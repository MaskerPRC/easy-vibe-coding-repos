<template>
  <div class="app">
    <SpaceHunterGame />
  </div>
</template>

<script setup>
import SpaceHunterGame from './components/SpaceHunterGame.vue';
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.app {
  width: 100%;
  height: 100%;
}
</style>
