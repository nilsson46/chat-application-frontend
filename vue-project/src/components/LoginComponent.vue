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
                // Handle the response from the server
                console.log(response.data);
            })
            .catch(error => {
                // Handle any errors that occur during the request
                console.error(error);
            });
        }
    }
};
</script>