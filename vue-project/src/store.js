
import Vuex from 'vuex';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';


export default new Vuex.Store({
  state: {
    socketUrl: 'http://localhost:8080',
    socket: null,
    client: null,
    connected: false,
  },
  mutations: {
    SET_SOCKET(state, socket) {
      state.socket = socket;
    },
    SET_CLIENT(state, client) {
      state.client = client;
    },
    SET_CONNECTED(state, connected) {
      state.connected = connected;
    },
  },
  actions: {
    connectWebSocket({ commit, state }) {
      const socket = new SockJS(`${state.socketUrl}/connect`);
      commit('SET_SOCKET', socket);

      const client = new Client({ webSocketFactory: () => state.socket });
      commit('SET_CLIENT', client);

      client.onConnect = () => {
        console.log('Connected to WebSocket server');
        commit('SET_CONNECTED', true);

        client.subscribe('/topic/public', (message) => {
          if (message.body) {
            let receivedMessage = JSON.parse(message.body);
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
    sendMessage({ state }) {
      if (!state.connected) {
        console.error('Du är inte ansluten till WebSocket-servern');
        return;
      }

      const message = {
        content: 'Detta är ett testmeddelande',
        sender: 'Användarnamn',
        type: 'CHAT'
      };

      state.client.publish({ destination: '/ws/chat/sendMessage', body: JSON.stringify(message) });
      console.log('Sent message:', message);
    },
  },
});