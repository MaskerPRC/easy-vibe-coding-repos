<template>
  <div class="snowfall-container">
    <div
      v-for="(snowflake, index) in snowflakes"
      :key="index"
      class="snowflake"
      :style="snowflake.style"
    >
      ❄
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const snowflakes = ref([]);

// 生成随机雪花
const generateSnowflakes = () => {
  const count = 50; // 雪花数量
  const flakes = [];

  for (let i = 0; i < count; i++) {
    flakes.push({
      style: {
        left: `${Math.random() * 100}%`,
        fontSize: `${Math.random() * 10 + 10}px`,
        animationDuration: `${Math.random() * 3 + 5}s`,
        animationDelay: `${Math.random() * 5}s`,
        opacity: Math.random() * 0.6 + 0.4,
        animationName: Math.random() > 0.5 ? 'fall' : 'fall-swing'
      }
    });
  }

  snowflakes.value = flakes;
};

onMounted(() => {
  generateSnowflakes();
});
</script>

<style scoped>
.snowfall-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  overflow: hidden;
}

.snowflake {
  position: absolute;
  top: -20px;
  color: #fff;
  user-select: none;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes fall {
  to {
    transform: translateY(100vh);
  }
}

@keyframes fall-swing {
  0% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(25vh) translateX(20px);
  }
  50% {
    transform: translateY(50vh) translateX(0);
  }
  75% {
    transform: translateY(75vh) translateX(-20px);
  }
  100% {
    transform: translateY(100vh) translateX(0);
  }
}
</style>
