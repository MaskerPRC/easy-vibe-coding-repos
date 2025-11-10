<template>
  <div
    ref="petElement"
    class="desktop-pet"
    :style="petStyle"
    @mousedown="startDrag"
    @click="handleClick"
    @dblclick="handleDoubleClick"
  >
    <div class="pet-text">宠物</div>

    <div v-if="showBubble" class="speech-bubble">
      {{ currentMessage }}
    </div>

    <div v-if="showHeart" class="heart-icon">爱心</div>
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
  cursor: grab;
  z-index: 9999;
  user-select: none;
  border: 1px solid black;
  padding: 10px;
  background: white;
}

.pet-text {
  font-size: 14px;
  color: black;
}

.speech-bubble {
  position: absolute;
  background: white;
  border: 1px solid black;
  padding: 8px 12px;
  top: -45px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 14px;
  color: black;
}

.heart-icon {
  position: absolute;
  font-size: 14px;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  color: black;
}
</style>
