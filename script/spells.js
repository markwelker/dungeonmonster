var spells = null;

$(document).ready(function() {
	//console.log("DM is running!")
	$.ajax({
		url : "http://www.dnd5eapi.co/api/spells/",
		dataType : "json",
		success : function(json) {
			spells = json.results;
			//loadSpells();
		}
	});
	fetchSpellByName("Wish");
});
/*
function loadCreatures() {
	var content = "";
	for (var i=0; i<creatures.length; i++){
		var creature = creatures[i]
		content += "<div class=\"lookup-card\" ";
		content += "onclick=\"fetchCreatureByName('" + creature.name + "')\">"
		content += "<h1>" + creature.name + "</h1>";
		content += "</div>";
		//console.log('added: ' + creature.name);
	}
	$('#lookup_pane').html(content);
}
*/

function fetchSpellByName(creatureName){
	$.ajax({
		url : "http://www.dnd5eapi.co/api/spells/?name=" + creatureName,
		dataType : "json",
		success : function(json) {
			//console.log(json);
			fetchSpellByURL(json.results[0].url);
		}
	});
}
function fetchSpellByURL(url){
	//console.log(url);
	$.ajax({
		url : url,
		dataType : "json",
		success : function(spell) {

			console.log(spell);
			$('#s_name').text(spell.name);
			var level;
			if (spell.level > 0) level = spell.level;
			else level = "cantrip";
			$('#s_type').text(spell.school.name + " " + level);
			$('#s_casting_time').text(spell.casting_time);
			$('#s_range').text(spell.range);
			var components = "";
			for (c in spell.components) {
				components += c + ", "
			}
			if (spell.materials !== undefined) {
				components += "(" + spell.materials + ")";
			}
			else {
				components = components.substr(0, components.length - 2);
			}
			$('#s_components').text(components);
			$('#s_duration').text(spell.duration);
			var description = "";
			for (line in spell.desc) {
				description += spell.desc[line].replace("nâ€™", "'") + "<br />";
			}
			$('#s_description').html(description);
			description = "";
			for (line in spell.higher_level) {
				description += spell.higher_level[line] + "<br />";
			}
			$('#s_higher_level').html(description);
			/*
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
			if (creature.special_abilities !== undefined) {
				//console.log(creature.special_abilities);
				var feature = "";
				for (var i = 0; i < creature.special_abilities.length; i++){
					feature += "<strong>" + creature.special_abilities[i].name + "</strong>: " + creature.special_abilities[i].desc;
					feature += "<br />";
				}
				$('#c_features').html(feature);
			}
			else $('#c_features').html("&nbsp");
			var actions = "";
			for (var i = 0; i < creature.actions.length; i++){
				actions += "<strong>" + creature.actions[i].name + "</strong>: " + creature.actions[i].desc;
				actions += "<br />";
			}
			$('#c_actions').html(actions);
			*/
		}
	});
}
