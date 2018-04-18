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
	   Class
	   <img class="class-select" src="/static/images/Bard.png">
	   <img class="class-select" src="/static/images/Cleric.png">
	   <img class="class-select" src="/static/images/Fighter.png">
	   <img class="class-select" src="/static/images/Wizard.png">
      <!--<button class = "login-button" onclick = "loginDM()">DM Login</button>-->
      <button class="login-button" v-on:click="register()">Register</button>&nbsp;
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
  methods: {
    register: function() {
      console.log("Registering Player");

      var name = document.getElementById("username").value;
      var password = document.getElementById("password").value;
	  var player = {name:username, password:password, class:'Fighter'};
      this.$store.dispatch('registerPlayer', npc);
    },
  }
}
</script>

<style scoped src="../assets/styles/login.css"></style>
