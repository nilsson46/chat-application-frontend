<script>
export default {
  data() {
    return {
      socket: null,
      connected: false,
      messageToSend: '',
      receivedMessage: ''
    };
  },
  methods: {
    connectToWebSocket() {
      this.socket = new WebSocket('ws://localhost:8080/ws');
      this.socket.onopen = () => {
        console.log('WebSocket-anslutning öppnad');
        this.connected = true;
        this.sendMessage(); // Skicka meddelandet när anslutningen är öppen
        this.socket.onmessage = this.receiveMessage;
      };
      this.socket.onerror = (error) => {
        console.error('WebSocket Error:', error);
      };
    },
    receiveMessage(event) {
      this.receivedMessage = event.data;
    },
    sendMessage() {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        const message = {
          type: 'CHAT',
          content: 'Hello, World!',
          sender: 'username'
        };
        this.socket.send(JSON.stringify(message));
      } else {
        console.error('WebSocket-anslutning inte öppen.');
      }
    }
  }
};
</script>

<template>
  <div>
    <button @click="connectToWebSocket">Anslut till WebSocket</button>
    <div v-if="connected">
      <input type="text" v-model="messageToSend" placeholder="Skriv ett meddelande">
      <button @click="sendMessage">Skicka</button>
      <div v-if="receivedMessage">{{ receivedMessage }}</div>
    </div>
  </div>
</template>

<style scoped>
/* Stilmall för komponenten */
</style>
