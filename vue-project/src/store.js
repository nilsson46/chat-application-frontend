// store.js
import Vuex from "vuex";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";
import createPersistedState from "vuex-persistedstate";

export default new Vuex.Store({
  state: {
    socketUrl: "http://localhost:9090",
    socket: null,
    client: null,
    connected: false,
    username: null,
    publicMessages: [],
    privateMessages: [],
    token: null,
    isLoggedIn: false,
    publicSubscription: null,
    privateSubscription: null,
  },

  plugins: [
    createPersistedState({
      paths: [
        "username",
        "publicMessages",
        "privateMessages",
        "token",
        "isLoggedIn",
      ],
    }),
  ],
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
      localStorage.setItem(
        "privateMessages",
        JSON.stringify(state.privateMessages)
      );
    },
    SET_TOKEN(state, token) {
      state.token = token;
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        state.isLoggedIn = true;
      } else {
        delete axios.defaults.headers.common["Authorization"];
        state.isLoggedIn = false;
      }
    },
    SET_ERROR_MESSAGE(state, errorMessage) {
      state.errorMessage = errorMessage;
    },
    RESET_STATE(state) {
      state.username = null;
      state.publicMessages = [];
      state.privateMessages = [];
      state.token = null;
      state.isLoggedIn = false;
    },
  },
  getters: {
    privateMessages: (state) => state.privateMessages,
  },
  computed: {
    privateMessages() {
      return this.$store.getters.privateMessages;
    },
  },
  actions: {
    initializeStore({ commit }) {
      const token = localStorage.getItem("token");
      if (token === null) {
        commit("SET_TOKEN", token);
      }
    },
    login({ commit, dispatch }, { username, token }) {
      commit("SET_USERNAME", username);
      commit("SET_TOKEN", token);
      dispatch("connectWebSocket");
    },
    logout({ commit }) {
      commit("RESET_STATE");
    },
    showErrorMessage({ commit }, errorMessage) {
      commit("SET_ERROR_MESSAGE", errorMessage);
    },
    connectWebSocket({ commit, state }) {
      const socket = new SockJS(`${state.socketUrl}/connect`);
      commit("SET_SOCKET", socket);

      const client = new Client({
        webSocketFactory: () => state.socket,
        connectHeaders: {
          Authorization: `Bearer ${state.token}`,
        },
        onStompError: (frame) => {
          console.error("Received error from server:", frame.body);
          if (frame.body.includes("Receiver not found")) {
            console.error("The recipient username does not exist");
          }
        },
      });

      commit("SET_CLIENT", client);

      client.onConnect = () => {
        console.log("Connected to WebSocket server");
        commit("SET_CONNECTED", true);

        if (state.publicSubscription) {
          state.publicSubscription.unsubscribe();
        }
        if (state.privateSubscription) {
          state.privateSubscription.unsubscribe();
        }

        state.publicSubscription = client.subscribe(
          "/topic/public",
          (message) => {
            if (message.body) {
              let receivedPublicMessage = JSON.parse(message.body);
              commit("ADD_PUBLIC_MESSAGE", receivedPublicMessage);
              console.log("Received public message:", receivedPublicMessage);
            }
          }
        );

        state.privateSubscription = client.subscribe(
          `/topic/private/${state.username}`,
          (message) => {
            if (message.body) {
              const receivedPrivateMessage = JSON.parse(message.body);
              commit("ADD_PRIVATE_MESSAGE", receivedPrivateMessage);
              console.log("Received private message:", receivedPrivateMessage);
            }
          }
        );
      };

      client.activate();
    },
    sendPublicMessage({ state }, messageContent) {
      if (!state.connected) {
        console.error("You are not connected to the WebSocket server");
        return;
      }

      const message = {
        content: messageContent,
        sender: state.username,
        receiver: "PUBLIC",
        type: "PUBLIC",
      };

      state.client.publish({
        destination: "/ws/chat/sendMessage",
        body: JSON.stringify(message),
      });
      console.log("Sent public message:", message);
    },
    sendPrivateMessage(
      { commit, state, dispatch },
      { recipientUsername, privateMessageContent }
    ) {
      if (!state.connected) {
        console.error("You are not connected to the WebSocket server");
        return;
      }
      if (!state.token) {
        console.error("You are not logged in");
        dispatch("showErrorMessage", "You are not logged in");
        return;
      }

      const message = {
        content: privateMessageContent,
        sender: state.username,
        receiver: recipientUsername,
        type: "PRIVATE",
      };

      state.client.publish({
        destination: `/ws/chat/sendMessage/${recipientUsername}`,
        body: JSON.stringify(message),
      });
      console.log("Sent private message:", message, recipientUsername);

      commit("ADD_PRIVATE_MESSAGE", message);
    },
  },
});
