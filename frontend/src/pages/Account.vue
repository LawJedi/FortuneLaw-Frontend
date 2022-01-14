<template>
  <v-app>
    <v-main>
      <v-app-bar>
        <img src="/black_logo.png" height="100%"/>
				<v-spacer></v-spacer>
				<v-menu v-if="mode == 'agent'" offset-x left nudge-left="15">
					<template v-slot:activator="{ on, attrs }">
						<v-avatar
							color="secondary"
							size="48"
							v-bind="attrs"
							v-on="on"
							close-on-content-click
						>
							<v-icon color="white">person</v-icon>
						</v-avatar>
					</template>
					<v-sheet width="300" elevation="0">
						<v-row class="flex-column align-stretch pa-3">
							<span class="text-button text-h2 mx-3">{{member.name}}</span>
							<span class="text--secondary text-caption mx-3">{{member.email}}</span>
							<v-divider class="my-2" />
							<a href="/dashboard" class="my-1"><v-btn text color="primary" width="100%">Dashboard</v-btn></a>
							<a href="/form" class="my-1"><v-btn text color="primary" width="100%">Form</v-btn></a>
							<v-divider class="my-3" />
							<v-btn class="mx-3" text color="secondary" @click="logout()">logout</v-btn>
						</v-row>
					</v-sheet>
				</v-menu>
				<div v-else>
					<a href="/admin/dashboard" class="mx-3"><v-btn text color="primary">admin dashboard</v-btn></a>
				</div>
      </v-app-bar>
      <v-container>
        <v-dialog v-if="mode == 'agent'" v-model="passDialog" persistent max-width="500">
					<v-card class="pa-4" :loading="btnDis">
						<span class="text-button sub-header my-2">change password</span>
						<v-text-field 
							v-model="oldp"
							label="Old Password"
							type="password"
							regular filled
							class="mt-4"
						/>
						<v-text-field  
							v-model="newp"
							label="New Password"
							type="password"
							regular filled 
						/>
						<v-card-actions class="justify-end">
							<v-btn color="red" text @click="closePassDialog()" :disabled="btnDis" large>cancel</v-btn>
							<v-btn color="secondary" @click="changePassword()" :disabled="btnDis" large class="mx-3">change</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>
        <v-row>
          <v-col cols="6">
          <table>
            <tr>
              <td rowspan="2"><v-icon size="64" class="mr-5">person</v-icon></td>
              <td><h3 class="header">{{agentData.full_name}}</h3></td>
            </tr>
            <tr>
              <td><h3 class="subheader text--secondary">{{agentData.email}}</h3></td>
            </tr>
          </table>
            <!-- <h3 class="header">{{agentData.full_name}}</h3>
            <h3 class="subheader text--secondary">{{agentData.email}}</h3> -->
            <v-divider class="my-5" color="black"/>
            <div class="section" data-header="telephone">
              <div class="cont">
                {{agentData.telephone}}
              </div>
            </div>
            <div class="section" data-header="company name">
              <div class="cont">
                {{agentData.company_name}}
              </div>
            </div>
            <div class="section" data-header="plans">
              <div class="cont">
                {{plans[agentData.ms_plan]}}
              </div>
            </div>
            <v-divider class="my-5"/>
            <v-btn large color="secondary" class="mx-3" @click="updateDialog = true">update info</v-btn>
            <v-btn large color="secondary" class="mx-3" @click="passDialog = true">Change password</v-btn>
          </v-col>
          <v-dialog fullscreen hide-overlay v-model="updateDialog" color="white">
            <v-card color="white">
              <v-toolbar color="secondary">
              <v-btn @click="updateDialog = false" text fab elevation="0" color="white"><v-icon>close</v-icon></v-btn>
              <v-divider vertical class="mx-3" />
              <h3 class="text-button my-5" style="color:white">Update Info</h3>
              </v-toolbar>
              <v-container color="white">
                <v-row>
                  <v-col offset="3" cols="6">
                    <v-alert
                      :type="msgType"
                      v-model="isMsg"
                    >
                    {{msg}}
                    </v-alert>
                    <div class="section active" data-header="telephone">
                      <div class="cont">
                        <v-text-field
                          type="tel"
                          v-model="updateData.tel"
                          :disabled="formDisable"
                          :loading="loading.tel"
                          color="black"
                        />
                        <v-btn @click="update('telephone', 'tel')" :disabled="formDisable" small color="secondary">update</v-btn>
                      </div>
                    </div>
                    <div class="section active" data-header="company name">
                      <div class="cont">
                        <v-text-field
                          v-model="updateData.com"
                          :disabled="formDisable"
                          :loading="loading.com"
                          color="black"
                        />
                        <v-btn @click="update('company_name', 'com')" :disabled="formDisable" small color="secondary">update</v-btn>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-dialog>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  metaInfo: {
    title: "Account"
  },
  data(){
    return {
      mode: "",
      member: {},
      agentData: {},
      updateData: {
        tel: "",
        com: "",
      },
      loading: {
        tel: false,
        com: false,
      },
      formDisable: false,
      updateDialog:false,
      isMsg: false,
      msg: "Success Message",
      msgType:"success",
      plans: ["Not Assigned", "Agent", "FLF Team"],
      // password dialog box
      passDialog: false,
      oldp: "",
      newp: "",
      btnDis: false
    }
  },
  mounted(){
    const self = this;
    let ls = window.localStorage;
    if(!ls.ms_email || !ls.ms_id || !ls.ms_name){
      this.logout()
    }
		if(ls.agent_key.startsWith("admin")){
			this.mode = "admin";
		} else if (ls.agent_key.startsWith("agent")){
			this.mode = "agent"
		} else {
			this.logout()
		}
    self.member = {
			name: window.localStorage.ms_name,
			email: window.localStorage.ms_email,
			id: window.localStorage.ms_id
		}
    window.document.title = self.member.name+" | Fortune Law";
    self.doc = window.document;
    this.getData();
  },
  methods:{
    alert(msgType, msg){
      this.msgType=msgType;
      this.msg = msg;
      this.isMsg = true;
    },
		logout(){
			window.localStorage.clear();
			window.location.assign("/login");
		},
    getData(){
      const self = this;
      let agentKey = window.localStorage.agent_key;
      let xhr = new XMLHttpRequest();
      xhr.open("GET", this.ORIGIN+"/self");
      xhr.setRequestHeader("Authorization", agentKey);
      xhr.onreadystatechange = function(){
        if(this.readyState == 4){
          if(this.status == 200){
            self.agentData = JSON.parse(this.response);
            self.updateData.tel = self.agentData.telephone
            self.updateData.com = self.agentData.company_name
            self.updateData.pln = self.agentData.ms_plan
          } else if(this.status == 401){
            self.alert("error", "You are not authorised to view page")
          } else {
            self.alert("error", "Something went wrong")
          }
        }
      }
      xhr.send()
    },
    update(field, f){
      const self = this;
      let agentKey = window.localStorage.agent_key;
      let req = new XMLHttpRequest();
      req.open("POST", this.ORIGIN+"/self/"+field);
      req.setRequestHeader("Content-type", "application/json");
      req.setRequestHeader("Authorization", agentKey);
      req.onreadystatechange = function(){
        if(this.readyState == 4){
          self.formDisable = false;
          self.loading[f] = false;
          if(this.status == 200){
            self.alert("success", `Updated successfully`);
            self.getData();
          } else if (this.status == 400){
            self.alert("error", `Update unsuccessful`)
          } else {
            self.alert("error", "Something went wrong. Try again later")
          }
        }
      }
      req.send(JSON.stringify({d: self.updateData[f]}));
      this.formDisable = true;
      this.loading[f] = true;
    },
		closePassDialog(){
      this.oldp = "";
      this.newp = "";
      this.passDialog = false;
    },
    changePassword(){
      const self = this;
      let oldp = this.oldp;
      let newp = this.newp;
      let req = new XMLHttpRequest();
      req.open("POST", self.ORIGIN+"/password");
      req.setRequestHeader("Content-type", "application/json");
      req.setRequestHeader("Authorization", window.localStorage.agent_key);
      self.btnDis = true;
      req.onreadystatechange = function(){
        if(this.readyState == 4){
          self.oldp = ""; self.newp = ""; self.btnDis = false;
          if(this.status == 200){
            self.closePassDialog();
            window.alert("Password changed");
          } else {
            window.alert("Something went wrong")
          }
        }
      }
      req.send(JSON.stringify({oldp, newp}))
    }
  }
}
</script>

<style>
.header {
  font-size:1.5rem;
  font-family:Roboto;
  text-transform:uppercase;
  letter-spacing:1.6px;
}
.subheader {
  font-size:1.1rem;
  font-family:Roboto;
}
.section {
  margin:25px 0; 
  padding:5px 20px 26px 20px;
  border:1px solid #aaa;
  border-radius:5px;
}
.section:hover {
  border:1px solid black; /* #1976d2 */
}
.section .cont {
  display:block;
  /*
  display:flex;
  align-items:center;
  justify-content:space-between;
  */
}
.section::before{
  display:inline-block;
  position:relative;
  background-color:white;
  top:-17px;
  left:10px;
  padding:0 20px;
  color:#aaa;
  text-transform:uppercase;
  font-family:Roboto;
  font-size:0.95rem;
  letter-spacing:1px;
  font-weight:bold;
  content:attr(data-header);
}
.section:hover::before {
  color:black;
}
.section.active {
  border:1px solid black;
}
.section.active::before {
  color:black;
}
</style>