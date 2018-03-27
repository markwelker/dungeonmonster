<template>
<div class="main-container-player" id="player-app">
  <div class="party-container">
    <h1 class="party-header">
					Party
					<img src="/static/images/scroll.png" v-on:click="toSpellsPage()">
		</h1>
    <PartyBar/>
  </div>
  <Chat/>
  <div class="character-info">
    <h1>Character Information</h1>

    <div class="character-sheet">
      <embed id="charsheet" src="/static/Fighter.pdf"></embed>
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
    PartyBar,
    Chat
  },

  data() {
    return {
      username: '',
      active: 'Fighter',
      sheet: '/static/pdf/Fighter.pdf',
    }
  },

  watch: {
    sheet: function(val) {
      var oldSheet = document.getElementById("charsheet");
      var clone = oldSheet.cloneNode(true);
      clone.setAttribute('src', val);
      oldSheet.parentNode.replaceChild(clone, oldSheet);
    },
  },
  methods: {
    selected(player){
      this.active = player.name;
      this.sheet = player.sheet;
    },

    swapCharacterSheets: function(newSheet) {
      this.active = newSheet;
    },
    toSpellsPage: function() {
      this.$router.push('Spells');
    },
  }, // end of methods
}
</script>

<style scoped src="../assets/styles/player.css"></style>
