<template>
  <v-app>
    <v-main>
      <v-app-bar>
				<v-btn to="/admin/dashboard" v-if="mode == 'admin'" fab text class="mr-5"><v-icon>arrow_back</v-icon></v-btn>
        <img src="/black_logo.png" height="100%"/>
				<v-spacer></v-spacer>
				<v-btn class="mx-3" text color="secondary" @click="generateClientForm()" :disabled="guBtnState"><v-icon class="mr-2">link</v-icon>Generate client form url<v-progress-circular indeterminate v-if="guBtnState"></v-progress-circular></v-btn>
				<a href="/form" class="mx-5"><v-btn color="primary">Form</v-btn></a>
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
							<a href="/account" class="my-1"><v-btn text color="primary" width="100%">Update Info</v-btn></a>
							<!-- <a href="/form" class="my-1"><v-btn text color="primary" width="100%">Form</v-btn></a> -->
							<!-- <v-divider class="my-3"/> -->
							<v-btn class="mx-3" text color="secondary" @click="logout()">logout</v-btn>
						</v-row>
					</v-sheet>
				</v-menu>
				<!-- <div v-else>
					<a href="/admin/dashboard" class="mx-3"><v-btn text color="primary">admin dashboard</v-btn></a>
				</div> -->
      </v-app-bar>
      <v-container>
				<v-dialog v-model="urlDialog" max-width="600" persistent>
					<v-card  class="pa-2">
					<span class="text-button sub-header">copy client url</span>
					<v-card-title class="pa-2 my-1" style="border:1px solid grey">{{clientFormUrl}}</v-card-title>
					<v-card-actions class="justify-center">
						<v-btn @click="copyURL()" :color="copyBtnColor"><v-icon class="mr-1">content_copy</v-icon>{{copyBtnText}}</v-btn>
						<v-btn @click="closeURLBox()" color="error">Close</v-btn>
					</v-card-actions>
					</v-card>
				</v-dialog>
        <v-row>
          <v-col>
            <span class="text-button section-header">clients</span>
            <v-sheet class="pa-2" elevation="0">
							<v-row class="ma-2">
								<v-text-field
									filled regular dense
									label="First Name"
									v-model="search_name"
									v-on:keyup.enter="search(search_name)"
									:loading="searchLoading"
									clearable
									@click:clear="loadClientsPage(1)"
								/>
								<v-btn @click="search(search_name)" color="secondary" x-large class="mx-2"><v-icon>search</v-icon></v-btn>
							</v-row>
						<v-card v-for="(c, i) in clients" elevation="4" class="my-3" :key="i" @click="loadClientInput(c._id)">
							<v-card-title>{{c.name}}</v-card-title>
							<v-card-subtitle>{{c.residence}}</v-card-subtitle>
						</v-card>
              <div class="d-flex flex-row justify-center mt-5">
                <v-btn text color="secondary" @click="loadClientsPage(--pg)" :disabled="disablePrev" large><v-icon class="mr-1">chevron_left</v-icon>prev</v-btn>
                <v-btn text color="secondary" @click="loadClientsPage(++pg)" :disabled="disableNext" large>Next<v-icon class="ml-1">chevron_right</v-icon></v-btn>
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
		title: "Dashboard",
  },
	data: function(){
		return {
			key: 0,
			pg: 1,
			disablePrev: true,
			disableNext: false,
			resultBtn: false,
			member: {},
			doc: null,
			err: false,
			alertText: "",
			activeClient: 0,
			clients: [],
			mode: "",
			clientFormUrl: "",
			urlDialog: false,
			copyBtnText: "Copy",
			copyBtnColor: "primary",
			guBtnState: false,
			search_name: "",
			searchLoading: false
		}
	},
  mounted(){
	  const self = this;
		let ls = window.localStorage;
    if(!ls.ms_email || !ls.ms_id || !ls.ms_name){
      this.logout()
    }
		if(ls.agent_key.startsWith("admin")){
			this.mode = "admin"
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
		window.document.title = "Dashboard | "+self.member.name;
		self.loadClientsPage(1);
		self.doc = window.document;
  },
  methods: {
		logout(){
			window.localStorage.clear();
			window.location.assign("/login");
		},
		alert(txt){
			this.err = true;
			this.alertText = txt;
		},
		loadClientsPage(pageNum){
			const self = this;
			const agentKey = window.localStorage.agent_key;
			let agentId = window.localStorage.ms_id;
			var req = new XMLHttpRequest();
			if(pageNum <= 0) {
				self.disablePrev = true;
				self.pg = 1;
				return;
			};
			if(pageNum == 1){
				self.disablePrev = true;
			}
			req.open("GET", self.ORIGIN+"/client/"+agentId+"/"+pageNum);
			req.setRequestHeader("Authorization", agentKey);
			req.onreadystatechange = function(){
				if(this.readyState == 4){
					if(this.status == 200){
						let resp = JSON.parse(this.response);
						self.disablePrev = false;
						if(resp.length == 0){
							self.pg--;
							self.disableNext = true;
							if(self.pg == 1) self.disablePrev = true;
							return;
						}
						self.disableNext = false;
						self.clients = JSON.parse(this.response);
					} else if(this.status == 401){
						self.logout()
 					} else {
						console.log("clientPage: "+this.status);
					}
				}
			}
			req.send();
			self.disableNext = true;
			self.disablePrev = true
		},
		initials: function(str){
      var str = str.split(" ");
      return str[0].charAt(0)+str[1].charAt(0);
    },
    loadClientInput(clientId){
			window.location.assign("/client?id="+clientId)
    },
		generateClientForm(){
			const self = this;
			const agentKey = window.localStorage.agent_key;
      var req = new XMLHttpRequest();
      req.open("GET", self.ORIGIN+"/client/form/generate/"+window.localStorage.ms_id);
			req.setRequestHeader("Authorization", agentKey);
      req.onreadystatechange = function(){
        if(this.readyState == 4){
          if(this.status == 200){
            let {url} = JSON.parse(this.response);
						self.urlDialog = true;
						self.clientFormUrl = url;
						self.copyBtnColor = "primary"
						self.copyBtnText = "Copy"
          } else {
            window.alert(this.status)
          }
					self.guBtnState = false
        }
      }
			req.send();
			self.guBtnState = true
		},
		copyURL(){
			if(window.navigator.clipboard){
				window.navigator.clipboard.writeText(this.clientFormUrl)
				this.copyBtnColor = "success"
				this.copyBtnText = "Copied"
			} else {
				this.copyBtnColor = "error"
				this.copyBtnText = "Try Again"
			}
		},
		closeURLBox(){
			this.clientFormUrl = "";
			this.urlDialog = false;
		},
		search(clientName){
			const self = this;
			const agentKey = window.localStorage.agent_key;
			const agentId = window.localStorage.ms_id;
			self.searchLoading = true;
      var req = new XMLHttpRequest();
      req.open("GET", self.ORIGIN+"/client/"+agentId+"/search?name="+clientName);
			req.setRequestHeader("Authorization", agentKey);
			req.onreadystatechange = function(){
				if(this.readyState == 4){
					self.searchLoading = false
					if(this.status == 200){
						self.disableNext = true;
						self.disablePrev = true;
						self.clients = JSON.parse(this.response);
					}
				}
			}
			req.send();
		}
	}
}
</script>

<style>
a{
	text-decoration:none;
}
.sub-header {
  padding-bottom:5px;
  background-image:linear-gradient(to right, black, black);
  background-size:20px 3px;
  background-position:0 100%;
  background-repeat:no-repeat;
  font-weight:bold;
}
.section-header {
  padding-bottom:5px;
  background-image: linear-gradient(black, black);
  background-size:30px 3px;
  background-repeat: no-repeat;
  background-position: 0 100%;
}
.section-subheader {
  padding-bottom:5px;
  background-image: linear-gradient(grey, grey);
  background-size:30px 3px;
  background-repeat: no-repeat;
  background-position: 0 100%;
}
</style>