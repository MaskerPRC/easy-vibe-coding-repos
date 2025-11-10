<template>
  <div class="desktop-pet-wrapper">
    <!-- 桌宠主体 -->
    <div
      ref="petElement"
      class="desktop-pet"
      :class="{ 'is-dragging': isDragging, 'is-speaking': isSpeaking }"
      :style="petStyle"
      @mousedown="startDrag"
      @click="handleClick"
      @mouseenter="handleHover"
    >
      <!-- 猫咪身体 -->
      <div class="pet-body">
        <!-- 耳朵 -->
        <div class="ear ear-left"></div>
        <div class="ear ear-right"></div>

        <!-- 头部 -->
        <div class="pet-head">
          <!-- 眼睛 -->
          <div class="eyes">
            <div class="eye eye-left" :class="{ 'eye-closed': eyesClosed }">
              <div class="pupil"></div>
            </div>
            <div class="eye eye-right" :class="{ 'eye-closed': eyesClosed }">
              <div class="pupil"></div>
            </div>
          </div>

          <!-- 鼻子 -->
          <div class="nose"></div>

          <!-- 嘴巴 -->
          <div class="mouth" :class="moodClass"></div>
        </div>

        <!-- 身体 -->
        <div class="pet-torso">
          <!-- 爱心装饰 -->
          <div class="heart-decoration"></div>
        </div>

        <!-- 尾巴 -->
        <div class="tail"></div>
      </div>

      <!-- 对话气泡 -->
      <transition name="bubble">
        <div v-if="showBubble" class="speech-bubble">
          <div class="bubble-content">{{ currentMessage }}</div>
          <div class="bubble-arrow"></div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

// 拖拽相关状态
const petElement = ref(null);
const isDragging = ref(false);
const position = ref({ x: 100, y: 100 });
const dragOffset = ref({ x: 0, y: 0 });

// 互动相关状态
const showBubble = ref(false);
const currentMessage = ref('');
const eyesClosed = ref(false);
const isSpeaking = ref(false);
const mood = ref('happy'); // happy, excited, sleepy

// 预设的对话内容
const messages = [
  '你好呀！我是你的桌宠~ 😊',
  '今天要加油哦！',
  '休息一下吧~ zzZ',
  '点击我可以互动哦！',
  '喵~ 陪你工作！',
  '要不要摸摸我？',
  '我会一直陪着你的~',
  '做得很棒！继续加油！'
];

// 计算样式
const petStyle = computed(() => ({
  left: `${position.value.x}px`,
  top: `${position.value.y}px`,
}));

// 心情样式
const moodClass = computed(() => ({
  'mood-happy': mood.value === 'happy',
  'mood-excited': mood.value === 'excited',
  'mood-sleepy': mood.value === 'sleepy',
}));

// 开始拖拽
const startDrag = (e) => {
  if (e.button !== 0) return; // 只响应左键

  isDragging.value = true;
  const rect = petElement.value.getBoundingClientRect();
  dragOffset.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };

  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);

  // 拖拽时隐藏气泡
  showBubble.value = false;
};

// 拖拽中
const onDrag = (e) => {
  if (!isDragging.value) return;

  const newX = e.clientX - dragOffset.value.x;
  const newY = e.clientY - dragOffset.value.y;

  // 限制在视窗范围内
  const maxX = window.innerWidth - 100;
  const maxY = window.innerHeight - 100;

  position.value = {
    x: Math.max(0, Math.min(newX, maxX)),
    y: Math.max(0, Math.min(newY, maxY)),
  };
};

// 停止拖拽
const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
};

// 点击互动
const handleClick = () => {
  if (isDragging.value) return;

  // 随机选择一条消息
  const randomIndex = Math.floor(Math.random() * messages.length);
  currentMessage.value = messages[randomIndex];

  // 显示对话气泡
  showBubble.value = true;
  isSpeaking.value = true;

  // 随机心情
  const moods = ['happy', 'excited'];
  mood.value = moods[Math.floor(Math.random() * moods.length)];

  // 3秒后隐藏气泡
  setTimeout(() => {
    showBubble.value = false;
    isSpeaking.value = false;
    mood.value = 'happy';
  }, 3000);
};

// 鼠标悬停
const handleHover = () => {
  if (!isDragging.value && !showBubble.value) {
    // 眨眼动画
    eyesClosed.value = true;
    setTimeout(() => {
      eyesClosed.value = false;
    }, 150);
  }
};

// 自动眨眼
let blinkInterval = null;
const startBlinking = () => {
  blinkInterval = setInterval(() => {
    if (!isDragging.value) {
      eyesClosed.value = true;
      setTimeout(() => {
        eyesClosed.value = false;
      }, 150);
    }
  }, 4000);
};

// 随机自动说话
let autoSpeakInterval = null;
const startAutoSpeak = () => {
  autoSpeakInterval = setInterval(() => {
    if (!showBubble.value && Math.random() > 0.5) {
      const randomIndex = Math.floor(Math.random() * messages.length);
      currentMessage.value = messages[randomIndex];
      showBubble.value = true;

      setTimeout(() => {
        showBubble.value = false;
      }, 3000);
    }
  }, 20000); // 每20秒可能说一次话
};

// 生命周期
onMounted(() => {
  // 随机初始位置
  position.value = {
    x: Math.random() * (window.innerWidth - 200) + 50,
    y: Math.random() * (window.innerHeight - 200) + 50,
  };

  startBlinking();
  startAutoSpeak();
});

onUnmounted(() => {
  if (blinkInterval) clearInterval(blinkInterval);
  if (autoSpeakInterval) clearInterval(autoSpeakInterval);
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
});
</script>

