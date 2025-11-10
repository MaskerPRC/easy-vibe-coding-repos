<template>
  <div class="wedding-container">
    <!-- 标题区域 -->
    <div class="wedding-header">
      <div class="title-section">
        <h1 class="wedding-title">我们的婚礼纪念册</h1>
        <div class="couple-names">
          <span class="groom-name">{{ groomName }}</span>
          <span class="heart">♥</span>
          <span class="bride-name">{{ brideName }}</span>
        </div>
        <div class="wedding-date">{{ weddingDate }}</div>
      </div>
    </div>

    <!-- 倒计时和纪念天数 -->
    <div class="counters-section">
      <div class="counter-card">
        <div class="counter-label">我们在一起</div>
        <div class="counter-value">{{ daysTogether }}</div>
        <div class="counter-unit">天</div>
      </div>
      <div class="counter-card">
        <div class="counter-label">下次纪念日</div>
        <div class="counter-value">{{ daysToAnniversary }}</div>
        <div class="counter-unit">天</div>
      </div>
      <div class="counter-card">
        <div class="counter-label">共同的回忆</div>
        <div class="counter-value">{{ memories.length }}</div>
        <div class="counter-unit">个</div>
      </div>
    </div>

    <!-- 时间轴 -->
    <div class="timeline-section">
      <h2 class="section-title">我们的故事</h2>
      <div class="timeline">
        <div
          v-for="memory in memories"
          :key="memory.id"
          class="timeline-item"
          :class="{ 'timeline-left': memory.id % 2 === 0, 'timeline-right': memory.id % 2 !== 0 }"
        >
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <div class="timeline-date">{{ memory.date }}</div>
            <div class="timeline-title">{{ memory.title }}</div>
            <div class="timeline-desc">{{ memory.description }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 照片墙 -->
    <div class="photos-section">
      <h2 class="section-title">甜蜜瞬间</h2>
      <div class="photo-gallery">
        <div
          v-for="photo in photos"
          :key="photo.id"
          class="photo-card"
          @click="selectPhoto(photo)"
          :class="{ selected: selectedPhoto && selectedPhoto.id === photo.id }"
        >
          <div class="photo-placeholder">
            <span class="photo-icon">📷</span>
            <span class="photo-number">{{ photo.id }}</span>
          </div>
          <div class="photo-title">{{ photo.title }}</div>
        </div>
      </div>
      <div v-if="selectedPhoto" class="photo-viewer">
        <div class="photo-viewer-content">
          <button class="close-btn" @click="selectedPhoto = null">✕</button>
          <div class="photo-large">
            <span class="photo-icon-large">📷</span>
            <span class="photo-number-large">{{ selectedPhoto.id }}</span>
          </div>
          <div class="photo-info">
            <h3>{{ selectedPhoto.title }}</h3>
            <p>{{ selectedPhoto.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 祝福留言 -->
    <div class="messages-section">
      <h2 class="section-title">祝福留言</h2>

      <!-- 留言输入 -->
      <div class="message-input-area">
        <input
          v-model="newMessage.name"
          type="text"
          placeholder="您的名字"
          class="input-name"
          maxlength="20"
        />
        <textarea
          v-model="newMessage.content"
          placeholder="写下您的祝福..."
          class="input-message"
          maxlength="200"
        ></textarea>
        <button
          @click="submitMessage"
          class="submit-btn"
          :disabled="!newMessage.name.trim() || !newMessage.content.trim()"
        >
          发送祝福
        </button>
      </div>

      <!-- 留言列表 -->
      <div class="messages-list">
        <div
          v-for="message in messages"
          :key="message.id"
          class="message-card"
        >
          <div class="message-header">
            <span class="message-author">{{ message.name }}</span>
            <span class="message-time">{{ formatTime(message.timestamp) }}</span>
          </div>
          <div class="message-content">{{ message.content }}</div>
        </div>
        <div v-if="messages.length === 0" class="no-messages">
          暂无留言，快来送上您的祝福吧！
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

// 新郎新娘信息
const groomName = ref('张先生');
const brideName = ref('李女士');
const weddingDate = ref('2024年5月20日');
const weddingDateObj = new Date('2024-05-20');

// 当前时间（用于倒计时）
const currentTime = ref(new Date());

// 定时器更新当前时间
let timer = null;
onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = new Date();
  }, 1000);

  // 加载留言
  loadMessages();
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});

