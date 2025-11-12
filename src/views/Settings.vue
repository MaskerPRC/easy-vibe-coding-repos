<template>
  <Layout>
    <div class="settings-page">
      <div class="page-header">
        <h2>系统设置</h2>
      </div>

      <el-row :gutter="20">
        <!-- AI 配置 -->
        <el-col :xs="24" :lg="12">
          <el-card header="AI 配置">
            <el-alert
              type="info"
              :closable="false"
              style="margin-bottom: 20px"
            >
              配置 OpenAI API 以启用智能消息分析功能
            </el-alert>

            <el-form :model="aiForm" label-width="120px">
              <el-form-item label="API Key">
                <el-input
                  v-model="aiForm.apiKey"
                  type="password"
                  placeholder="sk-..."
                  show-password
                />
              </el-form-item>

              <el-form-item label="API 端点">
                <el-input
                  v-model="aiForm.apiEndpoint"
                  placeholder="https://api.openai.com/v1/chat/completions"
                />
              </el-form-item>

              <el-form-item label="模型">
                <el-select v-model="aiForm.model" style="width: 100%">
                  <el-option label="gpt-3.5-turbo" value="gpt-3.5-turbo" />
                  <el-option label="gpt-4" value="gpt-4" />
                  <el-option label="gpt-4-turbo" value="gpt-4-turbo" />
                </el-select>
              </el-form-item>

              <el-form-item label="状态">
                <el-tag :type="aiConfig?.enabled ? 'success' : 'info'">
                  {{ aiConfig?.enabled ? '已启用' : '未启用' }}
                </el-tag>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="saveAIConfig" :loading="saving">
                  保存配置
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>

        <!-- GitHub OAuth 配置 -->
        <el-col :xs="24" :lg="12">
          <el-card header="GitHub OAuth 配置">
            <el-alert
              type="warning"
              :closable="false"
              style="margin-bottom: 20px"
            >
              GitHub OAuth 需要在 GitHub 上创建 OAuth App 并配置环境变量
            </el-alert>

            <el-descriptions :column="1" border>
              <el-descriptions-item label="Client ID">
                需配置环境变量 GITHUB_CLIENT_ID
              </el-descriptions-item>
              <el-descriptions-item label="Client Secret">
                需配置环境变量 GITHUB_CLIENT_SECRET
              </el-descriptions-item>
              <el-descriptions-item label="Callback URL">
                http://localhost:5173/auth/github/callback
              </el-descriptions-item>
              <el-descriptions-item label="状态">
                <el-tag type="info">未配置</el-tag>
              </el-descriptions-item>
            </el-descriptions>

            <el-alert
              type="info"
              title="配置说明"
              :closable="false"
              style="margin-top: 20px"
            >
              <p>1. 访问 GitHub Settings > Developer settings > OAuth Apps</p>
              <p>2. 创建新的 OAuth App</p>
              <p>3. 设置环境变量后重启服务器</p>
            </el-alert>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 20px">
        <!-- 定时任务配置 -->
        <el-col :xs="24" :lg="12">
          <el-card header="定时任务">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="状态">
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
              <el-descriptions-item label="成功次数">
                {{ taskStatus?.stats?.successfulRuns || 0 }}
              </el-descriptions-item>
              <el-descriptions-item label="失败次数">
                {{ taskStatus?.stats?.failedRuns || 0 }}
              </el-descriptions-item>
            </el-descriptions>

            <div style="margin-top: 20px">
              <el-button
                type="primary"
                @click="runTask"
                :loading="taskRunning"
              >
                <el-icon><Refresh /></el-icon>
                手动执行任务
              </el-button>
            </div>

            <el-alert
              type="info"
              :closable="false"
              style="margin-top: 20px"
            >
              提示：安装 node-cron 包以启用自动定时任务
            </el-alert>
          </el-card>
        </el-col>

        <!-- 系统信息 -->
        <el-col :xs="24" :lg="12">
          <el-card header="系统信息">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="系统版本">
                1.0.0
              </el-descriptions-item>
              <el-descriptions-item label="Node.js">
                {{ nodeVersion }}
              </el-descriptions-item>
              <el-descriptions-item label="数据存储">
                内存存储（重启后数据丢失）
              </el-descriptions-item>
              <el-descriptions-item label="用户数">
                {{ systemStore.stats.users || 0 }}
              </el-descriptions-item>
              <el-descriptions-item label="项目数">
                {{ systemStore.stats.projects || 0 }}
              </el-descriptions-item>
              <el-descriptions-item label="信息源数">
                {{ systemStore.stats.sources || 0 }}
              </el-descriptions-item>
              <el-descriptions-item label="消息数">
                {{ systemStore.stats.messages || 0 }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 20px">
        <!-- 关于系统 -->
        <el-col :span="24">
          <el-card header="关于系统">
            <h3>AI 新闻去重推送事实核查系统</h3>
            <p>智能信息处理，精准消息推送</p>

            <h4 style="margin-top: 20px">核心特性：</h4>
            <ul>
              <li>多源信息聚合：支持 RSS、API、网站、GitHub、Twitter 等</li>
              <li>AI 智能分析：使用大语言模型分析消息相关性</li>
              <li>四维评分系统：主题匹配度、上下文相关性、可操作性、紧急程度</li>
              <li>智能消息盒子：只接收与项目强相关的重要信息</li>
              <li>项目管理：支持多项目、优先级、相关性阈值</li>
            </ul>

            <h4 style="margin-top: 20px">技术栈：</h4>
            <ul>
              <li>前端：Vue 3 + Element Plus + Pinia + ECharts</li>
              <li>后端：Node.js + Express.js</li>
              <li>存储：内存存储（适配 Vercel 等无服务器环境）</li>
              <li>AI：OpenAI API</li>
            </ul>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSystemStore } from '../stores';
