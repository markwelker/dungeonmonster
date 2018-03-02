var spells = null;

function forceUnicodeEncoding(string) {
  return unescape(encodeURIComponent(string));
}

$(document).ready(function() {

	//console.log("DM is running!")
	$.ajax({
		url : "http://www.dnd5eapi.co/api/spells/",
		dataType : "json",
		success : function(json) {
			spells = json.results;
			loadSpells();
		}
	});
	fetchSpellByName("Cure Wounds");
});

function loadSpells() {
	var content = "";
	for (var i=0; i<spells.length; i++){
		var spell = spells[i]
		content += "<div class=\"lookup-card\" ";
		content += "onclick=\"fetchSpellByName(\'" + spell.name.replace("'", "$") + "\')\">"
		content += "<h1>" + spell.name.replace("/", " / ") + "</h1>";
		content += "</div>";
		//console.log('added: ' + spell.name);
	}
	$('#lookup_pane').html(content);
}


function fetchSpellByName(spellName){
	//console.log("here1");
	$.ajax({
		url : "http://www.dnd5eapi.co/api/spells/?name=" + spellName.replace("$", "\'"),
		dataType : "json",
		success : function(json) {
			//console.log(json);
			//console.log(json.results[0].url);
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

			//console.log(spell);
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
			//var test = ["testâ€™test", "tâ€™â€™â€™t"]
			for (line in spell.desc) {
				//description += spell.desc[line].replace("â€�", "\"") + "<br />";
				description += spell.desc[line].replace("â€™", "\'") + "<br />";
			}
			$('#s_description').html(description);
			description = "";
			for (line in spell.higher_level) {
				description += spell.higher_level[line] + "<br />";
			}
			$('#s_higher_level').html(description);
		}
	});
}
