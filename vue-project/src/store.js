import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    client: null,
    connected: false,
  },
  mutations: {
    SET_CLIENT(state, client) {
      state.client = client;
    },
    SET_CONNECTED(state, connected) {
      state.connected = connected;
    },
  },
  actions: {
    setClient({ commit }, client) {
      commit('SET_CLIENT', client);
    },
    setConnected({ commit }, connected) {
      commit('SET_CONNECTED', connected);
    },
  },
});