import { ElMessage } from 'element-plus';
import Layout from '../components/Layout.vue';

const systemStore = useSystemStore();

const saving = ref(false);
const taskRunning = ref(false);
const nodeVersion = ref('v18+');

const aiForm = ref({
  apiKey: '',
  apiEndpoint: 'https://api.openai.com/v1/chat/completions',
  model: 'gpt-3.5-turbo'
});

const aiConfig = computed(() => systemStore.aiConfig);
const taskStatus = computed(() => systemStore.taskStatus);

const saveAIConfig = async () => {
  if (!aiForm.value.apiKey) {
    ElMessage.warning('请输入 API Key');
    return;
  }

  saving.value = true;

  try {
    const result = await systemStore.setAIConfig(aiForm.value);

    if (result.success) {
      ElMessage.success('AI 配置已保存');
    } else {
      ElMessage.error(result.error || '保存失败');
    }
  } finally {
    saving.value = false;
  }
};

const runTask = async () => {
  taskRunning.value = true;

  try {
    const result = await systemStore.runTask();

    if (result.success) {
      ElMessage.success('任务执行成功');
      await systemStore.fetchSystemStats();
    } else {
      ElMessage.error(result.error || '任务执行失败');
    }
  } finally {
    taskRunning.value = false;
  }
};

const formatTime = (time) => {
  return new Date(time).toLocaleString('zh-CN');
};

onMounted(async () => {
  await Promise.all([
    systemStore.getAIConfig(),
    systemStore.fetchSystemStats()
  ]);

  if (aiConfig.value?.hasApiKey) {
    aiForm.value.apiKey = '已配置（隐藏）';
  }
});
</script>

<style scoped>
.settings-page {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

h3 {
  margin-top: 0;
  font-size: 20px;
  font-weight: 600;
}

h4 {
  margin-top: 15px;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 600;
}

ul {
  padding-left: 20px;
}

li {
  margin-bottom: 8px;
  line-height: 1.6;
}

p {
  margin: 10px 0;
  line-height: 1.6;
}
</style>
