<template>
  <div class="theme-toggle-container">
    <button
      class="theme-toggle-button"
      @click="handleToggle"
      :aria-label="`当前主题: ${getModeLabel(themeMode)}`"
      :title="`点击切换主题 (当前: ${getModeLabel(themeMode)})`"
    >
      <transition name="icon-fade" mode="out-in">
        <svg
          v-if="themeMode === THEME_MODES.LIGHT"
          key="light"
          class="theme-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <!-- 太阳图标 -->
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>

        <svg
          v-else-if="themeMode === THEME_MODES.DARK"
          key="dark"
          class="theme-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <!-- 月亮图标 -->
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>

        <svg
          v-else
          key="auto"
          class="theme-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <!-- 自动图标 (笔记本电脑) -->
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      </transition>

      <span class="theme-label">{{ getModeLabel(themeMode) }}</span>
    </button>
  </div>
</template>

<script setup>
import { useTheme } from '../composables/useTheme';

const { themeMode, cycleTheme, THEME_MODES } = useTheme();

// 处理主题切换
const handleToggle = () => {
  cycleTheme();
};

// 获取模式标签
const getModeLabel = (mode) => {
  const labels = {
    [THEME_MODES.LIGHT]: '亮色',
    [THEME_MODES.DARK]: '暗色',
    [THEME_MODES.AUTO]: '自动'
  };
  return labels[mode] || '未知';
};
</script>

<style scoped>
.theme-toggle-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.theme-toggle-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--theme-toggle-bg);
  border: 2px solid var(--theme-toggle-border);
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--theme-toggle-shadow);
  font-size: 14px;
  font-weight: 500;
  color: var(--theme-toggle-text);
  outline: none;
}

.theme-toggle-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--theme-toggle-shadow-hover);
  background: var(--theme-toggle-bg-hover);
}

.theme-toggle-button:active {
  transform: translateY(0);
}

.theme-toggle-button:focus-visible {
  outline: 2px solid var(--theme-primary);
  outline-offset: 2px;
}

.theme-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-toggle-button:hover .theme-icon {
  transform: rotate(15deg);
}

.theme-label {
  user-select: none;
}

/* 图标切换动画 */
.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.icon-fade-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.8);
}

.icon-fade-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.8);
}

.icon-fade-enter-to,
.icon-fade-leave-from {
  opacity: 1;
  transform: rotate(0deg) scale(1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .theme-toggle-container {
    top: 10px;
    right: 10px;
  }

  .theme-toggle-button {
    padding: 8px 12px;
    font-size: 12px;
  }

  .theme-icon {
    width: 18px;
    height: 18px;
  }

  .theme-label {
    display: none;
  }
}
</style>
