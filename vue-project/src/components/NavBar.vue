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
  <div class="navbar">
    <a class="navbar-button" :href="`${baseUrl}/`">Home</a>
    <a class="navbar-button" v-if="!username" :href="`${baseUrl}/login`">Login</a>
    <a class="navbar-button" v-if="!username" :href="`${baseUrl}/register`">Register</a>
    <a class="navbar-button" :href="`${baseUrl}/message`">Message</a>
    <button class="navbar-button" @click="handleLogout">Logout</button>
    <div v-if="username" class="username-display">Logged in as: {{ username }}</div>
  </div>
</template>

<style scoped>
.navbar {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #4a90e2;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.navbar-button {
  margin: 10px;
  padding: 10px;
  background-color: #357ab8;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  transition: background-color 0.3s;
}

.navbar-button:hover {
  background-color: #285a8c;
}

.username-display {
  margin-top: 10px;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
}
</style>