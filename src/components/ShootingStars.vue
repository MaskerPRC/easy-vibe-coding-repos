<template>
  <div class="shooting-stars-container">
    <div
      v-for="star in stars"
      :key="star.id"
      class="shooting-star"
      :class="{ reverse: star.reverse }"
      :style="star.style"
    >
      <div class="star-tail"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const stars = ref([]);
let starId = 0;
let intervalId = null;

// 创建一颗流星
const createStar = () => {
  // 30%的概率生成逆飞流星
  const isReverse = Math.random() < 0.3;

  // 随机位置
  const startX = Math.random() * 100;
  const startY = Math.random() * 100;

  // 随机持续时间（1-3秒）
  const duration = 1 + Math.random() * 2;

  // 随机延迟
  const delay = Math.random() * 0.5;

  // 随机大小
  const scale = 0.5 + Math.random() * 0.5;

  const star = {
    id: starId++,
    reverse: isReverse,
    style: {
      left: `${startX}%`,
      top: `${startY}%`,
      animationDuration: `${duration}s`,
      animationDelay: `${delay}s`,
      transform: `scale(${scale})`,
    }
  };

  stars.value.push(star);

  // 动画结束后移除流星
  setTimeout(() => {
    const index = stars.value.findIndex(s => s.id === star.id);
    if (index !== -1) {
      stars.value.splice(index, 1);
    }
  }, (duration + delay) * 1000);
};

onMounted(() => {
  // 初始创建几颗流星
  for (let i = 0; i < 3; i++) {
    setTimeout(() => createStar(), i * 500);
  }

  // 每隔2-5秒随机创建新的流星
  const scheduleNext = () => {
    const delay = 2000 + Math.random() * 3000;
    intervalId = setTimeout(() => {
      createStar();
      scheduleNext();
    }, delay);
  };

  scheduleNext();
});

onUnmounted(() => {
  if (intervalId) {
    clearTimeout(intervalId);
  }
});
</script>

<style scoped>
.shooting-stars-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
  overflow: hidden;
}

.shooting-star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  box-shadow:
    0 0 6px 2px rgba(255, 255, 255, 0.8),
    0 0 10px 4px rgba(135, 206, 250, 0.6),
    0 0 14px 6px rgba(173, 216, 230, 0.4);
  animation: shoot 2s linear forwards;
}

.shooting-star.reverse {
  animation: shoot-reverse 2s linear forwards;
}

.star-tail {
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  height: 2px;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.8),
    rgba(135, 206, 250, 0.4),
    transparent
  );
  transform-origin: 0 50%;
  transform: rotate(-45deg);
}

.shooting-star.reverse .star-tail {
  background: linear-gradient(
    to left,
    rgba(255, 255, 255, 0.8),
    rgba(135, 206, 250, 0.4),
    transparent
  );
  transform: rotate(135deg);
}

@keyframes shoot {
  0% {
    transform: translate(0, 0) scale(var(--scale, 1));
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    transform: translate(300px, 300px) scale(var(--scale, 1));
    opacity: 0;
  }
}

@keyframes shoot-reverse {
  0% {
    transform: translate(0, 0) scale(var(--scale, 1));
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    transform: translate(-300px, -300px) scale(var(--scale, 1));
    opacity: 0;
  }
}

/* 针对小屏幕调整 */
@media (max-width: 768px) {
  @keyframes shoot {
    100% {
      transform: translate(200px, 200px) scale(var(--scale, 1));
    }
  }

  @keyframes shoot-reverse {
    100% {
      transform: translate(-200px, -200px) scale(var(--scale, 1));
    }
  }

  .star-tail {
    width: 60px;
  }
}
</style>
