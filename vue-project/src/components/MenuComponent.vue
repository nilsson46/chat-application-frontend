<template>
  <div :class="{ 'blur-background': showModal }">
    <!--<div v-if="$store.state.isLoggedIn">
      Loggad
    </div>-->
    <h1>Menu</h1>
    <div>
      <div>
        Get friends List of friends
      </div>
      <div>
        get groups List of groups
      </div>
      <!--<div v-else>
        Logga in eller registrera dig för att använda appen
      </div>-->
      <div class="buttons">
        <button @click="openModal('friends')">Open Friends Modal</button>
        <button @click="openModal('groups')">Open Groups Modal</button>
        </div>
    </div>
  </div>

        <div>
            
            <div class="modal" v-if="showModal">
                <div class="modal-content">
                    <!-- Content of the modal window -->
                    <h2>Modal Window</h2>
                    <input class="inputField" type="text" v-model="searchTerm" :placeholder="placeholderText" @input="search">
                    <p>the get request should be done every search i guess?</p>
                    <button @click="closeModal">Close</button>
                </div>
            </div>
        </div>

    </template>

<script>
export default {
    data() {
        return {
            showModal: false,
            searchTerm: '',
            searchType: '',
        };
    },
    computed: {
    placeholderText() {
      return `Search ${this.searchType}`;
        },
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
    searchFriends() {
    // Implement your search for friends logic here and a list to shown? 
        console.log('Searching for friends:', this.searchTerm);
    },
    searchGroups() {
        // Implement your search for groups logic here and a list to shown? 
    console.log('Searching for groups:', this.searchTerm);
    },
    }
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