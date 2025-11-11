<template>
  <div class="app">
    <!-- 顶部导航 -->
    <AppHeader :currentTab="currentTab" @tab-change="handleTabChange" />

    <!-- 主体内容 -->
    <main class="main">
      <div class="container">
        <!-- 核心框架标签页 -->
        <FrameworkTab v-show="currentTab === 'framework'" />

        <!-- 详细笔记标签页 -->
        <NotesTab v-show="currentTab === 'notes'" />

        <!-- 投资人视角标签页 -->
        <InvestorTab v-show="currentTab === 'investor'" />

        <!-- 一页纸模板标签页 -->
        <TemplateTab v-show="currentTab === 'template'" />
      </div>
    </main>

    <!-- 页脚 -->
    <AppFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
import FrameworkTab from '@/components/FrameworkTab.vue';
import NotesTab from '@/components/NotesTab.vue';
import InvestorTab from '@/components/InvestorTab.vue';
import TemplateTab from '@/components/TemplateTab.vue';

// 当前标签页
const currentTab = ref('framework');

// 处理标签页切换
const handleTabChange = (tab) => {
  currentTab.value = tab;
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: #F8F8F8;
  font-family: 'PingFang SC', 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
}

/* 主体内容 */
.main {
  padding: 40px 0 80px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}
</style>
