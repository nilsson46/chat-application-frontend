
<template>
  <div class="navigation">
    PRIVATE
    <!-- Input field for the recipient's username -->
    <input v-model="recipientUsername" type="text" placeholder="Enter recipient's username">
    <!-- Input field for the message content -->
    <input v-model="privateMessageContent" type="text" placeholder="Skriv ditt meddelande här">
    <button class="button" @click="sendPrivateMessage({ recipientUsername, privateMessageContent })">Skicka</button>
  </div>
  <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  <!-- Display messages -->
  <div class="messages" v-for="message in filteredPrivateMessages" :key="message.id">
      <div>
          <strong>{{ message.sender }} {{ message.timestamp }}</strong>
      </div>
      <div>
          {{ message.content }}
      </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      privateMessageContent: '',
      recipientUsername: '',
    };
  },
  computed: {
    ...mapState(['connected','privateMessages']),
    filteredPrivateMessages() {
    console.log(this.privateMessages); // log the privateMessages array
    const filtered = this.privateMessages.filter(message => message.type === 'PRIVATE');
    console.log(filtered); // log the filtered array
    return filtered;
  },
  errorMessage() {
    return this.$store.state.errorMessage;
  }
  },
  methods: {
    ...mapActions(['connectWebSocket','sendPrivateMessage']),
  },
  
};
</script>
  <style>
  .messages {
      margin-top: 20px;
      background-color: rgb(124, 70, 181);
      padding: 10px;
      border-radius: 5px;
  }
  .messages > div {
      margin-bottom: 10px;
  }
  .messages > div > strong {
      font-weight: bold;
  }
  .messages > div > div {
      margin-top: 5px;
  }
  .button {
      margin-right: 10px;
  }
  </style>