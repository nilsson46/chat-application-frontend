<template>
    <div>
        <form @submit.prevent="loginUser" class="login-form">
            <div class="form-group">
                <label for="username">Username:</label>
                <input v-model="username" type="text" id="username" name="username" class="input-field">
            </div>
            <div class="form-group">
                <label for="password">Password:</label>
                <input v-model="password" type="password" id="password" name="password" class="input-field">
            </div>
            <button type="submit" class="button">Login</button>
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
        async loginUser() {
            console.log('Logging in with username:', this.username);
            try {
                const response = await axios.post('http://localhost:9090/login', {
                    username: this.username,
                    password: this.password
                });

                console.log('Login response:', response);

                // Store the token in localStorage
                localStorage.setItem('token', response.data.token);

                // Create an axios instance with the Authorization header set
                const instance = axios.create({
                    baseURL: 'http://localhost:9090',
                    timeout: 1000,
                    headers: {'Authorization': `Bearer ${response.data.token}`}
                });

                console.log('Created axios instance:', instance);

                this.$store.commit('SET_USERNAME', this.username);
                this.connectWebSocket();
                this.$store.commit('SET_TOKEN', response.data.token);
                this.$router.push('/message');

                // Use the axios instance to fetch messages
                const messagesResponse = await instance.get('/api/messages');
                console.log('Messages response:', messagesResponse);

                let messages = messagesResponse.data;
                messages.forEach(message => {
                    if (message.type === 'PRIVATE' && (message.receiver === this.username || message.sender === this.username)) {
                        this.$store.commit('ADD_PRIVATE_MESSAGE', message);
                    } else {
                        this.$store.commit('ADD_PUBLIC_MESSAGE', message);
                    }
                });
            } catch (error) {
                console.error('Error logging in:', error);
            }
        }
    }
};
</script>
<style scoped>
.login-form {
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