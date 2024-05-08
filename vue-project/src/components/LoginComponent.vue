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
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { mapActions } from 'vuex';

export default {
    data() {
        return {
            user: {
                username: '',
                password: ''
            },
            websocket:{
                socketUrl: 'http://localhost:8080',
                socket: null,
                client: null,
                connected: false
            }
            
        };
    },
    methods: {
        ...mapActions(['setConnect']),
        connectWebSocket() {
            // Create a WebSocket connection
            this.websocket.socket = new SockJS(`${this.websocket.socketUrl}/connect`);
            this.websocket.client = new Client({ webSocketFactory: () => this.websocket.socket });

            // Listen for the event when the WebSocket connection is established
            this.websocket.client.onConnect = () => {
                console.log('Connected to WebSocket server');
                this.websocket.connected = true;
                this.setConnected(true);

                // Add a listener to receive messages
                this.websocket.client.subscribe('/topic/public', (message) => {
                    if (message.body) {
                        let receivedMessage = JSON.parse(message.body);
                        console.log('Received message:', receivedMessage);
                    }
                });
            };

            // Listen for the event when the WebSocket connection is terminated
            this.websocket.client.onDisconnect = () => {
                console.log('Disconnected from WebSocket server');
                this.websocket.connected = false;
                this.setConnected(false);
            };

            // Activate the WebSocket connection
            this.websocket.client.activate();
        },
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
                this.connectWebSocket();
                this.$router.push('/landing');
            })
            .catch(error => {
                console.error(error);
            });
        }
    }
};
</script>
