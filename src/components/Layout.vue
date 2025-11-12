<template>
  <div class="layout-container">
    <!-- 侧边栏 -->
    <el-aside :width="collapsed ? '64px' : '240px'" class="sidebar">
      <div class="logo">
        <el-icon v-if="!collapsed" size="32"><DataAnalysis /></el-icon>
        <span v-if="!collapsed" class="logo-text">AI 新闻系统</span>
        <el-icon v-else size="24"><DataAnalysis /></el-icon>
      </div>

      <el-menu
        :default-active="currentRoute"
        :collapse="collapsed"
        :collapse-transition="false"
        router
      >
        <el-menu-item index="/">
          <el-icon><Odometer /></el-icon>
          <template #title>仪表盘</template>
        </el-menu-item>

        <el-menu-item index="/projects">
          <el-icon><Folder /></el-icon>
          <template #title>项目管理</template>
        </el-menu-item>

        <el-menu-item index="/sources">
          <el-icon><Link /></el-icon>
          <template #title>信息源</template>
        </el-menu-item>

        <el-menu-item index="/messages">
          <el-icon><Message /></el-icon>
          <template #title>消息盒子</template>
          <el-badge
            v-if="messageStats.unread > 0"
            :value="messageStats.unread"
            :max="99"
            class="badge"
          />
        </el-menu-item>

        <el-menu-item index="/statistics">
          <el-icon><TrendCharts /></el-icon>
          <template #title>统计分析</template>
        </el-menu-item>

        <el-menu-item index="/transform-monitor">
          <el-icon><Monitor /></el-icon>
          <template #title>站点转换监控</template>
        </el-menu-item>

        <el-menu-item index="/settings">
          <el-icon><Setting /></el-icon>
          <template #title>系统设置</template>
        </el-menu-item>
      </el-menu>

      <div class="sidebar-footer">
        <el-button
          :icon="collapsed ? Expand : Fold"
          circle
          @click="collapsed = !collapsed"
        />
      </div>
    </el-aside>

    <!-- 主内容区域 -->
    <el-container class="main-container">
      <!-- 顶部栏 -->
      <el-header class="header">
        <div class="header-left">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="breadcrumb">{{ breadcrumb }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="header-right">
          <el-button :icon="Refresh" circle @click="handleRefresh" />

          <el-dropdown @command="handleUserCommand">
            <div class="user-info">
              <el-avatar :src="user?.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" />
              <span class="username">{{ user?.username || '用户' }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>
                  个人信息
                </el-dropdown-item>
                <el-dropdown-item command="logout" divided>
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 内容区域 -->
      <el-main class="content">
        <slot />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore, useMessageStore } from '../stores';
import { ElMessage } from 'element-plus';
import { Fold, Expand } from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const messageStore = useMessageStore();

const collapsed = ref(false);
const messageStats = ref({ total: 0, unread: 0, important: 0 });

const currentRoute = computed(() => route.path);
const user = computed(() => userStore.user);

const breadcrumb = computed(() => {
  const map = {
    '/': '',
    '/projects': '项目管理',
    '/sources': '信息源管理',
    '/messages': '消息盒子',
    '/statistics': '统计分析',
    '/transform-monitor': '站点转换监控',
    '/settings': '系统设置'
  };
  return map[route.path] || '';
});

const handleRefresh = () => {
  ElMessage.success('刷新成功');
  location.reload();
};

const handleUserCommand = (command) => {
  if (command === 'logout') {
    userStore.logout();
    router.push('/login');
    ElMessage.success('已退出登录');
  } else if (command === 'profile') {
    ElMessage.info('个人信息功能开发中');
  }
};

onMounted(() => {
  if (!user.value) {
    userStore.fetchUser();
  }
});
</script>

<style scoped>
.layout-container {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  background: #001529;
  color: white;
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: white;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-text {
  white-space: nowrap;
}

.el-menu {
  flex: 1;
  border: none;
  background: transparent;
}

.sidebar-footer {
  padding: 15px;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header {
  background: white;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-left {
  flex: 1;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background 0.3s;
}

.user-info:hover {
  background: #f5f5f5;
}

.username {
  font-size: 14px;
}

.content {
  background: #f5f7fa;
  padding: 20px;
  overflow-y: auto;
}

.badge {
  position: absolute;
  right: 20px;
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1000;
  }

  .header-left {
    display: none;
  }

  .username {
    display: none;
  }
}
</style>
