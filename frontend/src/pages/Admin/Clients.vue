<template>
  <v-app>
    <v-main>
      <v-toolbar>
        <v-btn to="/admin/dashboard" fab text class="mr-5"><v-icon>arrow_back</v-icon></v-btn>
        <span class="text-button">
        Admin Dashboard
        </span>
        <v-spacer />
        <!-- <v-btn @click="logout()" elevation="0" color="grey lighten-1" tile>Logout</v-btn>
        <v-menu offset-y nudge-bottom="3">
          <template v-slot:activator="{on, attrs}">
            <v-btn v-on="on" v-bind="attrs" color="secondary" elevation="0" tile width="20"><v-icon>arrow_drop_down</v-icon></v-btn>
          </template>
          <v-sheet width="250px" :rounded="false">
            <v-row class="flex-column align-stretch pa-3">
              <a href="./dashboard" class="my-1"><v-btn color="primary" text block tile elevation="0">Dashboard</v-btn></a>
              <a href="./approval-request"><v-btn color="primary" text block tile elevation="0">Approval Request</v-btn></a>
            </v-row>
          </v-sheet>
        </v-menu> -->
      </v-toolbar>
      <v-container>
        <v-row>
          <v-col class="my-3">
            <span class="text-button sub-header">Agents</span>
            <v-row class="ma-2">
            <v-text-field
              filled regular dense
              label="Client Name"
              v-model="client_name"
              v-on:keyup.enter="search()"
              class="mx-3"
            />
            <v-text-field
              filled regular dense
              label="Agent Name"
              v-model="agent_name"
              v-on:keyup.enter="search()"
              class="mx-3"
            />
            <v-btn @click="search()" color="secondary" x-large class="mx-2"><v-icon>search</v-icon></v-btn>
            </v-row>
            <v-card v-for="c,i of clients" :key="c._" elevation="2" class="my-2" @click="openClient(c._, c.agent)" rounded>
              <v-card-title>{{c.name}}</v-card-title>
              <v-card-subtitle>{{c.residence}} <br> {{c.agent.n}}</v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  metaInfo: {
    title: "Admin Dashboard"
  },
  data: function(){
    return {
      clients: [],
      client_name: "",
      agent_name: ""
    }
  },
  mounted(){
    let ls = window.localStorage;
    if(!ls.agent_key) this.logout();
    if(!ls.agent_key.startsWith("admin")){
      this.logout();
    }
    window.localStorage.removeItem("ms_name");
    window.localStorage.removeItem("ms_email");
    window.localStorage.removeItem("ms_id");
  },
  methods: {
    logout(){
      window.localStorage.clear();
      window.location.assign("/admin");
    },
    validateAdmin(){
      const self = this;
      var req = new XMLHttpRequest();
      req.open("GET", this.ORIGIN+"/admin/validate/");
      req.setRequestHeader("Authorization", window.localStorage.agent_key);
      req.responseType = "json"
      req.onreadystatechange = function(){
        if(this.readyState == 4){
          if(this.status == 200) {
            self.agentsList(1);
          } else {
            self.logout()
          }
        }
      }
      req.send();
    },
    openClient(cid, agent){
      window.localStorage.ms_id = agent._;
      window.localStorage.ms_name = agent.n;
      window.localStorage.ms_email = agent.e;
      window.location.assign("/client?id="+cid);
    },
    search(){
      const self = this;
      let req = new XMLHttpRequest();
      req.open("GET", this.ORIGIN+"/admin/clients?name="+this.client_name+"&agent="+this.agent_name);
      req.setRequestHeader("Authorization", window.localStorage.agent_key);
      req.onreadystatechange = function(){
        if(this.readyState == 4){
          if(this.status == 200){
            self.clients = JSON.parse(this.response);
          }
        }
      }
      req.send();
    },
  }
}
</script>

<style>
a {
  text-decoration:none;
  color:inherit;
}
a.com-link {
  text-decoration:none;
  color:inherit;
  padding:3px;
  border-radius:2px;
}
a.com-link:hover {
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