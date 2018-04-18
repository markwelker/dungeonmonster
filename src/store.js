import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    username: 'Fighter',
    party: [],
    npcs: [],
    creatures: [],
    chat: [],
  },
  getters: {
    username: state => state.username,
    party: state => state.party,
    npcs: state => state.npcs,
    creatures: state => state.creatures,
    chat: state => state.chat,
  },
  mutations: {
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
  },
  actions: {
    getParty(context) {
      console.log("STORE: Getting Party");
      axios.get("/api/party").then(response => {
        context.commit('setParty', response.data);
        return true;
      }).catch(err => {
        console.log("STORE: Failed to Fetch Party Data");
        console.log(err);
      });
    },

    getNPCs(context) {
      console.log("STORE: Getting NPCs");
      axios.get("/api/npcs").then(response => {
        context.commit('setNPCs', response.data);
        return true;
      }).catch(err => {
        console.log("STORE: Failed to Fetch NPC Data");
        console.log(err);
      });
    },

    getCreatures(context) {
      console.log("STORE: Getting Creature Data");
      axios.get("api/creatures").then(response => {
        context.commit('setCreatures', response.data);
        return true;
      }).catch(err => {
        console.log("STORE: Failed to Fetch Creature Data");
        console.log(err);
      });
    },

    getChat(context) {
      console.log("STORE: Getting Chat");
      axios.get("api/chat").then(response => {
        context.commit('setChat', response.data);
        return true;
      }).catch(err => {
        console.log("STORE: Failed to Fetch Chat");
        console.log(err);
      });
    },

    addPlayer(context, player) {
      axios.post("/api/party", player).then(response => {
        return context.dispatch('getParty');
      }).catch(err => {
        console.log("STORE: Failed to POST player");
        console.log(err);
      });
    },

    addNPC(context, request) {
      console.log("adding npc");
      console.log(request);
      axios.post("/api/npcs", request).then(response => {
        return context.dispatch('getNPCs');
      }).catch(err => {
        console.log("STORE: Failed to POST npc");
        console.log(err);
      });
    },

    addChat(context, msg) {
      axios.post("/api/chat", msg).then(response => {
        return context.dispatch('getChat');
      }).catch(err => {
        console.log("Failed to POST chat");
        console.log(err);
      });
    },

    updatePlayer(context, player) {
      axios.put("/api/party/" + player.id, player).then(response => {
        console.log("Updating Player...");
        console.log(player);
        return true;
      }).catch(err => {
        console.log("STORE: Failed to UPDATE player");
        console.log(err);
      });
    },

    updateNPC(context, npc) {
      axios.put("/api/npcs/" + npc.id, npc).then(response => {
        console.log("Updating NPC...");
        console.log(npc);
        return true;
      }).catch(err => {
        console.log("STORE: Failed to UPDATE npc");
        console.log(err);
      });
    },

    deletePlayer(context, player) {
      axios.delete("/api/player/" + player.id).then(response => {
        return context.dispatch('getParty');
      }).catch(err => {
        console.log("Failed to REMOVE player");
        console.log(err);
      });
    },

    deleteNPC(context, id) {
      axios.delete("/api/npcs/" + id).then(response => {
        return context.dispatch('getNPCs');
      }).catch(err => {
        console.log("Failed to REMOVE npc");
        console.log(err);
      });
    },

  }
});