// 计算在一起的天数
const daysTogether = computed(() => {
  const diff = currentTime.value - weddingDateObj;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
});

// 计算距离下次纪念日的天数
const daysToAnniversary = computed(() => {
  const now = currentTime.value;
  const thisYear = now.getFullYear();
  let nextAnniversary = new Date(thisYear, 4, 20); // 5月20日（月份从0开始）

  // 如果今年的纪念日已过，计算明年的
  if (now > nextAnniversary) {
    nextAnniversary = new Date(thisYear + 1, 4, 20);
  }

  const diff = nextAnniversary - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

// 回忆时间轴
const memories = ref([
  {
    id: 1,
    date: '2023年1月14日',
    title: '初次相遇',
    description: '在咖啡馆的邂逅，命运的安排让我们相识'
  },
  {
    id: 2,
    date: '2023年2月14日',
    title: '情人节告白',
    description: '浪漫的情人节，我们确定了彼此的心意'
  },
  {
    id: 3,
    date: '2023年8月15日',
    title: '第一次旅行',
    description: '海边的日落，留下了最美的回忆'
  },
  {
    id: 4,
    date: '2023年12月25日',
    title: '求婚时刻',
    description: '圣诞夜的惊喜求婚，她说"我愿意"'
  },
  {
    id: 5,
    date: '2024年5月20日',
    title: '携手一生',
    description: '在亲友的见证下，我们步入婚姻的殿堂'
  },
  {
    id: 6,
    date: '2024年10月1日',
    title: '蜜月旅行',
    description: '浪漫的海岛之旅，留下无数美好瞬间'
  }
]);

// 照片墙
const photos = ref([
  { id: 1, title: '婚礼仪式', description: '神圣的时刻，交换戒指' },
  { id: 2, title: '婚纱照', description: '最美的新娘，最帅的新郎' },
  { id: 3, title: '婚礼现场', description: '精心布置的婚礼会场' },
  { id: 4, title: '切蛋糕', description: '甜蜜的蛋糕，甜蜜的我们' },
  { id: 5, title: '敬酒', description: '感谢亲友的祝福' },
  { id: 6, title: '合影', description: '与家人朋友的珍贵合照' },
  { id: 7, title: '求婚瞬间', description: '那一刻，她流下了幸福的泪水' },
  { id: 8, title: '蜜月', description: '海边的浪漫时光' }
]);

const selectedPhoto = ref(null);

const selectPhoto = (photo) => {
  selectedPhoto.value = photo;
};

// 留言功能
const messages = ref([]);
const newMessage = ref({
  name: '',
  content: ''
});

// 加载留言
const loadMessages = async () => {
  try {
    const response = await fetch('/api/wedding/messages');
    const data = await response.json();
    if (data.success) {
      messages.value = data.messages;
    }
  } catch (error) {
    console.error('加载留言失败:', error);
  }
};

// 提交留言
const submitMessage = async () => {
  if (!newMessage.value.name.trim() || !newMessage.value.content.trim()) {
    return;
  }

  try {
    const response = await fetch('/api/wedding/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: newMessage.value.name.trim(),
        content: newMessage.value.content.trim()
      })
    });

    const data = await response.json();
    if (data.success) {
      messages.value = data.messages;
      // 清空输入
      newMessage.value.name = '';
      newMessage.value.content = '';
    }
  } catch (error) {
    console.error('提交留言失败:', error);
    alert('提交失败，请稍后重试');
  }
};

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  // 小于1分钟
  if (diff < 60000) {
    return '刚刚';
  }
  // 小于1小时
  if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`;
  }
  // 小于1天
  if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`;
  }
  // 小于7天
  if (diff < 604800000) {
    return `${Math.floor(diff / 86400000)}天前`;
  }

  // 否则显示日期
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
</script>

<style scoped>
.wedding-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #FFFFFF;
  padding: 40px 20px;
  font-family: 'Courier New', 'Microsoft YaHei', sans-serif;
}

/* 标题区域 */
.wedding-header {
  text-align: center;
  margin-bottom: 50px;
  padding: 40px 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  backdrop-filter: blur(10px);
}

.wedding-title {
  font-size: 2.5em;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 3px;
}

