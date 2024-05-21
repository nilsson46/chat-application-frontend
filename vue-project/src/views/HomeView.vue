<script setup>
import NavBar from '@/components/NavBar.vue'
import MenuComponent from '@/components/MenuComponent.vue'
</script>

<template>
  <main class="navbar">
    <NavBar />
    <MenuComponent />
  </main>
</template>

<style>
.navbar {
  display: flex;
  flex-direction: column; /* Add this line */
  justify-content: flex-start;
  align-items: center;
  position: fixed; 
  top: 0; 
  left: 0; 
  width: 100%; 
  height: 60px; 
  z-index: 999; 
}
</style>