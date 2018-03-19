<template>
	<div class="main-container">
		<div class="stats-container">
			<h1 class="red-header">Creature Stat Block
				<img src="/static/images/scroll.png" v-on:click="toSpellsPage()">
			</h1>
			<div class = "creature-content">
				<div class = "creature-column">
					<h1 id = "c_name">{{active.name}}</h1>
					<h3 id = "c_description">{{active.description}}</h3>
					<h3 id = "c_ac">{{active.ac}}</h3>
					<h3 id = "c_hp">{{active.hp}}</h3>
					<div class = "stat-bar">
						<div class = "stat">
							<h3>STR</h3>
							<h3 id = "c_str">{{active.str}}</h3>
						</div>
						<div class = "stat">
							<h3>DEX</h3>
							<h3 id = "c_dex">{{active.dex}}</h3>
						</div>
						<div class = "stat">
							<h3>CON</h3>
							<h3 id = "c_con">{{active.con}}</h3>
						</div>
						<div class = "stat">
							<h3>INT</h3>
							<h3 id = "c_int">{{active.int}}</h3>
						</div>
						<div class = "stat">
							<h3>WIS</h3>
							<h3 id = "c_wis">{{active.wis}}</h3>
						</div>
						<div class = "stat">
							<h3>CHA</h3>
							<h3 id = "c_cha">{{active.cha}}</h3>
						</div>
					</div>
					<p id = "c_features" v-if="active.features!==undefined" v-for="feature in active.features">
						<strong>{{feature.name}}</strong>: {{feature.desc}}
						<br />
					</p>
				</div>
				<div class = "creature-column">
					<img src="/static/images/add.png" class="add-button" title="Add This Creature" v-on:click="addNPC()">
					<h1>Actions:</h1>
					<p id = "c_actions" v-for="action in active.actions">
						<strong>{{action.name}}</strong>: {{action.desc}}
						<br />
					</p>
				</div>
			</div>
		</div>

		<Chat/>
		<div class="block-wrapper">
			<div class="bottom-container">
				<div class="party-container" id="player-app">
					<h1 class="red-header">Party</h1>
					<PartyBar/>
				</div>

				<div class="monster-container">
					<h1 class="red-header">Encounter Monsters</h1>
					<div class="monster-pane">
						<div class="character-card" v-for="npc in this.npcs" v-on:click = "">
							<h2 v-on:click="fetchNPCByName(npc.species)">{{npc.name}}</h2>
							<h3>
								<img class = "icon" src = "/static/images/heal.png" v-on:click="heal(npc)" title = "Heal It!">

								{{npc.hp}}/{{npc.maxhp}}

								<img class = "icon" src = "/static/images/damage.png" v-on:click="damage(npc)" title = "Damage It!">
							</h3>
						</div>
					</div>
				</div>

				<div class="lookup-container">
					<h1 class="red-header">Monster Lookup</h1>
					<input id="npc-search" v-model="search" type="text" class="search" placeholder="Search"/>
					<div class="monster-pane" id="lookup_pane">
						<div class="lookup-card" v-for="thing in filteredNPCs" v-on:click="fetchNPCByName(thing)">
							<h2>{{thing}}</h2>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios';
import Chat from './Chat'
import PlayerApp from './PlayerApp'
import PartyBar from './PartyBar'

	export default {
		name: 'DM',
		components: {
			PartyBar, Chat
		},

		data() {
			return {
				username: '',
				active: [],			// The NPC whose stat block is currently visible.
				search: '',
			}
		},
		created: function() {
			this.$store.dispatch('getNPCs');
			this.$store.dispatch('getCreatures');
			this.fetchNPCByName("Warhorse");
		},
		computed: {
			npcs: function() {
				return this.$store.getters.npcs;
			},

			npcList: function () {
				return this.$store.getters.creatures;
			},

			filteredNPCs: function () {
				var filtered = [];
				for (var i=0; i < this.npcList.length; i++) {
					var npc = this.npcList[i];
					if(~npc.toLowerCase().indexOf(this.search.toLowerCase()) || this.search === "") {
						filtered.push(npc);
					}
				}
				return filtered;
			},
		},
		methods: {
			addNPC: function() {
				this.$store.dispatch('addNPC', this.active);
				location.reload();
			},

			fetchNPCByName: function(npcName){
				axios.get("http://www.dnd5eapi.co/api/monsters/?name=" + npcName)
				.then (response => {
					this.fetchNPCByURL(response.data.results[0].url);
				})
				.catch(error => {
					console.log(error);
				});
			},
			fetchNPCByURL: function(url){
				axios.get(url)
				.then (response => {
					var result = response.data; 	// shorthand.
					var npc = {};

					npc.name = result.name;
					npc.description = result.size + " " + result.type + " (" + result.subtype + "), " + result.alignment;
					npc.ac = "AC: " + result.armour_class;
					npc.hp = "HP: " + result.hit_points;
					npc.str = result.strength;
					npc.dex = result.dexterity;
					npc.con = result.constitution;
					npc.int = result.intelligence;
					npc.wis = result.wisdom;
					npc.cha = result.charisma;
					npc.features = result.special_abilities;
					npc.actions = result.actions;

					this.active = npc;
				})
				.catch(error => {
					console.log(error);
				});
			},
			toSpellsPage: function() {
				this.$router.push('Spells');
			},
			heal: function(npc) {
				var amount = "";
				while(!this.isInt(amount)) {
					amount = prompt("Heal how much damage?", 0);
				}
				amount = parseInt(amount, 10);
				npc.hp += amount;
				if (npc.hp > npc.maxhp) {
					npc.hp = npc.maxhp;
				}
				if (npc.hp <= 0) { 								// If it dies, it needs removed.
 					var index = 0;
 					console.log("deleting at index: " + index);
 					this.$store.dispatch('deleteNPC', index);
					location.reload();
				}
				else { 											// Else it needs updated.
					this.$store.dispatch('updateNPC', npc);
				}
			},
			damage: function(npc) {
				var amount = "";
				while(!this.isInt(amount)){
					amount = prompt("Take how much damage?", 0);
				}
				amount = parseInt(amount, 10);
				npc.hp -= amount;
				if(npc.hp > npc.maxhp) {
					npc.hp = npc.maxhp;
				}
				if(npc.hp <= 0){ 								// If it dies, it needs removed.
					npc.hp = 0;
 					var index = 0;
 					console.log("deleting at index: " + index);
 					this.$store.dispatch('deleteNPC', index);
					location.reload();
				}
				else { 											// Else it needs updated.
					this.$store.dispatch('updateNPC', npc);
				}
			},
			isInt: function(value) {
				var x;
				if (isNaN(value)) {
					return false;
				}
				x = parseFloat(value);
				return (x | 0) === x;
			},
		}, // end of methods
	}
</script>

<style src="../assets/styles/dm.css"></style>
