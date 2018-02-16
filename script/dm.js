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
	fetchCreatureByName("Orc");
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
		success : function(json) {
			console.log(json);

		}
	});
}
