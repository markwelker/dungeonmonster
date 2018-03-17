<template>
<div class="main-container-player" id="player-app">
  <div class="party-container">
    <h1 class="party-header">
  				Party
  				<img src="../assets/images/scroll.png" v-on:click="this.$router.push('spells')">
  	</h1>
    <PartyBar/>
  </div>
  <Chat/>
  <div class="character-info">
    <h1>Character Information</h1>
    <div class="character-sheet">
      <embed id="charsheet" src="../assets/pdf/Fighter.pdf"></embed>
    </div>

  </div>
</div>
</template>

<script>
import PartyBar from './PartyBar.vue'
import Chat from './Chat'

  export default {
    name: 'Player',
    components: {
      PartyBar, Chat
    },

    data() {
      return {
        username: '',

      }
    },
  }
</script>

<style src="../assets/styles/player.css"></style>
