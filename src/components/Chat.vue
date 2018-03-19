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

<style>
.chat-box {
	position:fixed;
	transform: translateX(72vw);
	width:28vw;
	height:100vh;
	margin: 0;
	background-color:var(--darkcrimson);
	box-sizing: border-box;
}

.chat-log {
	margin: 2vh;
	box-shadow: inset 0px 0px 1em rgba(0,0,0,0.2);
	background-color: var(--off-white);
	overflow:auto;
	height: 70vh;
}

.chat-log p {
	margin:0 0 0 1em;
    padding:0;
}

.chat-header {
	margin:0;
	padding:0;
	margin-left: 2vw;
    margin-bottom: 2vh;
	color:var(--off-white);
	font-family: Garamond, serif;
}

.chat-box input {
	width: calc(24vw + 17px);
	height: 10%;
	margin-left: 2vh;
	padding: 0.25em;
	padding-left: 0.5em;
}

.chat-box button {
	padding: 0.25em;
	width:15%;
	margin-left:1em;
	margin-top:1%;
	cursor: pointer;
}
</style>
