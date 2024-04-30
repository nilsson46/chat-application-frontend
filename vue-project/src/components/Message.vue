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

    // Lägg till en lyssnare för att ta emot meddelanden
    this.client.subscribe('/topic/public', (message) => {
      if (message.body) {
        let receivedMessage = JSON.parse(message.body);
        console.log('Received message:', receivedMessage);
      }
    });
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
        // Kontrollera om användaren är ansluten till WebSocket-servern
        if (!this.connected) {
            console.error('Du är inte ansluten till WebSocket-servern');
            return;
        }

        // Skapa ett meddelandeobjekt som matchar strukturen för ChatMessage-klassen i backend
        const message = {
            content: 'Detta är ett testmeddelande',
            sender: 'Användarnamn',
            type: 'CHAT'
        };

        // Skicka meddelandet till WebSocket-servern
        this.client.publish({ destination: '/ws/chat/sendMessage', body: JSON.stringify(message) });
        console.log('Sent message:', message);
        }
    }
  };
  </script>
  