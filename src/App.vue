<template>
  <div class="nio-et5t">
    <!-- 顶部导航 -->
    <nav class="nav-bar" :class="{ 'nav-scrolled': scrolled }">
      <div class="nav-container">
        <div class="nav-logo">NIO</div>
        <div class="nav-links">
          <a href="#exterior" @click.prevent="scrollToSection('exterior')">外观</a>
          <a href="#interior" @click.prevent="scrollToSection('interior')">内饰</a>
          <a href="#features" @click.prevent="scrollToSection('features')">产品亮点</a>
          <a href="#specs" @click.prevent="scrollToSection('specs')">技术参数</a>
        </div>
      </div>
    </nav>

    <!-- 英雄区域 -->
    <section class="hero-section" id="hero">
      <div class="hero-content">
        <h1 class="hero-title">蔚来 ET5T</h1>
        <p class="hero-subtitle">智能电动轿跑SUV</p>
        <p class="hero-desc">性能与美学的完美结合，开启未来出行新纪元</p>
        <button class="cta-button" @click="scrollToSection('exterior')">探索更多</button>
      </div>
      <div class="hero-overlay"></div>
    </section>

    <!-- 外观展示 -->
    <section class="section exterior-section" id="exterior">
      <div class="section-header">
        <h2 class="section-title">外观设计</h2>
        <p class="section-subtitle">流线型车身，诠释科技美学</p>
      </div>
      <div class="gallery">
        <div
          v-for="(view, index) in exteriorViews"
          :key="index"
          class="gallery-item"
          :class="{ 'active': currentExterior === index }"
          @click="currentExterior = index"
        >
          <div class="gallery-image" :style="{ background: view.color }">
            <div class="car-silhouette">
              <div class="car-body">
                <div class="car-window"></div>
                <div class="car-wheel wheel-front"></div>
                <div class="car-wheel wheel-rear"></div>
              </div>
            </div>
          </div>
          <h3 class="gallery-title">{{ view.title }}</h3>
          <p class="gallery-desc">{{ view.desc }}</p>
        </div>
      </div>
    </section>

    <!-- 内饰展示 -->
    <section class="section interior-section" id="interior">
      <div class="section-header">
        <h2 class="section-title">内饰空间</h2>
        <p class="section-subtitle">豪华科技座舱，尽享驾乘乐趣</p>
      </div>
      <div class="interior-grid">
        <div
          v-for="(interior, index) in interiorFeatures"
          :key="index"
          class="interior-card"
        >
          <div class="interior-icon" :style="{ background: interior.color }">
            <div class="icon-shape"></div>
          </div>
          <h3 class="interior-title">{{ interior.title }}</h3>
          <p class="interior-desc">{{ interior.desc }}</p>
        </div>
      </div>
    </section>

    <!-- 产品亮点 -->
    <section class="section features-section" id="features">
      <div class="section-header">
        <h2 class="section-title">产品亮点</h2>
        <p class="section-subtitle">创新科技，引领未来</p>
      </div>
      <div class="features-container">
        <div
          v-for="(feature, index) in productFeatures"
          :key="index"
          class="feature-card"
          :class="{ 'feature-highlight': feature.highlight }"
        >
          <div class="feature-number">{{ String(index + 1).padStart(2, '0') }}</div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-desc">{{ feature.desc }}</p>
          <div class="feature-stats" v-if="feature.stats">
            <div
              v-for="(stat, statIndex) in feature.stats"
              :key="statIndex"
              class="stat-item"
            >
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 技术参数 -->
    <section class="section specs-section" id="specs">
      <div class="section-header">
        <h2 class="section-title">技术参数</h2>
        <p class="section-subtitle">卓越性能，精准掌控</p>
      </div>
      <div class="specs-grid">
        <div
          v-for="(spec, index) in specifications"
          :key="index"
          class="spec-card"
        >
          <div class="spec-icon">
            <div class="spec-circle"></div>
          </div>
          <div class="spec-value">{{ spec.value }}</div>
          <div class="spec-label">{{ spec.label }}</div>
        </div>
      </div>
    </section>

    <!-- 底部 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-brand">NIO ET5T</div>
        <div class="footer-text">智能电动轿跑SUV · 开启未来出行</div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// 滚动状态
const scrolled = ref(false);
const currentExterior = ref(0);

// 外观视图数据
const exteriorViews = [
  {
    title: '前脸设计',
    desc: '标志性分体式大灯，科技感与辨识度兼具',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    title: '车身侧面',
    desc: '流畅的轿跑SUV线条，兼顾美学与空气动力学',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    title: '尾部造型',
    desc: '贯穿式尾灯设计，夜晚识别度极高',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    title: '车顶线条',
    desc: '溜背式设计，运动感十足',
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  }
];

