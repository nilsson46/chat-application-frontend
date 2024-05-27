<script>
import { mapActions, mapState } from 'vuex';
export default {
  computed: {
    baseUrl() {
      return `${window.location.protocol}//${window.location.host}`;
    },
    ...mapState(['username']),
  },
  methods: {
    ...mapActions(['logout']),
    async handleLogout() {
      await this.logout();
      this.$router.push('/login');
    },
  },
};
</script>
<template>
    <div>
        <a class="button" :href="`${baseUrl}/`">Home</a>
        <a class="button" v-if="!username" :href="`${baseUrl}/login`">Login</a>
        <a class="button" :href="`${baseUrl}/register`">Register</a>
        <a class="button" :href="`${baseUrl}/message`">Message</a>
        <a class="button" :href="`${baseUrl}/message`">Private Message</a>
        <button class="button" @click="logout">Logout</button>
        <div v-if="username">Logged in as: {{ username }}</div>
    </div>

</template>

<style scoped>
.button{
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