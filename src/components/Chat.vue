<template>
	<div class="chat-box">
		<div class="chat-log" v-for="message in chatMessages">
			<p>{{message.player}}: {{message.message}}</p>
		</div>
		<h1 class="chat-header">Chat</h1>
		<textarea type="text" name="chat" placeholder="Enter Message"></textarea><br>
		<button type="submit" name="chatSubmit">Send</button>
	</div>
</template>

<script>
export default{
	name: 'Chat',
	computed: {
		chatMessages: function() {
			this.$store.getters.chatMessages;
		}
	},
	methods:{
		submitChat(msg){
			var user = this.$store.getters.username;
			var message = {player: user, message: msg};
			this.$store.dispatch('addChat', message);
		}
	}
}
</script>
