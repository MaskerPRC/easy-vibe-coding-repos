<template>
  <div
    ref="petElement"
    class="desktop-pet"
    :style="petStyle"
    @mousedown="startDrag"
    @click="handleClick"
    @dblclick="handleDoubleClick"
    :class="{ 'dragging': isDragging, 'jumping': isJumping }"
  >
    <!-- 宠物身体 -->
    <div class="pet-body">
      <!-- 耳朵 -->
      <div class="ear ear-left"></div>
      <div class="ear ear-right"></div>

      <!-- 头部 -->
      <div class="head">
        <!-- 眼睛 -->
        <div class="eyes">
          <div class="eye eye-left" :class="{ 'blinking': isBlinking }">
            <div class="pupil"></div>
          </div>
          <div class="eye eye-right" :class="{ 'blinking': isBlinking }">
            <div class="pupil"></div>
          </div>
        </div>

        <!-- 鼻子 -->
        <div class="nose"></div>

        <!-- 嘴巴 -->
        <div class="mouth"></div>
      </div>

      <!-- 身体 -->
      <div class="body">
        <!-- 爪子 -->
        <div class="paws">
          <div class="paw paw-left"></div>
          <div class="paw paw-right"></div>
        </div>
      </div>

      <!-- 尾巴 -->
      <div class="tail" :class="{ 'wagging': isWagging }"></div>
    </div>

    <!-- 对话框 -->
    <transition name="bubble">
      <div v-if="showBubble" class="speech-bubble">
        {{ currentMessage }}
      </div>
    </transition>

    <!-- 爱心特效 -->
    <transition name="heart">
      <div v-if="showHeart" class="heart-icon">❤️</div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

// 位置状态
const position = ref({ x: 100, y: 100 });
const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });
const petElement = ref(null);

// 动画状态
const isJumping = ref(false);
const isBlinking = ref(false);
const isWagging = ref(false);
const showBubble = ref(false);
const showHeart = ref(false);
const currentMessage = ref('');

// 对话消息列表
const messages = [
  '喵~ 🐱',
  '你好呀！',
  '陪我玩吧！',
  '我饿了...',
  '好开心！',
  '要抱抱~',
  '别戳我啦！',
  '让我休息一下~',
];

// 计算样式
const petStyle = computed(() => ({
  left: `${position.value.x}px`,
  top: `${position.value.y}px`,
}));

// 开始拖动
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

  e.preventDefault();
};

// 拖动中
const onDrag = (e) => {
  if (!isDragging.value) return;

  const newX = e.clientX - dragOffset.value.x;
  const newY = e.clientY - dragOffset.value.y;

  // 限制在窗口范围内
  const maxX = window.innerWidth - 100;
  const maxY = window.innerHeight - 100;

  position.value = {
    x: Math.max(0, Math.min(newX, maxX)),
    y: Math.max(0, Math.min(newY, maxY)),
  };
};

// 停止拖动
const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
};

// 点击交互
const handleClick = () => {
  if (isDragging.value) return;

  // 显示随机消息
  const randomIndex = Math.floor(Math.random() * messages.length);
  currentMessage.value = messages[randomIndex];
  showBubble.value = true;

  // 摇尾巴
  isWagging.value = true;

  setTimeout(() => {
    showBubble.value = false;
    isWagging.value = false;
  }, 2000);
};

// 双击交互
const handleDoubleClick = () => {
  if (isDragging.value) return;

  // 跳跃动画
  isJumping.value = true;
  showHeart.value = true;

  setTimeout(() => {
    isJumping.value = false;
  }, 600);

  setTimeout(() => {
    showHeart.value = false;
  }, 1500);
};

// 眨眼动画
const startBlinking = () => {
  isBlinking.value = true;
  setTimeout(() => {
    isBlinking.value = false;
  }, 200);
};

// 定时眨眼
let blinkInterval;
onMounted(() => {
  // 随机眨眼
  blinkInterval = setInterval(() => {
    if (Math.random() > 0.7) {
      startBlinking();
    }
  }, 3000);

  // 初始位置随机
  position.value = {
    x: Math.random() * (window.innerWidth - 200) + 50,
    y: Math.random() * (window.innerHeight - 200) + 50,
  };
});

onUnmounted(() => {
  clearInterval(blinkInterval);
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
});
</script>

<style scoped>
.desktop-pet {
  position: fixed;
  width: 100px;
  height: 100px;
  cursor: grab;
  z-index: 9999;
  user-select: none;
  transition: transform 0.1s ease;
}

.desktop-pet.dragging {
  cursor: grabbing;
  transform: scale(1.1);
}

