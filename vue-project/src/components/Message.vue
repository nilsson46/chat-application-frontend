<template>
    <div class="navigation">
        PUBLIC
      <!-- Inputfält för att skriva meddelanden -->
      <input v-model="messageContent" type="text" placeholder="Skriv ditt meddelande här">
      <button class="button" @click="sendPublicMessage(messageContent)">Skicka</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
    <!-- Display messages -->
    <div class="messages" v-for="message in publicMessages" :key="message.id">
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
        messageContent: '',
        errorMessage: ''
      };
    },
    computed: {
        ...mapState(['connected', 'publicMessages']) 
    },
    methods: {
        ...mapActions(['connectWebSocket']),
        sendPublicMessage() {
            if (this.messageContent ===''){ 
                this.errorMessage = 'Message cannot be empty';
            } else {
                this.$store.dispatch('sendPublicMessage', this.messageContent);
                this.messageContent = '';
                this.errorMessage = '';
            }
        }
    },
    created() {
  console.log('WebSocket connection status:', this.connected);
  if (!this.connected) {
            this.connectWebSocket();
        }
}
};
</script>
<style>
.messages {
    margin-top: 20px;
    background-color: rgb(181, 70, 70);
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
