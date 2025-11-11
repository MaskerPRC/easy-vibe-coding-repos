<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
// Main app component - just renders the router view
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  font-family: 'Roboto', 'Montserrat', 'Open Sans', 'Lato', sans-serif;
  background: #0a0e1a;
}

#app {
  width: 100%;
  min-height: 100vh;
}

/* Global scrollbar styling */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: rgba(26, 43, 60, 0.5);
}

::-webkit-scrollbar-thumb {
  background: #ff8c00;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #ffa500;
}
</style>
