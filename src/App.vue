<template>
  <div class="app">
    <GameLobby />
  </div>
</template>

<script setup>
import GameLobby from './components/GameLobby.vue'
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f1729 0%, #1a2744 100%);
}
</style>

