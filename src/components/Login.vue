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
      <button class="login-button" v-on:click="login()">Login</button>&nbsp
      <button class="login-button" v-on:click="info()">&nbsp?&nbsp</button>
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
    login: function() {
      console.log("Logging in Player");
      var users = [
        {user: "Fighter", password: "fighter"},
        {user: "Wizard", password: "P0wroverwhelming"},
        {user: "Cleric", password: "healsalot"},
        {user: "Bard", password: "Shakespeare"},
      ];

      var username = document.getElementById("username").value;
      var password = document.getElementById("password").value;
      var success = false;
      if (username === "DM" && password === "dungeonmonster") {
        this.$router.push({name: 'dm'});
        success = true;
      } else {
        for (var i = 0; i < users.length; i++) {
          if (username === users[i].user && password === users[i].password) {
            this.$router.push({name: 'player', params: {username}});
            success = true;
            break;
          }
        }
      }
      // Didn't match any valid credentials, so alert them.
      if (!success) alert("Invalid Login Credentials!");
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

<style src="../assets/styles/login.css"></style>
