<template>
<div class="shadow">
  <div class="login-container">
    <div>
      Username
      <br>
        <input type="text"
          id="username"
          placeholder="Username"
          v-model="username">
       <br/>

      Password
      <br>
        <input type="password"
          id="password"
          placeholder="Password"
          v-model="password">
       <br/>
      <!--<button class = "login-button" onclick = "loginDM()">DM Login</button>-->
      <button class="login-button" v-on:click="login()">Login</button>&nbsp;
      <button class="login-button" v-on:click="info()">&nbsp;?&nbsp;</button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
    }
  },
  calculated: {
    loginError: function() {
      error = this.$store.getters.loginError;
      if(error !== '') {
        alert(error);
      }
      return error;
    },

    registrationError: function() {
      error = this.$store.getters.registrationError;
      if(error !== '') {
        alert(error);
      }
      return error;
    }
  },
  methods: {
    login: function() {
      console.log("Logging in Player");
	  var player = {name:this.username, password:this.password};
	  this.$store.dispatch('loginPlayer', player);
    },

    info: function() {
      console.log("info!");
      alert("Valid Credentials:\n" +
        "Username : Password\n" +
        "Fighter: fighter\n" +
        "Cleric: healsalot\n" +
        "Wizard: P0wroverwhelming\n" +
        "Bard: Shakespeare\n" +
        "DM: dungeonmonster");
    }
  }
}
</script>

<style scoped src="../assets/styles/login.css"></style>
