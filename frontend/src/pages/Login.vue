<template>
  <v-app>
    <v-app-bar app height="80" elevation="1">
      <img src="/black_logo.png" height="100%" style="margin:auto"/>
    </v-app-bar>
  <v-main>
    <v-container>
      <v-row class="flex-column justify-space-between align-center">
        <v-col cols="4">
          <v-sheet elevation="4" class="py-5 px-3 my-10" rounded v-if="!reset">
            <span class="text-button sub-header">login</span>
            <v-alert
              v-model="alert"
              class="my-2 text-subtitle"
              dense
              outlined
              :type="alertType"
            >{{alertText}}</v-alert>
              <v-form ref="lg-form" class="my-5" >
                <v-text-field
                  filled regular
                  label="email id"
                  type="email"
                  v-model="lg_email"
                  validate-on-blur
                  :rules="[ruleReq, ruleEm]"
                />
                <v-text-field
                  filled regular
                  label="password"
                  type="password"
                  ref="pass"
                  v-model="lg_pass"
                  v-on:keyup.enter="sendLoginDetail()"
                  validate-on-blur
                  :rules="[(v) => v.length >= 8 || 'must be more than 8 characters', ruleReq]"
                />
                <v-btn color="secondary" @click="reset=true" small text>Forgot password ?</v-btn>
                <div class="d-flex flex-row justify-center">
                  <v-btn large color="secondary" @click="sendLoginDetail()" :disabled="loader" :loading="loader">{{loginBtnTxt}}</v-btn>
                </div>
            </v-form>
            <div class="d-flex flex-column align-start">
              <g-link to="/register" class="text-button">Create an account</g-link>
              <g-link to="/admin" class="text-button">login as admin</g-link>
            </div>
          </v-sheet>
          <v-sheet elevation="4" class="py-5 px-3 my-10" v-else>
            <v-toolbar dense flat>
              <v-btn text fab @click="reset=false" class="mr-5"><v-icon>arrow_back</v-icon></v-btn>
              <span class="text-button">Forgot Password</span>
            </v-toolbar>
              <v-alert
                v-model="alert"
                class="my-2"
                dense
                outlined
                :type="alertType"
              >{{alertText}}</v-alert>
            <p class="text-body-1 my-8 mx-6">
              An email will be sent to the entered email address with a link to reset your password
            </p>
            <v-form ref="rsform" />
              <v-text-field
                filled regular
                label="Registered Email"
                type="email"
                class="mx-5"
                v-model="lg_reset_email"
                validate-on-blur
                :rules="[ruleEm, ruleReq]"
                v-on:keyup.enter="getResetLink()"
              />
              <div class="d-flex justify-center">
                <v-btn @click="getResetLink()" color="secondary" large :disabled="resetDisable" :loading="resetLoader">Get link</v-btn>
              </div>
            </v-form>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
  </v-app>
</template>

<script>
export default {
  metaInfo: {
    title: "Login"
  },
  data: function(){
    return {
      lg_email: "",
      lg_pass: "",
      lg_reset_email: "",
      alert: false,
      alertType: "error",
      alertText: "",
      loader: false,
      loginBtnTxt: "Login",
      reset: false,
      resetDisable: false,
      resetLoader: false,
      ruleReq: value => !!value || "Required",
      ruleEm: (v) => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(v) || "Invalid Email",
    }
  },
  watch: {
    reset: function(){
      this.alert = false
    }
  },
  methods: {
    setAlert(type, text){
      const self = this;
      self.alert = true;
      self.alertType = type;
      self.alertText = text;
    },
    sendLoginDetail(){
      const self = this;
      if(this.lg_pass.length < 8) {
        return
      };
      let ls = window.localStorage;
      var xhr = new XMLHttpRequest();
      xhr.open("POST", self.ORIGIN+"/login");
      xhr.setRequestHeader("Content-type", "application/json")
      self.loader = true;
      self.loginBtnTxt = "";
      xhr.onreadystatechange = function(){
        if(this.readyState == 4){
          if(this.status == 200){
            let resp = JSON.parse(this.response);
            ls.setItem("ms_id", resp.id);
            ls.setItem("ms_name", resp.name);
            ls.setItem("ms_email", resp.email);
            ls.setItem("agent_key", "agent-"+resp.key);
            window.location.assign("/dashboard");
          } else if (this.status == 400){
            self.setAlert("error", JSON.parse(this.response).msg);
            self.loader = false;
            self.loginBtnTxt = "Login"
          } else {
            self.setAlert("Somethin went wrong! Try Again.");
            self.loader = false;
            self.loginBtnTxt = "try again";
          }
        }
      }
      xhr.send(JSON.stringify({e: self.lg_email, p: self.lg_pass}));
    },
    getResetLink(){
      const self = this;
      if(self.resetDisable) return;
      if(!this.$refs.rsform.validate()){
        return
      }
      var xhr = new XMLHttpRequest();
      xhr.open("POST", self.ORIGIN+"/reset");
      xhr.setRequestHeader("Content-type", "application/json");
      this.resetDisable = true;
      this.resetLoader = true;
      xhr.onreadystatechange = function(){
        if(this.readyState == 4){
          self.resetLoader = false
          if(this.status == 200){
            self.setAlert("success", "Check your inbox for the email")
          } else if (this.status == 400){
            self.setAlert("error", JSON.parse(this.response).msg);
            self.resetDisable = false;
          } else {
            self.setAlert("error", "Somethin went wrong! Try Again.");
            self.resetDisable = false;
          }
        }
      }
      xhr.send(JSON.stringify({e: self.lg_reset_email}));
    }
  }
}
</script>

<style>
a {
  text-decoration:none;
  color:black;
  padding:3px;
  border-radius:2px;
}
a:hover {
  text-decoration:underline;
  text-decoration-style:dotted;
  background-color:#eee;
}
.sub-header {
  padding-bottom:5px;
  background-image:linear-gradient(to right, black, black);
  background-size:20px 3px;
  background-position:0 100%;
  background-repeat:no-repeat;
  font-weight:bold;
}
</style>