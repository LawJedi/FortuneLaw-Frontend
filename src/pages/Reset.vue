<template>
  <v-app>
    <v-app-bar app height="80" elevation="1">
      <img src="/black_logo.png" height="100%" style="margin:auto"/>
    </v-app-bar>
  <v-main>
    <v-container>
      <v-row class="flex-column justify-space-between align-center">
        <v-col cols="4">
          <v-sheet elevation="4" class="py-5 px-3 my-10" rounded>
            <v-form ref="lg-form" class="my-5" v-if="!changed">
              <span class="text-button sub-header">Password reset</span>
              <v-alert
                v-model="alert"
                class="my-2 text-button"
                dense
                outlined
                :type="alertType"
              >{{alertText}}</v-alert>
              <v-text-field
                filled regular
                label="New Password"
                type="password"
                v-model="lg_pass"
                validate-on-blur
                :rules="[(v) => v.length >= 8 || 'must be more than 8 characters']"
              />
              <v-text-field
                filled regular
                label="Confirm Password"
                type="password"
                v-model="lg_conf_pass"
                v-on:keyup.enter="resetRequest()"
                validate-on-blur
                :rules="[(v) => v.length >= 8 || 'must be more than 8 characters']"
              />
              <div class="d-flex flex-row justify-center">
                <v-btn large color="secondary" @click="resetRequest()" :disabled="loader" :loading="loader">Update</v-btn>
              </div>
            </v-form>
            <div v-else class="d-flex justify-center text-button">
              Password changed successfully
            </div>
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
    title: "Password Reset"
  },
  data: function(){
    return {
      lg_pass: "",
      lg_conf_pass: "",
      alert: false,
      alertType: "error",
      alertText: "",
      loader: false,
      btnTxt: "Login",
      changed: false
    }
  },
  mounted(){
    let {id} = this.$route.query;
    let req = new XMLHttpRequest();
    req.open("GET", this.ORIGIN+"/reset/validation/"+id);
    req.onreadystatechange = function(){
      if(this.readyState == 4){
        console.log(this.status)
        if(this.status != 200){
          window.location.assign("/404")
        }
      }
    }
    req.send()
  },
  methods: {
    setAlert(type, text){
      const self = this;
      self.alert = true;
      self.alertType = type;
      self.alertText = text;
    },
    resetRequest(){
      const self = this;
      let {id} = this.$route.query;
      if(this.lg_pass != this.lg_conf_pass) {
        setAlert("error", "Password doesn't match")
        return
      };
      var xhr = new XMLHttpRequest();
      xhr.open("POST", self.ORIGIN+"/reset/pass/");
      xhr.setRequestHeader("Content-type", "application/json")
      self.loader = true;
      self.btnTxt = "";
      xhr.onreadystatechange = function(){
        if(this.readyState == 4){
          self.loader = false;
          console.log(this.status)
          if(this.status == 200){
            self.changed = true;
          } else if (this.status == 400){
            self.setAlert("error", JSON.parse(this.response).msg);
            self.btnTxt = "Try Again"
          } else {
            self.setAlert("Somethin went wrong! Try Again.");
            self.btnTxt = "try again";
          }
        }
      }
      xhr.send(JSON.stringify({id, p: self.lg_pass}));
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