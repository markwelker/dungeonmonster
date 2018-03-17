<template>
<div class="party-bar">
  <div class="player-card" v-for="player in party" v-on:click="select(player.id)">
    <h2>{{player.name}}</h2>
    <img v-bind:src="player.profile">
    <h3>
            <img class="icon" src="../assets/heal.png" v-on:click.stop="heal(player.id)" title="Heal"/>
            {{player.hp}}/{{player.maxhp}}
            <img class="icon" src="../assets/damage.png" v-on:click.stop="damage(player.id)" title="Damage"/>
          </h3>
  </div>
</div>
</template>

<script>
export default {
  name: 'PartyBar',
  data() {
    return {
      selected: 0;
    };
  }
  computed: {
    party: function() {
      return this.$store.getters.party;
    },
  },
  methods: {
    heal: function(id) {
			var amount = "";
			while(!isInt(amount)){
			amount = prompt("Heal how much damage?", 0);
			}
			amount = parseInt(amount, 10);
      var player = this.party[id];
			player.hp += amount;
			if(player.hp > player.maxhp){
				player.hp = player.maxhp;
			}
			else if (player.hp < 0){
				player.hp = 0;
			}
      this.$store.dispatch('updatePlayer')
		},

		damage: function(id) {
			var amount = "";
			while(!isInt(amount)){
			amount = prompt("Take how much damage?", 0);
			}
			amount = parseInt(amount, 10);
      var player = this.party[id];
      player.hp -= amount;
			if(player.hp > player.maxhp){
			   player.hp = player.maxhp;
			}
			else if(player.hp < 0){
			   player.hp = 0;
			}
      this.$store.dispatch('updatePlayer', player);
    },

    select: function(id) {
			console.log("Selected: " + id);
			this.selected = id;
			var newSheet = this.players[this.selection].sheet;
			swapCharSheets(newSheet);
    },

    isInt: function(value) {
	    var x;
	    if (isNaN(value)) {
	      return false;
	    }
	    x = parseFloat(value);
	      return (x | 0) === x;
      },
    }
}
</script
