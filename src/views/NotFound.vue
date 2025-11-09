<template>
  <div class="not-found">
    <div class="error-container">
      <h1 class="error-code">404</h1>
      <h2 class="error-message">Not Found</h2>
      <p class="error-description">
        The requested URL was not found on this server.
      </p>
      <hr class="divider">
      <p class="server-info">nginx/1.18.0 (Ubuntu)</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  document.title = '404 Not Found'
})
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  font-family: Arial, sans-serif;
}

.error-container {
  text-align: center;
  max-width: 600px;
  padding: 20px;
}

.error-code {
  font-size: 120px;
  font-weight: bold;
  margin: 0;
  color: #333333;
  line-height: 1;
}

.error-message {
  font-size: 36px;
  font-weight: normal;
  margin: 20px 0;
  color: #333333;
}

.error-description {
  font-size: 16px;
  color: #666666;
  margin: 20px 0;
  line-height: 1.5;
}

.divider {
  border: none;
  border-top: 1px solid #cccccc;
  margin: 30px 0;
}

.server-info {
  font-size: 14px;
  color: #999999;
  margin: 0;
}
</style>
