<template>
  <div class="home">
    <div class="card">
      <h1>Hello World</h1>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.home {
  width: 100%;
  min-height: calc(100vh - 200px);
  background: #000000;
  padding: 40px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  max-width: 800px;
  width: 100%;
  text-align: center;
}

.card h1 {
  color: #ff69b4;
  font-size: 48px;
  margin: 0;
}
</style>
