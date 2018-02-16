var creatures; // List of all creatures

$(document).ready(function() {
	console.log("DM is running!")
	$.ajax({
		url : "http://www.dnd5eapi.co/api/monsters/",
		dataType : "json",
		success : function(json) {
			creatures = json.results;
			for (var i=0; i<creatures.length; i++){
				var creature = creatures[i]
				var element = "";
				element += "<div class=\"lookup-card\" ";
				element += "onclick=\"fetchCreatureByName('" + creature.name + "')\">"
				element += "<h1>" + creature.name + "</h1>";
				element += "</div";
				$('#lookup_pane').html(element);
				console.log('added: ' + creature.name);
			}
		}
	});
	fetchCreatureByName("Zombie");
});

function fetchCreatureByName(creatureName){
	$.ajax({
		url : "http://www.dnd5eapi.co/api/monsters/?name=" + creatureName,
		dataType : "json",
		success : function(json) {
			console.log(json);
			fetchCreatureByURL(json.results[0].url);
		}
	});
}
function fetchCreatureByURL(url){
	console.log(url);
	$.ajax({
		url : url,
		dataType : "json",
		success : function(creature) {

			console.log(creature);
			$('#c_name').text(creature.name);
			$('#c_description').text(creature.size + " " + creature.type + " (" + creature.subtype + "), " + creature.alignment);
			$('#c_ac').text("AC: " + creature.armor_class);
			$('#c_hp').text("HP: " + creature.hit_points);
			$('#c_str').text(creature.strength);
			$('#c_dex').text(creature.dexterity);
			$('#c_con').text(creature.constitution);
			$('#c_int').text(creature.intelligence);
			$('#c_wis').text(creature.wisdom);
			$('#c_cha').text(creature.charisma);
			var feature = "";
			for (var i = 0; i < creature.special_abilities.length; i++){
				feature += "<strong>" + creature.special_abilities[i].name + "</strong>: " + creature.special_abilities[i].desc;
				feature += "<br />";
			}
			$('#c_features').html(feature);
			var actions = "";
			for (var i = 0; i < creature.actions.length; i++){
				actions += "<strong>" + creature.actions[i].name + "</strong>: " + creature.actions[i].desc;
				actions += "<br />";
			}
			$('#c_actions').html(actions);
		}
	});
}
