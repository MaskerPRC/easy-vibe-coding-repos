<template>
  <div class="hero-carousel">
    <div class="carousel-header">
      <h1 class="title">王者荣耀 - 英雄殿堂</h1>
      <p class="subtitle">5V5英雄公平对战手游</p>
    </div>

    <div class="carousel-container">
      <!-- 左箭头 -->
      <button class="arrow arrow-left" @click="prevHero">
        <span>&#8249;</span>
      </button>

      <!-- 轮播内容 -->
      <div class="carousel-content">
        <transition :name="slideDirection">
          <div :key="currentIndex" class="hero-card">
            <div class="hero-image-container">
              <div class="hero-image" :style="{ backgroundColor: currentHero.color }">
                <div class="hero-icon">{{ currentHero.icon }}</div>
              </div>
              <div class="hero-glow" :style="{ backgroundColor: currentHero.color }"></div>
            </div>

            <div class="hero-info">
              <h2 class="hero-name">{{ currentHero.name }}</h2>
              <p class="hero-title">{{ currentHero.title }}</p>
              <div class="hero-type">
                <span v-for="type in currentHero.types" :key="type" class="type-badge">
                  {{ type }}
                </span>
              </div>
              <p class="hero-desc">{{ currentHero.description }}</p>

              <div class="hero-stats">
                <div class="stat-item">
                  <span class="stat-label">生存能力</span>
                  <div class="stat-bar">
                    <div class="stat-fill" :style="{ width: currentHero.stats.survival + '%', backgroundColor: currentHero.color }"></div>
                  </div>
                </div>
                <div class="stat-item">
                  <span class="stat-label">攻击伤害</span>
                  <div class="stat-bar">
                    <div class="stat-fill" :style="{ width: currentHero.stats.attack + '%', backgroundColor: currentHero.color }"></div>
                  </div>
                </div>
                <div class="stat-item">
                  <span class="stat-label">技能效果</span>
                  <div class="stat-bar">
                    <div class="stat-fill" :style="{ width: currentHero.stats.skill + '%', backgroundColor: currentHero.color }"></div>
                  </div>
                </div>
                <div class="stat-item">
                  <span class="stat-label">上手难度</span>
                  <div class="stat-bar">
                    <div class="stat-fill" :style="{ width: currentHero.stats.difficulty + '%', backgroundColor: currentHero.color }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- 右箭头 -->
      <button class="arrow arrow-right" @click="nextHero">
        <span>&#8250;</span>
      </button>
    </div>

    <!-- 指示器 -->
    <div class="carousel-indicators">
      <button
        v-for="(hero, index) in heroes"
        :key="index"
        @click="goToHero(index)"
        :class="['indicator', { active: index === currentIndex }]"
        :title="hero.name"
      ></button>
    </div>

    <!-- 自动播放控制 -->
    <div class="controls">
      <button @click="toggleAutoPlay" class="control-btn">
        {{ isAutoPlay ? '⏸ 暂停' : '▶ 播放' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

// 英雄数据
const heroes = ref([
  {
    name: '后羿',
    title: '半神之弓',
    icon: '🏹',
    color: '#ff6b35',
    types: ['射手', '远程'],
    description: '后羿是一位强力的射手英雄，擅长远程输出和风筝战术，灼日之矢可以对敌人造成巨额伤害。',
    stats: { survival: 50, attack: 90, skill: 70, difficulty: 60 }
  },
  {
    name: '妲己',
    title: '魅惑之狐',
    icon: '🦊',
    color: '#e91e63',
    types: ['法师', '爆发'],
    description: '妲己拥有极高的法术爆发伤害，可以在瞬间秒杀敌方脆皮英雄，是团战的关键输出点。',
    stats: { survival: 40, attack: 95, skill: 85, difficulty: 50 }
  },
  {
    name: '赵云',
    title: '苍天翔龙',
    icon: '⚔️',
    color: '#2196f3',
    types: ['战士', '刺客'],
    description: '赵云进退自如，既能切入敌方后排，也能保护己方核心，是团队中的多面手英雄。',
    stats: { survival: 65, attack: 75, skill: 70, difficulty: 65 }
  },
  {
    name: '貂蝉',
    title: '绝世舞姬',
    icon: '💃',
    color: '#9c27b0',
    types: ['法师', '突进'],
    description: '貂蝉拥有灵活的位移技能和持续输出能力，在团战中如同蝴蝶般翩翩起舞。',
    stats: { survival: 55, attack: 80, skill: 90, difficulty: 75 }
  },
  {
    name: '鲁班七号',
    title: '机关造物师',
    icon: '🤖',
    color: '#ff9800',
    types: ['射手', '机关'],
    description: '鲁班七号是机关大师，可以召唤炮台辅助作战，拥有恐怖的持续输出能力。',
    stats: { survival: 35, attack: 95, skill: 75, difficulty: 55 }
  },
  {
    name: '李白',
    title: '青莲剑仙',
    icon: '🗡️',
    color: '#00bcd4',
    types: ['刺客', '战士'],
    description: '李白身法飘逸，剑术超群，能够在战场上自由穿梭，给予敌人致命一击。',
    stats: { survival: 45, attack: 90, skill: 85, difficulty: 90 }
  },
  {
    name: '孙悟空',
    title: '齐天大圣',
    icon: '🐵',
    color: '#ffc107',
    types: ['刺客', '战士'],
    description: '孙悟空拥有强大的单体爆发能力和隐身技能，是刺杀敌方后排的最佳选择。',
    stats: { survival: 60, attack: 85, skill: 75, difficulty: 70 }
  },
  {
    name: '王昭君',
    title: '冰雪女神',
    icon: '❄️',
    color: '#3f51b5',
    types: ['法师', '控制'],
    description: '王昭君操控冰雪之力，可以大范围冻结敌人，为团队创造输出空间。',
    stats: { survival: 45, attack: 80, skill: 90, difficulty: 60 }
  }
]);

// 当前索引
const currentIndex = ref(0);
const slideDirection = ref('slide-left');
const isAutoPlay = ref(true);
let autoPlayTimer = null;

// 当前英雄
const currentHero = computed(() => heroes.value[currentIndex.value]);

// 下一个英雄
const nextHero = () => {
  slideDirection.value = 'slide-left';
  currentIndex.value = (currentIndex.value + 1) % heroes.value.length;
  resetAutoPlay();
};

// 上一个英雄
const prevHero = () => {
  slideDirection.value = 'slide-right';
  currentIndex.value = (currentIndex.value - 1 + heroes.value.length) % heroes.value.length;
  resetAutoPlay();
};

// 跳转到指定英雄
const goToHero = (index) => {
  if (index === currentIndex.value) return;
  slideDirection.value = index > currentIndex.value ? 'slide-left' : 'slide-right';
  currentIndex.value = index;
  resetAutoPlay();
};

// 开始自动播放
const startAutoPlay = () => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer);
  }
  autoPlayTimer = setInterval(() => {
    if (isAutoPlay.value) {
      nextHero();
    }
  }, 4000);
};

