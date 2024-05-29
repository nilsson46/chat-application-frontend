<template>
    <div>
        <h1>Logout</h1>
        <button @click="logout">Logout</button>
    </div>
</template>

<script>
export default {
    methods: {
        logout() {
            localStorage.clear();
            this.$store.commit('RESET_STATE');
            this.$router.push('/login');
        }
    }
}
</script>