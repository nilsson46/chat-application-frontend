<template>
  <div class="navigation">
    PRIVATE
    <div class="friends-list">
      <div v-for="friend in friends" :key="friend" class="friend">
        <button @click="selectFriend(friend)">Chat</button>
        <span>{{ friend }}</span>
      </div>
    </div>

    <!-- Chat area -->
    <div v-if="selectedFriend">
      <!-- Display selected friend's name -->
      <h2>Chat with {{ selectedFriend }}</h2>

      <!-- Input field for the message content -->
      <input v-model="privateMessageContent" type="text" placeholder="Skriv ditt meddelande här">
      <button class="button" @click="sendPrivateMessage">Skicka</button>
      <p v-if="imputErrorMessage" class="error">{{ imputErrorMessage }}</p>

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
  ...mapState(['connected','privateMessages','username']),
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
        const response = await axios.get('http://localhost:9090/friendship/friends');
        this.friends = response.data;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style>
/* Add your existing styles here */
</style>