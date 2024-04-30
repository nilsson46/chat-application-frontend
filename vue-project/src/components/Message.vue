<template>
    <div>
      <!-- Anslutningsknapp -->
      <button @click="connectWebSocket" :disabled="connected">Anslut till WebSocket</button>
  
      <!-- Inputfält för att skriva meddelanden -->
      <input v-model="messageToSend" type="text" placeholder="Skriv ditt meddelande här">
      <button @click="sendMessage" :disabled="!connected">Skicka</button>
    </div>
  </template>
  
  <script>
  import { Client } from '@stomp/stompjs';
  import SockJS from 'sockjs-client';
  
  export default {
    data() {
      return {
        socketUrl: 'http://localhost:8080',
        socket: null,
        client: null,
        connected: false,
        messageToSend: ''
      };
    },
    methods: {
      connectWebSocket() {
        // Skapa en WebSocket-anslutning
        this.socket = new SockJS(`${this.socketUrl}/connect`);
        this.client = new Client({ webSocketFactory: () => this.socket });
  
        // Lyssna på händelsen när WebSocket-anslutningen upprättas
        this.client.onConnect = () => {
          console.log('Connected to WebSocket server');
          this.connected = true;
        };
  
        // Lyssna på händelsen när WebSocket-anslutningen avbryts
        this.client.onDisconnect = () => {
          console.log('Disconnected from WebSocket server');
          this.connected = false;
        };
  
        // Aktivera WebSocket-anslutningen
        this.client.activate();
      },
      sendMessage() {
        // Kontrollera om meddelandet är tomt
        if (this.messageToSend.trim() === '') {
          console.error('Skriv ett meddelande innan du skickar');
          return;
        }
  
        // Kontrollera om användaren är ansluten till WebSocket-servern
        if (!this.connected) {
          console.error('Du är inte ansluten till WebSocket-servern');
          return;
        }
  
        // Skicka meddelandet till WebSocket-servern
        this.client.publish({ destination: '/chat/sendMessage', body: JSON.stringify({ sender: 'Me', content: this.messageToSend }) });
        console.log('Sent message:', { sender: 'Me', content: this.messageToSend });
  
        // Rensa inputfältet
        this.messageToSend = '';
      }
    }
  };
  </script>
  