// 重置自动播放
const resetAutoPlay = () => {
  if (isAutoPlay.value) {
    startAutoPlay();
  }
};

// 切换自动播放
const toggleAutoPlay = () => {
  isAutoPlay.value = !isAutoPlay.value;
  if (isAutoPlay.value) {
    startAutoPlay();
  } else {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
    }
  }
};

// 生命周期
onMounted(() => {
  startAutoPlay();
});

onUnmounted(() => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer);
  }
});
</script>

<style scoped>
.hero-carousel {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1a2e 50%, #16213e 100%);
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
}

/* 背景动画 */
.hero-carousel::before {
  content: '';
  position: absolute;
  width: 200%;
  height: 200%;
  background:
    radial-gradient(circle at 20% 50%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 50%, rgba(255, 107, 53, 0.1) 0%, transparent 50%);
  animation: rotate 20s linear infinite;
  pointer-events: none;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 标题 */
.carousel-header {
  text-align: center;
  margin-bottom: 40px;
  z-index: 1;
}

.title {
  font-size: 3em;
  font-weight: bold;
  background: linear-gradient(135deg, #00ffff, #ff6b35);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
  margin-bottom: 10px;
  font-family: 'Courier New', monospace;
}

.subtitle {
  font-size: 1.2em;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Courier New', monospace;
}

/* 轮播容器 */
.carousel-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  position: relative;
  z-index: 1;
  margin-bottom: 30px;
}

/* 箭头按钮 */
.arrow {
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(0, 255, 255, 0.3);
  color: #00ffff;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  font-size: 3em;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  flex-shrink: 0;
}

.arrow:hover {
  background: rgba(0, 255, 255, 0.2);
  border-color: #00ffff;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.6);
  transform: scale(1.1);
}

.arrow-left {
  margin-right: 20px;
}

.arrow-right {
  margin-left: 20px;
}

/* 轮播内容 */
.carousel-content {
  flex: 1;
  max-width: 900px;
  position: relative;
  overflow: hidden;
  height: 550px;
}

/* 英雄卡片 */
.hero-card {
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.9) 0%, rgba(22, 33, 62, 0.9) 100%);
  border: 2px solid rgba(0, 255, 255, 0.3);
  border-radius: 20px;
  padding: 40px;
  display: flex;
  gap: 40px;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
  position: absolute;
  width: 100%;
  box-sizing: border-box;
}

