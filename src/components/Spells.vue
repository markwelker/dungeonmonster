<template>
<div id="spells-page">
	<div class="main-container">
		<div class="container">
			<div class="lookup-container">
				<img class = "back" src = "../assets/images/back.png" onclick = "location.href='#/player'"/>
				<input id="spell-search" v-model="search" type="text" class="search" placeholder="Search"/>
				<div class="spell-pane" id="lookup_pane">
					<div class="lookup-card" v-for="spell in filteredSpells" v-on:click="fetchSpellByName(spell.name)">
						<h1>{{spell.name}}</h1>
					</div>

				</div>
			</div>
		</div>
		<div class="spell-sheet">
			<div class="spell-column">
				<h1 id="s_name">{{active.name}}</h1>
				<em><h3 id="s_type">{{active.type}}</h3></em><br />
				<strong>Casting Time: </strong><p id="s_casting_time">{{active.casting_time}}</p><br />
				<strong>Range: </strong><p id="s_range">{{active.range}}</p><br />
				<strong>Components: </strong><p id="s_components">{{active.components}}</p><br />
				<strong>Duration: </strong><p id="s_duration">{{active.duration}}</p><br /><br /><br />
				<p v-for="line in active.description">{{line}}</p><br /><br />
				<strong v-if="active.higher_level!==undefined">For Higher Levels:</strong>
				<p v-for="line in active.higher_level">{{line}}</p>
			</div>
		</div>
	</div>
</div>
</template>

<script>
import axios from 'axios';

export default {
	name: 'Spells',
	data() {
		return {
			spells: {},		// Spell list in JSON form
			active: [],		// Currently displayed spell
			search: '',		// Filter spells by this substring
		}
	},
	created: function() {
		axios.get("http://www.dnd5eapi.co/api/spells/")
		.then (response => {
			//console.log(this);
			//console.log("Spells Retrieved!");
			//console.log(response.data.results);
			this.spells = response.data.results;
			//console.log("Spells Stored!");
			//console.log(this.spells);
			//console.log("Filtering Spells!");
			//console.log(this.filteredSpells);
		})
		.catch(error => {
	    	//console.log(error);
		});
		this.fetchSpellByName("Cure Wounds");

	},
	watch: {
		active: function(val) {
			//console.log("New Active...");
			//console.log(val);
		},
		spells: function(val) {
			//console.log("New Spells...");
			//console.log(val);
		},
	},
	computed: {
		filteredSpells: function () {
			var filtered = [];
			//console.log("Starting filteredSpells");
			for (var i=0; i < this.spells.length; i++) {
				var spell = this.spells[i];
				if(~spell.name.toLowerCase().indexOf(this.search.toLowerCase()) || this.search === "") {
					filtered.push(spell);
				}
			}
			return filtered;
		}
	},
	methods: {
		fetchSpellByName: function(spellName){
			//console.log("here1");
			axios.get("http://www.dnd5eapi.co/api/spells/?name=" + spellName)
			.then (response => {
				this.fetchSpellByURL(response.data.results[0].url);
			})
			.catch(error => {
		    	console.log(error);
			});
		},
		fetchSpellByURL: function(url){
			axios.get(url)
			.then (response => {
				var result = response.data; 	// shorthand.
				var spell = [];

				spell.name = result.name;
				var level;
				if (result.level > 0) 	level = result.level;
				else 					level = "cantrip"
				spell.type = result.school.name + " " + level;
				spell.casting_time = result.casting_time;
				spell.range = result.range;
				var components = "";
				for (var c in result.components) {
					components += c + ", "
				}
				if (spell.materials !== undefined) {
					components += "(" + result.materials + ")";
				}
				else {
					components = components.substr(0, components.length - 2);
				}
				spell.components = components;
				spell.duration = result.duration;
				spell.description = result.desc;
				spell.higher_level = result.higher_level;
				this.active = spell;
			})
			.catch(error => {
		    	console.log(error);
			});
		},
	}, // end of methods

}
</script>

<style src="../assets/styles/spells.css"></style>
