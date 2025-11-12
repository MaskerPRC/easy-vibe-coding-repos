<template>
  <Layout>
    <div class="not-found">
      <el-card class="not-found-card">
        <div class="not-found-content">
          <div class="not-found-icon">
            <el-icon :size="120" color="#409eff">
              <QuestionFilled />
            </el-icon>
          </div>
          <div class="not-found-title">404</div>
          <div class="not-found-subtitle">页面未找到</div>
          <div class="not-found-description">
            抱歉，您访问的页面不存在或已被移除
          </div>
          <div class="not-found-actions">
            <el-button type="primary" size="large" @click="goHome">
              <el-icon><HomeFilled /></el-icon>
              返回首页
            </el-button>
            <el-button size="large" @click="goBack">
              <el-icon><Back /></el-icon>
              返回上一页
            </el-button>
          </div>
          <div class="not-found-links">
            <div class="links-title">您可能需要：</div>
            <div class="links-grid">
              <div class="link-item" @click="$router.push('/')">
                <el-icon><DataAnalysis /></el-icon>
                <span>仪表盘</span>
              </div>
              <div class="link-item" @click="$router.push('/messages')">
                <el-icon><Message /></el-icon>
                <span>消息盒子</span>
              </div>
              <div class="link-item" @click="$router.push('/projects')">
                <el-icon><Folder /></el-icon>
                <span>项目管理</span>
              </div>
              <div class="link-item" @click="$router.push('/sources')">
                <el-icon><Link /></el-icon>
                <span>信息源</span>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </Layout>
</template>

<script setup>
import { useRouter } from 'vue-router';
import Layout from '../components/Layout.vue';
import { QuestionFilled, HomeFilled, Back, DataAnalysis, Message, Folder, Link } from '@element-plus/icons-vue';

const router = useRouter();

// 返回首页
const goHome = () => {
  router.push('/');
};

// 返回上一页
const goBack = () => {
  router.back();
};
</script>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  padding: 20px;
}

.not-found-card {
  max-width: 600px;
  width: 100%;
}

.not-found-content {
  text-align: center;
  padding: 40px 20px;
}

.not-found-icon {
  margin-bottom: 20px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.not-found-title {
  font-size: 80px;
  font-weight: 800;
  color: #409eff;
  margin-bottom: 10px;
  line-height: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.not-found-subtitle {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 15px;
}

.not-found-description {
  font-size: 16px;
  color: #909399;
  margin-bottom: 40px;
}

.not-found-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.not-found-links {
  border-top: 1px solid #e8e8e8;
  padding-top: 30px;
}

.links-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 15px;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
}

.link-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 15px;
  background: #f5f7fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.link-item:hover {
  background: #ecf5ff;
  color: #409eff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

.link-item .el-icon {
  font-size: 24px;
}

.link-item span {
  font-size: 14px;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .not-found-title {
    font-size: 60px;
  }

  .not-found-subtitle {
    font-size: 22px;
  }

  .not-found-description {
    font-size: 14px;
  }

  .not-found-actions {
    flex-direction: column;
  }

  .not-found-actions .el-button {
    width: 100%;
  }

  .links-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
