<template>
  <Layout>
    <div class="dashboard">
      <el-row :gutter="20">
        <!-- 统计卡片 -->
        <el-col :xs="24" :sm="12" :md="6" v-for="card in statCards" :key="card.title">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon" :style="{ background: card.color }">
                <el-icon :size="24"><component :is="card.icon" /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ card.value }}</div>
                <div class="stat-title">{{ card.title }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 20px">
        <!-- 快速操作 -->
        <el-col :xs="24" :md="12">
          <el-card header="快速操作">
            <div class="quick-actions">
              <el-button type="primary" @click="handleRunTask" :loading="taskRunning">
                <el-icon><Refresh /></el-icon>
                手动抓取消息
              </el-button>
              <el-button @click="$router.push('/projects')">
                <el-icon><Plus /></el-icon>
                创建新项目
              </el-button>
              <el-button @click="$router.push('/sources')">
                <el-icon><Link /></el-icon>
                添加信息源
              </el-button>
            </div>
          </el-card>
        </el-col>

        <!-- 系统状态 -->
        <el-col :xs="24" :md="12">
          <el-card header="系统状态">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="任务状态">
                <el-tag :type="taskStatus?.isRunning ? 'success' : 'info'">
                  {{ taskStatus?.isRunning ? '运行中' : '空闲' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="最后运行">
                {{ taskStatus?.lastRunTime ? formatTime(taskStatus.lastRunTime) : '从未运行' }}
              </el-descriptions-item>
              <el-descriptions-item label="总运行次数">
                {{ taskStatus?.stats?.totalRuns || 0 }}
              </el-descriptions-item>
              <el-descriptions-item label="已处理消息">
                {{ taskStatus?.stats?.messagesProcessed || 0 }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 20px">
        <!-- 最近项目 -->
        <el-col :xs="24" :md="12">
          <el-card header="最近项目">
            <el-empty v-if="projects.length === 0" description="暂无项目" />
            <div v-else class="recent-list">
              <div
                v-for="project in projects.slice(0, 5)"
                :key="project.id"
                class="recent-item"
                @click="$router.push(`/messages?project=${project.id}`)"
              >
                <div class="item-info">
                  <div class="item-title">{{ project.name }}</div>
                  <div class="item-desc">{{ project.description || '无描述' }}</div>
                </div>
                <el-tag size="small">优先级: {{ project.priority }}</el-tag>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 最近信息源 -->
        <el-col :xs="24" :md="12">
          <el-card header="最近信息源">
            <el-empty v-if="sources.length === 0" description="暂无信息源" />
            <div v-else class="recent-list">
              <div
                v-for="source in sources.slice(0, 5)"
                :key="source.id"
                class="recent-item"
              >
                <div class="item-info">
                  <div class="item-title">{{ source.name }}</div>
                  <div class="item-desc">{{ source.url }}</div>
                </div>
                <el-tag :type="source.enabled ? 'success' : 'info'" size="small">
                  {{ source.enabled ? '启用' : '禁用' }}
                </el-tag>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useProjectStore, useSourceStore, useSystemStore } from '../stores';
import { ElMessage } from 'element-plus';
import Layout from '../components/Layout.vue';

const projectStore = useProjectStore();
const sourceStore = useSourceStore();
const systemStore = useSystemStore();

const taskRunning = ref(false);

const projects = computed(() => projectStore.projects);
const sources = computed(() => sourceStore.sources);
const taskStatus = computed(() => systemStore.taskStatus);

const statCards = computed(() => [
  {
    title: '项目总数',
    value: projectStore.projects.length,
    icon: 'Folder',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    title: '信息源',
    value: sourceStore.sources.length,
    icon: 'Link',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    title: '总消息数',
    value: systemStore.stats.messages || 0,
    icon: 'Message',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    title: '已处理',
    value: taskStatus.value?.stats?.messagesProcessed || 0,
    icon: 'Check',
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  }
]);

const handleRunTask = async () => {
  taskRunning.value = true;

  try {
    const result = await systemStore.runTask();

    if (result.success) {
      ElMessage.success(`任务执行成功！处理了 ${result.processed} 条消息，创建了 ${result.created} 条消息。`);
      await loadData();
    } else {
      ElMessage.error(result.error || '任务执行失败');
    }
  } catch (error) {
    ElMessage.error('任务执行失败：' + error.message);
  } finally {
    taskRunning.value = false;
  }
};

const formatTime = (time) => {
  return new Date(time).toLocaleString('zh-CN');
};

const loadData = async () => {
  await Promise.all([
    projectStore.fetchProjects(),
    sourceStore.fetchSources(),
    systemStore.fetchSystemStats()
  ]);
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.dashboard {
  max-width: 1400px;
  margin: 0 auto;
}

.stat-card {
  margin-bottom: 20px;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 5px;
}

.stat-title {
  font-size: 14px;
  color: #909399;
}

.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.recent-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.recent-item:hover {
  border-color: #409eff;
  background: #ecf5ff;
}

.item-info {
  flex: 1;
  overflow: hidden;
}

.item-title {
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.item-desc {
  font-size: 12px;
  color: #909399;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
