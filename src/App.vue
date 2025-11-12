<template>
  <router-view />
  <TransformWidget />
</template>

<script setup>
// 根组件，使用 router-view 渲染路由页面
import { onMounted, onUnmounted } from 'vue';
import TransformWidget from './components/TransformWidget.vue';
import { useTransformStore } from './stores/transform';

const transformStore = useTransformStore();

// 监听转换应用事件
const handleApplyTransform = (event) => {
  const { dsl } = event.detail;
  transformStore.applyTransform(dsl);
};

// 监听撤销事件
const handleUndoTransform = (event) => {
  const { dsl } = event.detail;
  transformStore.undoTransform(dsl);
};

// 监听重置事件
const handleResetTransform = () => {
  transformStore.reset();
};

onMounted(() => {
  window.addEventListener('apply-transform', handleApplyTransform);
  window.addEventListener('undo-transform', handleUndoTransform);
  window.addEventListener('reset-transform', handleResetTransform);
});

onUnmounted(() => {
  window.removeEventListener('apply-transform', handleApplyTransform);
  window.removeEventListener('undo-transform', handleUndoTransform);
  window.removeEventListener('reset-transform', handleResetTransform);
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f5f7fa;
}

#app {
  width: 100%;
  min-height: 100vh;
}
</style>
