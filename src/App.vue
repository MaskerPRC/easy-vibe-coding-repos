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

/* ==================== CSS 变量定义 - 亮色主题 (Google Material Design) ==================== */
:root,
.theme-light {
  /* Google 主色调 */
  --theme-primary: #4285f4;
  --theme-primary-dark: #1967d2;
  --theme-primary-light: #8ab4f8;

  /* Google 辅助色 */
  --theme-red: #ea4335;
  --theme-yellow: #fbbc04;
  --theme-green: #34a853;

  /* 背景色 - Google 风格 */
  --theme-bg-primary: #ffffff;
  --theme-bg-secondary: #f8f9fa;
  --theme-bg-tertiary: #e8eaed;

  /* 文字颜色 - Google 风格 */
  --theme-text-primary: #202124;
  --theme-text-secondary: #5f6368;
  --theme-text-tertiary: #80868b;

  /* 边框颜色 */
  --theme-border-primary: #dadce0;
  --theme-border-secondary: #e8eaed;

  /* Material Design 阴影 */
  --theme-shadow-sm: 0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
  --theme-shadow-md: 0 1px 3px 0 rgba(60, 64, 67, 0.3), 0 4px 8px 3px rgba(60, 64, 67, 0.15);
  --theme-shadow-lg: 0 2px 6px 2px rgba(60, 64, 67, 0.15), 0 8px 24px 4px rgba(60, 64, 67, 0.15);

  /* 主题切换按钮 */
  --theme-toggle-bg: #ffffff;
  --theme-toggle-bg-hover: #f8f9fa;
  --theme-toggle-border: #dadce0;
  --theme-toggle-text: #202124;
  --theme-toggle-shadow: 0 1px 3px 0 rgba(60, 64, 67, 0.3), 0 4px 8px 3px rgba(60, 64, 67, 0.15);
  --theme-toggle-shadow-hover: 0 2px 6px 2px rgba(60, 64, 67, 0.15), 0 8px 24px 4px rgba(60, 64, 67, 0.15);

  /* Google 状态颜色 */
  --theme-success: #34a853;
  --theme-warning: #fbbc04;
  --theme-error: #ea4335;
  --theme-info: #4285f4;

  /* 卡片样式 */
  --theme-card-bg: #ffffff;
  --theme-card-border: #dadce0;

  /* 输入框样式 */
  --theme-input-bg: #ffffff;
  --theme-input-border: #dadce0;
  --theme-input-border-focus: #4285f4;
  --theme-input-text: #202124;
  --theme-input-placeholder: #80868b;
}

/* ==================== CSS 变量定义 - 暗色主题 (Google Material Design Dark) ==================== */
.theme-dark {
  /* Google 主色调 - 暗色模式 */
  --theme-primary: #8ab4f8;
  --theme-primary-dark: #4285f4;
  --theme-primary-light: #aecbfa;

  /* Google 辅助色 - 暗色模式 */
  --theme-red: #f28b82;
  --theme-yellow: #fdd663;
  --theme-green: #81c995;

  /* 背景色 - Google 暗色风格 */
  --theme-bg-primary: #202124;
  --theme-bg-secondary: #292a2d;
  --theme-bg-tertiary: #35363a;

  /* 文字颜色 - Google 暗色风格 */
  --theme-text-primary: #e8eaed;
  --theme-text-secondary: #9aa0a6;
  --theme-text-tertiary: #5f6368;

  /* 边框颜色 */
  --theme-border-primary: #3c4043;
  --theme-border-secondary: #5f6368;

  /* Material Design 暗色阴影 */
  --theme-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3), 0 1px 3px 1px rgba(0, 0, 0, 0.15);
  --theme-shadow-md: 0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 4px 8px 3px rgba(0, 0, 0, 0.15);
  --theme-shadow-lg: 0 2px 6px 2px rgba(0, 0, 0, 0.15), 0 8px 24px 4px rgba(0, 0, 0, 0.15);

  /* 主题切换按钮 */
  --theme-toggle-bg: #292a2d;
  --theme-toggle-bg-hover: #35363a;
  --theme-toggle-border: #3c4043;
  --theme-toggle-text: #e8eaed;
  --theme-toggle-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 4px 8px 3px rgba(0, 0, 0, 0.15);
  --theme-toggle-shadow-hover: 0 2px 6px 2px rgba(0, 0, 0, 0.15), 0 8px 24px 4px rgba(0, 0, 0, 0.15);

  /* Google 状态颜色 - 暗色模式 */
  --theme-success: #81c995;
  --theme-warning: #fdd663;
  --theme-error: #f28b82;
  --theme-info: #8ab4f8;

  /* 卡片样式 */
  --theme-card-bg: #292a2d;
  --theme-card-border: #3c4043;

  /* 输入框样式 */
  --theme-input-bg: #292a2d;
  --theme-input-border: #3c4043;
  --theme-input-border-focus: #8ab4f8;
  --theme-input-text: #e8eaed;
  --theme-input-placeholder: #9aa0a6;
}

/* ==================== 主题过渡动画 ==================== */
html {
  transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ==================== 全局样式 (Google Material Design) ==================== */
body {
  font-family: 'Google Sans', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: var(--theme-bg-secondary);
  color: var(--theme-text-primary);
  transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
  background: var(--theme-bg-secondary);
  color: var(--theme-text-primary);
  transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ==================== 通用工具类 (Google Material Design) ==================== */
.card {
  background: var(--theme-card-bg);
  border: 1px solid var(--theme-card-border);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--theme-shadow-sm);
}

.card:hover {
  box-shadow: var(--theme-shadow-md);
  transform: translateY(-2px);
}

.button-primary {
  background: var(--theme-primary);
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 24px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0.25px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--theme-shadow-sm);
}

.button-primary:hover {
  background: var(--theme-primary-dark);
  box-shadow: var(--theme-shadow-md);
}

.button-primary:active {
  transform: scale(0.98);
}

.input {
  background: var(--theme-input-bg);
  border: 1px solid var(--theme-input-border);
  color: var(--theme-input-text);
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.input:focus {
  outline: none;
  border-color: var(--theme-input-border-focus);
  box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
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
