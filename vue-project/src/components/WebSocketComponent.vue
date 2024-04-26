<template>
    <div>
      <input type="text" v-model="message" placeholder="Enter your message">
      <button @click="sendMessage">Send</button>
      <ul>
        <li v-for="msg in messages" :key="msg.id">{{ msg.content }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  //import {Client} from '@stomp/stompjs'
  export default {
    data() {
      return {
        message: '',
        messages: [],
        socket: null
      };
    },
    mounted() {
      this.connectWebSocket();
    },
    methods: {
      connectWebSocket() {
        // Establish WebSocket connection
        this.socket = new WebSocket(`http://localhost:8080/connect`,'echo-protocol');
  
        // WebSocket event handlers
        this.socket.onopen = () => {
          console.log('Connected to WebSocket');
        };
  
        this.socket.onmessage = (event) => {
          // Handle incoming WebSocket messages
          console.log('Received message:', event.data);
          this.messages.push({ id: this.messages.length, content: event.data });
        };
  
        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
        };
  
        this.socket.onclose = () => {
          console.log('WebSocket connection closed');
        };
      },
      sendMessage() {
        // Send message through WebSocket
        this.socket.send(this.message);
        console.log('Message sent:', this.message);
        this.message = ''; // Clear input field after sending message
      }
    }
  };
  </script>
  
  <style scoped>
  /* Add your component-specific styles here if needed */
  </style>
  