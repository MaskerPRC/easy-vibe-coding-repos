<template>
  <div v-if="show" class="popup-overlay" @click="closePopup">
    <div class="popup-container login-popup" @click.stop>
      <div class="popup-header">
        <h3>🔐 用户登录</h3>
        <button class="close-btn" @click="closePopup">×</button>
      </div>
      <div class="popup-body">
        <div class="login-content">
          <div class="avatar-wrapper">
            <div class="avatar">👤</div>
          </div>

          <h2>{{ isRegister ? '注册新账户' : '欢迎回来' }}</h2>
          <p class="subtitle">{{ isRegister ? '创建您的账户以继续' : '登录以继续使用' }}</p>

          <form @submit.prevent="handleSubmit" class="login-form">
            <div v-if="isRegister" class="form-group">
              <label for="username">
                <span class="icon">👤</span>
                用户名
              </label>
              <input
                type="text"
                id="username"
                v-model="username"
                placeholder="请输入用户名"
                :required="isRegister"
              />
            </div>

            <div class="form-group">
              <label for="login-email">
                <span class="icon">📧</span>
                邮箱
              </label>
              <input
                type="email"
                id="login-email"
                v-model="email"
                placeholder="请输入邮箱地址"
                required
                :class="{ 'error': errors.email }"
              />
              <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            </div>

            <div class="form-group">
              <label for="password">
                <span class="icon">🔒</span>
                密码
              </label>
              <div class="password-wrapper">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  v-model="password"
                  placeholder="请输入密码"
                  required
                  :class="{ 'error': errors.password }"
                />
                <button
                  type="button"
                  class="toggle-password"
                  @click="showPassword = !showPassword"
                >
                  {{ showPassword ? '👁️' : '👁️‍🗨️' }}
                </button>
              </div>
              <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
            </div>

            <div v-if="isRegister" class="form-group">
              <label for="confirm-password">
                <span class="icon">🔒</span>
                确认密码
              </label>
              <input
                type="password"
                id="confirm-password"
                v-model="confirmPassword"
                placeholder="请再次输入密码"
                :required="isRegister"
                :class="{ 'error': errors.confirmPassword }"
              />
              <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
            </div>

            <div v-if="!isRegister" class="form-options">
              <label class="remember-me">
                <input type="checkbox" v-model="rememberMe" />
                <span>记住我</span>
              </label>
              <a href="#" class="forgot-password" @click.prevent="handleForgotPassword">忘记密码？</a>
            </div>

            <button type="submit" class="btn btn-login">
              {{ isRegister ? '注册' : '登录' }}
            </button>
          </form>

          <div class="divider">
            <span>或</span>
          </div>

          <div class="social-login">
            <button class="btn-social btn-google" @click="handleSocialLogin('Google')">
              <span class="social-icon">G</span>
              使用 Google 登录
            </button>
            <button class="btn-social btn-facebook" @click="handleSocialLogin('Facebook')">
              <span class="social-icon">f</span>
              使用 Facebook 登录
            </button>
          </div>

          <div class="toggle-mode">
            <span v-if="!isRegister">
              还没有账户？
              <a href="#" @click.prevent="isRegister = true">立即注册</a>
            </span>
            <span v-else>
              已有账户？
              <a href="#" @click.prevent="isRegister = false">立即登录</a>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, reactive } from 'vue';

const props = defineProps({
  show: Boolean
});

const emit = defineEmits(['close']);

const isRegister = ref(false);
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);

const errors = reactive({
  email: '',
  password: '',
  confirmPassword: ''
});

// 反人类：关闭按钮不关闭
const closePopup = () => {
  alert('😈 想关闭？不可能！输入正确信息才能关闭！');
  // 不关闭弹窗
};

const resetForm = () => {
  isRegister.value = false;
  username.value = '';
  email.value = '';
  password.value = '';
  confirmPassword.value = '';
  rememberMe.value = false;
  showPassword.value = false;
  errors.email = '';
  errors.password = '';
  errors.confirmPassword = '';
};

const validateEmail = (emailValue) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(emailValue);
};

const validateForm = () => {
  let isValid = true;
  errors.email = '';
  errors.password = '';
  errors.confirmPassword = '';

  if (!validateEmail(email.value)) {
    errors.email = '请输入有效的邮箱地址';
    isValid = false;
  }

  if (password.value.length < 6) {
    errors.password = '密码至少需要 6 个字符';
    isValid = false;
  }

  if (isRegister.value && password.value !== confirmPassword.value) {
    errors.confirmPassword = '两次输入的密码不一致';
    isValid = false;
  }

  return isValid;
};

// 反人类：登录和注册功能相反
const handleSubmit = () => {
  if (!validateForm()) {
    return;
  }

  if (isRegister.value) {
    // 点击"注册"实际上是登录
    console.log('实际上是登录用户:', { email: email.value });
    alert('😈 你以为在注册？其实你登录成功了！');
  } else {
    // 点击"登录"实际上是注册
    console.log('实际上是注册用户:', { email: email.value });
    alert('😈 你以为在登录？其实你注册成功了！');
  }

  emit('close');
  resetForm();
};

// "忘记密码"实际上是记住密码
const handleForgotPassword = () => {
  alert('✅ 恭喜！密码已被永久记住（虽然你什么也没做）');
};

// 社交登录实际上是退出登录
const handleSocialLogin = (provider) => {
  console.log(`使用 ${provider} 退出登录`);
  alert(`😈 使用 ${provider} 登录？不！你已经退出登录了！`);
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
  background: rgba(0, 0, 0, 0.7);
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
  background: white;
  border-radius: 15px;
  max-width: 450px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.4);
  animation: zoomIn 0.3s ease;
}

@keyframes zoomIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.popup-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px 15px 0 0;
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

.login-content {
  color: #333;
}

.avatar-wrapper {
  text-align: center;
  margin-bottom: 20px;
}

.avatar {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.login-content h2 {
  font-size: 24px;
  margin: 0 0 10px 0;
  text-align: center;
  color: #333;
}

.subtitle {
  text-align: center;
  margin: 0 0 25px 0;
  font-size: 14px;
  color: #777;
}

.login-form {
  margin-bottom: 20px;
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

.form-group .icon {
  margin-right: 5px;
}

.form-group input[type="email"],
.form-group input[type="text"],
.form-group input[type="password"] {
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

.password-wrapper {
  position: relative;
}

.password-wrapper input {
  padding-right: 45px;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 5px;
}

.error-message {
  display: block;
  color: #e74c3c;
  font-size: 12px;
  margin-top: 5px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 13px;
}

.remember-me {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #555;
}

.remember-me input {
  margin-right: 5px;
  cursor: pointer;
}

.forgot-password {
  color: #667eea;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.btn-login {
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

.btn-login:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.divider {
  text-align: center;
  margin: 25px 0;
  position: relative;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background: #ddd;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.divider span {
  background: white;
  padding: 0 15px;
  color: #999;
  font-size: 13px;
}

.social-login {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.btn-social {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  background: white;
}

.btn-google:hover {
  background: #f5f5f5;
  border-color: #db4437;
}

.btn-facebook:hover {
  background: #f5f5f5;
  border-color: #4267B2;
}

.social-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
}

.btn-google .social-icon {
  background: #db4437;
}

.btn-facebook .social-icon {
  background: #4267B2;
}

.toggle-mode {
  text-align: center;
  font-size: 14px;
  color: #666;
}

.toggle-mode a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.toggle-mode a:hover {
  text-decoration: underline;
}
</style>
