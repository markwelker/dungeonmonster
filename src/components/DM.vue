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
					<img src="/static/images/add.png" class="add-button">
					<h1>Actions:</h1>
					<p id = "c_actions" v-for="action in active.actions">
						<strong>{{action.name}}</strong>: {{action.desc}}
						<br />
					</p>
				</div>
			</div>
		</div>

		<div class="chat-box">
			<div class="chat-log" id = "chat_log">
				<p>
					<br>DM: Are you sure you want to touch that?<br> Fighter: Yes, yes I am.<br> Cleric: Oh no you aren't!<br> Fighter: But why not?<br> Cleric: You don't even know where that's been!<br> Wizard: ...or if it is magically protected.<br> Bard: You're all a
					bunch of party-poopers, I say let him do what he wants!<br> Fighter: Yeah! Let me pick it up!<br> DM: Does anyone try to stop him?<br> Cleric: I try to grapple the Fighter.<br> DM: OK, make a strength check.<br> Cleric: *rolls 1d20+1: 3<br> Cleric:
					No!<br> Wizard: Uh oh!<br> Bard: Yeah baby!<br> Fighter: Hahaha! I laugh at your puny arms and pick up the artifact!<br> Cleric: ...<br> DM: ...<br> DM: Nothing happens.<br> Fighter: Really, nothing? Then why'd you make a big deal about not touching
					it?<br> DM: Oh you'll see.<br> Bard: Well that's not ominous or anything...<br> Cleric: Wait, wasn't it in the gelatinous cube earlier?<br> Fighter: What even is this thing anyways?<br> DM: It appears to be a small cube of some sort, with some small
					buttons on one side.<br> Wizard: Do the buttons have any sort of markings?<br> DM: Yes, make a history check.<br> Wizard: *rolls 1d20+7: 22<br> DM: You remember seeing these types of symbols in some books on the ancient empire.<br> Wizard: Do they
					look like the symbols on the note we got earlier?<br> DM: Yes, they do!<br> Bard: Aha! I press the buttons in the sequence found on the note.<br> DM: The cube opens up and releases a horrid smelling substance on you.<br> Bard: Agh! This is the second
					time this week that I'll be washing this!<br> DM: You hear slurping sounds from the next hallway... a lot of slurping.<br>
				</p>
			</div>
			<h1 class="chat-header">Chat</h1>
			<textarea type="text" id = "chat_message" placeholder="Enter Message"></textarea><br>
			<button onclick = "chat()">Send</button>
		</div>

		<div class="bottom-container">
			<div class="party-container" id="player-app">
				<h1 class="red-header">Party</h1>
				<PartyBar/>
			</div>

			<div class="monster-container">
				<h1 class="red-header">Encounter Monsters</h1>
				<div class="monster-pane">
					<div class="character-card" onclick = "fetchCreatureByName('Orc')">
						<h2>Orc Chief</h2>
						<h3>
							<img class = "icon" src = "/static/images/heal.png" title = "Heal It!">

							14/27

							<img class = "icon" src = "/static/images/damage.png" title = "Damage It!">
						</h3>
					</div>
				</div>
			</div>

			<div class="lookup-container">
				<h1 class="red-header">Monster Lookup</h1>
				<input id="npc-search" v-model="search" type="text" class="search" placeholder="Search"/>
				<div class="monster-pane" id="lookup_pane">
					<div class="lookup-card" v-for="npc in filteredNPCs" v-on:click="fetchNPCByName(npc.name)">
						<h2>{{npc.name}}</h2>
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
				npcs: [],
				active: [],			// The NPC whose stat block is currently visible.
				search: '',
			}
		},
		created: function() {
			axios.get("http://www.dnd5eapi.co/api/monsters/")
			.then (response => {
				this.npcs = response.data.results;
			})
			.catch(error => {
		    	//console.log(error);
			});
			this.fetchNPCByName("Orc");
		},
		computed: {
			filteredNPCs: function () {
				var filtered = [];
				for (var i=0; i < this.npcs.length; i++) {
					var npc = this.npcs[i];
					if(~npc.name.toLowerCase().indexOf(this.search.toLowerCase()) || this.search === "") {
						filtered.push(npc);
					}
				}
				return filtered;
			}
		},
		methods: {
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
					var npc = [];

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
			}
		}, // end of methods
	}
</script>

<style src="../assets/styles/dm.css"></style>
