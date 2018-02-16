
function chat(){
	var message = $('#chat_message').val();
	$('#chat_message').val("");

	var chatLog = $('#chat_log');
	var currentLog = chatLog.html();

	chatLog.html(currentLog + "<p>You: " + message + "</p>");

	chatLog.scrollTop(chatLog.prop("scrollHeight"));
}
