import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		username: 'Fighter',
		token: '',
		party: [],
		npcs: [],
		creatures: [],
		chat: [],
		loginError: '',
		registrationError: '',
		DMLogin: false,
	},
	getters: {
		username: state => state.username,
		token: state => state.token,
		party: state => state.party,
		npcs: state => state.npcs,
		creatures: state => state.creatures,
		chat: state => state.chat,
		loginError: state => state.loginError,
		registrationError: state => state.registrationError,
		DMLogin: state => state.DMLogin,
	},
	mutations: {
		setUsername(state, username) {
			state.username = username;
		},

		setAuthToken(state, token) {
			state.token = token;
		},

		setParty(state, party) {
			state.party = party;
		},

		setNPCs(state, npcs) {
			state.npcs = npcs;
		},

		setCreatures(state, creatures) {
			state.creatures = creatures;
		},

		setChat(state, chat) {
			state.chat = chat;
		},

		setLoginError(state, error) {
			state.loginError = error;
		},

		setRegistrationError(state, error) {
			state.registrationError = error;
		},

		setDMLogin(state, DMLogin) {
			state.DMLogin = DMLogin;
		},
	},
	actions: {
		getParty(context) {
			console.log("STORE: Getting Party");
			axios.get("/api/party").then(response => {
				context.commit('setParty', response.data);
				return true;
			}).catch(error => {
				console.log("STORE: Failed to Fetch Party Data");
				console.log(error);
			});
		},

		getNPCs(context) {
			console.log("STORE: Getting NPCs");
			axios.get("/api/npcs").then(response => {
				context.commit('setNPCs', response.data);
				return true;
			}).catch(error => {
				console.log("STORE: Failed to Fetch NPC Data");
				console.log(error);
			});
		},

		getCreatures(context) {
			console.log("STORE: Getting Creature Data");
			axios.get("api/creatures").then(response => {
				context.commit('setCreatures', response.data);
				return true;
			}).catch(error => {
				console.log("STORE: Failed to Fetch Creature Data");
				console.log(error);
			});
		},

		getChat(context) {
			console.log("STORE: Getting Chat");
			axios.get("api/chat").then(response => {
				context.commit('setChat', response.data);
				return true;
			}).catch(error => {
				console.log("STORE: Failed to Fetch Chat");
				console.log(error);
			});
		},

		addPlayer(context, player) {
			axios.post("/api/party", player).then(response => {
				return context.dispatch('getParty');
			}).catch(error => {
				console.log("STORE: Failed to POST player");
				console.log(error);
			});
		},

		addNPC(context, request) {
			console.log("adding npc");
			console.log(request);
			axios.post("/api/npcs", request).then(response => {
				return context.dispatch('getNPCs');
			}).catch(error => {
				console.log("STORE: Failed to POST npc");
				console.log(error);
			});
		},

		addChat(context, msg) {
			axios.post("/api/chat", msg).then(response => {
				return context.dispatch('getChat');
			}).catch(error => {
				console.log("Failed to POST chat");
				console.log(error);
			});
		},

	loginPlayer(context, player) {
		console.log("STORE: Getting Player from database");
		axios.get("/api/party/" + player.name).then(response => {
			console.log("Logging in Player...");
			console.log(player);
			context.commit('setUsername', response.data.username);
			context.commit('setAuthToken', response.data.token);
			context.commit('setLoginError', '');
			context.commit('setRegistrationError', '');
			context.commit('setDMLogin', response.data.isDM);
			return true;
		}).catch(error => {
      console.log("login had an error!!");
			if (error.response.status === 403 || error.response.status === 400) {
					context.commit('setLoginError', 'Invalid Credientials!');
					context.commit('setRegistrationError', '');
			}
			console.log("STORE: Failed to Fetch Player Data");
			console.log(error);
		});
	},

	registerPlayer(context, player) {
		axios.post("/api/player/", player).then(response => {
			console.log("Registering Player...");
			console.log(player);
			context.commit('setUsername', response.data.username);
			context.commit('setAuthToken', response.data.token);
			context.commit('setLoginError', '');
			context.commit('setRegistrationError', '');		return true;
	}).catch(error => {
			if (error.response.status === 409) {
				context.commit('setLoginError', '');
				context.commit('setRegistrationError', 'That username has already been taken!');
			}
			console.log("STORE: Failed to POST player");
			console.log(error);
		});
	},

		updatePlayer(context, player) {
			axios.put("/api/party/" + player.id, player).then(response => {
				console.log("Updating Player...");
				console.log(player);
				return true;
			}).catch(error => {
				console.log("STORE: Failed to UPDATE player");
				console.log(error);
			});
		},

		updateNPC(context, npc) {
			axios.put("/api/npcs/" + npc.id, npc).then(response => {
				console.log("Updating NPC...");
				console.log(npc);
				return true;
			}).catch(error => {
				console.log("STORE: Failed to UPDATE npc");
				console.log(error);
			});
		},

		deletePlayer(context, player) {
			axios.delete("/api/player/" + player.id).then(response => {
				return context.dispatch('getParty');
			}).catch(error => {
				console.log("Failed to REMOVE player");
				console.log(error);
			});
		},

		deleteNPC(context, id) {
			axios.delete("/api/npcs/" + id).then(response => {
				return context.dispatch('getNPCs');
			}).catch(error => {
				console.log("Failed to REMOVE npc");
				console.log(error);
			});
		},

	}
});
