$(document).ready(function() {
	console.log("HELLLLLO WORLD!")
	$.ajax({
		url : "http://www.dnd5eapi.co/api/monsters/",
		dataType : "json",
		success : function(json) {
			console.log(json);
		}
	});
});
