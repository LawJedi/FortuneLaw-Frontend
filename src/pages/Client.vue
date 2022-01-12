<template>
  <v-app>
    <v-main>
      <v-app-bar>
				<v-btn to="/dashboard" v-if="mode == 'admin'" fab text class="mr-5"><v-icon>arrow_back</v-icon></v-btn>
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
							<v-divider class="my-3"/>
							<v-btn class="mx-3" text color="secondary" @click="logout()">logout</v-btn>
						</v-row>
					</v-sheet>
				</v-menu>
				<!-- <div v-else>
					<a href="/admin/dashboard" class="mx-3"><v-btn text color="primary">admin dashboard</v-btn></a>
				</div> -->
      </v-app-bar>
      <v-container>
			<v-row>
				<v-col>
					<div class="font-weight-bold text--secondary text-h3 mt-4 mb-8">GOLDEN Client Details and Debt Information</div>
					<ul>
						<li>To make adjustments to the debt information, type in the new information then hit the “rerun” button. Then click on “generate PDF,” and then the new document will be ready for download.</li>
						<li>If you have a new illustration spreadsheet, click near the paperclip to upload it, find it on your computer, then hit the “replace” button. Then click on “generate PDF,” and then the new document will be ready for download.</li>
					</ul>
				</v-col>
			</v-row>
				<v-form ref="form" :key="key">
        <v-row>
          <v-col cols="8" class="my-5">
            <v-sheet class="px-6" elevation="4" v-if="key">
							<v-row class="flex-column justify-space-between align-center">
								<v-col>
									<v-row>
									<span class="text-button section-header">client details</span>
									</v-row>
									<v-row>
									<v-col cols="12">
										<v-row style="margin-top:-15px; margin-bottom:-15px;">
										<v-col>
										<TextInput
											label="First Name"
											id="first-name"
											:value="clientDetail.first_name"
											class="my-2"
										/>
										</v-col>
										<v-col>
										<TextInput
											label="Last Name"
											id="last-name"
											:value="clientDetail.last_name"
											class="my-2"
										/>
										</v-col>
										</v-row>
										<v-row style="margin-top:-15px; margin-bottom:-15px;">
										<v-col>
										<TextInput email
											label="Email"
											:value="clientDetail.email"
											id="email"
											class="my-2"
										/>
										</v-col>
										<v-col>
										<v-select 
											regular outlined
											label="State of Residence"
											:items="states"
											prepend-inner-icon="home"
											id="residence"
											:rules="rules"
											class="my-5"
											:autocomplete="t"
											:value="clientDetail.residence"
										/>
										</v-col>
										</v-row>
										<v-row style="margin-top:-15px; margin-bottom:-15px;">
										<v-col>
											<TextInput number
											prepend-inner-icon="schedule"
											id="birth"
											label="Birth year"
											:value="clientDetail.birth_year"
											/>
										</v-col>
										<v-col>
											<TextInput number
											prepend-inner-icon="schedule"
											id="retire"
											label="Retirement Age"
											:value="clientDetail.retirement_age"
											/>
										</v-col>
										</v-row>
									</v-col>
									</v-row>
									<v-row>
									<span class="text-button section-header">Debt Information</span>
									<p class="text-caption my-3">For this section, it is critical that inputs have the exact numbers for balances, minimum payments, actual payments, and interest rates to ensure our debt illustration is as accurate as possible.</p>
									</v-row>
									<v-row>
									<v-col>
										<p class="text-button text--secondary section-subheader">mortgage Information</p>
										<div class="my-3" :id="'mi-'+i" v-if="mortgagesCount > 0" v-for="i in (mortgagesCount)" :key="i">
										<span class="font-weight-bold">Mortgage {{i}}<v-btn text @click="deleteMortgage(i)"><v-icon>delete</v-icon></v-btn></span>
										<TextInput
											label="Name"
											:id="'mi-'+i+'_name'"
											:value="clientDetail.mortgages[i-1][0]"
											hint="Just put something here to identify it. Maybe the name of the street the home is on."
										/>
										<TextInput number
											label="Mortgage and interest payment (do not include PMI, taxes, etc.)"
											:id="'mi-'+i+'_pay'"
											:value="clientDetail.mortgages[i-1][1]"
										/>
										<TextInput number
											label="How much is the client overpaying on their mortgage every year ?"
											:id="'mi-'+i+'_over'"
											hint="Don't include property tax, PMI, or anything beyond principal and interest."
											:value="clientDetail.mortgages[i-1][2]"
										/>
										<TextInput number
											label="What is the balance on this mortgage ?"
											:id="'mi-'+i+'_bal'"
											v-model="clientDetail.mortgages[i-1][3]"
										/>
										<TextInput number
											prepend-inner-icon="schedule"
											label="Years left on this mortgage, ex., 14.67"
											:id="'mi-'+i+'_yrs'"
											:value="clientDetail.mortgages[i-1][4]"
										/>
										<TextInput number
											prepend-inner-icon="trending_up"
											label="Interest rate on this mortgage, ex., 5.24"
											:id="'mi-'+i+'_ir'"
											step="0.1" min="0.00"
											:value="clientDetail.mortgages[i-1][5]"
										/>
										</div>
										<v-divider class="my-5" />
										<v-btn color="secondary" @click="addMortgage()"><v-icon>add</v-icon>add mortgage</v-btn>
										<v-divider class="my-2" />
									</v-col>
									</v-row>
									<v-row>
									<v-col>
										<p class="text-button text--secondary section-subheader">Oustanding debts Information</p>
										<div class="my-3" :id="'odi-'+i" v-if="outDebtsCount > 0" v-for="i in (outDebtsCount)" :key="i">
										<span class="font-weight-bold">Outstanding Debt {{i}} <v-btn text @click="deleteDebt(i)"><v-icon>delete</v-icon></v-btn></span>
										<TextInput 
											label="Name"
											hint="Come up with a label to describe this debt, e.g., 'American Express'; 'student loan.'"
											:id="'od-'+i+'_name'"
											v-model="clientDetail.outstanding_debts[i-1][0]"
										/>
										<TextInput number
											label="Debt Balance"
											:id="'od-'+i+'_bal'"
											v-model="clientDetail.outstanding_debts[i-1][1]"
										/>
										<TextInput number
											prepend-inner-icon="trending_up"
											label="Interest rate, ex., 5.24"
											:id="'od-'+i+'_ir'"
											v-model="clientDetail.outstanding_debts[i-1][2]"
										/>
										<TextInput number
											:ref="'od'+i+'mmp'"
											label="Minimum monthly payment"
											:id="'od-'+i+'_mmp'"
											v-model="clientDetail.outstanding_debts[i-1][3]"
										/>
										<TextInput number
											label="Actual monthly payment"
											:id="'od-'+i+'_amp'"
											v-model="clientDetail.outstanding_debts[i-1][4]"
										/>
										</div>
										<v-divider class="my-5" />
										<v-btn @click="addDebt()" color="secondary"><v-icon>add</v-icon>Add debt</v-btn>
										<v-divider class="my-2" />
									</v-col>
									</v-row>
								</v-col>
							</v-row>
            </v-sheet>
          </v-col>
					<v-col cols="4">
						<v-sheet elevation="4" v-if="key" class="my-5 pa-3">
							<span class="text-button section-header pb-3">Attachments</span>
							<br><br>
							<v-btn large color="primary" :disabled="readMode || genDisable" @click="genpdf()" class="my-2"><v-icon class="mr-2">picture_as_pdf</v-icon>{{resultText}}</v-btn>
							<br>
							<v-btn large color="primary" :disabled="readMode || downloadDisable" @click="openpdf()"><v-icon class="mr-2">get_app</v-icon>pdf</v-btn>
							<v-divider class="ma-2" />
							<!-- <a :href="ORIGIN+'/client/illustration/'+clientDetail.file_ref+'/'+clientDetail.email+'/'+clientDetail.last_name"><v-btn large color="green accent-4"><v-icon class="mr-2">get_app</v-icon>Excel template</v-btn></a> -->
							<v-btn large color="green accent-4" :disabled="illDownload" @click="getIllustration()"><v-icon class="mr-2">get_app</v-icon>Excel template</v-btn>
							<v-radio-group
                v-model="uploadType"
                row
								:disbabled="readMode"
              >
                <v-radio
                  label="Penn Mutual"
                  value="penn"
                />
                <v-radio
                  label="Other"
                  value="other"
                  :checked="t"
                />
              </v-radio-group>
							<v-file-input
								regular filled
								label="Replace Illustration"
								id="data-file"
								@change="fileSubmit()"
								v-model="file"
								class="my-3"
								:disbaled="readMode"
								@click.clear="file = false"
							/>
							<v-btn large color="primary" :disabled="readMode || replaceDisable" @click="uploadFile()" v-if="!fileSubmitted" class="ml-2">Replace</v-btn>
						</v-sheet>
						<v-sheet class="pa-5" v-if="key">
							<div class="d-flex justify-space-around align-stretch">
								<v-btn large color="primary" @click="rerun()" :disabled="readMode || runDisable">rerun</v-btn>
							</div>
						</v-sheet>
					</v-col>
        </v-row>
				</v-form>
      </v-container>
			<v-bottom-sheet v-model="err" persistent>
				<v-sheet flat class="pa-5">
				<v-alert type="error" outlined>{{this.alertText}}</v-alert>
				<div class="d-flex justify-center">
				<v-btn @click="err = !err"  color="error" outlined>Close</v-btn>
				</div>
				</v-sheet>
			</v-bottom-sheet>
     </v-main>
    </v-app>
