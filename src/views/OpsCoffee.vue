<template>
  <div class="ops-coffee">
    <!-- 主容器 -->
    <div class="main-container">
      <!-- 顶部区域 -->
      <header class="header">
        <div class="logo-section">
          <div class="logo-icon">☕</div>
          <h1 class="site-title">运维咖啡吧</h1>
        </div>
        <p class="site-motto">追求技术的道路上，我从不曾停下脚步</p>
      </header>

      <!-- 产品导航网格 -->
      <div class="products-grid">
        <a
          v-for="product in products"
          :key="product.id"
          :href="product.url"
          target="_blank"
          rel="noopener noreferrer"
          class="product-card"
          :style="{ '--card-color': product.color }"
        >
          <div class="card-icon">{{ product.icon }}</div>
          <h2 class="card-title">{{ product.name }}</h2>
          <p class="card-description">{{ product.description }}</p>
          <div class="card-footer">
            <span class="visit-text">访问</span>
            <span class="arrow">→</span>
          </div>
        </a>
      </div>

      <!-- 页脚 -->
      <footer class="footer">
        <p class="footer-text">运维咖啡吧 © 2024 - 专注运维技术分享</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const products = ref([
  {
    id: 1,
    name: '个人主页',
    description: '了解更多关于运维咖啡吧的故事',
    url: 'https://ops-coffee.com',
    icon: '🏠',
    color: '#667eea'
  },
  {
    id: 2,
    name: '个人博客',
    description: '分享运维技术与实践经验',
    url: 'https://blog.ops-coffee.com',
    icon: '📝',
    color: '#f093fb'
  },
  {
    id: 3,
    name: '好拼',
    description: '免费在线拼图工具，简单高效',
    url: 'https://img.ops-coffee.com',
    icon: '🧩',
    color: '#4facfe'
  },
  {
    id: 4,
    name: '图片处理工具箱',
    description: '免费在线图片处理工具集合',
    url: 'https://img.ops-coffee.com/tools/',
    icon: '🎨',
    color: '#43e97b'
  },
  {
    id: 5,
    name: '域名证书管理',
    description: '域名证书统一管理系统',
    url: 'https://domain.ops-coffee.com',
    icon: '🔐',
    color: '#fa709a'
  }
]);
</script>

<style scoped>
.ops-coffee {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.main-container {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

/* 顶部区域 */
.header {
  text-align: center;
  margin-bottom: 4rem;
  animation: fadeInDown 0.8s ease-out;
}

.logo-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.logo-icon {
  font-size: 4rem;
  animation: rotate 3s ease-in-out infinite;
}

@keyframes rotate {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(15deg);
  }
}

.site-title {
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -1px;
}

.site-motto {
  font-size: 1.2rem;
  color: #64748b;
  font-weight: 500;
  margin: 0;
  font-style: italic;
}

/* 产品网格 */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
  animation: fadeInUp 0.8s ease-out;
}

.product-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  text-decoration: none;
  color: inherit;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  cursor: pointer;
}

.product-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: var(--card-color);
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

.product-card:hover::before {
  transform: scaleX(1);
}

.product-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.card-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  display: inline-block;
  transition: transform 0.4s ease;
}

.product-card:hover .card-icon {
  transform: scale(1.2) rotate(5deg);
}

.card-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 1rem 0;
  transition: color 0.3s ease;
}

.product-card:hover .card-title {
  color: var(--card-color);
}

.card-description {
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0 0 2rem 0;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.visit-text {
  font-size: 1rem;
  font-weight: 600;
  color: var(--card-color);
  transition: transform 0.3s ease;
}

.arrow {
  font-size: 1.5rem;
  color: var(--card-color);
  transition: transform 0.3s ease;
}

.product-card:hover .arrow {
  transform: translateX(5px);
}

/* 页脚 */
.footer {
  text-align: center;
  padding: 2rem 0;
  animation: fadeIn 1s ease-out 0.3s both;
}

.footer-text {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
}

/* 动画 */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
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

/* 响应式设计 */
@media (max-width: 768px) {
  .site-title {
    font-size: 2.5rem;
  }

  .logo-icon {
    font-size: 3rem;
  }

  .site-motto {
    font-size: 1rem;
  }

  .products-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .product-card {
    padding: 2rem;
  }

  .card-icon {
    font-size: 3rem;
  }

  .card-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .ops-coffee {
    padding: 1rem;
  }

  .site-title {
    font-size: 2rem;
  }

  .header {
    margin-bottom: 2rem;
  }
}
</style>
