<template>
    <div>
        <h1>Login</h1>
        <form @submit.prevent="loginUser">
            <div>
                <label for="username">Username:</label>
                <input v-model="username" type="text" id="username" name="username">
            </div>
            <div>
                <label for="password">Password:</label>
                <input v-model="password" type="password" id="password" name="password">
            </div>
            <button type="submit">Login</button>
        </form>
    </div>
</template>
<script>
import axios from 'axios';
import { mapActions } from 'vuex';

export default {
    data() {
        return {
            username: '',
            password: ''
        };
    },
    methods: {
        ...mapActions(['connectWebSocket']),
        loginUser() {
            axios.post('http://localhost:9090/login', {
                username: this.username,
                password: this.password
            })
            .then(response => {
                localStorage.setItem('token', response.data.token);
                console.log('Stored token:', localStorage.getItem('token')); // Log the stored token
                this.$store.commit('SET_USERNAME', this.username);
                this.connectWebSocket();
                this.$store.commit('SET_TOKEN', response.data.token);
                this.$router.push('/message');
                axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
                console.log('Authorization header:', axios.defaults.headers.common['Authorization']); // Log the Authorization header
                axios.get(`http://localhost:9090/api/messages`, {
                })
                .then(response => {
                    let messages = response.data;
                    messages.forEach(message => {
                        this.$store.commit('ADD_MESSAGE', message);
                    });
                })
                .catch(error => {
                    console.error('Error fetching messages:', error);
                });
            })
            .catch(error => {
                console.error('Error logging in:', error);
            });
        }
    }
};
</script>