.couple-names {
  font-size: 1.8em;
  margin: 20px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.groom-name, .bride-name {
  font-weight: bold;
}

.heart {
  color: #ff69b4;
  font-size: 1.2em;
  animation: heartbeat 1.5s infinite;
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.wedding-date {
  font-size: 1.3em;
  color: #ffd700;
  margin-top: 15px;
}

/* 计数器区域 */
.counters-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.counter-card {
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  padding: 30px;
  text-align: center;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.counter-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.counter-label {
  font-size: 1.1em;
  margin-bottom: 15px;
  opacity: 0.9;
}

.counter-value {
  font-size: 3em;
  font-weight: bold;
  color: #ffd700;
  margin: 10px 0;
}

.counter-unit {
  font-size: 1.2em;
  opacity: 0.8;
}

/* 时间轴 */
.timeline-section {
  max-width: 900px;
  margin: 0 auto 50px;
}

.section-title {
  font-size: 2em;
  text-align: center;
  margin-bottom: 40px;
  color: #ffd700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.timeline {
  position: relative;
  padding: 20px 0;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 3px;
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(-50%);
}

.timeline-item {
  position: relative;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
}

.timeline-left {
  justify-content: flex-end;
  padding-right: calc(50% + 30px);
}

.timeline-right {
  justify-content: flex-start;
  padding-left: calc(50% + 30px);
}

.timeline-dot {
  position: absolute;
  left: 50%;
  width: 20px;
  height: 20px;
  background: #ffd700;
  border: 3px solid #fff;
  border-radius: 50%;
  transform: translateX(-50%);
  z-index: 2;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
}

.timeline-content {
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  padding: 20px;
  max-width: 400px;
  backdrop-filter: blur(10px);
}

.timeline-date {
  color: #ffd700;
  font-size: 0.9em;
  margin-bottom: 10px;
}

.timeline-title {
  font-size: 1.3em;
  font-weight: bold;
  margin-bottom: 10px;
}

.timeline-desc {
  opacity: 0.9;
  line-height: 1.6;
}

/* 照片墙 */
.photos-section {
  max-width: 1200px;
  margin: 0 auto 50px;
}

.photo-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.photo-card {
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  padding: 15px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  backdrop-filter: blur(10px);
}

.photo-card:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.photo-card.selected {
  border-color: #ffd700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}

.photo-placeholder {
  aspect-ratio: 4/3;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  font-size: 3em;
}

.photo-icon {
  font-size: 1em;
  margin-bottom: 10px;
}

.photo-number {
  font-size: 0.4em;
  opacity: 0.7;
}

.photo-title {
  text-align: center;
  font-size: 1.1em;
}

/* 照片查看器 */
.photo-viewer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.photo-viewer-content {
  position: relative;
  max-width: 800px;
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  padding: 30px;
  backdrop-filter: blur(20px);
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.5);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.photo-large {
  aspect-ratio: 16/9;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 5em;
}

.photo-icon-large {
  font-size: 1em;
  margin-bottom: 20px;
}

.photo-number-large {
  font-size: 0.3em;
  opacity: 0.7;
}

.photo-info h3 {
  font-size: 1.5em;
  margin-bottom: 10px;
  color: #ffd700;
}

.photo-info p {
  opacity: 0.9;
  line-height: 1.6;
}

/* 留言区域 */
.messages-section {
  max-width: 800px;
  margin: 0 auto;
}

.message-input-area {
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  padding: 25px;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
}

.input-name {
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 15px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 1em;
  font-family: inherit;
}

.input-name::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.input-message {
  width: 100%;
  min-height: 100px;
  padding: 12px 15px;
  margin-bottom: 15px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 1em;
  font-family: inherit;
  resize: vertical;
}

.input-message::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background: rgba(255, 215, 0, 0.8);
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  color: #333;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  background: rgba(255, 215, 0, 1);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.message-card {
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.message-author {
  font-weight: bold;
  color: #ffd700;
  font-size: 1.1em;
}

.message-time {
  font-size: 0.9em;
  opacity: 0.7;
}

.message-content {
  line-height: 1.6;
  opacity: 0.95;
}

.no-messages {
  text-align: center;
  padding: 40px 20px;
  opacity: 0.7;
  font-size: 1.1em;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .wedding-title {
    font-size: 1.8em;
  }

  .couple-names {
    font-size: 1.3em;
    gap: 10px;
  }

  .wedding-date {
    font-size: 1em;
  }

  .counter-value {
    font-size: 2.5em;
  }

  .timeline::before {
    left: 20px;
  }

  .timeline-left, .timeline-right {
    padding-left: 60px;
    padding-right: 0;
  }

  .timeline-dot {
    left: 20px;
  }

  .photo-gallery {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
</style>
