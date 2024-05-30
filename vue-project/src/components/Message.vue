<template>
    <div class="navigation">
        PUBLIC
        <!-- Inputfält för att skriva meddelanden -->
        <input v-model="messageContent" type="text" placeholder="Skriv ditt meddelande här" class="input-field">
        <button class="button" @click="sendPublicMessage">Skicka</button>
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
<style scoped>
.navigation {
    margin-bottom: 20px;
}

.input-field {
    padding: 10px;
    width: 300px;
    box-sizing: border-box;
    margin-right: 10px;
}

.messages {
    margin-top: 20px;
    background-color: #357ab8;
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
    padding: 10px 20px;
    font-size: 15px;
    color: white;
    background-color: #357ab8;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.button:hover {
    background-color: #285a8c;
}

.error {
    color: red;
    font-size: 14px;
    margin-top: 5px;
}
</style>
