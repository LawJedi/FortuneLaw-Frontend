<template>
  <v-app>
      <v-app-bar>
        <img src="/black_logo.png" height="100%"/>
				<v-spacer></v-spacer>
				<a href="/dashboard/" class="mx-3"><v-btn text color="primary">Dashboard</v-btn></a>
				<!-- <a href="/form/" class="mx-3"><v-btn text color="primary">Form</v-btn></a>
				<v-btn class="mx-3" text color="secondary" @click="logout()">logout</v-btn> -->
      </v-app-bar>
    <v-main>
      <v-form ref="form">
      <v-container>
        <v-row>
          <v-col cols="8" offset="2">
            <v-row>
              <v-col>
                <p class="text-h2 text-center">Debt Elimination Client Questionnaire</p>
                <p class="text-subheader-1 text--secondary">Please fill this form out in its entirety so we can get to work seeing how we can help eliminate your debt while building your wealth at the same time.</p>
                <p class="text-caption text--secondary">(All fields are necessary.)</p>
              </v-col>
            </v-row>
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
                    class="my-2"
                  />
                  </v-col>
                  <v-col>
                  <TextInput
                    label= "Last Name"
                    id="last-name"
                    class="my-2"
                  />
                  </v-col>
                </v-row>
                <v-row style="margin-top:-15px; margin-bottom:-15px;">
                  <v-col>
                  <TextInput email
                    label= "Email"
                    id="email"
                    class="my-2"
                  />
                  </v-col>
                  <v-col>
                  <v-select 
                    v-model="resid"
                    regular outlined
                    label= "State of Residence"
                    :items="states"
                    prepend-inner-icon="home"
                    id="residence"
                    :rules="rules"
                    class="my-5"
                    :autocomplete="t"
                  />
                  </v-col>
                </v-row>
                <v-row style="margin-top:-15px; margin-bottom:-15px;">
                  <v-col>
                    <TextInput number
                      prepend-inner-icon="schedule"
                      label="Birth year"
                      id="birth"
                      :min="currentYear - 60"
                      :max="currentYear - 25"
                    />
                  </v-col>
                  <v-col>
                    <TextInput number
                      prepend-inner-icon="schedule"
                      label="Retirement Age"
                      id= "retire"
                      min="55"
                      max="65"
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <span class= "text-button section-header">Debt Information</span>
              <p class="text-caption my-3">For this section, it is critical that inputs have the exact numbers for balances, minimum payments, actual payments, and interest rates to ensure our debt illustration is as accurate as possible.</p>
            </v-row>
            <v-row>
              <v-col>
                <p class="text-button text--secondary section-subheader">mortgage Information</p>
                <v-select v-model="mortgagesCount"
                  :items="mortgages"
                  label="How many mortgages do you have ?"
                />
                <div class="my-3" :id="'mi-'+i" v-if="mortgagesCount > 0" v-for="i in (mortgagesCount)" :key="i">
                  <span class="font-weight-bold">Mortgage {{i}}</span>
                  <TextInput
                    label= "Name"
                    :id="'mi-'+i+'_name'"
                    hint="Just put something here to identify it. Maybe the name of the street the home is on."
                  />
                  <TextInput number
                    label="Mortgage and interest payment (do not include PMI, taxes, etc.)"
                    :id="'mi-'+i+'_pay'"
                  />
                  <TextInput number
                    label="How much is the client overpaying on their mortgage every year ?"
                    :id="'mi-'+i+'_over'"
                    hint="Don't include property tax, PMI, or anything beyond principal and interest."
                  />
                  <TextInput number
                    label="What is the balance on this mortgage ?"
                    :id="'mi-'+i+'_bal'"
                  />
                  <TextInput number
                    prepend-inner-icon="schedule"
                    label="Years left on this mortgage, ex., 14.67"
                    :id="'mi-'+i+'_yrs'"
                  />
                  <TextInput number
                    prepend-inner-icon="trending_up"
                    label="Interest rate on this mortgage, ex., 5.24"
                    :id="'mi-'+i+'_ir'"
                    step="0.1" min= "0.00"
                  />
                </div>
                <div class="my-3" v-if="mortgagesCount > 10">
                  <span class="font-weight-bold">More mortgages</span>
                  <v-textarea
                    regular outlined
                    label="More mortgages"
                    id="mi_more"
                    class="my-5"
                    :rules="rules"
                  />
                </div>
                <v-divider class="my-5" />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <p class="text-button text--secondary section-subheader">Oustanding debts Information</p>
                <v-select v-model="outDebtsCount"
                  :items="outDebts"
                  label="How many outstanding debts (other than mortgages) do you have ?"
                />
                <div class="my-3" :id="'odi-'+i" v-if="outDebtsCount > 0" v-for="i in (outDebtsCount)" :key="i">
                  <span class="font-weight-bold">Outstanding Debt {{i}}</span>
                  <TextInput 
                    label="Name"
                    hint="Come up with a label to describe this debt, e.g., 'American Express'; 'student loan.'"
                    :id="'od-'+i+'_name'"
                  />
                  <TextInput number
                    label="Debt Balance"
                    :id="'od-'+i+'_bal'"
                  />
                  <TextInput number
                    prepend-inner-icon="trending_up"
                    label="Interest rate, ex., 5.24"
                    :id="'od-'+i+'_ir'"
                  />
                  <TextInput number
                    :ref="'od'+i+'mmp'"
                    label="Minimum monthly payment"
                    :id="'od-'+i+'_mmp'"
                  />
                  <TextInput number
                    label="Actual monthly payment"
                    :id="'od-'+i+'_amp'"
                  />
                </div>
                <div class="my-3" v-if="outDebtsCount > 10">
                  <span class="font-weight-bold">More Debts</span>
                  <v-textarea
                    regular outlined
                    label="More outstanding Debts"
                    class="my-5"
                    id="od_more"
                    :rules="rules"
                  />
                </div>
                <v-divider class="my-5" />
              </v-col>
            </v-row>
            <v-row class="mt-5">
              <span class="text-button section-header">agent details</span>
            </v-row>
            <v-row>
              <v-col>
                <TextInput
                  label="First Name"
                  id="agent-first-name"
                />
              </v-col>
              <v-col>
                <TextInput 
                  label="Last Name"
                  id="agent-last-name"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-btn @click="save(true)" color="secondary" large class="mx-3"><v-icon class="mr-2">save</v-icon>Save</v-btn>
              <v-btn @click="clear()" text color="secondary" large class="mx-3"><v-icon class="mr-2">refresh</v-icon>reset</v-btn>
            </v-row>
            <v-divider class="my-5"/>
            <v-row class="mt-5">
              <v-col cols="8">
              <p class="text-caption">(Agents only) If you have the .csv for the illustration, please upload it here.</p>
              <v-radio-group
                v-model="uploadType"
                row
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
              <v-row>
              <v-file-input filled
                :clearable="false"
                prepend-icon="" 
                prepend-inner-icon="attach_file" 
                label="Upload" 
                :rules="rules"
                id="data-file"
                validate-on-blur
                @change="fileSubmit()"
                v-model="file"
                style="cursor:pointer" />
              <v-btn large color="secondary" @click="uploadFile()" v-if="!fileSubmitted" class="my-3 mx-8">Upload File</v-btn>
              </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-alert dismissible
                  v-model="err"
                  prominent
                  id="err-disp"
                  type="error"
                  border="left"
                  colored-border
                  icon="error"
                  class="my-3"
                >{{errorText}}</v-alert>
                <v-sheet v-if="outStatus">
                  <p v-html="outputText"></p>
                  <v-btn color="secondary" @click="downloadPDF()" :disabled="pdfBtnStatus">{{pdfBtn}}</v-btn>
                </v-sheet>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn x-large color="secondary" @click="submitData()" :disabled="(submitBtn && fileSubmitted)" class="px-10">{{btnText || "Submit"}} <v-progress-circular v-if="loader" indeterminate color="primary" class="ml-5"></v-progress-circular></v-btn>
              </v-col>
            </v-row>
            <v-row>
              <a href= "/template.xlsx"><v-btn outlined x-large><v-icon class="mr-2">get_app</v-icon>download excel template</v-btn></a>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
      </v-form>
    </v-main>
  </v-app>
