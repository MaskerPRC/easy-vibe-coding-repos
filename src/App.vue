<template>
  <div class="apex-cover">
    <!-- 背景层 -->
    <div class="background-layer"></div>
    <div class="gradient-overlay"></div>

    <!-- 主要内容 -->
    <div class="content-wrapper">
      <!-- Logo区域 -->
      <div class="logo-section">
        <div class="apex-logo">
          <svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
            <!-- A -->
            <path d="M 20 70 L 35 20 L 50 70 M 25 55 L 45 55" stroke="#FF6B35" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <!-- P -->
            <path d="M 60 70 L 60 20 L 75 20 Q 85 20 85 30 Q 85 40 75 40 L 60 40" stroke="#FF6B35" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <!-- E -->
            <path d="M 95 70 L 95 20 L 115 20 M 95 45 L 110 45 M 95 70 L 115 70" stroke="#FF6B35" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <!-- X -->
            <path d="M 125 20 L 145 70 M 145 20 L 125 70" stroke="#FF6B35" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h1 class="game-title">APEX LEGENDS</h1>
        <p class="game-subtitle">战场传奇</p>
      </div>

      <!-- 特色信息 -->
      <div class="features-section">
        <div class="feature-card" v-for="(feature, index) in features" :key="index" :style="{ animationDelay: `${index * 0.1}s` }">
          <div class="feature-icon">
            <component :is="feature.icon" />
          </div>
          <div class="feature-content">
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-desc">{{ feature.desc }}</p>
          </div>
        </div>
      </div>

      <!-- 底部信息 -->
      <div class="bottom-info">
        <div class="info-badge">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>FREE TO PLAY</span>
        </div>
        <div class="season-info">SEASON 20 | BREAKOUT</div>
      </div>
    </div>

    <!-- 装饰元素 -->
    <div class="decoration-elements">
      <div class="hex-pattern"></div>
      <div class="glow-effect glow-1"></div>
      <div class="glow-effect glow-2"></div>
      <div class="glow-effect glow-3"></div>
    </div>
  </div>
</template>

<script setup>
import { h } from 'vue'

