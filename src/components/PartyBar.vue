<script>
export default {
  name: 'PartyBar',

  data() {
    return {
      selected: 0
    };
  },

  created: function() {
    this.$store.dispatch('getParty');
  },

  computed: {
    party: function() {
      return this.$store.getters.party;
    },
  },

  methods: {
    heal: function(id) {
			var amount = "";
			while(!this.isInt(amount)){
				amount = prompt("Heal how much damage?", 0);
			}
			amount = parseInt(amount, 10);
      		var player = this.party[id];
			player.hp += amount;
			if (player.hp > player.maxhp) {
				player.hp = player.maxhp;
			}
			else if (player.hp < 0){
				player.hp = 0;
			}
      		this.$store.dispatch('updatePlayer', player);
		},

		damage: function(id) {
			var amount = "";
			while(!this.isInt(amount)){
				amount = prompt("Take how much damage?", 0);
			}
			amount = parseInt(amount, 10);
			console.log(this.party);
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
    	this.$parent.selected(this.party[id]);
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
</script>

<template>
<div class="party-bar">
  <div class="player-card" v-for="player in party" v-on:click="select(player.id)">
    <h2>{{player.name}}</h2>
    <img v-bind:src="player.picture">
    <h3>
            <img class="icon" src="/static/images/heal.png" v-on:click.stop="heal(player.id)" title="Heal"/>
            {{player.hp}}/{{player.maxhp}}
            <img class="icon" src="/static/images/damage.png" v-on:click.stop="damage(player.id)" title="Damage"/>
          </h3>
  </div>
</div>
</template>

<style scoped>
.party-bar{
	display:flex;
	width:100%;
	flex-flow:wrap;
}

.player-card {
	margin:1vw;
	max-width: 10vw;
	min-width:7vw;
	border-radius: 1em;
	background-color:var(--charcoal);
	box-shadow: 0 0 1em rgba(0,0,0,0.5);
	cursor: pointer;
}

.player-card:hover{
	box-shadow: 0 0 1em rgba(255,255,255,1);
}

.player-card h2 {
	font-size: 1.5em;
	margin:0;
	padding:3px;
	text-align: center;
	border-top-left-radius: 0.5em;
	border-top-right-radius: 0.5em;

	/* font-family: 'Berkshire Swash', cursive; */

	font-family: 'Garamond';
	color:var(--off-white);
	background-color: var(--blue);
}

.player-card h3 {
	font-size: 1.25em;
	font-family: "Garamond";
	margin:0;
	padding:3px;
	text-align: center;
	border-bottom-left-radius: 0.5em;
	border-bottom-right-radius: 0.5em;

	/* font-family: 'Berkshire Swash', cursive; */

	font-family: 'Garamond';
	color:var(--off-white);
	background-color: var(--green);
}

.player-card img {
	max-width: 10vw;
	max-height: 10vw;
}

.icon {
	margin:0;
	padding:0;
	width: 1.25em;
	height: 1.25em;
}
</style>
