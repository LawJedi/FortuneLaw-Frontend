// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import Vuetify from "vuetify"
import 'vuetify/dist/vuetify.min.css'
import TextInput from "~/components/TextInput.vue"

export default function (Vue, { head, appOptions }) {

  Vue.component("TextInput", TextInput);
  
  head.link.push({
    rel: 'stylesheet',
    href: 'https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css',
  })

  head.link.push({
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css?family=Material+Icons',
  })
  
  head.link.push({
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900',
  });

  Vue.prototype.validate = {
    mortgage: function(mortData, yearsToRetire){
      let name = mortData[0];
      let rate = mortData[5], balance = mortData[3], payment = mortData[1], dur = mortData[4]*12;
      let r = rate/1200;
      let resultPayment = null;
      if(r != 0){
        resultPayment = (Math.round((balance*(r*Math.pow(1+r, dur))/(Math.pow(1+r, dur) - 1))*100)/100).toFixed(2);
      } else {
        resultPayment = (Math.round((balance/dur)*100)/100).toFixed(2)
      }
      let valObj = {
        valid: true,
        msg: "",
        epoint: "" 
      }
      if(dur > yearsToRetire*12){
        valObj = {
          valid: false,
          msg: name+" is being cleared after your retirement.",
          epoint: "warn"
        }
      }
      if(resultPayment != payment){
        valObj = {
          valid: false,
          msg: "Monthly payment for "+name+" does not match the balance, years left, and interest rate. We have adjusted it to "+resultPayment+". If you are confident the monthly payment amount is correct and only includes principal and interest, then you can adjust the numbers left on the mortgage so the monhtly payment matches.",
          epoint: resultPayment
        }
      }
      return valObj
    },
    debt: function(debtData, yearsToRetire){
      let name  = debtData[0];
      let rate = debtData[2], balance = debtData[1], apayment = parseFloat(debtData[4]), mpayment = parseFloat(debtData[3]);
      let r = rate/1200;
      let aresultMonth;
      if(r != 0){
        aresultMonth = Math.ceil((Math.log10(apayment/(balance*r)) - Math.log10((apayment/(balance*r))-1))/(Math.log10(1+r)));
      } else {
        aresultMonth = Math.ceil(balance/apayment)
      }
      let valObj = {
        valid: true,
        msg: ""
      }
      if(apayment < mpayment){
        valObj = {
          valid: false,
          msg: "Actual payment for "+name+" is less than minimum payment.",
          epoint: mpayment
        }
      }
      if(aresultMonth > yearsToRetire*12){
        valObj = {
          valid : false,
          msg: "Debt is being cleared after retirement period"
        }
      }
      let firstInt = (Math.round(balance*r*100)/100).toFixed(2)
      if(apayment < firstInt){
        valObj = {
          valid: false,
          msg: "Invalid Actual Debt Payment for "+name
        }
      }if(mpayment < firstInt){
        valObj = {
          valid: false,
          msg: "Invalid minimum Debt Payment for "+name+". Must be greater than interest of first month, i.e, "+(parseFloat(firstInt)+20).toFixed(2),
          epoint: (parseFloat(firstInt)+20).toFixed(2)
        }
      }
      return valObj
    }
  }

  Vue.prototype.ORIGIN = "http://qualyval.mynetgear.com:4010/backend"
  // Vue.prototype.ORIGIN = "http://localhost:9000"

  let opts={};
  Vue.use(Vuetify)
  
  appOptions.vuetify = new Vuetify(opts);
}
