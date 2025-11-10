<template>
  <div class="hello-world-container">
    <div class="hello-card">
      <div class="icon-wrapper">
        <span class="wave-emoji">👋</span>
      </div>
      <h1 class="hello-title">Hello, World!</h1>
      <p class="hello-subtitle">欢迎来到 WebShell Manager</p>
      <div class="info-box">
        <p class="info-text">这是一个简单的 Hello World 示例页面</p>
        <p class="info-text">当前时间: {{ currentTime }}</p>
      </div>
      <div class="button-group">
        <button @click="showMessage" class="action-btn primary">
          点击我
        </button>
        <button @click="resetCount" class="action-btn secondary">
          重置计数
        </button>
      </div>
      <div v-if="message" class="message-box">
        {{ message }}
      </div>
      <div class="counter-box">
        <p>你已经点击了 <span class="counter">{{ clickCount }}</span> 次</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const currentTime = ref('');
const message = ref('');
const clickCount = ref(0);
let timeInterval;

const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

const showMessage = () => {
  clickCount.value++;
  const messages = [
    '你好，世界！',
    'Hello, World!',
    'Bonjour, le monde!',
    'Hola, mundo!',
    'こんにちは、世界！',
    '안녕하세요, 세계!'
  ];
  const randomIndex = Math.floor(Math.random() * messages.length);
  message.value = messages[randomIndex];

  setTimeout(() => {
    message.value = '';
  }, 3000);
};

const resetCount = () => {
  clickCount.value = 0;
  message.value = '计数已重置！';
  setTimeout(() => {
    message.value = '';
  }, 2000);
};

onMounted(() => {
  updateTime();
  timeInterval = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
});
</script>

<style scoped>
.hello-world-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  padding: 40px 20px;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
}

.hello-card {
  max-width: 600px;
  width: 100%;
  background: #2d2d2d;
  border: 2px solid #00ff88;
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 255, 136, 0.2);
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.icon-wrapper {
  margin-bottom: 30px;
}

.wave-emoji {
  font-size: 80px;
  display: inline-block;
  animation: wave 2s ease-in-out infinite;
}

@keyframes wave {
  0%, 100% {
    transform: rotate(0deg);
  }
  10%, 30% {
    transform: rotate(14deg);
  }
  20%, 40% {
    transform: rotate(-8deg);
  }
  50% {
    transform: rotate(10deg);
  }
  60% {
    transform: rotate(-4deg);
  }
  70% {
    transform: rotate(6deg);
  }
  80% {
    transform: rotate(-2deg);
  }
}

.hello-title {
  font-size: 48px;
  font-weight: 700;
  color: #00ff88;
  margin: 0 0 15px 0;
  text-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
}

.hello-subtitle {
  font-size: 18px;
  color: #999;
  margin: 0 0 30px 0;
}

.info-box {
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 30px;
}

.info-text {
  margin: 8px 0;
  font-size: 15px;
  color: #e0e0e0;
}

.button-group {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 20px;
}

.action-btn {
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn.primary {
  background: #00ff88;
  color: #1a1a1a;
}

.action-btn.primary:hover {
  background: #00cc6f;
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(0, 255, 136, 0.4);
}

.action-btn.secondary {
  background: #444;
  color: #e0e0e0;
  border: 1px solid #666;
}

.action-btn.secondary:hover {
  background: #555;
  transform: translateY(-2px);
}

.message-box {
  margin-top: 20px;
  padding: 15px;
  background: #00ff88;
  color: #1a1a1a;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.counter-box {
  margin-top: 20px;
  padding: 15px;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 8px;
  font-size: 16px;
  color: #e0e0e0;
}

.counter {
  font-size: 24px;
  font-weight: 700;
  color: #00ff88;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hello-card {
    padding: 40px 30px;
  }

  .hello-title {
    font-size: 36px;
  }

  .wave-emoji {
    font-size: 60px;
  }

  .button-group {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}
</style>