</template>

<script>
export default {
  metaInfo: {
    title: 'Form'
  },
  data(){
    return {
      f:false,
      t:true,
      doc: null,
      currentYear: (new Date()).getFullYear(),
      resid: "",
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
      uploadType:"other",
      err: false,
      errorText: "",
      submitBtn: false,
      btnText: "",
      loader: false,
      fileSubmitted: false,
      fileRef: "",
      ext: "",
      file: null,
      outStatus: false,
      responseID: null,
      outputText: "",
      pdfBtn: "Generate PDF",
      pdfBtnStatus: false,
      pdfGen: false,
      rules: [value => !!value || "Required"]
    }
  },
  mounted(){
    this.doc = window.document;
    let ls = window.localStorage;
    if(!ls.ms_email || !ls.ms_id || !ls.ms_name){
      window.localStorage.clear();
      window.location.replace("/login")
    }
  },
  watch: {
    mortgagesCount: function(nval, oval){
      let doc = this.doc;
      const self = this;
      const yearsToRetire = (parseInt(doc.getElementById("retire").value) + parseInt(doc.getElementById("birth").value)) - parseInt(new Date().getFullYear());
      setTimeout(()=>{
        for(let i = oval+1; i <= nval; i++){
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
      }, 200)
    },
    outDebtsCount: function(nval, oval){
      let doc = this.doc;
      const self = this;
      const yearsToRetire = (parseInt(self.doc.getElementById("retire").value) + parseInt(self.doc.getElementById("birth").value)) - parseInt(new Date().getFullYear());
      setTimeout(()=>{
        for(let i = oval+1; i <= nval; i++){
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
        this.fileSubmitted = false;
        this.file = null;
      }
    }
  },
  methods: {
		logout(){
			window.localStorage.clear();
			window.location.replace("/login");
		},
    changeBtn: function(disState, text, enableLoader){
      this.submitBtn = disState;
      if(enableLoader){
        this.loader = true;
      } else {
        this.loader = false;
      }
      this.btnText = text;
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
    popError(txt){
      this.doc.getElementById("err-disp").scrollIntoView();
      this.err = true;
      this.errorText = txt;
    },
    downloadPDF(){
      let self = this;
      if(!this.pdfGen){
        var xhr = new XMLHttpRequest();
        xhr.open("GET", self.ORIGIN+"/result/"+this.responseID+"/pdf");
        xhr.send();
        self.pdfBtn = "Generating PDF ..."
        self.pdfBtnStatus = true;
        xhr.onreadystatechange = function(){
          if(this.readyState == 4){
            if(this.status == 200){
              self.pdfBtn = "Download PDF";
              self.pdfBtnStatus = false;
              self.pdfGen = true;
            } else {
              self.pdfBtn = "Try Again";
              self.pdfGen = false;
              self.popError = "PDF didn't generate. Try Again."
            }
          }
        }
      } else {
        window.open(this.ORIGIN+"/result/"+this.responseID+"/pdf/download");
      }
    },
    fileSubmit(){
      this.fileSubmitted = false;
      var fileInfo = this.doc.getElementById("data-file").files[0];
    },
    async uploadFile(){
      const self = this;
      var xhrFile = new XMLHttpRequest();
      xhrFile.open("POST", self.ORIGIN+"/upload/"+this.uploadType);
      xhrFile.onreadystatechange = function(){
        if(this.readyState == 4){
          if(this.status == 200){
            self.fileRef = this.response
            self.fileSubmitted = true;
            self.err = false;
          } else {
            console.log(this.response)
            self.popError(JSON.parse(this.response).message)
          }
        }
      }
      var fd = new FormData();
      let email = self.doc.getElementById("email").value;
      if(!!email){
        var filename = email.replace(/[@|.]/gi, "_");
        fd.append("file", self.doc.getElementById("data-file").files[0], filename+".xlsx");
        xhrFile.send(fd);
      } else {
        this.popError("Email field is empty.")
      }
    },
    async save(sendBool){
      const self = this;
      self.email = self.doc.getElementById("email").value;
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
          this.popError("Invalid data for "+temp[0]);
          this.changeBtn(false, "Try Again", false)
          return false
        }
        if(m >= this.mortgages.length){
          data.mortgages.push(self.doc.getElementById("mi_more").value)
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
          this.popError("Invalid data for "+temp[0]);
          this.changeBtn(false, "Try Again", false)
          return false
        }
        if(m >= this.outDebts.length){
          data.outstandingDebts.push(self.doc.getElementById("od_more").value)
        }
      }

      // collecting all data
      var currDate = new Date();
      let retireYear = parseInt(self.doc.getElementById("retire").value) + parseInt(self.doc.getElementById("birth").value); // retire_age + birth_year
      const _data = {
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
        "agent_first_name": self.doc.getElementById("agent-first-name").value,
        "agent_last_name": self.doc.getElementById("agent-last-name").value,
        "insurer": "",
        "file_ref": "",
        "agent_email": window.localStorage.getItem("ms_email"),
        "agent_id": window.localStorage.getItem("ms_id"),
      };
      if(sendBool){
        var xhr = new XMLHttpRequest();
        xhr.open("POST", self.ORIGIN+"/save/");
        xhr.setRequestHeader("Content-type", "application/json")
        xhr.setRequestHeader("Authorization", window.localStorage.agent_key)
        xhr.responseType = "json";
        xhr.onreadystatechange = function(){
          if(this.readyState == 4){
            if(this.status == 200){
              self.err = false;
              self.clear();
              window.location.assign("/dashboard");
            } else {
              self.popError(this.response.message)
            }
          }
        }
        xhr.send(JSON.stringify(_data));
      }
    },
    async clear(){
      let self = this;
      let ids = ["first-name", "last-name", "email", "birth", "retire", "agent-first-name", "agent-last-name"];
      for(let id of ids){
        console.log(id);
        self.doc.getElementById(id).value = "";
        self.doc.getElementById(id).dispatchEvent(new Event("input"));        
      }
      self.resid = "Alabama";
      self.mortgageCount = 0;
      self.outDebtsCount = 0;
    },
    async submitData(){
      // routine
      if(!this.$refs.form.validate()) {
        this.popError("Incomplete or Invalid Data");
        this.changeBtn(false, "Try Again", false)
        return
      }
      this.err = false;
      const self = this;
      self.changeBtn(true, "validating data ...", true);
      self.email = self.doc.getElementById("email").value;
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
          this.popError("Invalid data for "+temp[0]);
          this.changeBtn(false, "Try Again", false)
          return false
        }
        if(m >= this.mortgages.length){
          data.mortgages.push(self.doc.getElementById("mi_more").value)
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
          this.popError("Invalid data for "+temp[0]);
          this.changeBtn(false, "Try Again", false)
          return false
        }
        if(m >= this.outDebts.length){
          data.outstandingDebts.push(self.doc.getElementById("od_more").value)
        }
      }

      // collecting all data
      var currDate = new Date();
      let retireYear = parseInt(self.doc.getElementById("retire").value) + parseInt(self.doc.getElementById("birth").value); // retire_age + birth_year
      const _data = {
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
        "agent_first_name": self.doc.getElementById("agent-first-name").value,
        "agent_last_name": self.doc.getElementById("agent-last-name").value,
        "insurer": self.uploadType,
        "file_ref": self.fileRef,
        "agent_email": window.localStorage.getItem("ms_email"),
        "agent_id": window.localStorage.getItem("ms_id"),
      };
      var xhr = new XMLHttpRequest();
      xhr.open("POST", self.ORIGIN+"/debts/");
      xhr.setRequestHeader("Content-type", "application/json")
      xhr.responseType = "json";
      xhr.onreadystatechange = function(){
        if(this.readyState == 4){
          if(this.status == 200){
            self.responseID = this.response.id;
            self.outStatus = true;
            self.changeBtn(true, "data sent", false)
            self.err = false;
          } else {
            self.changeBtn(false, "Try Again", false)
            self.popError(this.response.message)
          }
        }
      }
      xhr.send(JSON.stringify(_data));
    }
  }
}
</script>

<style>
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
a {
  text-decoration: none;
}
</style>

