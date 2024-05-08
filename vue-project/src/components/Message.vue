<template>
    <div class="navigation">
      <!-- Anslutningsknapp -->
      <button class="button" @click="connectWebSocket" :disabled="connected">Anslut till WebSocket</button>
  
      <!-- Inputfält för att skriva meddelanden -->
      <input v-model="messageToSend" type="text" placeholder="Skriv ditt meddelande här">
      <button class="button" @click="sendMessage">Skicka</button>
    </div>
</template>
  
<script>
import { mapState, mapActions } from 'vuex';

export default {
    data() {
      return {
        messageToSend: ''
      };
    },
    computed: {
        ...mapState(['connected'])
    },
    methods: {
        ...mapActions(['connectWebSocket', 'sendMessage'])
    }
};
</script>

<style scoped>
div .navigation{
    display: flex;
    justify-content: space-around;
    font-size: x-large;
    font-family: 'Courier New', Courier, monospace;
    background-color: blue;
    padding: 1rem;
}
button{
  margin-top: 1rem;
  margin-bottom: 1rem;
  margin-right: 1rem;
  margin-left: 1rem;
}
</style>