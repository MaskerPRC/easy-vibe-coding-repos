<template>
  <div v-if="show" class="popup-overlay" @click="closePopup">
    <div class="popup-container email-popup" @click.stop>
      <div class="popup-header">
        <h3>📧 订阅我们的新闻通讯</h3>
        <button class="close-btn" @click="closePopup">×</button>
      </div>
      <div class="popup-body">
        <div class="email-content">
          <div class="icon-wrapper">
            <span class="mail-icon">✉️</span>
          </div>
          <h2>获取独家优惠和最新资讯！</h2>
          <p class="subtitle">订阅我们的新闻通讯，第一时间了解最新优惠、产品发布和行业资讯。</p>

          <div class="benefits">
            <div class="benefit-item">
              <span class="benefit-icon">🎁</span>
              <span>新订阅用户立享 10% 折扣</span>
            </div>
            <div class="benefit-item">
              <span class="benefit-icon">📰</span>
              <span>每周精选内容直达邮箱</span>
            </div>
            <div class="benefit-item">
              <span class="benefit-icon">🔔</span>
              <span>独家活动提前通知</span>
            </div>
          </div>

          <form @submit.prevent="handleSubmit" class="email-form">
            <div class="form-group">
              <label for="email">邮箱地址</label>
              <input
                type="email"
                id="email"
                v-model="email"
                placeholder="请输入您的邮箱地址"
                required
                :class="{ 'error': emailError }"
              />
              <span v-if="emailError" class="error-message">{{ emailError }}</span>
            </div>

            <div class="form-group">
              <label for="name">姓名（可选）</label>
              <input
                type="text"
                id="name"
                v-model="name"
                placeholder="请输入您的姓名"
              />
            </div>

            <div class="checkbox-group">
              <label>
                <input type="checkbox" v-model="acceptTerms" />
                <span>我同意接收营销邮件和优惠信息</span>
              </label>
            </div>

            <button type="submit" class="btn btn-subscribe" :disabled="!acceptTerms">
              立即订阅
            </button>
          </form>

          <p class="privacy-note">
            我们重视您的隐私。您可以随时取消订阅。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';

const props = defineProps({
  show: Boolean
});

const emit = defineEmits(['close']);

const email = ref('');
const name = ref('');
const acceptTerms = ref(false);
const emailError = ref('');

const closePopup = () => {
  emit('close');
  resetForm();
};

const resetForm = () => {
  email.value = '';
  name.value = '';
  acceptTerms.value = false;
  emailError.value = '';
};

const validateEmail = (emailValue) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(emailValue);
};

const handleSubmit = () => {
  emailError.value = '';

  if (!validateEmail(email.value)) {
    emailError.value = '请输入有效的邮箱地址';
    return;
  }

  console.log('订阅邮箱:', email.value);
  console.log('姓名:', name.value);
  alert('订阅成功！感谢您的订阅！');
  emit('close');
  resetForm();
};
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.popup-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  max-width: 550px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.4);
  animation: slideDown 0.4s ease;
}

@keyframes slideDown {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.popup-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
}

.popup-header h3 {
  margin: 0;
  font-size: 20px;
  color: white;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: white;
  line-height: 1;
  padding: 0;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.popup-body {
  padding: 30px;
}

.email-content {
  color: white;
}

.icon-wrapper {
  text-align: center;
  margin-bottom: 20px;
}

.mail-icon {
  font-size: 60px;
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

.email-content h2 {
  font-size: 24px;
  margin: 0 0 10px 0;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  text-align: center;
  margin: 0 0 25px 0;
  font-size: 14px;
  opacity: 0.9;
  line-height: 1.6;
}

.benefits {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 25px;
}

.benefit-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
}

.benefit-item:last-child {
  margin-bottom: 0;
}

.benefit-icon {
  font-size: 24px;
  margin-right: 12px;
}

.email-form {
  background: rgba(255, 255, 255, 0.95);
  padding: 25px;
  border-radius: 10px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 14px;
  color: #555;
}

.form-group input[type="email"],
.form-group input[type="text"] {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input.error {
  border-color: #e74c3c;
}

.error-message {
  display: block;
  color: #e74c3c;
  font-size: 12px;
  margin-top: 5px;
}

.checkbox-group {
  margin-bottom: 20px;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #555;
  cursor: pointer;
}

.checkbox-group input[type="checkbox"] {
  margin-right: 8px;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.btn-subscribe {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-subscribe:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-subscribe:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.privacy-note {
  text-align: center;
  font-size: 12px;
  margin: 15px 0 0 0;
  opacity: 0.8;
}
</style>
