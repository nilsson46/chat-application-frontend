<template>
    <div>
        <h1>Register</h1>
        <form @submit.prevent="registerUser">
            <div>
                <label for="username">Username:</label>
                <input v-model="username" type="text" id="username" name="username">
            </div>
            <div>
                <label for="password">Password:</label>
                <input v-model="password" type="password" id="password" name="password">
            </div>
            <div>
                <label for="email">Email:</label>
                <input v-model="email" type="email" id="email" name="email">
            </div>
            <div>
                <label for="role">Role:</label>
                <input v-model="role" type="text" id="role" name="role">
            </div>
            <div>
                <label for="age">Age:</label>
                <input v-model="age" type="number" id="age" name="age">
            </div>
            <div>
                <label for="address">Address:</label>
                <input v-model="address" type="text" id="address" name="address">
            </div>
            <div>
                <label for="city">City:</label>
                <input v-model="city" type="text" id="city" name="city">
            </div>
            <div>
                <label for="country">Country:</label>
                <input v-model="country" type="text" id="country" name="country">
            </div>
            <button type="submit">Register</button>
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
            email: '',
            role: '',
            age: '',
            address: '',
            city: '',
            country: ''
        };
    },
    methods: {
        registerUser() {

            axios.post('http://localhost:9090/register', {
                username: this.username,
                password: this.password,
                email: this.email,
                role: this.role,
                age: this.age,
                address: this.address,
                city: this.city,
                country: this.country
            })
            .then(response => {
                // Handle the response from the server
                console.log(response.data);
                this.$router.push('/login');
            })
            .catch(error => {
                // Handle the error
                console.log(error);
            });
        }
    }
};
</script>