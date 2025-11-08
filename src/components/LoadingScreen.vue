<template>
  <transition name="loading-fade">
    <div v-if="isVisible" class="loading-screen">
      <!-- 背景渐变 -->
      <div class="loading-background"></div>

      <!-- 标题 -->
      <div class="loading-title">
        <h1 class="title-main">🍰 日向美ビタースイーツ♪ 🍰</h1>
        <h2 class="title-sub">ひなビタ♪</h2>
      </div>

      <!-- 5位角色立绘弹出动画 -->
      <div class="characters-showcase">
        <div
          v-for="(character, index) in characters"
          :key="character.id"
          class="character-popup"
          :style="getCharacterStyle(index)"
        >
          <div class="character-wrapper">
            <img :src="character.image" :alt="character.name" class="character-img" />
            <div class="character-name-tag" :style="{ background: character.gradient }">
              {{ character.name }}
            </div>
          </div>
        </div>
      </div>

      <!-- 加载进度条 -->
      <div class="loading-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <p class="loading-text">{{ loadingText }}</p>
      </div>

      <!-- 装饰音符 -->
      <div class="music-notes">
        <div v-for="i in 20" :key="i" class="note" :style="getNoteStyle(i)">
          {{ ['🎵', '🎶', '♪', '♫'][i % 4] }}
        </div>
      </div>

      <!-- 甜点装饰 -->
      <div class="sweets-decoration">
        <div class="sweet sweet-1">🧁</div>
        <div class="sweet sweet-2">🍰</div>
        <div class="sweet sweet-3">🍬</div>
        <div class="sweet sweet-4">🍭</div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const isVisible = ref(true);
const progress = ref(0);
const loadingText = ref('正在加载中...');

// 角色数据
const characters = ref([
  {
    id: 1,
    name: '春日咲子',
    image: '/images/characters/sakiko.svg',
    gradient: 'linear-gradient(135deg, #FFB6D9 0%, #FF69B4 100%)'
  },
  {
    id: 2,
    name: '芽兔めう',
    image: '/images/characters/meu.svg',
    gradient: 'linear-gradient(135deg, #FFF4B0 0%, #FFD700 100%)'
  },
  {
    id: 3,
    name: '和泉一舞',
    image: '/images/characters/ibuki.svg',
    gradient: 'linear-gradient(135deg, #B4E7FF 0%, #87CEEB 100%)'
  },
  {
    id: 4,
    name: '山形まり花',
    image: '/images/characters/marika.svg',
    gradient: 'linear-gradient(135deg, #C1FFC1 0%, #98FB98 100%)'
  },
  {
    id: 5,
    name: '霜月凛',
    image: '/images/characters/rin.svg',
    gradient: 'linear-gradient(135deg, #F0C4F0 0%, #DDA0DD 100%)'
  }
]);

// 获取角色样式（分布在屏幕上的位置）
const getCharacterStyle = (index) => {
  const positions = [
    { left: '10%', top: '35%' },    // 春日咲子 - 左侧
    { left: '25%', top: '50%' },    // 芽兔めう - 左中
    { left: '50%', top: '30%', transform: 'translateX(-50%)' }, // 和泉一舞 - 中央
    { right: '25%', top: '50%' },   // 山形まり花 - 右中
    { right: '10%', top: '35%' }    // 霜月凛 - 右侧
  ];

  return {
    ...positions[index],
    animationDelay: `${0.3 + index * 0.2}s`
  };
};

// 获取音符样式
const getNoteStyle = (index) => {
  return {
    left: `${(index * 5) % 100}%`,
    top: `${(index * 7) % 100}%`,
    animationDelay: `${index * 0.15}s`,
    fontSize: `${1.2 + (index % 3) * 0.4}rem`
  };
};

// 加载进度模拟
const simulateLoading = () => {
  const loadingSteps = [
    { progress: 20, text: '正在加载资源...' },
    { progress: 40, text: '正在准备角色立绘...' },
    { progress: 60, text: '正在初始化音乐工作站...' },
    { progress: 80, text: '正在准备交互体验...' },
    { progress: 100, text: '加载完成！' }
  ];

  let currentStep = 0;

  const interval = setInterval(() => {
    if (currentStep < loadingSteps.length) {
      progress.value = loadingSteps[currentStep].progress;
      loadingText.value = loadingSteps[currentStep].text;
      currentStep++;
    } else {
      clearInterval(interval);
      // 加载完成后延迟一下再隐藏
      setTimeout(() => {
        isVisible.value = false;
      }, 500);
    }
  }, 600);
};

// 组件挂载时开始加载动画
onMounted(() => {
  simulateLoading();
});

// 暴露给父组件的方法
defineExpose({
  isVisible
});
</script>

<style scoped>
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* 背景渐变 */
.loading-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg,
    #FFE5EC 0%,
    #FFF0F5 15%,
    #FFF8DC 30%,
    #F0F8FF 45%,
    #F5FFFA 60%,
    #FAF0FA 75%,
    #FFE5EC 100%
  );
  animation: gradient-shift 8s ease infinite;
}

