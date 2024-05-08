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

export default {
    data() {
        return {
            username: '',
            password: '',
        };
    },
    methods: {
        loginUser() {
            axios.post('http://localhost:8080/login', {
                username: this.username,
                password: this.password
            })
            .then(response => {
                // Store the JWT token in local storage
                localStorage.setItem('token', response.data.token);
                console.log(response.data);
                console.log(response.data.token);
                // Redirect the user to a different page
                this.$router.push('/landing');
            })
            .catch(error => {
                console.error(error);
            });
        }
    }
};
</script>
