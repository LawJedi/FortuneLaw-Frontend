<template>
  <v-app>
    <v-main>
      <v-toolbar>
        <span class="text-button">
        Admin Dashboard
        </span>
        <v-spacer />
        <!-- <a href="/admin/clients" class="mx-2"><v-btn color="primary" text block tile>Clients</v-btn></a> -->
        <v-btn color="primary" @click.stop="passDialog = true" class="mx-2">change password</v-btn>
        <v-btn @click="logout()" color="secondary" tile>Logout</v-btn>
        <!-- <v-menu offset-y nudge-bottom="3">
          <template v-slot:activator="{on, attrs}">
            <v-btn v-on="on" v-bind="attrs" color="secondary" elevation="0" tile width="20"><v-icon>arrow_drop_down</v-icon></v-btn>
          </template>
          <v-sheet width="250px" :rounded="false">
            <v-row class="flex-column align-stretch pa-3">
              <a href="/clients" class="my-1"><v-btn color="primary" text block tile elevation="0">Clients</v-btn></a>
            </v-row>
          </v-sheet>
        </v-menu> -->
      </v-toolbar>
      <v-dialog v-model="passDialog" persistent max-width="500">
        <v-card class="pa-4" :loading="passState">
          <span class="text-button sub-header my-2">change password</span>
          <v-text-field 
            v-model="oldp"
            label="Old Password"
            type="password"
            regular filled
            class="mt-4"
            validate-on-blur
            :rules="[(v) => v.length >= 8 || 'must be more than 8 characters']"
          />
          <v-text-field  
            v-model="newp"
            label="New Password"
            type="password"
            regular filled
            validate-on-blur
            :rules="[(v) => v.length >= 8 || 'must be more than 8 characters']"
          />
          <v-text-field  
            v-model="cnewp"
            label="Confirm Password"
            type="password"
            regular filled
            validate-on-blur
            :rules="[(v) => v.length >= 8 || 'must be more than 8 characters']"
          />
          <v-card-actions class="justify-end">
            <v-btn color="red" text @click="closePassDialog()" :disabled="passState" large>cancel</v-btn>
            <v-btn color="secondary" @click="changePassword()" :disabled="passState" large class="mx-3">change</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="deleteDialog" :loading="deleteState" max-width="500">
        <v-card>
          <!-- <span class="text-button sub-header my-2">change password</span> -->
          <v-toolbar color="error"><span class="text-button" style="color:white"><v-icon class="mr-3" color="white" size="32">delete</v-icon>Delete Agent</span></v-toolbar>
          <div class="pa-4">
            <span class="text-subtitle">Are you sure you want to delete the agent <b class="text-button">{{toDelName}}</b> ?</span>
          <v-card-actions class="justify-end mt-2">
            <v-btn color="secondary" @click="closeDeleteDialog()" :disabled="deleteState" large>cancel</v-btn>
            <v-btn color="error" @click="deleteAgent()" :disabled="deleteState" large class="mx-3">Delete</v-btn>
          </v-card-actions>
          </div>
        </v-card>
      </v-dialog>
      <v-container>
        <v-row>
          <v-col class="my-3">
            <span class="text-button sub-header">Agents</span>
            <v-row class="ma-2">
            <v-text-field
              filled regular dense
              label="Search Agent"
              v-model="search_name"
              clearable
              @click:clear="agentsList(1)" 
              v-on:keyup.enter="search(search_name)"
            />
            <v-btn @click="search(search_name)" color="secondary" x-large class="mx-2"><v-icon>search</v-icon></v-btn>
            </v-row>
            <v-card v-for="a,i of agents" :key="a.i" :loading="a.s" elevation="2" class="my-1" rounded>
              <v-row>
                <v-col>
                  <v-card-title>{{a.n}} <v-chip label :color="a.a ? 'green' : 'red'" class="text-button text-caption mx-2" text-color="white" @click="toggleAgentStatus(a.i, i)">{{a.a ? 'granted' : 'denied'}}</v-chip></v-card-title>
                  <v-card-subtitle class="my-1 text-body-1"><b>{{a.e}}</b></v-card-subtitle>
                  <v-card-subtitle>
                    <v-select 
                      v-model="a.m"
                      label="Membership Plan"
                      :items="plans"
                      :error-messages="a.v"
                      outlined
                      hide-selected
                      validate-on-blur
                      :disabled="a.s"
                      :loading="a.s"
                      @change="updateMemberShip(a._, i)"
                    />
                  </v-card-subtitle>
                  <v-card-actions>
                    <v-btn @click="openAgentDashboard(a)" color="primary"><v-icon>open_in_new</v-icon>dashboard</v-btn>
                    <v-btn @click="deleteConfirmDialog(a._, a.n, i)" color="error"><v-icon>delete</v-icon>Delete Agent</v-btn>
                  </v-card-actions>
                </v-col>
                <v-divider vertical />
                <v-col>
                  <table width="100%">
                    <tr>
                      <td class="text--secondary text-caption" width="25%">Company</td><td class="text-button">{{a.c}}</td>
                    </tr>
                    <tr><td colspan="2"><v-divider /></td></tr>
                    <tr>
                      <td class="text--secondary text-caption">Telephone</td><td class="text-button">{{a.t}}</td>
                    </tr>
                    <tr><td colspan="2"><v-divider /></td></tr>
                    <tr>
                      <td class="text--secondary text-caption">Account Created On: </td><td class="text-button">{{new Date(a.d).toDateString()}}<br>{{new Date(a.d).toTimeString()}}</td>
                    </tr>
                  </table>
                </v-col>
              </v-row>
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
      agents: [],
      agentsRaw: [], 
      search_name: "",
      plans: [{value: 0, text: "Not Assigned"}, 
      {value: 1, text: "Agent"}, 
      {value: 2, text:  "FLF Team"}],
      oldp: "",
      newp: "",
      cnewp: "",
      deleteState: false,
      deleteDialog: false,
      passDialog: false,
      passState: false,
      toDelId: "",
      toDelName: "",
      delIndex: -1,
    }
  },
  mounted(){
    let ls = window.localStorage;
    if(!ls.agent_key) this.logout();
    if(!ls.agent_key.startsWith("admin")){
      this.logout();
    }
    this.agentsList(1);
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
          }
        }
      }
      req.send();
    },
    agentsList(pageNum){
      const self = this;
      var req = new XMLHttpRequest();
      req.open("GET", this.ORIGIN+"/admin/agents/"+pageNum);
      req.setRequestHeader("Authorization", window.localStorage.agent_key);
      req.onreadystatechange = function(){
        if(this.readyState == 4){
          if(this.status == 200) {
            console.log(JSON.parse(this.response))
            self.agents = JSON.parse(this.response);
            self.agentsRaw = JSON.parse(this.response);
          }
        }
      }
      req.send();
    },
    toggleAgentStatus(agentid, i){
      const self = this;
      var req = new XMLHttpRequest();
      req.open("GET", this.ORIGIN+"/admin/agent/toggle/"+agentid);
      req.setRequestHeader("Authorization", window.localStorage.agent_key);
      req.responseType = "json"
      self.agents[i].s = true;
      req.onreadystatechange = function(){
        if(this.readyState == 4){
          if(this.status == 200) {
            self.agents[i].a = !self.agents[i].a;
            self.agents[i].s = false;
          }
        }
      }
      req.send();
    },
    updateMemberShip(id, index){
      const self = this;
      let req = new XMLHttpRequest();
      let agentKey = window.localStorage.agent_key;
      let plan = self.agents[index].m;
      req.open("PUT", this.ORIGIN+"/admin/agent/membership/"+id+"/"+plan);
      console.log(plan)
      req.setRequestHeader("Authorization", agentKey);
      self.agents[index].s = true;
      req.onreadystatechange = function(){
        if(this.readyState == 4){
          self.agents[index].s = false;
          if(this.status == 200){
            self.agents[index].v = "";
            self.agentsRaw[index].m = self.agents[index].m
          } else {
            self.agents[index].v = 'Failed to update';
            self.agents[index].m = self.agentsRaw[index].m
          }
        }
      }
      req.send()
    },
    openAgentDashboard(agent){
      let ls = window.localStorage;
      ls.setItem("ms_id", agent.i);
      ls.setItem("ms_name", agent.n);
      ls.setItem("ms_email", agent.e);
      window.location.assign("/dashboard");
    },
    search(agent_name){
      const self = this;
      let req = new XMLHttpRequest();
      req.open("GET", this.ORIGIN+"/admin/agent/search?n="+agent_name);
      req.setRequestHeader("Authorization", window.localStorage.agent_key);
      req.onreadystatechange = function(){
        if(this.readyState == 4){
          if(this.status == 200){
            self.agents = JSON.parse(this.response);
            self.agentsRaw = JSON.parse(this.response);
          }
        }
      }
      req.send();
    },
    closePassDialog(){
      this.oldp = "";
      this.newp = "";
      this.cnewp = "";
      this.passState = false;
      this.passDialog = false
    },
    changePassword(){
      const self = this;
      let oldp = this.oldp;
      let newp = this.newp;
      if(oldp.length < 8 || newp.length < 8 ) {
        return
      }
      if(self.newp != self.cnewp){
        alert("Confirm Password doesn't match New Password")
        return
      }
      let req = new XMLHttpRequest();
      req.open("POST", this.ORIGIN+"/admin/password");
      req.setRequestHeader("Content-type", "application/json");
      req.setRequestHeader("Authorization", window.localStorage.agent_key);
      self.btnDis = true;
      req.onreadystatechange = function(){
        if(this.readyState == 4){
          self.oldp = ""; self.newp = ""; self.cnewp = false; self.passState = false;
          if(this.status == 200){
            self.closePassDialog();
            window.alert("Password changed");
          } else {
            window.alert(JSON.parse(this.response).msg)
          }
        }
      }
      req.send(JSON.stringify({oldp, newp}))
    },
    deleteConfirmDialog(id, name, index){
      if(!!id){
        this.toDelId = id;
        this.toDelName = name;
        this.delIndex = index;
        this.deleteDialog = true;
      }
    },
    closeDeleteDialog(){
      this.toDelId = "";
      this.toDelName = "";
      this.delIndex = -1;
      this.deleteDialog = false;
    },
    deleteAgent(){
      const self = this;
      let req = new XMLHttpRequest();
      req.open("DELETE", this.ORIGIN+"/admin/agent/"+this.toDelId);
      req.setRequestHeader("Authorization", window.localStorage.agent_key);
      req.onreadystatechange = function(){
        if(this.readyState == 4){
          self.delState = false;
          if(this.status == 200){
            self.agents.splice(self.delIndex, 1);
            self.closeDeleteDialog()
          } else {
            window.alert("Delete Unsuccessful. Try Again.")
          }
        }
      }
      req.send();
      self.delState = true;
    }
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
