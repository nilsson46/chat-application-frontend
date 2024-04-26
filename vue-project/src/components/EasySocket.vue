<template>

    <div>
      <button @click="connectWebSocket">Connect</button>
      <button @click="disconnectWebSocket">Disconnect</button>
    </div>
  </template>
  
  <script>
  import { Client } from '@stomp/stompjs';
  import SockJS from 'sockjs-client';
  export default {
    data() {
      return {
        socket : null,
        client : null
      };
    },
    methods: {
      connectWebSocket() {
        this.socket = new SockJS('http://localhost:8080/connect');
      this.client = new Client({ webSocketFactory: () => this.socket });

      this.client.onConnect = () => {
        console.log('Connected to WebSocket');
        this.client.subscribe('/topic/messages', (message) => {
          console.log('Received message:', message.body);
        });
      };

      this.client.activate();
    },
    disconnectWebSocket() {
      if (this.client) {
        this.client.deactivate();
        this.client = null;
      }
    }
  }
};
  </script>