<template>
  <div
    class="horror-container"
    :class="{ 'invert': isInverted }"
    @click="handleClick"
    @mousemove="handleMouseMove"
  >
    <div
      v-for="(char, index) in characters"
      :key="index"
      class="yi-char"
      :style="getCharStyle(char, index)"
      :class="{
        'flicker': char.flicker,
        'pulse': char.pulse,
        'shake': char.shake,
        'hover-effect': char.isHovered
      }"
    >
      一
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const characters = ref([]);
const isInverted = ref(false);
let animationFrame = null;
let invertInterval = null;
let flickerInterval = null;

// 生成大量"一"字
const generateCharacters = () => {
  const chars = [];
  const count = 500; // 生成500个"一"字

  for (let i = 0; i < count; i++) {
    chars.push({
      x: Math.random() * 100, // 0-100%
      y: Math.random() * 100,
      size: Math.random() * 150 + 10, // 10-160px
      opacity: Math.random() * 0.5 + 0.5, // 0.5-1
      rotation: Math.random() * 360,
      fontWeight: Math.random() > 0.5 ? 900 : 700,
      flicker: Math.random() > 0.7, // 30%的字会闪烁
      pulse: Math.random() > 0.8, // 20%的字会脉动
      shake: false,
      isHovered: false,
      zIndex: Math.floor(Math.random() * 100),
      animationDelay: Math.random() * 5
    });
  }

  characters.value = chars;
};

// 获取单个字符的样式
const getCharStyle = (char, index) => {
  return {
    left: `${char.x}%`,
    top: `${char.y}%`,
    fontSize: `${char.size}px`,
    opacity: char.opacity,
    transform: `rotate(${char.rotation}deg)`,
    fontWeight: char.fontWeight,
    zIndex: char.zIndex,
    animationDelay: `${char.animationDelay}s`
  };
};

// 处理点击事件 - 触发全局闪烁
const handleClick = () => {
  isInverted.value = !isInverted.value;

  // 随机震动一些字
  characters.value.forEach(char => {
    if (Math.random() > 0.5) {
      char.shake = true;
      setTimeout(() => {
        char.shake = false;
      }, 300);
    }
  });
};

// 处理鼠标移动 - 影响附近的字
const handleMouseMove = (e) => {
  const mouseX = (e.clientX / window.innerWidth) * 100;
  const mouseY = (e.clientY / window.innerHeight) * 100;

  characters.value.forEach(char => {
    const distance = Math.sqrt(
      Math.pow(char.x - mouseX, 2) + Math.pow(char.y - mouseY, 2)
    );

    // 如果鼠标在字符附近，触发悬停效果
    char.isHovered = distance < 10;
  });
};

// 随机背景反转效果
const startRandomInvert = () => {
  invertInterval = setInterval(() => {
    if (Math.random() > 0.7) {
      isInverted.value = !isInverted.value;
      setTimeout(() => {
        isInverted.value = !isInverted.value;
      }, Math.random() * 200 + 50);
    }
  }, Math.random() * 3000 + 2000);
};

// 随机闪烁效果
const startRandomFlicker = () => {
  flickerInterval = setInterval(() => {
    characters.value.forEach(char => {
      if (Math.random() > 0.95) {
        const originalOpacity = char.opacity;
        char.opacity = Math.random() * 0.3;
        setTimeout(() => {
          char.opacity = originalOpacity;
        }, Math.random() * 100 + 50);
      }
    });
  }, 200);
};

onMounted(() => {
  generateCharacters();
  startRandomInvert();
  startRandomFlicker();
});

onUnmounted(() => {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  if (invertInterval) clearInterval(invertInterval);
  if (flickerInterval) clearInterval(flickerInterval);
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.horror-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000000;
  overflow: hidden;
  cursor: crosshair;
  transition: background-color 0.1s ease;
}

.horror-container.invert {
  background: #ffffff;
}

.yi-char {
  position: absolute;
  color: #ffffff;
  font-family: 'Arial Black', 'Helvetica Neue', Arial, sans-serif;
  user-select: none;
  pointer-events: none;
  white-space: nowrap;
  line-height: 1;
  transition: opacity 0.1s ease;
  will-change: transform, opacity;
}

.horror-container.invert .yi-char {
  color: #000000;
}

/* 闪烁动画 */
.yi-char.flicker {
  animation: flicker-animation 3s infinite;
}

@keyframes flicker-animation {
  0%, 100% { opacity: 1; }
  10% { opacity: 0.3; }
  20% { opacity: 1; }
  30% { opacity: 0.5; }
  40% { opacity: 1; }
  50% { opacity: 0.2; }
  60% { opacity: 1; }
  70% { opacity: 0.7; }
  80% { opacity: 1; }
}

/* 脉动动画 */
.yi-char.pulse {
  animation: pulse-animation 2s ease-in-out infinite;
}

@keyframes pulse-animation {
  0%, 100% {
    transform: scale(1) rotate(var(--rotation, 0deg));
    opacity: 1;
  }
  50% {
    transform: scale(1.3) rotate(var(--rotation, 0deg));
    opacity: 0.5;
  }
}

/* 震动动画 */
.yi-char.shake {
  animation: shake-animation 0.3s ease-in-out;
}

@keyframes shake-animation {
  0%, 100% { transform: translate(0, 0) rotate(var(--rotation, 0deg)); }
  10% { transform: translate(-5px, -5px) rotate(calc(var(--rotation, 0deg) + 5deg)); }
  20% { transform: translate(5px, 5px) rotate(calc(var(--rotation, 0deg) - 5deg)); }
  30% { transform: translate(-5px, 5px) rotate(calc(var(--rotation, 0deg) + 5deg)); }
  40% { transform: translate(5px, -5px) rotate(calc(var(--rotation, 0deg) - 5deg)); }
  50% { transform: translate(-3px, -3px) rotate(calc(var(--rotation, 0deg) + 3deg)); }
  60% { transform: translate(3px, 3px) rotate(calc(var(--rotation, 0deg) - 3deg)); }
  70% { transform: translate(-3px, 3px) rotate(calc(var(--rotation, 0deg) + 3deg)); }
  80% { transform: translate(3px, -3px) rotate(calc(var(--rotation, 0deg) - 3deg)); }
  90% { transform: translate(-1px, -1px) rotate(calc(var(--rotation, 0deg) + 1deg)); }
}

/* 悬停效果 */
.yi-char.hover-effect {
  animation: hover-effect-animation 0.5s ease-in-out;
  opacity: 1 !important;
}

@keyframes hover-effect-animation {
  0% { transform: scale(1); }
  50% { transform: scale(1.5); }
  100% { transform: scale(1); }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .yi-char {
    font-size: 0.8em;
  }
}

/* 增加一些全局的诡异氛围效果 */
.horror-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    transparent 0px,
    transparent 2px,
    rgba(255, 255, 255, 0.03) 2px,
    rgba(255, 255, 255, 0.03) 4px
  );
  pointer-events: none;
  z-index: 1000;
  animation: scan-line 8s linear infinite;
}

@keyframes scan-line {
  0% { transform: translateY(0); }
  100% { transform: translateY(100vh); }
}

.horror-container.invert::before {
  background: repeating-linear-gradient(
    0deg,
    transparent 0px,
    transparent 2px,
    rgba(0, 0, 0, 0.03) 2px,
    rgba(0, 0, 0, 0.03) 4px
  );
}
</style>
