<script>
export default {
  computed: {
    baseUrl() {
      return `${window.location.protocol}//${window.location.host}`;
    },
  },
};
</script>
<template>
    <div>
        <a class="button" :href="`${baseUrl}/`">Home</a>
        <a class="button" :href="`${baseUrl}/login`">Login</a>
        <a class="button" :href="`${baseUrl}/register`">Register</a>
        <a class="button" :href="`${baseUrl}/message`">Message</a>
        <a class="button">Something</a>
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