</template>

<script>
export default {
  metaInfo: {
		title: "Client",
  },
	data: function(){
		return {
			key: 0,
			resultBtn: false,
			resultText: "Generate PDF",
			member: {},
			doc: null,
			err: false,
			alertText: "",
			states: ['Alabama','Alaska','American Samoa','Arizona','Arkansas','California','Colorado', 
			'Connecticut','Delaware','District of Columbia','Federated States of Micronesia','Florida',
			'Georgia','Guam','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky',
			'Louisiana','Maine','Marshall Islands','Maryland','Massachusetts','Michigan','Minnesota',
			'Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico',
			'New York','North Carolina','North Dakota','Northern Mariana Islands','Ohio','Oklahoma','Oregon',
			'Palau','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas',
			'Utah','Vermont','Virgin Island','Virginia','Washington','West Virginia','Wisconsin','Wyoming'],
			mortgages: [0, 1,  2, 3, 4, 5, 6, 7, 8, 9, 10],
			mortgagesCount: 0,
			outDebts: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
			outDebtsCount: 0,
			t: true,
			f: false,
			rules: [value => !!value || "Required"],
			readMode: false,
			clientDetail: {},
			uploadType:"penn",
			file: null,
			fileRef: "",
			fileSubmitted: false,
			mode: "",
			subStage: 0,
			runDisable: false,
			downloadDisable: false,
			genDisable: false,
			replaceDisable: true,
			illDownload: true
		}
	},
  async mounted(){
	  const self = this;
		let ls = window.localStorage;
    if(!ls.ms_email || !ls.ms_id || !ls.ms_name){
      this.logout()
    }
		if(ls.agent_key.startsWith("admin")){
			this.mode = "admin"
		} else if (ls.agent_key.startsWith("agent")){
			this.mode = "agent"
      self.member = {
        name: window.localStorage.ms_name,
        email: window.localStorage.ms_email,
        id: window.localStorage.ms_id
      }
		} else {
			this.logout()
		}
    let [qkey, formid] = window.location.search.slice(1).split("=");
    if(qkey == "id" && formid){
      await self.loadClientInput(formid);
    } else window.location.replace("/dashboard")
		self.doc = window.document;
  },
	watch: {
    mortgagesCount: function(nval, oval){
      let doc = this.doc;
      const self = this;
      const yearsToRetire = self.clientDetail.retire_year - self.clientDetail.current_year.split("/")[1];
      setTimeout(()=>{
        for(let i = 1; i <= self.mortgagesCount; i++){
          doc.getElementById("mi-"+i+"_ir").addEventListener("blur", function(e){
            let name = doc.getElementById("mi-"+i+"_name").value,
                pay = doc.getElementById("mi-"+i+"_pay").value,
                overpay = doc.getElementById("mi-"+i+"_over").value, 
                bal = doc.getElementById("mi-"+i+"_bal").value,
                yr = doc.getElementById("mi-"+i+"_yrs").value,
                ir = e.target.value;
            let mortData = [name, pay, overpay, bal, yr, ir];
            let valObj = self.validate.mortgage(mortData, yearsToRetire)
            if(!valObj.valid){
              if(valObj.epoint == "warn"){
                alert(valObj.msg)
              } else if(!isNaN(parseFloat(valObj.epoint))){
                alert(valObj.msg);
                var el = doc.getElementById("mi-"+i+"_pay");
                el.value = valObj.epoint;
                el.dispatchEvent(new Event("input"));
              }
            }
          });
        }
      }, 200);
    },
    outDebtsCount: function(nval, oval){
      let doc = this.doc;
      const self = this;
      const yearsToRetire = self.clientDetail.retire_year - self.clientDetail.current_year.split("/")[1];
      setTimeout(()=>{
        for(let i = 1; i <= self.outDebtsCount; i++){
          doc.getElementById("od-"+i+"_amp").addEventListener("blur", function(e){
            let name = doc.getElementById("od-"+i+"_name").value,
                bal = doc.getElementById("od-"+i+"_bal").value,
                ir = doc.getElementById("od-"+i+"_ir").value, 
                mmp = doc.getElementById("od-"+i+"_mmp").value,
                amp = e.target.value;
            let debtData = [name, bal, ir, mmp, amp];
            let valObj = self.validate.debt(debtData, yearsToRetire)
            if(!valObj.valid){
              if(valObj.epoint == mmp){
                alert(valObj.msg);
                e.target.value = valObj.epoint
              } else if(valObj.epoint > parseFloat(mmp)) {
                alert(valObj.msg);
                doc.getElementById("od-"+i+"_mmp").value = valObj.epoint
                doc.getElementById("od-"+i+"_mmp").dispatchEvent(new Event("input"));;
                if(parseFloat(amp) < valObj.epoint) {
                  doc.getElementById("od-"+i+"_amp").value = parseFloat(valObj.epoint);
                  doc.getElementById("od-"+i+"_amp").dispatchEvent(new Event("input"));
                }
              } else {
                alert(valObj.msg);
                doc.getElementById("od-"+i+"_mmp").focus()
              }
            }
          });
        }
      }, 200)
    },
    uploadType: function(nval, oval){
      if(nval != oval){
				this.subStage = 0;
        this.fileSubmitted = false;
        this.file = null;
				this.replaceDisable = true;
      }
    },
		runDisable(c){
			if(!c) {
				this.btnState(1, 0, 0)
			}
		}
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
		addDebt: function(){
			const self = this;
			self.clientDetail.outstanding_debts.push(["", 0, 0, 0, 0]);
			self.outDebtsCount++;
			self.runDisable = false;
			setTimeout(() => self.doc.getElementById("od-"+self.outDebtsCount+"_name").focus());
		},
		deleteDebt: function(ind){
			const self = this;
			self.outDebtsCount--;
			self.runDisable = false;
			self.clientDetail.outstanding_debts.splice(ind-1, 1);
		},
		addMortgage: function(){
			const self = this;
			self.clientDetail.mortgages.push(["", 0, 0, 0, 0, 0]);
			self.mortgagesCount++;
			self.runDisable = false;
			setTimeout(() => self.doc.getElementById("mi-"+self.mortgagesCount+"_name").focus());
		},
		deleteMortgage: function(ind){
			const self = this;
			self.mortgagesCount--;
			self.runDisable = false;
			self.clientDetail.mortgages.splice(ind-1, 1);
		},
		btnState(r, d, g){
			this.runDisable = !!!r;
			this.downloadDisable = !!!d;
			this.genDisable = !!!g;
		},
		getIllustration(){
			let cd = this.clientDetail;
			window.open(this.ORIGIN+'/client/illustration/'+cd.file_ref+'/'+cd.email+'/'+cd.last_name);
		},
		openpdf(){
			window.open(this.ORIGIN+"/result/"+this.clientDetail._id+"/pdf/download", "_blank");
		},
		genpdf(){
			const self = this;
			let req = new XMLHttpRequest();
			self.readMode = true;
			req.open("GET", self.ORIGIN+"/result/"+self.clientDetail._id+"/pdf");
			req.send();
			self.resultText = "Generating PDF";
			self.resultBtn = true;
			req.onreadystatechange = function(){
				if(this.readyState == 4){
					self.readMode = false;
					self.resultText = "Generate pdf"
					self.resultBtn = false;
					if(this.status == 200){
						self.btnState(0, 1, 0);
					} else {
						self.btnState(0, 0, 1);
						self.alert(this.response.msg)
					}
				}
			}
		},
    async loadClientInput(clientId){
			const self = this;
			const agentKey = window.localStorage.agent_key;
      var agentId = localStorage.ms_id;
      var xhr = new XMLHttpRequest();
      xhr.open("GET", self.ORIGIN+"/client/detail/"+agentId+"/"+clientId);
			xhr.setRequestHeader("Authorization", agentKey);
      xhr.onreadystatechange = function(){
        if(this.readyState == 4){
          if(this.status == 200){
						// set button state
						let firstCall = false;
						if(Object.keys(JSON.parse(JSON.stringify(self.clientDetail))).length == 0){
							firstCall = true;
						}
						self.clientDetail = JSON.parse(this.response);
            window.document.title = "Client - "+self.clientDetail.first_name+" "+self.clientDetail.last_name
						self.key = self.key+1;
						self.processClientDetail(JSON.parse(this.response));
						if(firstCall) {
							if(self.clientDetail.insurer && self.clientDetail.file_ref){
								self.illDownload = false;
								self.btnState(0, 1, 0);
							} else {
								self.illDownload = true;
								self.btnState(0, 0, 0);	
							}
						} else {
							self.btnState(0, 0, 1);
							self.illDownload = false;
						}
          } else {
            console.log("loadClientInput: "+this.status)
          }
        }
      }
      xhr.send()
      this.msg = clientId;
    },
    processClientDetail(obj){
      const self = this;
      let doc = this.doc;
			self.fileRef = obj.file_ref;
			self.uploadType = obj.insurer
      self.mortgagesCount = obj.mortgages.length;
      self.outDebtsCount = obj.outstanding_debts.length;
      const yearsToRetire = obj.retire_year - obj.current_year.split("/")[1];
      // add events to mortgages fields
      setTimeout(()=>{
        for(let i = 1; i <= self.mortgagesCount; i++){
          doc.getElementById("mi-"+i+"_ir").addEventListener("blur", function(e){
            let name = doc.getElementById("mi-"+i+"_name").value,
                pay = doc.getElementById("mi-"+i+"_pay").value,
                overpay = doc.getElementById("mi-"+i+"_over").value, 
                bal = doc.getElementById("mi-"+i+"_bal").value,
                yr = doc.getElementById("mi-"+i+"_yrs").value,
                ir = e.target.value;
            let mortData = [name, pay, overpay, bal, yr, ir];
            let valObj = self.validate.mortgage(mortData, yearsToRetire)
            if(!valObj.valid){
              if(valObj.epoint == "warn"){
                alert(valObj.msg)
              } else if(!isNaN(parseFloat(valObj.epoint))){
                alert(valObj.msg);
                var el = doc.getElementById("mi-"+i+"_pay");
                el.value = valObj.epoint;
                el.dispatchEvent(new Event("input"));
              }
            }
          });
        }
      }, 200);
      // add events to outstanding debts fields
      setTimeout(()=>{
        for(let i = 1; i <= self.outstanding_debts; i++){
          doc.getElementById("od-"+i+"_amp").addEventListener("blur", function(e){
            let name = doc.getElementById("od-"+i+"_name").value,
                bal = doc.getElementById("od-"+i+"_bal").value,
                ir = doc.getElementById("od-"+i+"_ir").value, 
                mmp = doc.getElementById("od-"+i+"_mmp").value,
                amp = e.target.value;
            let debtData = [name, bal, ir, mmp, amp];
            let valObj = self.validate.debt(debtData, yearsToRetire)
            if(!valObj.valid){
              if(valObj.epoint == mmp){
                alert(valObj.msg);
                e.target.value = valObj.epoint
              } else if(valObj.epoint > parseFloat(mmp)) {
                alert(valObj.msg);
                doc.getElementById("od-"+i+"_mmp").value = valObj.epoint
                doc.getElementById("od-"+i+"_mmp").dispatchEvent(new Event("input"));;
                if(parseFloat(amp) < valObj.epoint) {
                  doc.getElementById("od-"+i+"_amp").value = parseFloat(valObj.epoint);
                  doc.getElementById("od-"+i+"_amp").dispatchEvent(new Event("input"));
                }
              } else {
                alert(valObj.msg);
                doc.getElementById("od-"+i+"_mmp").focus()
              }
            }
          });
        }
      }, 200)
    },
		fileSubmit(){
			this.fileSubmitted = false;
      var fileInfo = this.doc.getElementById("data-file").files[0];
			if(fileInfo){
				this.replaceDisable = false;
			} else this.replaceDisable = true
		},
		async uploadFile(){
      const self = this;
			if(!this.uploadType) {
				self.alert("Select a insurer type");
				return;
			}
			if(!self.doc.getElementById("data-file").files[0]){
				self.alert("No file uploaded");
				return;
			}
			const agentKey = window.localStorage.agent_key;
      var xhrFile = new XMLHttpRequest();
      xhrFile.open("POST", self.ORIGIN+"/upload/"+this.uploadType);
			xhrFile.setRequestHeader("Authorization", agentKey);
      xhrFile.onreadystatechange = function(){
        if(this.readyState == 4){
					self.readMode = false;
          if(this.status == 200){
            self.fileRef = this.response;
						self.clientDetail.file_ref = this.response;
						self.clientDetail.insurer = self.uploadType;
            self.fileSubmitted = true;
						self.illDownload = false;
						self.btnState(1, 0, 0);
          } else {
						self.replaceDisable = false;
            self.alert(JSON.parse(this.response).message) 
          }
        }
      }
      var fd = new FormData();
      let email = self.doc.getElementById("email").value;
      if(!!email){
        var filename = email.replace(/[@|.]/gi, "_");
        fd.append("file", self.doc.getElementById("data-file").files[0], filename+".xlsx");
				fd.append("lib_id", self.clientDetail._id);
				fd.append("agent_id", window.localStorage.ms_id);
				self.readMode = true;
        xhrFile.send(fd);
      } else {
        this.alert("Email field is empty.")
      }
    },
    format(val){
      if(parseFloat(val) === Math.floor(val) && !isNaN(parseFloat(val))){
        return parseInt(val);
      } else if(!isNaN(parseFloat(val))){
        return parseFloat(val);
      } else {
        return val;
      }
    },
		async rerun(){
			if(!this.$refs.form.validate()){
        this.alert("Incomplete or Invalid Data");
        return
      }
      const self = this;
      // self.email = self.doc.getElementById("email").value;
      var mortgages = this.mortgagesCount, debts = this.outDebtsCount;
      const mortgageFields = ["name", "pay", "over", "bal", "yrs", "ir"];
      const debtsFields = ["name", "bal", "ir", "mmp", "amp"];
      let data = {
        "mortgages": [],
        "outstandingDebts": []
      };
      
      let yearsToRetire = (parseInt(self.doc.getElementById("retire").value) + parseInt(self.doc.getElementById("birth").value)) - parseInt(new Date().getFullYear());
      
      // collecting mortgage information
      for(let m = 1; m <= mortgages; m++){
        let temp = [];
        mortgageFields.forEach(field => {
          let el = self.doc.getElementById("mi-"+m+"_"+field);
          if(el.value === ""){
            el = el.parentElement.parentElement.querySelector("input[change the value of vuieitfy text input using jstype='hidden']")
          }
          let val = this.format(el.value);
          temp.push(val)
        })
        if(this.validate.mortgage(temp, yearsToRetire)){
          data.mortgages.push(temp);
        } else {
          this.alert("Invalid data for "+temp[0]);
          return false
        }
      }

      // collecting debts information
      for(let m = 1; m <= debts; m++){
        let temp = [];
        debtsFields.forEach(field => {
          let el = self.doc.getElementById("od-"+m+"_"+field);
          if(el.value === ""){
            el = el.parentElement.parentElement.querySelector("input[type='hidden']")
          }
          let val = this.format(el.value);
          temp.push(val)
        })
        if(this.validate.debt(temp, yearsToRetire)){
          data.outstandingDebts.push(temp);
        } else {
          this.alert("Invalid data for "+temp[0]);
          return false
        }
      }

      // collecting all data
      var currDate = new Date();
      let retireYear = parseInt(self.doc.getElementById("retire").value) + parseInt(self.doc.getElementById("birth").value); // retire_age + birth_year
      const _data = {
				"_id": self.clientDetail._id,
        "first_name": self.doc.getElementById("first-name").value,
        "last_name": self.doc.getElementById("last-name").value,
        "email": self.doc.getElementById("email").value,
        "birth_year": parseInt(self.doc.getElementById("birth").value),
        "residence": self.doc.getElementById("residence").parentElement.parentElement.querySelector("input[type='hidden']").value,
        "retirement_age": self.doc.getElementById("retire").value,
        "retire_year": retireYear,
        "current_year": currDate.getMonth()+"/"+currDate.getFullYear(),
        "mortgages": data.mortgages,
        "outstanding_debts": data.outstandingDebts,
        "agent_first_name": self.clientDetail.agent_first_name,
        "agent_last_name": self.clientDetail.agent_last_name,
        "insurer": self.uploadType,
        "file_ref": self.fileRef,
        "agent_email": window.localStorage.getItem("ms_email"),
        "agent_id": window.localStorage.getItem("ms_id"),
      };
      var xhr = new XMLHttpRequest();
      xhr.open("POST", self.ORIGIN+"/debts");
      xhr.setRequestHeader("Content-type", "application/json")
			xhr.setRequestHeader("Authorization", window.localStorage.agent_key);
      xhr.responseType = "json";
      xhr.onreadystatechange = function(){
        if(this.readyState == 4){
          if(this.status == 200){
            self.loadClientInput(this.response.id);
						self.btnState(0, 0, 1)
						self.readMode = false;
          } else {
            self.alert(this.response.message)
          }
        }
      }
      xhr.send(JSON.stringify(_data));
			self.readMode = true;
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