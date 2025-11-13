<template>
  <div class="page-container">
    <div class="header">
      <div class="title">我的</div>
    </div>

    <div class="content">
      <!-- 会员卡片 -->
      <div class="member-card">
        <div class="member-header">
          <div class="member-info">
            <div class="member-name">{{ userInfo.enterpriseName }}</div>
            <div class="member-tag">会员全部特权，无弹窗广告</div>
          </div>
          <button class="btn-renew">立即续费</button>
        </div>
        <div class="member-expiry">到期时间: {{ userInfo.memberExpiry }}</div>
        <div class="member-action">
          <span>分享加入</span>
          <span class="arrow">></span>
        </div>
      </div>

      <!-- 企业信息 -->
      <div class="section-card">
        <div class="card-item" @click="navigateTo('/enterprise')">
          <div class="card-label">我的企业</div>
          <div class="card-arrow">></div>
        </div>
        <div class="card-item" @click="navigateTo('/promote')">
          <div class="card-label">推广企业</div>
          <div class="card-arrow">></div>
        </div>
        <div class="card-item" @click="navigateTo('/personal')">
          <div class="card-label">个人信息</div>
          <div class="card-arrow">></div>
        </div>
      </div>

      <!-- 功能管理 -->
      <div class="section-title">薪资管理</div>
      <div class="section-card">
        <div class="card-item" @click="navigateTo('/product-management')">
          <div class="card-label">计件产品管理</div>
          <div class="card-arrow">></div>
        </div>
        <div class="card-item" @click="navigateTo('/job-management')">
          <div class="card-label">计时工种管理</div>
          <div class="card-arrow">></div>
        </div>
        <div class="card-item" @click="navigateTo('/employee')">
          <div class="card-label">员工管理</div>
          <div class="card-arrow">></div>
        </div>
      </div>

      <!-- 设置 -->
      <div class="section-title">设置</div>
      <div class="section-card">
        <div class="card-item" @click="navigateTo('/settings')">
          <div class="card-label">全局设置</div>
          <div class="card-arrow">></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { userAPI } from '../api';

const router = useRouter();

const userInfo = ref({
  enterpriseName: '志丰',
  memberExpiry: '2055-12-31'
});

const loadUserInfo = async () => {
  try {
    const response = await userAPI.get();
    userInfo.value = response.data.data;
  } catch (error) {
    console.error('加载用户信息失败:', error);
  }
};

const navigateTo = (path) => {
  router.push(path);
};

onMounted(() => {
  loadUserInfo();
});
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: #F8F8F8;
  padding-bottom: 80px;
}

.header {
  background: #FFFFFF;
  padding: 16px 20px;
  border-bottom: 1px solid #E0E0E0;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
}

.content {
  padding: 16px;
}

.member-card {
  background: linear-gradient(135deg, #1A73E8 0%, #1565C0 100%);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  color: #FFFFFF;
  box-shadow: 0 4px 16px rgba(26, 115, 232, 0.3);
}

.member-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
}

.member-info {
  flex: 1;
}

.member-name {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
}

.member-tag {
  font-size: 13px;
  opacity: 0.9;
}

.btn-renew {
  background: #4CAF50;
  color: #FFFFFF;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

.btn-renew:hover {
  background: #45A049;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}

.member-expiry {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 12px;
}

.member-action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
}

.member-action:hover {
  opacity: 0.8;
}

.arrow {
  font-size: 16px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #666666;
  margin: 24px 0 12px 4px;
}

.section-card {
  background: #FFFFFF;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.card-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  cursor: pointer;
  transition: background 0.2s ease;
  border-bottom: 1px solid #F2F2F2;
}

.card-item:last-child {
  border-bottom: none;
}

.card-item:hover {
  background: #F8F8F8;
}

.card-item:active {
  background: #F2F2F2;
}

.card-label {
  font-size: 15px;
  color: #333333;
  font-weight: 500;
}

.card-arrow {
  color: #CCCCCC;
  font-size: 16px;
}

@media (max-width: 480px) {
  .member-card {
    padding: 20px;
  }

  .member-name {
    font-size: 20px;
  }
}
</style>
