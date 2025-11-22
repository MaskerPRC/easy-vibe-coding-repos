<template>
  <div class="app">
    <SoftBodyTetris />
  </div>
</template>

<script setup>
import SoftBodyTetris from './components/SoftBodyTetris.vue'
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: #1C1C2C;
}
</style>

