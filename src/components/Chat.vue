<script>
export default{
	name: 'Chat',

  data() {
    return {
      text: '',
    };
  },

  created: function() {
    this.$store.dispatch('getChat');
  },

	computed: {
		chat: function() {
			return this.$store.getters.chat;
		}
	},
	methods:{
		submitChat(){
			var user = this.$store.getters.username;
			var message = {player: user, message: this.text};
			this.$store.dispatch('addChat', message);
		}
	}
}
</script>

<template>
	<div class="chat-box">
		<div class="chat-log">
			<p v-for="message in chat">{{message.player}}: {{message.message}}</p>
		</div>
		<h1 class="chat-header">Chat</h1>
		<input  v-model="text" placeholer="Enter Message"></input><br>
		<button v-on:click.prevent="submitChat()">Send</button>
	</div>
</template>