// 特色功能数据
const features = [
  {
    title: '英雄射击',
    desc: '选择传奇角色，发挥独特能力',
    icon: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, [
      h('path', { d: 'M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
    ])
  },
  {
    title: '小队对战',
    desc: '3人小队，战术配合制胜',
    icon: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, [
      h('path', { d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
      h('circle', { cx: '9', cy: '7', r: '4', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
      h('path', { d: 'M23 21v-2a4 4 0 0 0-3-3.87', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
      h('path', { d: 'M16 3.13a4 4 0 0 1 0 7.75', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
    ])
  },
  {
    title: '动态竞技场',
    desc: '不断进化的战场地图',
    icon: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, [
      h('path', { d: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
      h('circle', { cx: '12', cy: '10', r: '3', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
    ])
  },
  {
    title: '进化战利品',
    desc: '收集装备，强化武装',
    icon: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, [
      h('path', { d: 'M12 2L2 7l10 5 10-5-10-5z', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
      h('path', { d: 'M2 17l10 5 10-5', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
      h('path', { d: 'M2 12l10 5 10-5', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
    ])
  }
]
</script>

<style scoped>
/* 全局重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 主容器 - Apex主题 */
.apex-cover {
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  font-family: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Rajdhani', 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 背景层 */
.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  z-index: 0;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(ellipse at 20% 30%, rgba(255, 107, 53, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 70%, rgba(220, 20, 60, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(255, 69, 0, 0.08) 0%, transparent 60%);
  z-index: 1;
}

/* 装饰元素 */
.decoration-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.hex-pattern {
  position: absolute;
  top: 10%;
  right: 10%;
  width: 200px;
  height: 200px;
  opacity: 0.1;
  background:
    linear-gradient(30deg, #FF6B35 12%, transparent 12.5%, transparent 87%, #FF6B35 87.5%, #FF6B35),
    linear-gradient(150deg, #FF6B35 12%, transparent 12.5%, transparent 87%, #FF6B35 87.5%, #FF6B35),
    linear-gradient(30deg, #FF6B35 12%, transparent 12.5%, transparent 87%, #FF6B35 87.5%, #FF6B35),
    linear-gradient(150deg, #FF6B35 12%, transparent 12.5%, transparent 87%, #FF6B35 87.5%, #FF6B35);
  background-size: 80px 140px;
  background-position: 0 0, 0 0, 40px 70px, 40px 70px;
  animation: hexFloat 20s ease-in-out infinite;
}

.glow-effect {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  animation: pulse 4s ease-in-out infinite;
}

.glow-1 {
  top: 20%;
  left: 10%;
  width: 300px;
  height: 300px;
  background: rgba(255, 107, 53, 0.2);
  animation-delay: 0s;
}

.glow-2 {
  bottom: 30%;
  right: 15%;
  width: 400px;
  height: 400px;
  background: rgba(220, 20, 60, 0.15);
  animation-delay: 1.5s;
}

.glow-3 {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 500px;
  background: rgba(255, 69, 0, 0.1);
  animation-delay: 3s;
}

/* 内容包装器 */
.content-wrapper {
  position: relative;
  z-index: 10;
  max-width: 1200px;
  width: 100%;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;
}

/* Logo区域 */
.logo-section {
  text-align: center;
  animation: fadeInDown 1s ease-out;
}

.apex-logo {
  margin-bottom: 20px;
  animation: glowPulse 3s ease-in-out infinite;
}

.apex-logo svg {
  width: 200px;
  height: 80px;
  filter: drop-shadow(0 0 20px rgba(255, 107, 53, 0.6));
}

.game-title {
  font-size: 72px;
  font-weight: 900;
  letter-spacing: 8px;
  background: linear-gradient(135deg, #FF6B35 0%, #DC143C 50%, #FF4500 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(255, 107, 53, 0.5);
  margin-bottom: 10px;
  animation: titleGlow 3s ease-in-out infinite;
}

.game-subtitle {
  font-size: 24px;
  font-weight: 300;
  letter-spacing: 4px;
  color: #ffffff;
  opacity: 0.9;
  text-transform: uppercase;
}

/* 特色功能区域 */
.features-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  width: 100%;
  max-width: 900px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 107, 53, 0.2);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  transition: all 0.3s ease;
  animation: fadeInUp 0.8s ease-out;
  animation-fill-mode: both;
}

.feature-card:hover {
  transform: translateY(-8px);
  border-color: rgba(255, 107, 53, 0.5);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px rgba(255, 107, 53, 0.2);
}

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.2), rgba(220, 20, 60, 0.2));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: rotate(5deg) scale(1.1);
}

.feature-icon svg {
  width: 24px;
  height: 24px;
  color: #FF6B35;
}

.feature-content {
  flex: 1;
}

.feature-title {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.feature-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
}

/* 底部信息 */
.bottom-info {
  display: flex;
  align-items: center;
  gap: 32px;
  animation: fadeIn 1.2s ease-out 0.5s;
  animation-fill-mode: both;
  flex-wrap: wrap;
  justify-content: center;
}

.info-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.2), rgba(220, 20, 60, 0.2));
  border: 2px solid #FF6B35;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 700;
  color: #FF6B35;
  letter-spacing: 2px;
  transition: all 0.3s ease;
}

.info-badge:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 20px rgba(255, 107, 53, 0.4);
}

.info-badge svg {
  width: 20px;
  height: 20px;
}

.season-info {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 2px;
  text-transform: uppercase;
}

/* 动画定义 */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.1);
  }
}

@keyframes hexFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

@keyframes glowPulse {
  0%, 100% {
    filter: drop-shadow(0 0 20px rgba(255, 107, 53, 0.6));
  }
  50% {
    filter: drop-shadow(0 0 40px rgba(255, 107, 53, 0.9));
  }
}

@keyframes titleGlow {
  0%, 100% {
    text-shadow: 0 0 40px rgba(255, 107, 53, 0.5);
  }
  50% {
    text-shadow: 0 0 60px rgba(255, 107, 53, 0.8), 0 0 80px rgba(220, 20, 60, 0.5);
  }
}

/* 响应式设计 - 平板 */
@media (max-width: 768px) {
  .content-wrapper {
    gap: 40px;
    padding: 30px 16px;
  }

  .game-title {
    font-size: 48px;
    letter-spacing: 4px;
  }

  .game-subtitle {
    font-size: 18px;
    letter-spacing: 2px;
  }

  .apex-logo svg {
    width: 150px;
    height: 60px;
  }

  .features-section {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .feature-card {
    padding: 20px;
  }

  .bottom-info {
    gap: 20px;
  }
}

/* 响应式设计 - 手机 */
@media (max-width: 480px) {
  .content-wrapper {
    gap: 30px;
    padding: 20px 12px;
  }

  .game-title {
    font-size: 36px;
    letter-spacing: 2px;
  }

  .game-subtitle {
    font-size: 16px;
    letter-spacing: 1px;
  }

  .apex-logo svg {
    width: 120px;
    height: 48px;
  }

  .feature-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 16px;
  }

  .feature-icon {
    width: 40px;
    height: 40px;
  }

  .feature-icon svg {
    width: 20px;
    height: 20px;
  }

  .feature-title {
    font-size: 16px;
  }

  .feature-desc {
    font-size: 13px;
  }

  .info-badge {
    padding: 10px 20px;
    font-size: 14px;
  }

  .season-info {
    font-size: 12px;
  }

  .glow-1, .glow-2, .glow-3 {
    width: 200px;
    height: 200px;
  }
}
</style>
