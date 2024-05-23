<template>
    <div>
      <h1>Private Chat</h1>
      <div v-for="message in privateMessages" :key="message.id">
        <p>{{ message.content }}</p>
      </div>
      <input v-model="newMessage" @keyup.enter="sendPrivateMessageHandler" placeholder="Type a message..." />
      <button class="button" @click="sendPrivateMessageHandler">Skicka</button>
    </div>
  </template>
  
  <script>
  import { mapState, mapActions } from 'vuex';
  
  export default {
    data() {
      return {
        newMessage: '',
        recipientUsername: 'maja', // Replace with the actual recipient's username
      };
    },
    computed: {
      ...mapState(['connected','privateMessages']),
    },
    methods: {
      ...mapActions(['connectWebSocket','sendPrivateMessage']), // Changed from 'sendPrivateMessageAction' to 'sendPrivateMessage'
      sendPrivateMessageHandler() {
        this.sendPrivateMessage({ recipientUsername: this.recipientUsername, messageContent: this.newMessage });
        //this.privateMessages.push({ content: this.newMessage, sender: this.recipientUsername });
        this.newMessage = '';
      },
    },
  };
  </script>