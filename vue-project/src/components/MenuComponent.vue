<script>

</script>
<template>
    <div>
      <div v-if="$store.state.isLoggedIn">
        Loggad
      </div>
      <div v-else>
        Logga in eller registrera dig för att använda appen
      </div>
    </div>
  </template>