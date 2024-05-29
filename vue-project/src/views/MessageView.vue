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
    <button @click="toggleChat">{{ showPrivateMessage ? 'Switch to Public Chat' : 'Switch to Private Chat' }}</button>
    <Message v-if="!showPrivateMessage" />
    <PrivateMessage v-if="showPrivateMessage" />
  </div>
</template> 

<style> 
button {
  margin: 10px;
  padding: 10px;
  background-color: #4CAF50;
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
</style>