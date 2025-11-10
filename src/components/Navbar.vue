<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-brand" @click="goHome">
        <span class="brand-icon">💊</span>
        <span class="brand-text">药理知识库</span>
      </div>
      <div class="nav-menu">
        <router-link to="/" class="nav-link">首页</router-link>
        <a href="#about" class="nav-link">关于</a>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>

<style scoped>
.navbar {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.nav-brand:hover {
  opacity: 0.8;
}

.brand-icon {
  font-size: 28px;
}

.brand-text {
  font-size: 20px;
  font-weight: 700;
  color: #2f80ed;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.nav-menu {
  display: flex;
  gap: 24px;
  align-items: center;
}

.nav-link {
  color: #333333;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s;
  font-family: 'Microsoft YaHei', sans-serif;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: #f0f0f0;
  color: #2f80ed;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .nav-container {
    padding: 12px 16px;
  }

  .brand-text {
    font-size: 16px;
  }

  .brand-icon {
    font-size: 24px;
  }

  .nav-menu {
    gap: 12px;
  }

  .nav-link {
    font-size: 14px;
    padding: 6px 12px;
  }
}
</style>
