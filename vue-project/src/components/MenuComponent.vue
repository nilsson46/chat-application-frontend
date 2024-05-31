<template>
  <div>
    <div :class="{ 'blur-background': showModal }">
      <div>
        <div class="buttons">
          <button class="button" @click="openModal('friends')">Open Friends Modal</button>
          <button class="button" @click="openModal('groups')">Open Groups Modal</button>
        </div>
      </div>
    </div>

    <div class="modal" v-if="showModal">
      <div class="modal-backdrop" @click="closeModal"></div>
      <div class="modal-content">
        <h2>Modal Window</h2>
        <input class="input-field" type="text" v-model="searchTerm" :placeholder="placeholderText" @input="search" />

        <div v-if="searchType === 'friends'">
          <div v-if="searchResults.length > 0">
            <ul class="search-results">
              <li v-for="result in searchResults" :key="result" class="search-result">
                {{ result }}
                <button class="button" @click="sendFriendRequest(result)">Send Friend Request</button>
              </li>
            </ul>
          </div>
        </div>

        <div>
          <h2>Friends</h2>
          <ul class="friends-list">
            <li v-for="friend in friends" :key="friend">{{ friend }}</li>
          </ul>
      
          <h2>Friend Requests</h2>
          <ul class="friend-requests">
            <li v-for="request in friendRequests" :key="request">
              {{ request }}
              <button class="button" @click="acceptFriendRequest(request)">Accept</button>
              <button class="button" @click="declineFriendRequest(request)">Decline</button>
            </li>
          </ul>
        </div>
        <button class="button" @click="closeModal">Close</button>
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
        const token = localStorage.getItem('token'); 
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

    const token = localStorage.getItem('token'); 
    const config = {
      headers: { Authorization: `Bearer ${token}` },
      params: { keyword: this.searchTerm }, 
    };
    const searchResponse = await axios.get('http://localhost:9090/friendship/search', config);

    this.searchResults = searchResponse.data.filter(user => !this.friends.includes(user) && user !== this.username);
  } catch (error) {
    console.error(error);
  }
},
    searchGroups() {

    console.log('Searching for groups:', this.searchTerm);
    },
    async sendFriendRequest(username) {
  try {
    const token = localStorage.getItem('token'); 
    const config = {
      headers: { Authorization: `Bearer ${token}` },
      params: { otherUsername: username },
    };
    const response = await axios.post('http://localhost:9090/friendship/add', null, config);
    this.message = response.data;

    this.searchResults = this.searchResults.filter(user => user !== username);

    this.friendRequests.push(username);
  } catch (error) {
    this.message = error.response ? error.response.data : 'An error occurred';
  }
},
async acceptFriendRequest(username) {
    try {
      const token = localStorage.getItem('token'); 
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
    const token = localStorage.getItem('token');
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
.blur-background {
  filter: blur(5px);
}

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
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
}

.modal-content {
  position: relative;
  padding: 20px;
  background-color: #4a90e2; 
  color: white;
  border-radius: 8px; 
  width: 50%;
  max-width: 500px; 
  box-sizing: border-box;
}

.input-field {
  padding: 10px;
  margin: 10px 0;
  width: 100%;
  box-sizing: border-box;
}

.buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.button {
  margin: 15px 0;
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

.search-results {
  list-style: none;
  padding: 0;
  margin: 10px 0;
}

.search-result {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #3479b5;
  border-radius: 5px;
  margin: 5px 0;
}

.friends-list,
.friend-requests {
  list-style: none;
  padding: 0;
  margin: 10px 0;
}

.friends-list li,
.friend-requests li {
  padding: 10px;
  background-color: #3479b5;
  border-radius: 5px;
  margin: 5px 0;
}
</style>