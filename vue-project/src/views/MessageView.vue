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