<template>
  <div class="app">
    <ChessBoard />
  </div>
</template>

<script setup>
import ChessBoard from './components/ChessBoard.vue'
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #F0F0E0 0%, #FFFFFF 100%);
}
</style>

