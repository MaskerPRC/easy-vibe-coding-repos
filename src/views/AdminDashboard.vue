<template>
  <div class="admin-dashboard">
    <!-- 顶部导航栏 -->
    <header class="admin-header">
      <div class="header-left">
        <h1 class="logo">网站管理系统</h1>
      </div>
      <div class="header-right">
        <span class="admin-name">管理员：{{ adminName }}</span>
        <button class="logout-btn" @click="handleLogout">退出</button>
      </div>
    </header>

    <div class="admin-body">
      <!-- 侧边栏 -->
      <aside class="sidebar">
        <nav class="sidebar-nav">
          <div
            v-for="item in menuItems"
            :key="item.id"
            :class="['menu-item', { active: activeMenu === item.id }]"
            @click="activeMenu = item.id"
          >
            <span class="menu-icon">{{ item.icon }}</span>
            <span class="menu-text">{{ item.text }}</span>
          </div>
        </nav>
      </aside>

      <!-- 主内容区 -->
      <main class="main-content">
        <!-- 数据统计卡片 -->
        <div class="stats-grid">
          <div class="stat-card" v-for="stat in stats" :key="stat.label">
            <div class="stat-icon" :style="{ background: stat.color }">
              {{ stat.icon }}
            </div>
            <div class="stat-info">
              <div class="stat-label">{{ stat.label }}</div>
              <div class="stat-value">{{ stat.value }}</div>
            </div>
          </div>
        </div>

        <!-- 数据表格 -->
        <div class="data-table-section">
          <div class="section-header">
            <h2>{{ tableTitle }}</h2>
            <button class="refresh-btn" @click="refreshData">刷新数据</button>
          </div>

          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>标题</th>
                <th>状态</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in tableData" :key="item.id">
                <td>{{ item.id }}</td>
                <td>{{ item.title }}</td>
                <td>
                  <span :class="['status-badge', item.status]">
                    {{ getStatusText(item.status) }}
                  </span>
                </td>
                <td>{{ item.createTime }}</td>
                <td>
                  <button class="action-btn edit">编辑</button>
                  <button class="action-btn delete">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 最近活动 -->
        <div class="activity-section">
          <h3>最近活动</h3>
          <div class="activity-list">
            <div class="activity-item" v-for="activity in activities" :key="activity.id">
              <div class="activity-dot"></div>
              <div class="activity-content">
                <div class="activity-text">{{ activity.text }}</div>
                <div class="activity-time">{{ activity.time }}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const adminName = ref('Admin');
const activeMenu = ref('dashboard');

const menuItems = ref([
  { id: 'dashboard', icon: '📊', text: '仪表盘' },
  { id: 'content', icon: '📝', text: '内容管理' },
  { id: 'users', icon: '👥', text: '用户管理' },
  { id: 'comments', icon: '💬', text: '评论管理' },
  { id: 'settings', icon: '⚙️', text: '系统设置' },
  { id: 'analytics', icon: '📈', text: '数据分析' },
  { id: 'plugins', icon: '🔌', text: '插件管理' },
  { id: 'logs', icon: '📋', text: '系统日志' }
]);

const stats = ref([
  { label: '总访问量', value: '12,345', icon: '👁️', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { label: '总用户数', value: '3,456', icon: '👤', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { label: '今日新增', value: '89', icon: '📈', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { label: '待审核', value: '23', icon: '⏰', color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }
]);

const tableData = ref([
  { id: 1001, title: '系统公告：网站维护通知', status: 'published', createTime: '2025-11-08 14:23' },
  { id: 1002, title: '用户反馈处理报告', status: 'draft', createTime: '2025-11-08 12:15' },
  { id: 1003, title: '新功能发布说明', status: 'published', createTime: '2025-11-07 18:30' },
  { id: 1004, title: '安全漏洞修复记录', status: 'archived', createTime: '2025-11-06 09:45' },
  { id: 1005, title: '数据备份操作日志', status: 'published', createTime: '2025-11-05 16:20' }
]);

const activities = ref([
  { id: 1, text: '管理员 Admin 登录系统', time: '2分钟前' },
  { id: 2, text: '新用户注册：user_2025', time: '15分钟前' },
  { id: 3, text: '文章《系统更新》已发布', time: '1小时前' },
  { id: 4, text: '评论审核通过 3 条', time: '2小时前' },
  { id: 5, text: '系统自动备份完成', time: '3小时前' }
]);

const tableTitle = ref('内容管理');

const getStatusText = (status) => {
  const statusMap = {
    published: '已发布',
    draft: '草稿',
    archived: '已归档'
  };
  return statusMap[status] || status;
};

const handleLogout = () => {
  alert('退出登录功能（演示）');
};

const refreshData = () => {
  alert('刷新数据功能（演示）');
};

onMounted(() => {
  // 初始化数据
  console.log('管理后台已加载');
});
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: #f0f2f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* 顶部导航栏 */
.admin-header {
  background: #fff;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  font-size: 20px;
  font-weight: 600;
  color: #1890ff;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.admin-name {
  color: #666;
  font-size: 14px;
}

.logout-btn {
  padding: 6px 16px;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.logout-btn:hover {
  color: #1890ff;
  border-color: #1890ff;
}

/* 主体布局 */
.admin-body {
  display: flex;
  min-height: calc(100vh - 60px);
}

/* 侧边栏 */
.sidebar {
  width: 220px;
  background: #001529;
  padding: 16px 0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  color: rgba(255, 255, 255, 0.65);
  cursor: pointer;
  transition: all 0.3s;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.menu-item.active {
  background: #1890ff;
  color: #fff;
}

.menu-icon {
  font-size: 18px;
  margin-right: 12px;
}

.menu-text {
  font-size: 14px;
}

/* 主内容区 */
.main-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

/* 数据统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

/* 数据表格 */
.data-table-section {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.refresh-btn {
  padding: 6px 16px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.refresh-btn:hover {
  background: #40a9ff;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background: #fafafa;
}

.data-table th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #f0f0f0;
  font-size: 14px;
}

.data-table td {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
  color: #666;
}

.data-table tbody tr:hover {
  background: #fafafa;
}

.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status-badge.published {
  background: #e6f7ff;
  color: #1890ff;
}

.status-badge.draft {
  background: #fff7e6;
  color: #fa8c16;
}

.status-badge.archived {
  background: #f0f0f0;
  color: #999;
}

.action-btn {
  padding: 4px 12px;
  border: 1px solid #d9d9d9;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-right: 8px;
  transition: all 0.3s;
}

.action-btn.edit:hover {
  color: #1890ff;
  border-color: #1890ff;
}

.action-btn.delete:hover {
  color: #ff4d4f;
  border-color: #ff4d4f;
}

/* 最近活动 */
.activity-section {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.activity-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.activity-dot {
  width: 8px;
  height: 8px;
  background: #1890ff;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.activity-time {
  font-size: 12px;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .admin-body {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