// 内饰功能数据
const interiorFeatures = [
  {
    title: '智能座舱',
    desc: '12.8英寸中控屏，NOMI Mate智能助手，打造沉浸式交互体验',
    color: '#4593E6'
  },
  {
    title: '豪华座椅',
    desc: '一体式运动座椅，Nappa真皮包裹，支持多向电动调节和加热通风',
    color: '#667eea'
  },
  {
    title: '全景天幕',
    desc: '超大全景天幕，采光面积达2.1㎡，带来极致开阔视野',
    color: '#f5576c'
  },
  {
    title: '高级音响',
    desc: '23扬声器沉浸式音响系统，7.1.4声道环绕立体声',
    color: '#00f2fe'
  }
];

// 产品亮点数据
const productFeatures = [
  {
    title: '超长续航',
    desc: '搭载150kWh固态电池包，CLTC综合续航里程超过1000公里，彻底消除里程焦虑',
    highlight: true,
    stats: [
      { value: '1000+', label: '续航里程(km)' },
      { value: '150', label: '电池容量(kWh)' }
    ]
  },
  {
    title: '极速性能',
    desc: '双电机智能四驱系统，总功率480kW，零百加速仅需3.9秒',
    highlight: false,
    stats: [
      { value: '3.9s', label: '0-100km/h加速' },
      { value: '480kW', label: '最大功率' }
    ]
  },
  {
    title: '智能驾驶',
    desc: 'NIO Pilot+智能驾驶辅助系统，33个高性能感知硬件，实现高速/城区领航辅助',
    highlight: false
  },
  {
    title: '换电便捷',
    desc: '支持换电服务，3分钟快速换电，全国超过1500座换电站随时待命',
    highlight: false,
    stats: [
      { value: '3min', label: '换电时间' },
      { value: '1500+', label: '换电站数量' }
    ]
  },
  {
    title: '智能空间',
    desc: '灵活可变的后备箱空间，容积可达700L，满足各种出行需求',
    highlight: false
  },
  {
    title: '安全防护',
    desc: '五星安全标准，配备多重主被动安全系统，全方位守护每一次出行',
    highlight: false
  }
];

// 技术参数数据
const specifications = [
  { value: '4790mm', label: '车身长度' },
  { value: '1960mm', label: '车身宽度' },
  { value: '1499mm', label: '车身高度' },
  { value: '2888mm', label: '轴距' },
  { value: '480kW', label: '最大功率' },
  { value: '850N·m', label: '最大扭矩' },
  { value: '1000km', label: 'CLTC续航' },
  { value: '200km/h', label: '最高车速' }
];

// 滚动处理
const handleScroll = () => {
  scrolled.value = window.scrollY > 50;
};

// 平滑滚动到指定区域
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const offsetTop = element.offsetTop - 80;
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.nio-et5t {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  color: #1e1e1e;
  background: #ffffff;
  overflow-x: hidden;
}

/* 导航栏 */
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: all 0.3s ease;
  background: transparent;
}

.nav-bar.nav-scrolled {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo {
  font-size: 28px;
  font-weight: 700;
  color: #4593E6;
  letter-spacing: 2px;
}

.nav-links {
  display: flex;
  gap: 40px;
}

.nav-links a {
  text-decoration: none;
  color: #333;
  font-size: 16px;
  font-weight: 500;
  transition: color 0.3s ease;
  position: relative;
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background: #4593E6;
  transition: width 0.3s ease;
}

.nav-links a:hover {
  color: #4593E6;
}

.nav-links a:hover::after {
  width: 100%;
}

/* 英雄区域 */
.hero-section {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.08) 0%, transparent 50%);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
  animation: fadeInUp 1s ease;
}

.hero-title {
  font-size: 80px;
  font-weight: 700;
  margin-bottom: 20px;
  letter-spacing: 4px;
}

.hero-subtitle {
  font-size: 28px;
  font-weight: 300;
  margin-bottom: 15px;
  opacity: 0.95;
}

.hero-desc {
  font-size: 18px;
  font-weight: 300;
  margin-bottom: 40px;
  opacity: 0.9;
}

