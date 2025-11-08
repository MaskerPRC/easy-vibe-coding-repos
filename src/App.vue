<template>
  <div class="app">
    <header class="header">
      <h1>应用项目</h1>
      <p>这是一个基础的 Vue + Vite 应用（前后端分离）</p>

      <nav class="nav">
        <button
          @click="currentPage = 'home'"
          :class="{ active: currentPage === 'home' }"
          class="nav-btn"
        >
          首页
        </button>
        <button
          @click="currentPage = 'digital-nomad'"
          :class="{ active: currentPage === 'digital-nomad' }"
          class="nav-btn"
        >
          数字游民生活
        </button>
      </nav>
    </header>
    <main class="main">
      <component :is="currentComponent" />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Home from './views/Home.vue';
import DigitalNomad from './views/DigitalNomad.vue';

const currentPage = ref('home');

const currentComponent = computed(() => {
  return currentPage.value === 'home' ? Home : DigitalNomad;
});
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: black;
  color: white;
}

.header {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header h1 {
  font-size: 48px;
  margin-bottom: 10px;
}

.header p {
  font-size: 18px;
  opacity: 0.9;
  margin-bottom: 30px;
}

.nav {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px 0 0 0;
}

.nav-btn {
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 600;
  border: 2px solid white;
  background: transparent;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.nav-btn:hover {
  background: white;
  color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.nav-btn.active {
  background: white;
  color: #667eea;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.main {
  max-width: 100%;
  margin: 0;
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 32px;
  }

  .header p {
    font-size: 16px;
  }

  .nav {
    flex-direction: column;
    align-items: center;
  }

  .nav-btn {
    width: 200px;
  }
}
</style>

