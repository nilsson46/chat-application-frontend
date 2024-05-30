<template>
  <div class="navigation">
    <div class="friends-list">
      <div v-for="friend in friends" :key="friend" class="friend" @click="selectFriend(friend)">
        <span>{{ friend }}</span>
      </div>
    </div>

    <!-- Chat area -->
    <div v-if="selectedFriend">
      <!-- Display selected friend's name -->
      <h2>Chat with {{ selectedFriend }}</h2>

      <!-- Input field for the message content -->
      <input v-model="privateMessageContent" type="text" placeholder="Meddelande" class="input-field">
      <button class="button" @click="sendPrivateMessage">Skicka</button>
      <p v-if="imputErrorMessage" class="error">{{ imputErrorMessage }}</p>
      <div class="chat">
        <!-- Display messages -->
        <div class="messages" v-for="message in filteredPrivateMessages" :key="message.id">
          <div>
            <strong>{{ message.sender }} {{ message.timestamp }}</strong>
          </div>
          <div>
            {{ message.content }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      privateMessageContent: '',
      recipientUsername: '',
      imputErrorMessage: '',
      selectedFriend: null,
      friends: [],
    };
  },
  created() {
    this.fetchFriends().then(() => {
    console.log(this.friends); // Add this line
    
  });
  },
  computed: {
  ...mapState(['connected','privateMessages','username','token']),
  filteredPrivateMessages() {
  console.log(this.privateMessages);

  if (!this.selectedFriend) {
    return [];
  }

  return this.privateMessages.filter(message => 
    message.type === 'PRIVATE' && 
    ((message.sender === this.selectedFriend && message.receiver === this.username) || 
     (message.sender === this.username && message.receiver === this.selectedFriend))
  );
},
  errorMessage() {
    return this.$store.state.errorMessage;
  }
},
  methods: {
    ...mapActions(['connectWebSocket']),
    sendPrivateMessage() {
  console.log(this.selectedFriend, this.username);

  if (this.selectedFriend === '') {
    this.imputErrorMessage = 'Recipient cannot be empty';
  } else if (this.privateMessageContent === '') {
    this.imputErrorMessage = 'Message cannot be empty';
  } else {
    this.$store.dispatch('sendPrivateMessage', { recipientUsername: this.selectedFriend, privateMessageContent: this.privateMessageContent });
    this.privateMessageContent = '';
    this.imputErrorMessage = '';
  }
},
    selectFriend(friend) {
      this.selectedFriend = friend;
    },
    async fetchFriends() {
  try {
    const response = await axios.get('http://localhost:9090/friendship/friends', {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });
    this.friends = response.data;
  } catch (error) {
    console.error(error);
  }
},
  },
};
</script>

<style scoped>
.navigation {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: #222c46; /* Ljusgrå huvudbakgrund */
}

@media (min-width: 768px) {
  .navigation {
    flex-direction: row;
  }
}

.friends-list {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: #222c46; /* Ljusare grå för vänlistan */
}

.friend {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #4a90e2; /* Grå för vänrad */
  margin-bottom: 10px;
  cursor: pointer;
  color: white;
  border-radius: 5px;
}

.friend span {
  cursor: pointer;
}

.friend:hover {
  background-color: #0056b3; /* Ljusare grå för vänrad vid hovring */
}

.chat {
  width: 100%;
  padding: 10px;
  height: 500px; /* Justera detta värde vid behov */
  overflow-y: auto;
}

@media (min-width: 768px) {
  .chat {
    width: 70%;
  }
}

.messages {
  background-color: #648ef1; /* Ljusare grå för meddelanden */
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  color: white;
}

.messages strong {
  display: block;
  margin-bottom: 5px;
}

.input-field {
  width: calc(100% - 100px); /* Justera bredden för att rymma knappen */
  padding: 10px;
  margin: 10px 0;
  box-sizing: border-box;
}

.button {
  padding: 10px 20px;
  background-color: #007bff; /* Blå för knappar */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-left: 10px;
}

.button:hover {
  background-color: #0056b3; /* Mörkare blå för knappar vid hovring */
}

.error {
  color: #d9534f; /* Röd för felmeddelanden */
}
</style>