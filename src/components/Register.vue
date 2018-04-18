<template>
<div class="shadow">
	<div class="login-container">
		<div>
			Username
			<br>
			<input type="text"
				id="username"
				placeholder="Username"
				v-model="username">
			<br />

			Password
			<br />
			<input type="password" id="password" placeholder="Password" v-model="password">
			<br />
			Class
			<br />
			<img class="class-select selected" v-on:click="select()" title="Bard" src="/static/images/Bard.png">
			<img class="class-select" v-on:click="select()" title="Cleric" src="/static/images/Cleric.png">
			<img class="class-select" v-on:click="select()" title="Fighter" src="/static/images/Fighter.png">
			<img class="class-select" v-on:click="select()" title="Wizard" src="/static/images/Wizard.png">
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
	methods: {
		register: function() {
			console.log("Registering Player");
			let playerClass = document.getElementsByClassName('selected').getAttribute('title');
			var player = {name:this.username, password:this.password, playerClass};
			this.$store.dispatch('registerPlayer', player);
		},
		select: function() {
			document.getElementsByClassName('selected').classList.remove('selected');
			this.classList.add('selected');
		},
	}
}
</script>

<style scoped src="../assets/styles/login.css"></style>
