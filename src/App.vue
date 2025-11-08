<template>
  <div class="app">
    <!-- 苹果风格导航栏 -->
    <AppleNav />

    <!-- Hero 区域 - Pixel 9 Pro -->
    <PixelHero />

    <!-- 产品展示区 -->
    <ProductShowcase />

    <!-- 特性展示区 -->
    <section class="features">
      <div class="features-content">
        <h2 class="section-title">为什么选择 Google Pixel</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🤖</div>
            <h3 class="feature-title">Google AI</h3>
            <p class="feature-desc">强大的 AI 功能，让你的手机更智能</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📸</div>
            <h3 class="feature-title">顶级相机</h3>
            <p class="feature-desc">AI 驱动的摄影技术，随手拍大片</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔒</div>
            <h3 class="feature-title">安全可靠</h3>
            <p class="feature-desc">Titan M2 芯片，多层安全保护</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3 class="feature-title">持久续航</h3>
            <p class="feature-desc">自适应电池，续航超过 24 小时</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-links">
          <div class="footer-column">
            <h4>购物与了解</h4>
            <ul>
              <li><a href="#store">Google Store</a></li>
              <li><a href="#pixel">Pixel 手机</a></li>
              <li><a href="#watch">Pixel Watch</a></li>
              <li><a href="#buds">Pixel Buds</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h4>服务</h4>
            <ul>
              <li><a href="#support">支持服务</a></li>
              <li><a href="#warranty">保修服务</a></li>
              <li><a href="#trade-in">以旧换新</a></li>
              <li><a href="#financing">分期付款</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h4>关于 Google</h4>
            <ul>
              <li><a href="#about">公司简介</a></li>
              <li><a href="#news">新闻中心</a></li>
              <li><a href="#careers">招贤纳士</a></li>
              <li><a href="#responsibility">社会责任</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p class="footer-copyright">© 2024 Google LLC. 保留所有权利。</p>
          <div class="footer-legal">
            <a href="#privacy">隐私政策</a>
            <a href="#terms">使用条款</a>
            <a href="#cookies">Cookie 设置</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import AppleNav from './components/AppleNav.vue';
import PixelHero from './components/PixelHero.vue';
import ProductShowcase from './components/ProductShowcase.vue';
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: #ffffff;
}

/* 特性展示区 */
.features {
  padding: 100px 20px;
  background: #f5f5f7;
}

.features-content {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 48px;
  font-weight: 600;
  color: #1d1d1f;
  text-align: center;
  margin: 0 0 80px;
  letter-spacing: -0.02em;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.feature-card {
  text-align: center;
  padding: 40px 20px;
  background: #ffffff;
  border-radius: 18px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.feature-card:hover {
  transform: translateY(-8px);
}

.feature-icon {
  font-size: 56px;
  margin-bottom: 20px;
}

.feature-title {
  font-size: 24px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 12px;
}

.feature-desc {
  font-size: 17px;
  font-weight: 400;
  color: #6e6e73;
  margin: 0;
  line-height: 1.47;
}

/* Footer */
.footer {
  background: #f5f5f7;
  border-top: 1px solid #d2d2d7;
  padding: 60px 20px 20px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin-bottom: 40px;
  padding-bottom: 40px;
  border-bottom: 1px solid #d2d2d7;
}

.footer-column h4 {
  font-size: 12px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.footer-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-column li {
  margin-bottom: 12px;
}

.footer-column a {
  color: #6e6e73;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.footer-column a:hover {
  color: #1d1d1f;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-copyright {
  font-size: 12px;
  color: #6e6e73;
  margin: 0;
}

.footer-legal {
  display: flex;
  gap: 20px;
}

.footer-legal a {
  font-size: 12px;
  color: #6e6e73;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-legal a:hover {
  color: #1d1d1f;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .section-title {
    font-size: 32px;
    margin: 0 0 40px;
  }

  .features {
    padding: 60px 20px;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .feature-card {
    padding: 30px 20px;
  }

  .feature-icon {
    font-size: 48px;
  }

  .feature-title {
    font-size: 21px;
  }

  .footer-links {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .footer-legal {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
