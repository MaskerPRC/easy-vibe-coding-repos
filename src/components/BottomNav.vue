<template>
  <div class="bottom-nav">
    <div
      v-for="item in navItems"
      :key="item.path"
      :class="['nav-item', { active: currentPath === item.path }]"
      @click="navigate(item.path)"
    >
      <div class="nav-icon">{{ item.icon }}</div>
      <div class="nav-label">{{ item.label }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const navItems = [
  { path: '/piecework', label: '计件', icon: '件' },
  { path: '/timework', label: '计时', icon: '时' },
  { path: '/statistics', label: '统计', icon: '统' },
  { path: '/profile', label: '我的', icon: '我' }
];

const currentPath = computed(() => route.path);

const navigate = (path) => {
  router.push(path);
};
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: #FFFFFF;
  border-top: 1px solid #E0E0E0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1000;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 6px 0;
}

.nav-item:active {
  background: #F8F8F8;
}

.nav-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
  transition: all 0.3s ease;
  background: #F2F2F2;
  color: #666666;
}

.nav-item.active .nav-icon {
  background: #1A73E8;
  color: #FFFFFF;
}

.nav-label {
  font-size: 12px;
  color: #666666;
  transition: all 0.3s ease;
}

.nav-item.active .nav-label {
  color: #1A73E8;
  font-weight: 600;
}

@media (max-width: 480px) {
  .bottom-nav {
    height: 52px;
  }

  .nav-icon {
    width: 26px;
    height: 26px;
    font-size: 14px;
  }

  .nav-label {
    font-size: 11px;
  }
}
</style>
