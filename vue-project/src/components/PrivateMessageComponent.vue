
  <template>
    <div class="navigation">
      PRIVATE
      <!-- Inputfält för att skriva meddelanden -->
      <input v-model="privateMessageContent" type="text" placeholder="Skriv ditt meddelande här">
      <button class="button" @click="sendPrivateMessage(privateMessageContent)">Skicka</button>
    </div>
    <!-- Display messages -->
    <div class="messages" v-for="message in privateMessages" :key="message.id">
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
        recipientUsername: 'maja', // Replace with the actual recipient's username
      };
    },
    computed: {
      ...mapState(['connected','privateMessages']),
    },
    methods: {
      ...mapActions(['connectWebSocket','sendPrivateMessage']), // Changed from 'sendPrivateMessageAction' to 'sendPrivateMessage'

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