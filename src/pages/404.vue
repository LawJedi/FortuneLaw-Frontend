<template>
  <v-app>
    <v-main>
      <v-toolbar>
        <img src="/black_logo.png" height="100%" style="margin:auto" />
      </v-toolbar>
      <v-container>
        <v-row justify-center>
          <span class="_ my-5">Sorry, the page you requested does not exist !</span>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  metaInfo: {
    title: "Sorry, Not Found!"
  }
}
</script>

<style>
._ {
  margin:auto;
  font-family:Roboto;
  font-size:40px;
  font-weight:bold;
  text-transform:uppercase;
}
</style>