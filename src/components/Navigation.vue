<template>
  <nav class="navigation">
    <div class="nav-container">
      <div class="nav-logo">
        <router-link to="/">蔡徐坤个人站</router-link>
      </div>
      <ul class="nav-menu" :class="{ 'active': mobileMenuOpen }">
        <li><router-link to="/" @click="closeMobileMenu">首页</router-link></li>
        <li><router-link to="/achievements" @click="closeMobileMenu">事迹</router-link></li>
        <li><router-link to="/timeline" @click="closeMobileMenu">成长历程</router-link></li>
        <li><router-link to="/fans" @click="closeMobileMenu">粉丝生态</router-link></li>
      </ul>
      <div class="nav-right">
        <MusicPlayer />
        <div class="nav-mobile-toggle" @click="toggleMobileMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import MusicPlayer from './MusicPlayer.vue';

const mobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};
</script>

<style scoped>
.navigation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

.nav-logo a {
  font-size: 20px;
  font-weight: 700;
  color: #007AFF;
  text-decoration: none;
  transition: color 0.3s;
}

.nav-logo a:hover {
  color: #FFD700;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 32px;
  margin: 0;
  padding: 0;
}

.nav-menu li a {
  color: #333333;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  transition: color 0.3s;
  position: relative;
}

.nav-menu li a:hover {
  color: #007AFF;
}

.nav-menu li a.router-link-active {
  color: #007AFF;
}

.nav-menu li a.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  right: 0;
  height: 3px;
  background: #007AFF;
  border-radius: 2px;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-mobile-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
}

.nav-mobile-toggle span {
  width: 25px;
  height: 3px;
  background: #333333;
  transition: all 0.3s;
  border-radius: 2px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .nav-mobile-toggle {
    display: flex;
  }

  .nav-menu {
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.98);
    flex-direction: column;
    padding: 24px;
    gap: 16px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-100%);
    opacity: 0;
    transition: all 0.3s;
    pointer-events: none;
  }

  .nav-menu.active {
    transform: translateY(0);
    opacity: 1;
    pointer-events: all;
  }

  .nav-menu li a.router-link-active::after {
    bottom: -4px;
  }
}
</style>
