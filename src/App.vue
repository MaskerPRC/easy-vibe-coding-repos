<template>
  <div id="app">
    <ThemeToggle />
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import ThemeToggle from './components/ThemeToggle.vue';
import { useTheme } from './composables/useTheme';

const { initTheme } = useTheme();

// 初始化主题
onMounted(() => {
  initTheme();
});
</script>

<style>
/* ==================== 全局重置 ==================== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* ==================== CSS 变量定义 - 亮色主题 ==================== */
:root,
.theme-light {
  /* 主色调 */
  --theme-primary: #3b82f6;
  --theme-primary-dark: #2563eb;
  --theme-primary-light: #60a5fa;

  /* 背景色 */
  --theme-bg-primary: #ffffff;
  --theme-bg-secondary: #f5f5f5;
  --theme-bg-tertiary: #e5e7eb;

  /* 文字颜色 */
  --theme-text-primary: #1f2937;
  --theme-text-secondary: #6b7280;
  --theme-text-tertiary: #9ca3af;

  /* 边框颜色 */
  --theme-border-primary: #e5e7eb;
  --theme-border-secondary: #d1d5db;

  /* 阴影 */
  --theme-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --theme-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --theme-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

  /* 主题切换按钮 */
  --theme-toggle-bg: #ffffff;
  --theme-toggle-bg-hover: #f9fafb;
  --theme-toggle-border: #e5e7eb;
  --theme-toggle-text: #1f2937;
  --theme-toggle-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --theme-toggle-shadow-hover: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

  /* 成功/警告/错误颜色 */
  --theme-success: #10b981;
  --theme-warning: #f59e0b;
  --theme-error: #ef4444;
  --theme-info: #3b82f6;

  /* 卡片样式 */
  --theme-card-bg: #ffffff;
  --theme-card-border: #e5e7eb;

  /* 输入框样式 */
  --theme-input-bg: #ffffff;
  --theme-input-border: #d1d5db;
  --theme-input-border-focus: #3b82f6;
  --theme-input-text: #1f2937;
  --theme-input-placeholder: #9ca3af;
}

/* ==================== CSS 变量定义 - 暗色主题 ==================== */
.theme-dark {
  /* 主色调 */
  --theme-primary: #60a5fa;
  --theme-primary-dark: #3b82f6;
  --theme-primary-light: #93c5fd;

  /* 背景色 */
  --theme-bg-primary: #1f2937;
  --theme-bg-secondary: #111827;
  --theme-bg-tertiary: #374151;

  /* 文字颜色 */
  --theme-text-primary: #f9fafb;
  --theme-text-secondary: #d1d5db;
  --theme-text-tertiary: #9ca3af;

  /* 边框颜色 */
  --theme-border-primary: #374151;
  --theme-border-secondary: #4b5563;

  /* 阴影 */
  --theme-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --theme-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
  --theme-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4);

  /* 主题切换按钮 */
  --theme-toggle-bg: #374151;
  --theme-toggle-bg-hover: #4b5563;
  --theme-toggle-border: #4b5563;
  --theme-toggle-text: #f9fafb;
  --theme-toggle-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
  --theme-toggle-shadow-hover: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4);

  /* 成功/警告/错误颜色 */
  --theme-success: #34d399;
  --theme-warning: #fbbf24;
  --theme-error: #f87171;
  --theme-info: #60a5fa;

  /* 卡片样式 */
  --theme-card-bg: #374151;
  --theme-card-border: #4b5563;

  /* 输入框样式 */
  --theme-input-bg: #374151;
  --theme-input-border: #4b5563;
  --theme-input-border-focus: #60a5fa;
  --theme-input-text: #f9fafb;
  --theme-input-placeholder: #9ca3af;
}

/* ==================== 主题过渡动画 ==================== */
html {
  transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ==================== 全局样式 ==================== */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: var(--theme-bg-secondary);
  color: var(--theme-text-primary);
  transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

#app {
  min-height: 100vh;
  background: var(--theme-bg-secondary);
  color: var(--theme-text-primary);
  transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ==================== 通用工具类 ==================== */
.card {
  background: var(--theme-card-bg);
  border: 1px solid var(--theme-card-border);
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  box-shadow: var(--theme-shadow-md);
}

.button-primary {
  background: var(--theme-primary);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.button-primary:hover {
  background: var(--theme-primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--theme-shadow-md);
}

.input {
  background: var(--theme-input-bg);
  border: 1px solid var(--theme-input-border);
  color: var(--theme-input-text);
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.input:focus {
  outline: none;
  border-color: var(--theme-input-border-focus);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input::placeholder {
  color: var(--theme-input-placeholder);
}

/* ==================== 滚动条样式 ==================== */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--theme-bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--theme-border-secondary);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--theme-text-tertiary);
}

/* ==================== 选中文本样式 ==================== */
::selection {
  background: var(--theme-primary);
  color: white;
}

::-moz-selection {
  background: var(--theme-primary);
  color: white;
}
</style>
