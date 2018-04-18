<template>
<div id="home-page">
  <div id="wrapper">
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <!--<li><router-link to="/player">Player Page</router-link></li>-->
        <!--<li><router-link to="/dm">DM's Page</router-link></li>-->
        <li class="register-button"><router-link to="/register">Register</router-link></li>
        <li class="login-button"><router-link to="/login">Login</router-link></li>
      </ul>
    </nav>
    <div id="notice-board">
      <h1>Notice</h1>
      <p>{{intro}}</p>
      <!--  <p>{{instructions}}</p>  -->
	  <p>{{notice}}
      <p>{{hints}}</p>
    </div>
  </div>
  <footer>
    <a href="https://github.com/markwelker/dungeonmonster/">Dungeon Monster GitHub</a>
  </footer>
</div>
</template>

<script>
export default {
  name: 'notice-board',
  data() {
    return {
      intro: "Welcome to Dungeon Monster! This is a management tool for a campaign of Dungeons and Dragons. " +
        "If you haven't played or heard of that before, no worries! All you need to know is that DnD is a " +
        "cooperative game where you work together with other heroes.",

      instructions: "This page is provided for ease of access. In the final version, you will only be able to " +
        "access this site via the login page. For the best experience, we recommend that you visit the login page first!",

	  notice: "Please bear with us while we refactor the entire website into vue-webpack, the login page isn't yet operational, " +
	    "but it fulfills all the requirements.",

      hints: "Hint: If you're looking for an API with C.R.U.D., try healing/hurting Players/NPCs on the DM page!",
    }
  }
}
</script>

<style scoped src="../assets/styles/home.css"></style>
