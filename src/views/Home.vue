<template>
  <div class="home">
    <div class="card">
      <h2>欢迎使用</h2>
      <p>您可以通过控制平台的对话框提交需求，系统会自动修改这里的代码。</p>

      <div class="status">
        <p>后端状态: <span :class="backendStatus">{{ backendStatusText }}</span></p>
      </div>

      <div class="counter">
        <button @click="decrement">-</button>
        <span>{{ count }}</span>
        <button @click="increment">+</button>
      </div>

      <div class="actions">
        <button @click="fetchData" class="action-btn">获取后端数据</button>
        <button @click="updateData" class="action-btn">更新后端数据</button>
      </div>

      <div v-if="apiMessage" class="api-message">
        {{ apiMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const count = ref(0);
const backendStatus = ref('checking');
const backendStatusText = ref('检查中...');
const apiMessage = ref('');

const increment = () => {
  count.value++;
  updateData();
};

const decrement = () => {
  count.value--;
  updateData();
};

// 检查后端状态
const checkBackend = async () => {
  try {
    const response = await fetch('/api/health');
    const data = await response.json();
    if (data.status === 'ok') {
      backendStatus.value = 'online';
      backendStatusText.value = '在线';
    }
  } catch (error) {
    backendStatus.value = 'offline';
    backendStatusText.value = '离线';
    console.error('后端连接失败:', error);
  }
};

// 获取后端数据
const fetchData = async () => {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    apiMessage.value = `后端返回: ${data.message}`;
    if (data.data && data.data.count !== undefined) {
      count.value = data.data.count;
    }
  } catch (error) {
    apiMessage.value = '获取数据失败: ' + error.message;
    console.error('获取数据失败:', error);
  }
};

// 更新后端数据
const updateData = async () => {
  try {
    const response = await fetch('/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ count: count.value })
    });
    const data = await response.json();
    apiMessage.value = data.message || '数据已更新';
  } catch (error) {
    apiMessage.value = '更新数据失败: ' + error.message;
    console.error('更新数据失败:', error);
  }
};

onMounted(async () => {
  checkBackend();
  // 每 5 秒检查一次后端状态
  setInterval(checkBackend, 5000);
  // 页面加载时从后端获取数据，实现数据持久化
  await fetchData();
});
</script>

<style scoped>
.home {
  width: 100%;
  min-height: calc(100vh - 200px);
  background: linear-gradient(135deg, #ffe5ec 0%, #ffc2d1 100%);
  padding: 40px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  max-width: 800px;
  width: 100%;
}

.card h2 {
  color: #ff69b4;
  margin-bottom: 20px;
}

.card p {
  color: #ff1493;
  line-height: 1.6;
  margin-bottom: 30px;
}

.counter {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.counter button {
  width: 50px;
  height: 50px;
  font-size: 24px;
  border: 2px solid #ff69b4;
  background: white;
  color: #ff1493;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.counter button:hover {
  background: #ff69b4;
  color: white;
}

.counter span {
  font-size: 32px;
  font-weight: bold;
  color: #ff1493;
  min-width: 60px;
  text-align: center;
}

.status {
  margin: 20px 0;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 6px;
}

.status span {
  font-weight: bold;
  color: #ff69b4;
}

.status span.checking {
  color: #ff69b4;
}

.status span.online {
  color: #ff1493;
}

.status span.offline {
  color: #ffb6c1;
}

.actions {
  margin-top: 30px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.action-btn {
  padding: 10px 20px;
  background: #ff69b4;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.action-btn:hover {
  background: #ff1493;
  color: white;
}

.api-message {
  margin-top: 20px;
  padding: 10px;
  background: #ffe5ec;
  border-left: 4px solid #ff69b4;
  border-radius: 4px;
  color: #ff1493;
}
</style>
