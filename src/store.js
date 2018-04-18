import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';

Vue.use(Vuex);

const getAuthHeader = () => {
  return { headers: {'Authorization': localStorage.getItem('token')}};
}

export default new Vuex.Store({
    // Initialize //
  initialize(context) {
    let token = localStorage.getItem('token');
    if(token) {
     // see if we can use the token to get my user account
     axios.get("/api/me",getAuthHeader()).then(response => {
       console.log("Successful initialization!")
       context.commit('setAuthToken',token);
       context.commit('setUsername', response.data.username);
     }).catch(err => {
       // remove token and user from state
       console.log("store failed to initialize");
       localStorage.removeItem('token');
       context.commit('setUsername',{});
       context.commit('setAuthToken','');
     });
    }
  },
  state: {
    username: '',
    token: '',
    party: [],
    npcs: [],
    creatures: [],
    chat: [],
    loginError: '',
    registrationError: '',
    loginSuccess: false,
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
    loginSuccess: state => state.loginSuccess,
    DMLogin: state => state.DMLogin,
  },
  mutations: {
    setUsername(state, username) {
      state.username = username;
    },

    setAuthToken(state, token) {
      state.token = token;
      if(token === ''){
        localStorage.removeItem('token');
      }else{
        localStorage.setItem('token', token);
      }
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

    setLoginSuccess(state, success) {
      state.loginSuccess = success;
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
      axios.post("/api/npcs", request, getAuthHeader()).then(response => {
        return context.dispatch('getNPCs');
      }).catch(error => {
        console.log("STORE: Failed to POST npc");
        console.log(error);
      });
    },

    addChat(context, msg) {
      axios.post("/api/chat", msg, getAuthHeader()).then(response => {
        return context.dispatch('getChat');
      }).catch(error => {
        console.log("Failed to POST chat");
        console.log(error);
      });
    },

    loginPlayer(context, player) {
      return new Promise((resolve, reject) => {
        console.log("STORE: Getting Player from database");
        axios.get("/api/player/" + player.name).then(response => {
          console.log("Logging in Player...");
          console.log(player);
          console.log(response);
          context.commit('setUsername', response.data.name);
          context.commit('setAuthToken', response.data.token);
          context.commit('setLoginError', '');
          context.commit('setRegistrationError', '');
          context.commit('setLoginSuccess', true);
          context.commit('setDMLogin', response.data.isDM);
          return true;
        }).catch(err => {
          console.log("login had an error!!");
          console.log(err);
          if (error.response.status === 403 || error.response.status === 400) {
            context.commit('setLoginError', 'Invalid Credientials!');
            context.commit('setRegistrationError', '');
            context.commit('setAuthToken', '');
            context.commit('setUsername', '');
          }
          console.log("STORE: Failed to Fetch Player Data");
        });
      });
    },

    registerPlayer(context, player) {
      axios.post("/api/player/", player).then(response => {
        console.log("Registering Player...");
        console.log(player);
        context.commit('setUsername', response.data.username);
        context.commit('setAuthToken', response.data.token);
        context.commit('setLoginError', '');
        context.commit('setRegistrationError', '');
        return true;
      }).catch(error => {
        if (error.response.status === 409) {
          context.commit('setLoginError', '');
          context.commit('setRegistrationError', 'That username has already been taken!');
          context.commit('setAuthToken', '');
          context.commit('setUsername', '');
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
