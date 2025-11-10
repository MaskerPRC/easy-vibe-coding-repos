<template>
  <router-view />
  <DesktopPet />
</template>

<script setup>
import DesktopPet from './components/DesktopPet.vue';
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
}

#app {
  min-height: 100vh;
}
</style>

