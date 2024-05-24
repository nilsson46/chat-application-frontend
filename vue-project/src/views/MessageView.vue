<script setup>
import NavBar from '../components/NavBar.vue'
import Message from '../components/Message.vue'
import PrivateMessage from '@/components/PrivateMessageComponent.vue';
</script>

<template>
    <div class="about">
        <NavBar/>
      <Message />
      <PrivateMessage />
    </div>
</template>