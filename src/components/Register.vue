<template>
<div class="shadow">
	<div class="login-container">
		<div>
			Character Name
			<br>
			<input type="text"
				id="username"
				placeholder="Username"
				v-model="username">
			<br />

			Password
			<br />
			<input type="password" id="password" placeholder="Password" v-model="password">
			<br /><br />
			Choose your Class
			<br />
			<img class="class-select selected" v-on:click="select" title="Bard" src="/static/images/Bard.png">
			<img class="class-select" v-on:click="select" title="Cleric" src="/static/images/Cleric.png">
			<img class="class-select" v-on:click="select" title="Fighter" src="/static/images/Fighter.png">
			<img class="class-select" v-on:click="select" title="Wizard" src="/static/images/Wizard.png">
			<br />
			<button class="login-button" v-on:click="register()">Register</button>
		</div>
	</div>
</div>
</template>

<script>
export default {
	name: 'Login',
	data() {
		return {
			username: '',
			password: '',
		}
	},
	computed: {
		registrationError: function() {
			error = this.$store.getters.registrationError;
			if(error !== '') {
				alert(error);
			}
			return error;
		},
	},
	methods: {
		register: function() {
			console.log("Registering Player");
			let playerClass = document.getElementsByClassName('selected')[0].getAttribute('title');
			var player = {name:this.username, password:this.password, class: playerClass};
			this.$store.dispatch('registerPlayer', player).then(()) => {
				this.$router.push('Player');
			});
		},
		select: function(event) {
			let oldSelected = document.getElementsByClassName('selected')[0];
			console.log(oldSelected);
			oldSelected.classList.remove('selected');
			event.target.classList.add('selected');
		},
	}
}
</script>

<style scoped src="../assets/styles/login.css"></style>