.cta-button {
  padding: 16px 48px;
  font-size: 18px;
  font-weight: 500;
  color: #4593E6;
  background: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

/* 通用区域样式 */
.section {
  padding: 120px 40px;
  max-width: 1400px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 80px;
}

.section-title {
  font-size: 48px;
  font-weight: 700;
  color: #1e1e1e;
  margin-bottom: 20px;
}

.section-subtitle {
  font-size: 20px;
  color: #666;
  font-weight: 300;
}

/* 外观展示 */
.exterior-section {
  background: #f5f5f5;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.gallery-item {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s ease;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.gallery-item:hover,
.gallery-item.active {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.gallery-image {
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.car-silhouette {
  width: 200px;
  height: 120px;
  position: relative;
}

.car-body {
  width: 100%;
  height: 60px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 30px 30px 15px 15px;
  position: absolute;
  bottom: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.car-window {
  width: 80px;
  height: 35px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 15px 15px 0 0;
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
}

.car-wheel {
  width: 35px;
  height: 35px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  position: absolute;
  bottom: -5px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
}

.wheel-front {
  left: 20px;
}

.wheel-rear {
  right: 20px;
}

.gallery-title {
  padding: 20px 20px 10px;
  font-size: 22px;
  font-weight: 600;
  color: #1e1e1e;
}

.gallery-desc {
  padding: 0 20px 20px;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

/* 内饰展示 */
.interior-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
}

.interior-card {
  text-align: center;
  padding: 40px 30px;
  background: white;
  border-radius: 20px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.interior-card:hover {
  border-color: #4593E6;
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(69, 147, 230, 0.15);
}

.interior-icon {
  width: 100px;
  height: 100px;
  margin: 0 auto 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.icon-shape {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  animation: rotate 3s linear infinite;
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.interior-title {
  font-size: 24px;
  font-weight: 600;
  color: #1e1e1e;
  margin-bottom: 15px;
}

.interior-desc {
  font-size: 15px;
  color: #666;
  line-height: 1.8;
}

/* 产品亮点 */
.features-section {
  background: #fafafa;
}

.features-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.feature-card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  border-left: 4px solid #e0e0e0;
  transition: all 0.3s ease;
}

.feature-card:hover {
  border-left-color: #4593E6;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transform: translateX(5px);
}

.feature-card.feature-highlight {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-left: none;
}

.feature-number {
  font-size: 36px;
  font-weight: 700;
  color: #4593E6;
  margin-bottom: 20px;
  opacity: 0.3;
}

.feature-highlight .feature-number {
  color: white;
  opacity: 0.5;
}

.feature-title {
  font-size: 26px;
  font-weight: 600;
  margin-bottom: 15px;
}

.feature-highlight .feature-title {
  color: white;
}

.feature-desc {
  font-size: 15px;
  line-height: 1.8;
  color: #666;
  margin-bottom: 20px;
}

.feature-highlight .feature-desc {
  color: rgba(255, 255, 255, 0.95);
}

.feature-stats {
  display: flex;
  gap: 30px;
  margin-top: 25px;
}

.stat-item {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #4593E6;
  margin-bottom: 5px;
}

.feature-highlight .stat-value {
  color: white;
}

.stat-label {
  font-size: 13px;
  color: #999;
}

.feature-highlight .stat-label {
  color: rgba(255, 255, 255, 0.8);
}

/* 技术参数 */
.specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.spec-card {
  text-align: center;
  padding: 50px 30px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.spec-card:hover {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-5px);
}

.spec-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 30px;
  position: relative;
}

.spec-circle {
  width: 100%;
  height: 100%;
  border: 3px solid #4593E6;
  border-radius: 50%;
  position: relative;
  animation: pulse 2s ease-in-out infinite;
}

.spec-circle::after {
  content: '';
  width: 40px;
  height: 40px;
  background: #4593E6;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.spec-value {
  font-size: 36px;
  font-weight: 700;
  color: #1e1e1e;
  margin-bottom: 10px;
}

.spec-label {
  font-size: 16px;
  color: #666;
}

/* 底部 */
.footer {
  background: #1e1e1e;
  color: white;
  padding: 60px 40px;
  text-align: center;
}

.footer-brand {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 15px;
  letter-spacing: 3px;
}

.footer-text {
  font-size: 16px;
  opacity: 0.7;
}

/* 动画 */
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

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-container {
    padding: 15px 20px;
  }

  .nav-links {
    gap: 20px;
    font-size: 14px;
  }

  .hero-title {
    font-size: 48px;
  }

  .hero-subtitle {
    font-size: 20px;
  }

  .hero-desc {
    font-size: 16px;
  }

  .section {
    padding: 80px 20px;
  }

  .section-title {
    font-size: 36px;
  }

  .section-subtitle {
    font-size: 16px;
  }

  .gallery {
    grid-template-columns: 1fr;
  }

  .interior-grid {
    grid-template-columns: 1fr;
  }

  .features-container {
    grid-template-columns: 1fr;
  }

  .specs-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .feature-stats {
    flex-direction: column;
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .nav-logo {
    font-size: 24px;
  }

  .nav-links a {
    font-size: 12px;
  }

  .hero-title {
    font-size: 36px;
  }

  .section-title {
    font-size: 28px;
  }

  .specs-grid {
    grid-template-columns: 1fr;
  }
}
</style>
