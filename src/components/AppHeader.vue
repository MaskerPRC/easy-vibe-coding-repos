<template>
  <header class="header">
    <div class="container">
      <h1 class="logo">商业规划框架</h1>
      <nav class="nav">
        <button
          @click="$emit('tab-change', 'framework')"
          :class="['nav-btn', { active: currentTab === 'framework' }]"
        >
          核心框架
        </button>
        <button
          @click="$emit('tab-change', 'notes')"
          :class="['nav-btn', { active: currentTab === 'notes' }]"
        >
          详细笔记
        </button>
        <button
          @click="$emit('tab-change', 'investor')"
          :class="['nav-btn', { active: currentTab === 'investor' }]"
        >
          投资人视角
        </button>
        <button
          @click="$emit('tab-change', 'template')"
          :class="['nav-btn', { active: currentTab === 'template' }]"
        >
          一页纸模板
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup>
// 定义props
defineProps({
  currentTab: {
    type: String,
    required: true
  }
});

// 定义事件
defineEmits(['tab-change']);
</script>

<style scoped>
.header {
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: #2980B9;
  letter-spacing: 1px;
  margin: 0;
}

.nav {
  display: flex;
  gap: 8px;
}

.nav-btn {
  padding: 10px 20px;
  border: none;
  background: transparent;
  color: #666666;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: #F0F0F0;
  color: #2980B9;
}

.nav-btn.active {
  background: #2980B9;
  color: #ffffff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
    gap: 16px;
  }

  .logo {
    font-size: 20px;
  }

  .nav {
    width: 100%;
    justify-content: center;
  }

  .nav-btn {
    padding: 8px 16px;
    font-size: 14px;
  }
}
</style>