<style scoped>
.desktop-pet-wrapper {
  position: relative;
  pointer-events: none;
}

.desktop-pet {
  position: fixed;
  width: 100px;
  height: 100px;
  cursor: move;
  z-index: 9999;
  pointer-events: all;
  user-select: none;
  transition: transform 0.2s ease;
}

.desktop-pet:hover {
  transform: scale(1.05);
}

.desktop-pet.is-dragging {
  cursor: grabbing;
  transform: scale(1.1);
}

.desktop-pet.is-speaking {
  animation: bounce 0.5s ease;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* 猫咪身体 */
.pet-body {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 耳朵 */
.ear {
  position: absolute;
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-bottom: 20px solid #FFB6D9;
  top: 5px;
  z-index: 1;
  animation: ear-wiggle 2s ease-in-out infinite;
}

.ear-left {
  left: 18px;
  transform: rotate(-15deg);
}

.ear-right {
  right: 18px;
  transform: rotate(15deg);
}

@keyframes ear-wiggle {
  0%, 100% { transform: rotate(-15deg); }
  50% { transform: rotate(-20deg); }
}

.ear-right {
  animation: ear-wiggle-right 2s ease-in-out infinite;
}

@keyframes ear-wiggle-right {
  0%, 100% { transform: rotate(15deg); }
  50% { transform: rotate(20deg); }
}

/* 头部 */
.pet-head {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #FFD6E8 0%, #FFB6D9 100%);
  border-radius: 50%;
  position: relative;
  margin-top: 15px;
  box-shadow: 0 4px 12px rgba(255, 182, 217, 0.3);
  z-index: 2;
}

/* 眼睛 */
.eyes {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 16px;
}

.eye {
  width: 8px;
  height: 8px;
  background: #2C3E50;
  border-radius: 50%;
  position: relative;
  transition: all 0.15s ease;
}

.eye-closed {
  height: 2px;
  border-radius: 0;
}

.pupil {
  width: 4px;
  height: 4px;
  background: #fff;
  border-radius: 50%;
  position: absolute;
  top: 1px;
  left: 1px;
}

/* 鼻子 */
.nose {
  width: 6px;
  height: 5px;
  background: #FF91C7;
  border-radius: 0 0 50% 50%;
  position: absolute;
  top: 32px;
  left: 50%;
  transform: translateX(-50%);
}

/* 嘴巴 */
.mouth {
  position: absolute;
  top: 37px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 10px;
}

.mouth::before,
.mouth::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 6px;
  border: 1px solid #FF91C7;
  border-top: none;
  border-radius: 0 0 8px 8px;
}

.mouth::before {
  left: 0;
}

.mouth::after {
  right: 0;
}

.mouth.mood-excited::before,
.mouth.mood-excited::after {
  border-color: #FF6BB5;
  height: 8px;
}

.mouth.mood-sleepy::before,
.mouth.mood-sleepy::after {
  opacity: 0.5;
}

/* 身体 */
.pet-torso {
  width: 50px;
  height: 35px;
  background: linear-gradient(135deg, #FFD6E8 0%, #FFB6D9 100%);
  border-radius: 50% 50% 60% 60%;
  margin-top: -5px;
  position: relative;
  box-shadow: 0 4px 12px rgba(255, 182, 217, 0.2);
  animation: breathe 2s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.05); }
}

/* 爱心装饰 */
.heart-decoration {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  background: #FF91C7;
  transform-origin: center;
  animation: heart-beat 1.5s ease-in-out infinite;
}

.heart-decoration::before,
.heart-decoration::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  background: #FF91C7;
  border-radius: 50%;
}

.heart-decoration::before {
  top: -4px;
  left: 0;
}

.heart-decoration::after {
  left: 4px;
  top: 0;
}

@keyframes heart-beat {
  0%, 100% { transform: translateX(-50%) scale(1); }
  50% { transform: translateX(-50%) scale(1.2); }
}

/* 尾巴 */
.tail {
  width: 25px;
  height: 25px;
  background: #FFB6D9;
  border-radius: 50%;
  position: absolute;
  bottom: 10px;
  right: -5px;
  transform-origin: top left;
  animation: tail-wag 1.5s ease-in-out infinite;
}

@keyframes tail-wag {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(20deg); }
}

/* 对话气泡 */
.speech-bubble {
  position: absolute;
  bottom: 110px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid #FFB6D9;
  border-radius: 12px;
  padding: 10px 15px;
  min-width: 120px;
  max-width: 200px;
  box-shadow: 0 4px 15px rgba(255, 182, 217, 0.4);
  z-index: 10000;
  pointer-events: none;
  backdrop-filter: blur(5px);
}

.bubble-content {
  color: #2C3E50;
  font-size: 13px;
  line-height: 1.4;
  text-align: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

.bubble-arrow {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid #FFB6D9;
}

.bubble-arrow::before {
  content: '';
  position: absolute;
  bottom: 2px;
  left: -6px;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid rgba(255, 255, 255, 0.95);
}

/* 气泡动画 */
.bubble-enter-active {
  animation: bubble-in 0.3s ease;
}

.bubble-leave-active {
  animation: bubble-out 0.3s ease;
}

@keyframes bubble-in {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(10px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
  }
}

@keyframes bubble-out {
  from {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px) scale(0.8);
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .desktop-pet {
    width: 80px;
    height: 80px;
  }

  .pet-head {
    width: 50px;
    height: 50px;
  }

  .pet-torso {
    width: 40px;
    height: 28px;
  }

  .speech-bubble {
    min-width: 100px;
    max-width: 150px;
    font-size: 12px;
  }
}
</style>
