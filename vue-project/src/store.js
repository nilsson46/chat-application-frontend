// store.js
import Vuex from 'vuex';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';

export default new Vuex.Store({
  state: {
    socketUrl: 'http://localhost:9090',
    socket: null,
    client: null,
    connected: false,
    username: null,
    messages: [],
    token: null,
    isLoggedIn: false,
  },
  mutations: {
    SET_SOCKET(state, socket) {
      state.socket = socket;
    },
    SET_USERNAME(state, username) {
      state.username = username;
    },
    SET_CLIENT(state, client) {
      state.client = client;
    },
    SET_CONNECTED(state, connected) {
      state.connected = connected;
    },
    ADD_MESSAGE(state, message) {
      state.messages.push(message);
    },
    SET_TOKEN(state, token) {
      state.token = token;
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        state.isLoggedIn = true;
      } else {
        delete axios.defaults.headers.common['Authorization'];
        state.isLoggedIn = false;
      }
    },
  },
  actions: {
    login({ commit, dispatch }, { username, token }) {
      commit('SET_USERNAME', username);
      commit('SET_TOKEN', token);
      dispatch('connectWebSocket');
    },
    connectWebSocket({ commit, state }) {
      const socket = new SockJS(`${state.socketUrl}/connect`);
      commit('SET_SOCKET', socket);

      const client = new Client({
        webSocketFactory: () => state.socket,
        connectHeaders: {
          Authorization: `Bearer ${state.token}`,
        },
      });
      commit('SET_CLIENT', client);

      client.onConnect = () => {
        console.log('Connected to WebSocket server');
        commit('SET_CONNECTED', true);

        client.subscribe('/topic/public', (message) => {
          if (message.body) {
            let receivedMessage = JSON.parse(message.body);
            commit('ADD_MESSAGE', receivedMessage);
            console.log('Received message:', receivedMessage);
          }
        });
      };

      client.onDisconnect = () => {
        console.log('Disconnected from WebSocket server');
        commit('SET_CONNECTED', false);
      };

      client.activate();
    },
    sendMessage({ state }, messageContent) {
      if (!state.connected) {
        console.error('You are not connected to the WebSocket server');
        return;
      }

      const message = {
        content: messageContent,
        sender: state.username,
        type: 'CHAT'
      };

      state.client.publish({ destination: '/ws/chat/sendMessage', body: JSON.stringify(message) });
      console.log('Sent message:', message);
    },
  },
});