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
    publicMessages: [],
    privateMessages: [],
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
    ADD_PUBLIC_MESSAGE(state, message) {
      state.publicMessages.push(message);
    },
    ADD_PRIVATE_MESSAGE(state, message) {
      state.privateMessages.push(message);
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
            commit('ADD_PUBLIC_MESSAGE', receivedMessage);
            console.log('Received public message:', receivedMessage);
          }
        });
      
        client.subscribe(`/topic/private/maja/simon`, (message) => {
          if (message.body) {
            const newMessage = JSON.parse(message.body);
            if (newMessage.sender === state.username || newMessage.receiver === state.username) {
              commit('ADD_PRIVATE_MESSAGE', newMessage);
              console.log('Received private message:', newMessage);
            }
          }
        });
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
        receiver: 'PUBLIC',
        type: 'CHAT'
      };

      state.client.publish({ destination: '/ws/chat/sendMessage', body: JSON.stringify(message) });
      console.log('Sent public message:', message);
    },
    sendPrivateMessage({ state }, { recipientUsername, messageContent }) {
      if (!state.connected) {
        console.error('You are not connected to the WebSocket server');
        return;
      }

      const message = {
        content: messageContent,
        sender: state.username,
        receiver: recipientUsername,
        type: 'CHAT'
      };
       
      // Send the message to the private topic
      state.client.publish({ destination: `/ws/chat/sendMessage/${recipientUsername}`, body: JSON.stringify(message) });
      console.log('Sent private message:', message);
    },
  },
});

// Retrieve the token from localStorage and set the Authorization header
//const token = localStorage.getItem('token');
//if (token) {
 // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//}