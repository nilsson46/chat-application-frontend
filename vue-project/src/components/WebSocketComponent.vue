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
  import { mapState, mapActions } from 'vuex';
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
    computed: {
    ...mapState(['username', 'token'])
    },
    methods: {
      connectWebSocket() {

        this.socket = new WebSocket(`http://localhost:9090/connect`,'echo-protocol');
  

        this.socket.onopen = () => {
          console.log('Connected to WebSocket');
        };
  
        this.socket.onmessage = (event) => {

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

        this.socket.send(this.message);
        console.log('Message sent:', this.message);
        this.message = '';
      }
    }
  };
  </script>

  