@keyframes gradient-shift {
  0%, 100% {
    filter: hue-rotate(0deg);
  }
  50% {
    filter: hue-rotate(20deg);
  }
}

/* 标题 */
.loading-title {
  position: relative;
  z-index: 3;
  text-align: center;
  margin-bottom: 50px;
  animation: title-bounce 1s ease-out;
}

@keyframes title-bounce {
  0% {
    opacity: 0;
    transform: translateY(-100px) scale(0.5);
  }
  60% {
    transform: translateY(10px) scale(1.1);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.title-main {
  font-size: 3rem;
  color: #FF69B4;
  text-shadow: 3px 3px 8px rgba(255, 105, 180, 0.4),
               -2px -2px 6px rgba(255, 255, 255, 0.8);
  margin-bottom: 15px;
  font-weight: 900;
}

.title-sub {
  font-size: 2rem;
  color: #FF1493;
  text-shadow: 2px 2px 6px rgba(255, 20, 147, 0.3);
  font-weight: 700;
}

/* 角色展示区 */
.characters-showcase {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.character-popup {
  position: absolute;
  animation: character-bounce 1s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
}

@keyframes character-bounce {
  0% {
    opacity: 0;
    transform: translateY(100vh) scale(0.3) rotate(180deg);
  }
  60% {
    transform: translateY(-30px) scale(1.15) rotate(-10deg);
  }
  80% {
    transform: translateY(10px) scale(0.95) rotate(5deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1) rotate(0deg);
  }
}

.character-wrapper {
  position: relative;
  animation: float-gentle 3s ease-in-out infinite;
}

@keyframes float-gentle {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-15px) rotate(3deg);
  }
  75% {
    transform: translateY(-8px) rotate(-3deg);
  }
}

.character-img {
  width: 150px;
  height: 200px;
  object-fit: contain;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));
  transition: transform 0.3s ease;
}

.character-popup:hover .character-img {
  transform: scale(1.1) translateY(-10px);
}

.character-name-tag {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 20px;
  border-radius: 20px;
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
  white-space: nowrap;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* 加载进度 */
.loading-progress {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  width: 400px;
  max-width: 80%;
  z-index: 3;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg,
    #FF69B4 0%,
    #FFD700 25%,
    #87CEEB 50%,
    #98FB98 75%,
    #DDA0DD 100%
  );
  border-radius: 20px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  animation: progress-shine 2s linear infinite;
}

@keyframes progress-shine {
  0% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.3);
  }
  100% {
    filter: brightness(1);
  }
}

.loading-text {
  text-align: center;
  color: #FF69B4;
  font-size: 1.1rem;
  font-weight: 600;
  text-shadow: 1px 1px 3px rgba(255, 255, 255, 0.8);
}

/* 音符装饰 */
.music-notes {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.note {
  position: absolute;
  opacity: 0.2;
  animation: note-float 6s ease-in-out infinite;
}

@keyframes note-float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.2;
  }
  50% {
    transform: translateY(-80px) rotate(360deg);
    opacity: 0.5;
  }
}

/* 甜点装饰 */
.sweets-decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.sweet {
  position: absolute;
  font-size: 3rem;
  opacity: 0.3;
  animation: sweet-rotate 8s linear infinite;
}

.sweet-1 {
  top: 10%;
  left: 15%;
  animation-delay: 0s;
}

.sweet-2 {
  top: 15%;
  right: 12%;
  animation-delay: 2s;
}

.sweet-3 {
  bottom: 20%;
  left: 10%;
  animation-delay: 4s;
}

.sweet-4 {
  bottom: 15%;
  right: 15%;
  animation-delay: 6s;
}

@keyframes sweet-rotate {
  0%, 100% {
    transform: rotate(0deg) scale(1);
  }
  25% {
    transform: rotate(90deg) scale(1.2);
  }
  50% {
    transform: rotate(180deg) scale(1);
  }
  75% {
    transform: rotate(270deg) scale(1.2);
  }
}

/* 加载屏淡出动画 */
.loading-fade-enter-active,
.loading-fade-leave-active {
  transition: opacity 0.8s ease;
}

.loading-fade-enter-from,
.loading-fade-leave-to {
  opacity: 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .title-main {
    font-size: 2rem;
  }

  .title-sub {
    font-size: 1.5rem;
  }

  .character-img {
    width: 100px;
    height: 133px;
  }

  .character-name-tag {
    font-size: 0.75rem;
    padding: 6px 12px;
  }

  .loading-progress {
    width: 300px;
  }

  .sweet {
    font-size: 2rem;
  }

  /* 移动端减少角色显示 */
  .character-popup:nth-child(2),
  .character-popup:nth-child(4) {
    display: none;
  }

  /* 调整剩余角色位置 */
  .character-popup:nth-child(1) {
    left: 10% !important;
    top: 40% !important;
  }

  .character-popup:nth-child(3) {
    left: 50% !important;
    top: 35% !important;
    transform: translateX(-50%) !important;
  }

  .character-popup:nth-child(5) {
    right: 10% !important;
    top: 40% !important;
  }
}
</style>
