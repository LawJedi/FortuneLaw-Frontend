<template>
  <v-app>
    <v-main>
      <v-toolbar class="text-button">
        <v-btn to="/login" fab text class="mr-5"><v-icon>arrow_back</v-icon></v-btn>
        <img src="/black_logo.png" height="100%"/>
      </v-toolbar>
      <v-container>
        <v-row>
          <v-col cols="4" offset="4">
            <v-sheet>
              <span class="text-button text-h3">admin password</span>
              <v-alert
              v-model="alert"
              class="my-2"
              dense
              outlined
              :type="alertType"
            >{{alertText}}</v-alert>
              <v-text-field
                type="password"
                regular filled
                v-model="pass"
                v-on:keyup.enter="login()"
              />
              <v-btn @click="login()" color="primary" :disabled="state" :loading="state">Login<v-icon>login</v-icon></v-btn>
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
    title: "Admin Login"
  },
  data(){
    return {
      pass: "",
      alert: false,
      alertType: "error",
      alertText: "",
      state: false,
    }
  },
  methods: {
    setAlert(type, text){
      const self = this;
      self.alert = true;
      self.alertType = type;
      self.alertText = text;
    },
    login(){
      const self = this;
      let req = new XMLHttpRequest();
      req.open("POST", this.ORIGIN+"/admin/login/");
      req.setRequestHeader("Content-type", "application/json");
      req.responseType = "json"
      self.state = true;
      req.onreadystatechange = function(){
        if(this.readyState == 4){
          self.state = false;
          if(this.status == 200){
            let resp = this.response;
            window.localStorage.agent_key = resp.k;
            window.location.assign("/admin/dashboard")
          } else if(this.status == 401){
            self.setAlert("error", "Incorrect Password")
          } else {
            self.setAlert("error", "Try Again")
          }
        }
      }
      req.send(JSON.stringify({p: self.pass}));
    }
  }
}
</script>