<template>
  <div class="login-page">
    <!-- 返回首页按钮 -->
    <div class="back-button">
      <button @click="goHome" class="btn-back">返回首页</button>
    </div>

    <!-- 登录/注册表单 -->
    <div class="auth-container">
      <div class="auth-card">
        <!-- 左侧装饰 -->
        <div class="auth-decoration">
          <div class="decoration-content">
            <div class="decoration-icon">🚀</div>
            <h2 class="decoration-title">欢迎来到 MyApp</h2>
            <p class="decoration-text">
              开启您的精彩旅程，探索无限可能
            </p>
            <div class="decoration-features">
              <div class="feature-item">✓ 安全可靠的账户系统</div>
              <div class="feature-item">✓ 个性化的用户体验</div>
              <div class="feature-item">✓ 丰富的功能服务</div>
              <div class="feature-item">✓ 7×24小时技术支持</div>
            </div>
          </div>
        </div>

        <!-- 右侧表单 -->
        <div class="auth-form-container">
          <!-- 切换选项卡 -->
          <div class="auth-tabs">
            <button
              @click="currentTab = 'login'"
              :class="{ active: currentTab === 'login' }"
              class="tab-button"
            >
              登录
            </button>
            <button
              @click="currentTab = 'register'"
              :class="{ active: currentTab === 'register' }"
              class="tab-button"
            >
              注册
            </button>
          </div>

          <!-- 登录表单 -->
          <form v-if="currentTab === 'login'" @submit.prevent="handleLogin" class="auth-form">
            <div class="form-group">
              <label class="form-label">邮箱地址</label>
              <input
                v-model="loginForm.email"
                type="email"
                placeholder="请输入邮箱"
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">密码</label>
              <input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                class="form-input"
                required
              />
            </div>

            <div class="form-options">
              <label class="checkbox-label">
                <input type="checkbox" v-model="loginForm.remember" />
                <span>记住我</span>
              </label>
              <a href="#" class="link-text">忘记密码？</a>
            </div>

            <button type="submit" class="btn-submit">登录</button>

            <div class="divider">
              <span>或使用第三方登录</span>
            </div>

            <div class="social-login">
              <button type="button" class="social-btn github">
                <span>GitHub</span>
              </button>
              <button type="button" class="social-btn google">
                <span>Google</span>
              </button>
              <button type="button" class="social-btn wechat">
                <span>微信</span>
              </button>
            </div>
          </form>

          <!-- 注册表单 -->
          <form v-if="currentTab === 'register'" @submit.prevent="handleRegister" class="auth-form">
            <div class="form-group">
              <label class="form-label">用户名</label>
              <input
                v-model="registerForm.username"
                type="text"
                placeholder="请输入用户名"
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">邮箱地址</label>
              <input
                v-model="registerForm.email"
                type="email"
                placeholder="请输入邮箱"
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">密码</label>
              <input
                v-model="registerForm.password"
                type="password"
                placeholder="请输入密码（至少6位）"
                class="form-input"
                required
                minlength="6"
              />
            </div>

            <div class="form-group">
              <label class="form-label">确认密码</label>
              <input
                v-model="registerForm.confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                class="form-input"
                required
              />
            </div>

            <div class="form-options">
              <label class="checkbox-label">
                <input type="checkbox" v-model="registerForm.agree" required />
                <span>我同意<a href="#" class="link-text">服务条款</a>和<a href="#" class="link-text">隐私政策</a></span>
              </label>
            </div>

            <button type="submit" class="btn-submit">注册</button>
          </form>
        </div>
      </div>
    </div>

    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="decoration-circle circle-1"></div>
      <div class="decoration-circle circle-2"></div>
      <div class="decoration-circle circle-3"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const currentTab = ref('login');

// 登录表单
const loginForm = ref({
  email: '',
  password: '',
  remember: false
});

// 注册表单
const registerForm = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agree: false
});

// 返回首页
const goHome = () => {
  router.push('/');
};

