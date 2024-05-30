<script setup>
import { ref } from 'vue';
import NavBar from '../components/NavBar.vue'
import Message from '../components/Message.vue'
import PrivateMessage from '@/components/PrivateMessageComponent.vue';
const showPrivateMessage = ref(false);
const toggleChat = () => {
  showPrivateMessage.value = !showPrivateMessage.value;
};
</script>


<template>
  <div class="about">
    <NavBar/>
    <button @click="toggleChat" class="toggle-button">{{ showPrivateMessage ? 'Switch to Public Chat' : 'Switch to Private Chat' }}</button>
    <Message v-if="!showPrivateMessage" />
    <PrivateMessage v-if="showPrivateMessage" />
  </div>
</template>

<style> 
button.toggle-button {
  margin: 10px;
  padding: 10px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  transition: background-color 0.3s;
}

button.toggle-button:hover {
  background-color: #3669b8;
}
</style>