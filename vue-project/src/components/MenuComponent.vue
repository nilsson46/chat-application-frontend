<template>
  <div :class="{ 'blur-background': showModal }">
    <h1>Menu</h1>
    <div>
      <div class="buttons">
        <button @click="openModal('friends')">Open Friends Modal</button>
        <button @click="openModal('groups')">Open Groups Modal</button>
      </div>
    </div>

    <div class="modal" v-if="showModal">
      <div class="modal-content">
        <h2>Modal Window</h2>
        <input class="inputField" type="text" v-model="searchTerm" :placeholder="placeholderText" @input="search">
        

        <!-- Moved friend request related elements here -->
        <div v-if="searchType === 'friends'">
          <!-- Removed the old input field and button -->
        
          <!-- Dropdown list of search results -->
          <div v-if="searchResults.length > 0">
            <ul>
              <li v-for="result in searchResults" :key="result">
                {{ result }}
                <!-- Added a button next to each result -->
                <button @click="sendFriendRequest(result)">Send Friend Request</button>
              </li>
            </ul>
          </div>
        </div>

        <div>
          <h2>Friends</h2>
          <ul>
            <li v-for="friend in friends" :key="friend">{{ friend }}</li>
          </ul>
      
          <h2>Friend Requests</h2>
          <ul>
            <li v-for="request in friendRequests" :key="request">
            {{ request }}
            <button @click="acceptFriendRequest(request)">Accept</button>
            <button @click="declineFriendRequest(request)">Decline</button>
          </li>
          </ul>
        </div>
        <button @click="closeModal">Close</button>
      </div>
      
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            showModal: false,
            searchTerm: '',
            searchType: '',
            username: '',
            message: '',
            friends: [],
            friendRequests: [],
            searchResults: [],
        };
    },
    computed: {
    placeholderText() {
      return `Search ${this.searchType}`;
        },
    },
    async created() {
      try {
        const token = localStorage.getItem('token'); // replace this with your token retrieval logic
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const friendsResponse = await axios.get('http://localhost:9090/friendship/friends', config);
        this.friends = friendsResponse.data;

        const requestsResponse = await axios.get('http://localhost:9090/friendship/friendRequests', config);
        this.friendRequests = requestsResponse.data;
      } catch (error) {
        console.error(error);
      }
    },
    methods: {
        openModal(type) {
        this.searchType = type;
        this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
        },
        search() {
      if (this.searchType === 'friends') {
        this.searchFriends();
      } else if (this.searchType === 'groups') {
        this.searchGroups();
      }
    },
    async searchFriends() {
  try {
    if (this.searchTerm.trim() === '') {
      this.searchResults = [];
      return;
    }

    const token = localStorage.getItem('token'); // replace this with your token retrieval logic
    const config = {
      headers: { Authorization: `Bearer ${token}` },
      params: { keyword: this.searchTerm }, // pass the search term as a query parameter
    };
    const searchResponse = await axios.get('http://localhost:9090/friendship/search', config);

    // Update the search results with the response data
    // Filter out the friends and the current user from the search results
    this.searchResults = searchResponse.data.filter(user => !this.friends.includes(user) && user !== this.username);
  } catch (error) {
    console.error(error);
  }
},
    searchGroups() {
        // Implement your search for groups logic here and a list to shown? 
    console.log('Searching for groups:', this.searchTerm);
    },
    async sendFriendRequest(username) {
  try {
    const token = localStorage.getItem('token'); // replace this with your token retrieval logic
    const config = {
      headers: { Authorization: `Bearer ${token}` },
      params: { otherUsername: username },
    };
    const response = await axios.post('http://localhost:9090/friendship/add', null, config);
    this.message = response.data;

    // Remove the user from the search results
    this.searchResults = this.searchResults.filter(user => user !== username);
    // Add the user to the friendRequests list
    this.friendRequests.push(username);
  } catch (error) {
    this.message = error.response ? error.response.data : 'An error occurred';
  }
},
async acceptFriendRequest(username) {
    try {
      const token = localStorage.getItem('token'); // replace this with your token retrieval logic
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: { otherUsername: username },
      };
      await axios.post('http://localhost:9090/friendship/accept', null, config);
      this.friendRequests = this.friendRequests.filter(request => request !== username);
      this.friends.push(username);
    } catch (error) {
      console.error(error);
    }
  },
  async declineFriendRequest(username) {
  try {
    const token = localStorage.getItem('token'); // replace this with your token retrieval logic
    const config = {
      headers: { Authorization: `Bearer ${token}` },
      params: { otherUsername: username },
    };
    await axios.post('http://localhost:9090/friendship/decline', null, config);
    this.friendRequests = this.friendRequests.filter(request => request !== username);
  } catch (error) {
    console.error(error);
  }
},
  },
};
</script>

<style scoped>

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(125, 64, 64, 0.5);
  backdrop-filter: blur(5px);
}

.modal-content {
  padding: 20px;
  background-color: rgba(114, 125, 114, 0.8); /* Green background */
  color: white; /* White text */
  border-radius: 5px; /* Rounded corners */
  width: 50%; /* Half of the parent's width */
  max-width: 500px; /* Maximum width */
  box-sizing: border-box; /* Include padding and border in element's total width and height */
}

.inputField {
  padding: 10px;
  margin: 10px 0;
  width: 100%;
  box-sizing: border-box;
}
.buttons {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
}

.buttons button {
    padding: 10px 20px;
    font-size: 15px;
    color: white;
    background-color: #449c47;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.buttons button:hover {
    background-color: #1e9221;
}
</style>