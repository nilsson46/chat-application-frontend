<template>
    <div>
        <h1>Register</h1>
        <form @submit.prevent="registerUser" class="register-form">
            <div class="form-group">
                <label for="username">Username:</label>
                <input v-model="username" type="text" id="username" name="username" class="input-field">
            </div>
            <div class="form-group">
                <label for="password">Password:</label>
                <input v-model="password" type="password" id="password" name="password" class="input-field">
            </div>
            <div class="form-group">
                <label for="email">Email:</label>
                <input v-model="email" type="email" id="email" name="email" class="input-field">
            </div>
            <div class="form-group">
                <label for="role">Role:</label>
                <input v-model="role" type="text" id="role" name="role" class="input-field">
            </div>
            <div class="form-group">
                <label for="age">Age:</label>
                <input v-model="age" type="number" id="age" name="age" class="input-field">
            </div>
            <div class="form-group">
                <label for="address">Address:</label>
                <input v-model="address" type="text" id="address" name="address" class="input-field">
            </div>
            <div class="form-group">
                <label for="city">City:</label>
                <input v-model="city" type="text" id="city" name="city" class="input-field">
            </div>
            <div class="form-group">
                <label for="country">Country:</label>
                <input v-model="country" type="text" id="country" name="country" class="input-field">
            </div>
            <button type="submit" class="button">Register</button>
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

                console.log(response.data);
                localStorage.setItem('token', response.data.token);
                this.$store.commit('SET_TOKEN', response.data.token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                this.$router.push('/login');
            })
            .catch(error => {

                console.log(error);
            });
        }
    }
};
</script>
<style scoped>
.register-form {
  max-width: 400px;
  margin: auto;
}

.form-group {
  margin-bottom: 1rem;
}

.input-field {
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
}

.button {
  padding: 10px 20px;
  font-size: 15px;
  color: white;
  background-color: #357ab8;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #285a8c;
}
</style>