// 处理登录
const handleLogin = async () => {
  console.log('登录表单:', loginForm.value);

  // 简单验证
  if (!loginForm.value.email || !loginForm.value.password) {
    alert('请填写完整的登录信息');
    return;
  }

  try {
    // 这里应该调用后端API进行登录
    // const response = await fetch('/api/login', { ... });

    // 模拟登录成功
    alert('登录成功！欢迎回来！');
    // 登录成功后可以跳转到首页或用户中心
    // router.push('/');
  } catch (error) {
    console.error('登录失败:', error);
    alert('登录失败，请检查邮箱和密码');
  }
};

// 处理注册
const handleRegister = async () => {
  console.log('注册表单:', registerForm.value);

  // 验证密码
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    alert('两次输入的密码不一致');
    return;
  }

  if (registerForm.value.password.length < 6) {
    alert('密码长度至少为6位');
    return;
  }

  if (!registerForm.value.agree) {
    alert('请同意服务条款和隐私政策');
    return;
  }

  try {
    // 这里应该调用后端API进行注册
    // const response = await fetch('/api/register', { ... });

    // 模拟注册成功
    alert('注册成功！欢迎加入MyApp！');
    // 注册成功后切换到登录页面
    currentTab.value = 'login';
    // 清空注册表单
    registerForm.value = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      agree: false
    };
  } catch (error) {
    console.error('注册失败:', error);
    alert('注册失败，请稍后重试');
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
}

.btn-back {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

/* 认证容器 */
.auth-container {
  max-width: 1000px;
  width: 100%;
  position: relative;
  z-index: 2;
}

.auth-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 600px;
}

/* 左侧装饰 */
.auth-decoration {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  position: relative;
  overflow: hidden;
}

.auth-decoration::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.decoration-content {
  position: relative;
  z-index: 1;
}

.decoration-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.decoration-title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-align: center;
}

.decoration-text {
  font-size: 1.1rem;
  opacity: 0.95;
  text-align: center;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.decoration-features {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feature-item {
  font-size: 1rem;
  opacity: 0.9;
  padding-left: 1rem;
}

/* 表单容器 */
.auth-form-container {
  padding: 3rem;
  display: flex;
  flex-direction: column;
}

/* 选项卡 */
.auth-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.tab-button {
  flex: 1;
  background: transparent;
  border: none;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #9ca3af;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
}

.tab-button.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

/* 表单 */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #374151;
}

.form-input {
  padding: 0.875rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #6b7280;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.link-text {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  transition: color 0.3s;
}

.link-text:hover {
  color: #764ba2;
}

.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 0.5rem;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

/* 分隔线 */
.divider {
  text-align: center;
  position: relative;
  margin: 1rem 0;
}

.divider span {
  background: white;
  padding: 0 1rem;
  color: #9ca3af;
  font-size: 0.9rem;
  position: relative;
  z-index: 1;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e5e7eb;
}

/* 社交登录 */
.social-login {
  display: flex;
  gap: 1rem;
}

.social-btn {
  flex: 1;
  background: #f3f4f6;
  border: 2px solid #e5e7eb;
  padding: 0.75rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  color: #374151;
}

.social-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.social-btn.github:hover {
  background: #24292e;
  color: white;
  border-color: #24292e;
}

.social-btn.google:hover {
  background: #4285f4;
  color: white;
  border-color: #4285f4;
}

.social-btn.wechat:hover {
  background: #07c160;
  color: white;
  border-color: #07c160;
}

/* 背景装饰 */
.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 1;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.circle-1 {
  width: 400px;
  height: 400px;
  top: -200px;
  right: -100px;
}

.circle-2 {
  width: 300px;
  height: 300px;
  bottom: -150px;
  left: -50px;
}

.circle-3 {
  width: 200px;
  height: 200px;
  top: 50%;
  left: 10%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .auth-card {
    grid-template-columns: 1fr;
  }

  .auth-decoration {
    display: none;
  }

  .auth-form-container {
    padding: 2rem 1.5rem;
  }

  .social-login {
    flex-direction: column;
  }
}
</style>
