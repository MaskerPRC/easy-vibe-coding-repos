<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h1>AI 新闻去重推送系统</h1>
        <p>智能信息处理，精准消息推送</p>
      </div>

      <el-card class="login-card">
        <template #header>
          <div class="card-header">
            <span>用户登录</span>
          </div>
        </template>

        <el-alert
          v-if="error"
          :title="error"
          type="error"
          :closable="false"
          style="margin-bottom: 20px"
        />

        <el-button
          type="primary"
          size="large"
          :loading="loading"
          @click="handleTestLogin"
          style="width: 100%; margin-bottom: 15px"
        >
          <el-icon style="margin-right: 8px"><User /></el-icon>
          使用测试账号登录
        </el-button>

        <el-divider>或</el-divider>

        <el-button
          size="large"
          :loading="loading"
          @click="handleGitHubLogin"
          style="width: 100%"
        >
          <el-icon style="margin-right: 8px"><Connection /></el-icon>
          使用 GitHub 登录
        </el-button>

        <div class="login-footer">
          <el-text size="small" type="info">
            测试账号无需配置 GitHub OAuth，可直接登录体验系统功能
          </el-text>
        </div>
      </el-card>

      <div class="features">
        <div class="feature-item">
          <el-icon><DataAnalysis /></el-icon>
          <span>AI 智能分析</span>
        </div>
        <div class="feature-item">
          <el-icon><Filter /></el-icon>
          <span>智能去重过滤</span>
        </div>
        <div class="feature-item">
          <el-icon><Message /></el-icon>
          <span>精准消息推送</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores';
import { ElMessage } from 'element-plus';

const router = useRouter();
const userStore = useUserStore();

const loading = ref(false);
const error = ref('');

// 测试登录
const handleTestLogin = async () => {
  loading.value = true;
  error.value = '';

  try {
    const result = await userStore.login();

    if (result.success) {
      ElMessage.success('登录成功！');
      router.push('/');
    } else {
      error.value = result.error || '登录失败';
    }
  } catch (err) {
    error.value = '登录失败：' + err.message;
  } finally {
    loading.value = false;
  }
};

// GitHub 登录
const handleGitHubLogin = () => {
  ElMessage.info('GitHub OAuth 需要配置后才能使用，请先使用测试账号登录');
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-box {
  width: 100%;
  max-width: 450px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
  color: white;
}

.login-header h1 {
  font-size: 32px;
  margin-bottom: 10px;
  font-weight: 700;
}

.login-header p {
  font-size: 16px;
  opacity: 0.9;
}

.login-card {
  backdrop-filter: blur(10px);
}

.card-header {
  font-size: 18px;
  font-weight: 600;
  text-align: center;
}

.login-footer {
  margin-top: 20px;
  text-align: center;
}

.features {
  display: flex;
  justify-content: space-around;
  margin-top: 40px;
  color: white;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.feature-item .el-icon {
  font-size: 24px;
}

@media (max-width: 768px) {
  .login-header h1 {
    font-size: 24px;
  }

  .login-header p {
    font-size: 14px;
  }

  .features {
    flex-direction: column;
    gap: 20px;
  }
}
</style>
