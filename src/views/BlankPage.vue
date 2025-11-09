<template>
  <div class="blank-page">
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  document.title = ''
})
</script>

<style scoped>
.blank-page {
  min-height: 100vh;
  background-color: #ffffff;
}
</style>
