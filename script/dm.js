var creatures; // List of all creatures

$(document).ready(function() {
	console.log("DM is running!")
	$.ajax({
		url : "http://www.dnd5eapi.co/api/monsters/",
		dataType : "json",
		success : function(json) {
			creatures = json.results;
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
