<template>
  <v-text-field
    regular outlined
    class="my-5"
    v-bind="$attrs"
    v-bind:id="$attrs.id"
    v-bind:hint="$attrs.hint"
    v-bind:persistent-hint="!!$attrs.hint"
    v-bind:type="type"
    v-bind:prepend-inner-icon="icon"
    v-bind:rules="rules"
    validate-on-blur
  />
</template>

<script>
export default {
  props: {
    number: {
      type: Boolean,
      default: false
    },
    email: {
      type: Boolean,
      default: false
    }
  },
  inheritAttrs: false,
  data(){
    return {
      icon: "",
      type: "text",
      checkNumber: (val) => {
        return (/[\d]+/.test(val) || "Number only")
      },
      checkEmail: (val) => {
        return (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val) || "Invalid email");
      },
      rules: [(val)=>{
        if(val != 0) return !!val || "Required or invalid data"
        else return true;
      }]
    }
  },
  mounted(){
    this.icon = this.$attrs["prepend-inner-icon"] || "text_format";
    if(this.$props.number){
      this.type = "number";
      this.icon = this.$attrs["prepend-inner-icon"] || "attach_money";
      this.rules.push(this.checkNumber);
    }
    if(this.$props.email){
      this.type = "email";
      this.icon = this.$attrs["prepend-inner-icon"] || "alternate_email";
      this.rules.push(this.checkEmail);
    }
  }
}
</script>