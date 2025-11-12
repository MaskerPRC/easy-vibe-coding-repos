<template>
  <Layout>
    <div class="messages-page">
      <div class="page-header">
        <h2>消息盒子</h2>
        <el-select v-model="selectedProjectId" placeholder="选择项目" style="width: 200px" @change="loadMessages">
          <el-option
            v-for="project in projects"
            :key="project.id"
            :label="project.name"
            :value="project.id"
          />
        </el-select>
      </div>

      <el-card v-if="selectedProjectId">
        <!-- 统计信息 -->
        <div class="stats-bar">
          <el-statistic title="总消息数" :value="stats.total" />
          <el-statistic title="未读消息" :value="stats.unread" />
          <el-statistic title="重要消息" :value="stats.important" />
        </div>

        <!-- 筛选器 -->
        <div class="filters">
          <el-radio-group v-model="filterType" @change="loadMessages">
            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button label="unread">未读</el-radio-button>
            <el-radio-button label="important">重要</el-radio-button>
          </el-radio-group>

          <el-slider
            v-model="minScore"
            :min="0"
            :max="100"
            style="width: 200px"
            @change="loadMessages"
          />
          <span style="margin-left: 10px; color: #909399">最低相关性: {{ minScore }}%</span>
        </div>

        <!-- 消息列表 -->
        <el-empty v-if="messages.length === 0" description="暂无消息" />

        <div v-else class="messages-list" v-loading="messageStore.loading">
          <div
            v-for="message in messages"
            :key="message.id"
            class="message-item"
            :class="{ unread: !message.isRead }"
          >
            <div class="message-header">
              <div class="message-title">
                <el-icon v-if="!message.isRead" color="#409eff"><Message /></el-icon>
                <el-icon v-if="message.isImportant" color="#f56c6c"><Star /></el-icon>
                <a :href="message.url" target="_blank" class="title-link">
                  {{ message.title }}
                </a>
              </div>
              <div class="message-actions">
                <el-tooltip content="标记为重要">
                  <el-button
                    :icon="message.isImportant ? 'StarFilled' : 'Star'"
                    :type="message.isImportant ? 'warning' : 'default'"
                    circle
                    size="small"
                    @click="toggleImportant(message)"
                  />
                </el-tooltip>
                <el-tooltip content="删除">
                  <el-button
                    icon="Delete"
                    circle
                    size="small"
                    @click="deleteMessage(message)"
                  />
                </el-tooltip>
              </div>
            </div>

            <div class="message-content">
              <p>{{ message.content?.substring(0, 200) }}...</p>
            </div>

            <div class="message-meta">
              <el-tag size="small">相关性: {{ (message.relevanceScore * 100).toFixed(0) }}%</el-tag>
              <span class="meta-item">作者: {{ message.author || '未知' }}</span>
              <span class="meta-item">{{ formatTime(message.publishedAt) }}</span>
            </div>

            <!-- 评分详情 -->
            <div class="scores-detail">
              <el-progress
                :percentage="Math.round(message.scores.topicMatch * 100)"
                :stroke-width="6"
                :format="() => `主题匹配: ${Math.round(message.scores.topicMatch * 100)}%`"
              />
              <el-progress
                :percentage="Math.round(message.scores.contextRelevance * 100)"
                :stroke-width="6"
                :format="() => `上下文: ${Math.round(message.scores.contextRelevance * 100)}%`"
              />
              <el-progress
                :percentage="Math.round(message.scores.actionability * 100)"
                :stroke-width="6"
                :format="() => `可操作性: ${Math.round(message.scores.actionability * 100)}%`"
              />
              <el-progress
                :percentage="Math.round(message.scores.urgency * 100)"
                :stroke-width="6"
                :format="() => `紧急度: ${Math.round(message.scores.urgency * 100)}%`"
              />
            </div>

            <div v-if="message.analysis" class="ai-analysis">
              <el-icon><ChatLineRound /></el-icon>
              <span>{{ message.analysis }}</span>
            </div>
          </div>
        </div>
      </el-card>

      <el-empty v-else description="请先选择一个项目" />
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useProjectStore, useMessageStore } from '../stores';
import { ElMessage, ElMessageBox } from 'element-plus';
import Layout from '../components/Layout.vue';

const route = useRoute();
const projectStore = useProjectStore();
const messageStore = useMessageStore();

const selectedProjectId = ref(null);
const filterType = ref('all');
const minScore = ref(0);

const projects = computed(() => projectStore.projects);
const messages = computed(() => messageStore.messages);
const stats = computed(() => messageStore.stats);

const loadMessages = async () => {
  if (!selectedProjectId.value) return;

  const filters = {};

  if (filterType.value === 'unread') filters.unread = 'true';
  if (filterType.value === 'important') filters.important = 'true';
  if (minScore.value > 0) filters.minScore = minScore.value / 100;

  await messageStore.fetchMessages(selectedProjectId.value, filters);
  await messageStore.fetchStats(selectedProjectId.value);
};

const toggleImportant = async (message) => {
  const result = await messageStore.markAsImportant(message.id, !message.isImportant);
  if (result.success) {
    ElMessage.success(message.isImportant ? '已取消重要标记' : '已标记为重要');
  }
};

const deleteMessage = async (message) => {
  try {
    await ElMessageBox.confirm('确定要删除这条消息吗？', '警告', { type: 'warning' });

    const result = await messageStore.deleteMessage(message.id);

    if (result.success) {
      ElMessage.success('消息已删除');
    } else {
      ElMessage.error('删除失败');
    }
  } catch {
    // 用户取消
  }
};

const formatTime = (time) => {
  return new Date(time).toLocaleString('zh-CN');
};

watch(selectedProjectId, () => {
  loadMessages();
});

onMounted(async () => {
  await projectStore.fetchProjects();

  // 从 URL 参数获取项目 ID
  const projectId = route.query.project;
  if (projectId) {
    selectedProjectId.value = parseInt(projectId);
  } else if (projects.value.length > 0) {
    selectedProjectId.value = projects.value[0].id;
  }
});
</script>

<style scoped>
.messages-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.stats-bar {
  display: flex;
  gap: 40px;
  margin-bottom: 20px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 4px;
}

.filters {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message-item {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 20px;
  background: white;
  transition: all 0.3s;
}

.message-item.unread {
  border-left: 4px solid #409eff;
  background: #ecf5ff;
}

.message-item:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.message-title {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
}

.title-link {
  color: #303133;
  text-decoration: none;
}

.title-link:hover {
  color: #409eff;
}

.message-actions {
  display: flex;
  gap: 5px;
}

.message-content {
  margin-bottom: 15px;
  color: #606266;
  line-height: 1.6;
}

.message-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
  font-size: 13px;
  color: #909399;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.scores-detail {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 15px;
}

.ai-analysis {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  background: #f0f9ff;
  border-radius: 4px;
  font-size: 14px;
  color: #606266;
}
</style>
