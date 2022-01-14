<template>
  <v-app>
  <v-app-bar height="80" elevation="1">
    <img src="/black_logo.png" height="100%" style="margin:auto"/>
  </v-app-bar>
  <v-main>
    <v-container>
      <v-row class="flex-column justify-space-between align-center">
        <v-col cols="6">
          <v-sheet elevation="8" class="py-5 px-3 my-2" rounded="lg" >
              <v-form ref="lg_form">
              <v-row>
                <v-col>
                  <span class="text-button sub-header">Contact Detail</span>
                  <v-row>
                    <v-col>
                      <v-text-field
                        outlined regular
                        label="First Name"
                        v-model="lg_first_name"
                        validate-on-blur
                        :rules="[ruleReq]"
                      />
                    </v-col>
                    <v-col>
                      <v-text-field
                        outlined regular
                        label="Last Name"
                        v-model="lg_last_name"
                        :rules="[ruleReq]"
                        validate-on-blur
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        outlined regular
                        label="Telephone"
                        v-model="lg_tel"
                        :rules="[ruleReq, ruleTel]"
                        validate-on-blur
                      />
                    </v-col>
                  </v-row>
                </v-col> 
              </v-row>
              <v-row>
                <v-col cols="6">
                  <span class="text-button sub-header">Company Detail</span>
                  <v-text-field
                    outlined regular
                    label="Company Name"
                    v-model="lg_co_name"
                    :rules="[ruleReq]"
                    validate-on-blur
                    class="mt-2"
                  />
                </v-col>
              </v-row>
              <!--
                <v-row>
                  <v-col>
                    <span class="text-button sub-header">Company Detail</span>
                    <v-text-field
                      outlined regular
                      label="Company Name"
                      v-model="lg_co_name"
                      :rules="rules"
                      validate-on-blur
                      class="mt-2"
                    />
                  </v-col>
                  <v-col>
                    <span class="text-button sub-header">Contact Detail</span>
                    <v-text-field
                      outlined regular
                      label="First Name"
                      v-model="lg_first_name"
                      validate-on-blur
                      :rules="rules"
                      class="mt-2"
                    />
                    <v-text-field
                      outlined regular
                      label="Last Name"
                      v-model="lg_last_name"
                      :rules="rules"
                      validate-on-blur
                    />
                    <v-text-field
                      outlined regular
                      label="Telephone"
                      v-model="lg_tel"
                      :rules="rules"
                      validate-on-blur
                    />
                  </v-col>
                </v-row> -->
                <v-row>
                  <v-col>
                    <span class="text-button sub-header my-2">Login Detail</span>
                    <v-text-field
                      outlined regular
                      label="Email"
                      type="email"
                      v-model="lg_email"
                      :rules="[ruleReq, ruleEm]"
                      validate-on-blur
                      class="mt-2"
                    />
                    <v-text-field
                      outlined regular
                      label="Password"
                      type="password"
                      v-model="lg_pass"
                      :rules="[ruleReq, rulePass]"
                    />
                    <v-text-field
                      outlined regular
                      label="Confirm Password"
                      type="password"
                      v-model="lg_conf_pass"
                      :rules="[ruleReq, rulePass]"
                    />
                  </v-col>
                </v-row>
                <v-alert
                    v-model="alert"
                    class="my-2"
                    dense
                    outlined text
                    :type="alertType"
                  >{{alertText}}</v-alert>
                <div class="d-flex flex-row justify-center">
                  <v-btn x-large color="secondary" @click="register()" :disabled="loader" :loading="loader">{{loginBtnTxt}}</v-btn>
                </div>
                <span class="text-caption" v-if="loader">If the page isn't directed to login page automatically within few seconds <a href="/login">click here</a></span>
            </v-form>
            <g-link to="/login" class="text-button">Login</g-link>
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
    title: "Register"
  },
  data: function(){
    return {
      lg_email: "",
      lg_pass: "",
      lg_first_name: "",
      lg_last_name: "",
      lg_tel: "",
      lg_co_name: "",
      lg_conf_pass: "",
      alert: false,
      alertType: "error",
      alertText: "",
      loader: false,
      loginBtnTxt: "Register",
      ruleReq: value => !!value || "Required",
      ruleEm: (v) => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(v) || "Invalid Email",
      ruleTel: (v) => /[0-9]{10,15}/.test(v) || "Invalid telephone number",
      rulePass: (v) => v.length >= 8 || "Must be longer than 8 characters" 
    }
  },
  mounted(){
    let ls = window.localStorage;
    if(ls.ms_email && ls.ms_id && ls.ms_name){
      window.location.replace("/dashboard")
    }
  },
  methods: {
    setAlert(type, text){
      const self = this;
      self.alert = true;
      self.alertType = type;
      self.alertText = text;
    },
    agentData(){
      const self = this;
      let data = JSON.stringify({
        e: self.lg_email,
        p: self.lg_pass,
        f: self.lg_first_name,
        l: self.lg_last_name,
        c: self.lg_co_name,
        t: self.lg_tel
      })
      return data;
    },
    register(){
      const self = this;
      if(!this.$refs.lg_form.validate()) {
        self.setAlert("error", "Incomplete data. Try again after filling the form correctly");
        return  
      }
      if(self.lg_pass != self.lg_conf_pass){
        self.setAlert("error", "Password doesn't match");
        return;
      }
      var xhr = new XMLHttpRequest();
      xhr.open("POST", self.ORIGIN+"/reg");
      xhr.setRequestHeader("Content-type", "application/json");
      self.loader = true;
      self.loginBtnTxt = "";
      xhr.onreadystatechange = function(){
        if(this.readyState == 4){
          if(this.status == 200){
            self.setAlert("success", "Registered")
            window.location.replace("/login");
          } else if (this.status == 400){
            self.setAlert("error", JSON.parse(this.response).msg);
            self.loader = false;
            self.loginBtnTxt = "register"
          } else {
            self.setAlert("error", "Somethin went wrong! Try Again.");
            self.loader = false;
            self.loginBtnTxt = "try again";
          }
        }
      }
      let data = this.agentData();
      xhr.send(data);
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