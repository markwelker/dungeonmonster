
function chat(){
	var message = $('#chat_message').val();
	$('#chat_message').val("");

	var chatLog = $('#chat_log');
	var currentLog = chatLog.html();

	chatLog.html(currentLog + "<p>You: " + message + "</p>");

	chatLog.scrollTop(chatLog.prop("scrollHeight"));
}

function swapCharSheets(newSheet) {
	var oldSheet = document.getElementById("charsheet");
	var clone = oldSheet.cloneNode(true);
	clone.setAttribute('src', newSheet);
	oldSheet.parentNode.replaceChild(clone, oldSheet);
}
