<template>
    <div class="navigation">
  
      <!-- Inputfält för att skriva meddelanden -->
      <input v-model="messageContent" type="text" placeholder="Skriv ditt meddelande här">
      <button class="button" @click="sendMessage(messageContent)">Skicka</button>
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
      };
    },
    computed: {
        ...mapState(['connected', 'publicMessages']) 
    },
    methods: {
        ...mapActions(['connectWebSocket', 'sendMessage'])
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