/* 英雄图片容器 */
.hero-image-container {
  position: relative;
  flex-shrink: 0;
}

.hero-image {
  width: 250px;
  height: 250px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  border: 3px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
}

.hero-icon {
  font-size: 8em;
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.5));
}

.hero-glow {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.3;
  filter: blur(40px);
  z-index: 0;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
  50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.5; }
}

/* 英雄信息 */
.hero-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.hero-name {
  font-size: 2.5em;
  font-weight: bold;
  color: #00ffff;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  margin: 0;
  font-family: 'Courier New', monospace;
}

.hero-title {
  font-size: 1.2em;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  font-style: italic;
}

.hero-type {
  display: flex;
  gap: 10px;
  margin: 5px 0;
}

.type-badge {
  background: rgba(0, 255, 255, 0.2);
  border: 1px solid rgba(0, 255, 255, 0.5);
  padding: 5px 15px;
  border-radius: 15px;
  color: #00ffff;
  font-size: 0.9em;
  font-weight: bold;
}

.hero-desc {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 10px 0;
}

/* 属性条 */
.hero-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 10px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stat-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9em;
  font-weight: bold;
}

.stat-bar {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 10px;
  height: 12px;
  overflow: hidden;
  position: relative;
}

.stat-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.5s ease;
  box-shadow: 0 0 10px currentColor;
  position: relative;
}

.stat-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shine 2s infinite;
}

@keyframes shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* 指示器 */
.carousel-indicators {
  display: flex;
  gap: 12px;
  z-index: 1;
  margin-bottom: 20px;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  border: 2px solid rgba(0, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.indicator:hover {
  background: rgba(0, 255, 255, 0.5);
  transform: scale(1.2);
}

.indicator.active {
  background: #00ffff;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
  width: 30px;
  border-radius: 6px;
}

/* 控制按钮 */
.controls {
  z-index: 1;
}

.control-btn {
  padding: 12px 30px;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(0, 255, 255, 0.3);
  border-radius: 25px;
  color: #00ffff;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Courier New', monospace;
}

.control-btn:hover {
  background: rgba(0, 255, 255, 0.2);
  border-color: #00ffff;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.6);
  transform: translateY(-2px);
}

/* 过渡动画 */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.5s ease;
}

.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 968px) {
  .hero-card {
    flex-direction: column;
    padding: 30px;
    height: auto;
  }

  .carousel-content {
    height: auto;
    min-height: 700px;
  }

  .hero-image-container {
    align-self: center;
  }

  .title {
    font-size: 2em;
  }

  .arrow {
    width: 50px;
    height: 50px;
    font-size: 2em;
  }
}

@media (max-width: 768px) {
  .carousel-container {
    padding: 0 10px;
  }

  .arrow-left {
    margin-right: 10px;
  }

  .arrow-right {
    margin-left: 10px;
  }

  .hero-image {
    width: 200px;
    height: 200px;
  }

  .hero-icon {
    font-size: 6em;
  }

  .hero-name {
    font-size: 2em;
  }

  .title {
    font-size: 1.8em;
  }

  .subtitle {
    font-size: 1em;
  }
}
</style>