.desktop-pet.jumping {
  animation: jump 0.6s ease;
}

@keyframes jump {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-30px) rotate(-5deg); }
  50% { transform: translateY(-40px) rotate(0deg); }
  75% { transform: translateY(-30px) rotate(5deg); }
}

.pet-body {
  position: relative;
  width: 100%;
  height: 100%;
}

/* 耳朵 */
.ear {
  position: absolute;
  width: 20px;
  height: 25px;
  background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
  border-radius: 80% 20% 0 0;
  top: 5px;
}

.ear-left {
  left: 15px;
  transform: rotate(-30deg);
}

.ear-right {
  right: 15px;
  transform: rotate(30deg);
}

.ear::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 12px;
  background: #ffd5d5;
  border-radius: 50%;
  top: 8px;
  left: 5px;
}

/* 头部 */
.head {
  position: absolute;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #ffa8a8 0%, #ffd0d0 100%);
  border-radius: 50%;
  top: 15px;
  left: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* 眼睛 */
.eyes {
  position: absolute;
  width: 100%;
  top: 18px;
  display: flex;
  justify-content: space-around;
  padding: 0 12px;
}

.eye {
  width: 12px;
  height: 14px;
  background: white;
  border-radius: 50%;
  position: relative;
  box-shadow: inset 0 -2px 3px rgba(0, 0, 0, 0.1);
  transition: height 0.1s;
}

.eye.blinking {
  height: 2px;
}

.pupil {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #333;
  border-radius: 50%;
  top: 4px;
  left: 3px;
}

.eye.blinking .pupil {
  display: none;
}

/* 鼻子 */
.nose {
  position: absolute;
  width: 8px;
  height: 6px;
  background: #ff6b9d;
  border-radius: 50%;
  top: 35px;
  left: 26px;
}

/* 嘴巴 */
.mouth {
  position: absolute;
  width: 20px;
  height: 10px;
  top: 38px;
  left: 20px;
}

.mouth::before,
.mouth::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  border: 2px solid #ff6b9d;
  border-top: none;
  border-right: none;
  border-radius: 0 0 0 8px;
}

.mouth::before {
  left: 2px;
  transform: rotate(15deg);
}

.mouth::after {
  right: 2px;
  transform: rotate(-15deg) scaleX(-1);
}

/* 身体 */
.body {
  position: absolute;
  width: 50px;
  height: 35px;
  background: linear-gradient(135deg, #ffa8a8 0%, #ffd0d0 100%);
  border-radius: 50% 50% 50% 50% / 40% 40% 60% 60%;
  top: 60px;
  left: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 爪子 */
.paws {
  position: absolute;
  bottom: -8px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 0 5px;
}

.paw {
  width: 12px;
  height: 15px;
  background: #ffa8a8;
  border-radius: 40% 40% 50% 50%;
}

/* 尾巴 */
.tail {
  position: absolute;
  width: 30px;
  height: 35px;
  background: linear-gradient(135deg, #ffa8a8 0%, #ffd0d0 100%);
  border-radius: 50% 30% 30% 50%;
  top: 65px;
  right: 8px;
  transform-origin: top left;
  transform: rotate(20deg);
  transition: transform 0.3s ease;
}

.tail.wagging {
  animation: wag 0.3s ease-in-out 3;
}

@keyframes wag {
  0%, 100% { transform: rotate(20deg); }
  50% { transform: rotate(-10deg); }
}

/* 对话框 */
.speech-bubble {
  position: absolute;
  background: white;
  border-radius: 12px;
  padding: 8px 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  top: -45px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.speech-bubble::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid white;
}

.bubble-enter-active,
.bubble-leave-active {
  transition: all 0.3s ease;
}

.bubble-enter-from,
.bubble-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px) scale(0.8);
}

/* 爱心特效 */
.heart-icon {
  position: absolute;
  font-size: 24px;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  animation: float-heart 1.5s ease;
}

@keyframes float-heart {
  0% {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(0.5);
  }
  50% {
    opacity: 1;
    transform: translateX(-50%) translateY(-20px) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(-40px) scale(1.2);
  }
}

.heart-enter-active {
  animation: float-heart 1.5s ease;
}

.heart-leave-active {
  display: none;
}

/* 响应式 */
@media (max-width: 768px) {
  .desktop-pet {
    width: 80px;
    height: 80px;
  }

  .head {
    width: 50px;
    height: 50px;
    left: 15px;
  }

  .body {
    width: 40px;
    height: 28px;
    left: 20px;
    top: 50px;
  }
}
</style>
