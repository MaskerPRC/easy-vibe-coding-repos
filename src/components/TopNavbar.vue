<template>
  <!-- 顶部导航栏 -->
  <header class="top-navbar">
    <div class="navbar-container">
      <div class="navbar-left">
        <h1 class="brand-logo">AIverse</h1>
      </div>
      <nav class="navbar-right">
        <a href="#analytics" class="nav-link">Analytics</a>
        <a href="#submit" @click.prevent="$emit('open-submit-modal')" class="nav-link">Submit Tool</a>
        <a href="#login" class="nav-link">Login / Register</a>
        <a href="#subscribe" class="nav-link nav-link-subscribe">Subscribe</a>
      </nav>
      <!-- 移动端汉堡菜单 -->
      <button class="mobile-menu-btn" @click="$emit('toggle-mobile-menu')">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </header>
</template>

<script setup>
// 组件事件定义
defineEmits(['open-submit-modal', 'toggle-mobile-menu']);
</script>

<style scoped>
/* 顶部导航栏 */
.top-navbar {
  background: #FFFFFF;
  border-bottom: 1px solid #E0E0E0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.brand-logo {
  font-family: 'Poppins', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #4A90E2;
  margin: 0;
  cursor: pointer;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-link {
  font-size: 15px;
  font-weight: 500;
  color: #333333;
  text-decoration: none;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #4A90E2;
}

.nav-link-subscribe {
  background: #4A90E2;
  color: #FFFFFF;
  padding: 8px 20px;
  border-radius: 6px;
  transition: background 0.2s;
}

.nav-link-subscribe:hover {
  background: #3a7bc8;
  color: #FFFFFF;
}

.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}

.mobile-menu-btn span {
  width: 24px;
  height: 2px;
  background: #333333;
  transition: all 0.3s;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .navbar-right {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
  }
}

@media (max-width: 480px) {
  .brand-logo {
    font-size: 24px;
  }

  .navbar-container {
    padding: 0 16px;
  }
}
</style>
