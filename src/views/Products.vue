<template>
  <div class="products-page">
    <!-- 导航栏 -->
    <header class="header">
      <div class="container">
        <nav class="nav">
          <div class="logo" @click="goHome">
            <span class="logo-icon">🚀</span>
            <span class="logo-text">MyApp</span>
          </div>
          <ul class="nav-menu">
            <li><router-link to="/">首页</router-link></li>
            <li><router-link to="/products" class="active">产品</router-link></li>
            <li><router-link to="/blog">博客</router-link></li>
            <li><router-link to="/login">登录</router-link></li>
          </ul>
        </nav>
      </div>
    </header>

    <!-- 页面标题 -->
    <section class="page-header">
      <div class="container">
        <h1 class="page-title">我们的产品</h1>
        <p class="page-subtitle">探索我们精心打造的优质产品，满足您的各种需求</p>
      </div>
    </section>

    <!-- 产品筛选 -->
    <section class="filter-section">
      <div class="container">
        <div class="filter-tabs">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="currentCategory = category.id"
            :class="{ active: currentCategory === category.id }"
            class="filter-tab"
          >
            {{ category.name }}
          </button>
        </div>
      </div>
    </section>

    <!-- 产品列表 -->
    <section class="products-section">
      <div class="container">
        <div class="products-grid">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="product-card"
            @click="viewProduct(product)"
          >
            <div class="product-image">
              <div class="image-placeholder" :style="{ background: product.color }">
                <div class="product-icon">{{ product.icon }}</div>
              </div>
              <div class="product-badge" v-if="product.badge">{{ product.badge }}</div>
            </div>
            <div class="product-content">
              <h3 class="product-title">{{ product.name }}</h3>
              <p class="product-description">{{ product.description }}</p>
              <div class="product-footer">
                <div class="product-price">
                  <span class="price-label">¥</span>
                  <span class="price-value">{{ product.price }}</span>
                  <span class="price-unit">/月</span>
                </div>
                <button class="btn-buy">立即购买</button>
              </div>
              <div class="product-features">
                <div v-for="(feature, index) in product.features" :key="index" class="feature-item">
                  ✓ {{ feature }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="container">
        <p>&copy; 2024 MyApp. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 分类
const categories = ref([
  { id: 'all', name: '全部产品' },
  { id: 'software', name: '软件工具' },
  { id: 'service', name: '云服务' },
  { id: 'design', name: '设计资源' }
]);

const currentCategory = ref('all');

// 产品列表
const products = ref([
  {
    id: 1,
    name: '智能办公套件',
    description: '提升团队协作效率的一站式办公解决方案，包含文档编辑、项目管理、即时通讯等功能。',
    price: 99,
    category: 'software',
    icon: '📝',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    badge: '热门',
    features: ['多人协作', '云端同步', '智能AI助手', '数据加密']
  },
  {
    id: 2,
    name: '云存储服务',
    description: '安全可靠的企业级云存储服务，支持海量数据存储和高速访问。',
    price: 49,
    category: 'service',
    icon: '☁️',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    badge: '推荐',
    features: ['1TB空间', '自动备份', '文件分享', '7x24支持']
  },
  {
    id: 3,
    name: '设计素材库',
    description: '海量高质量设计素材，包含图标、插画、模板等，满足各类设计需求。',
    price: 199,
    category: 'design',
    icon: '🎨',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    features: ['10万+素材', '商用授权', '每周更新', 'AI生成工具']
  },
  {
    id: 4,
    name: '数据分析平台',
    description: '强大的数据分析和可视化工具，帮助企业做出更明智的决策。',
    price: 299,
    category: 'software',
    icon: '📊',
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    badge: '企业版',
    features: ['实时分析', '自定义报表', '预测模型', 'API接口']
  },
  {
    id: 5,
    name: 'API开发平台',
    description: '快速构建和部署API的云平台，支持多种编程语言和框架。',
    price: 149,
    category: 'service',
    icon: '🔌',
    color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    features: ['快速部署', '自动扩展', '监控告警', '开发文档']
  },
  {
    id: 6,
    name: 'UI组件库',
    description: '精美的React/Vue组件库，包含100+组件，加速前端开发。',
    price: 79,
    category: 'design',
    icon: '🧩',
    color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    features: ['100+组件', 'TypeScript', '响应式设计', '主题定制']
  }
]);

// 筛选产品
const filteredProducts = computed(() => {
  if (currentCategory.value === 'all') {
    return products.value;
  }
  return products.value.filter(p => p.category === currentCategory.value);
});

// 返回首页
const goHome = () => {
  router.push('/');
};

// 查看产品详情
const viewProduct = (product) => {
  console.log('查看产品:', product);
  alert(`产品名称: ${product.name}\n价格: ¥${product.price}/月\n\n${product.description}`);
};
</script>

<style scoped>
.products-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 导航栏 */
.header {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  cursor: pointer;
}

.logo-icon {
  font-size: 2rem;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-menu a {
  color: #666;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-menu a:hover,
.nav-menu a.active {
  color: #667eea;
}

/* 页面标题 */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
}

.page-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.page-subtitle {
  font-size: 1.2rem;
  opacity: 0.95;
}

/* 筛选区 */
.filter-section {
  background: white;
  padding: 2rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.filter-tabs {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.filter-tab {
  background: #f5f5f5;
  border: 2px solid transparent;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  color: #666;
}

.filter-tab:hover {
  background: #e5e5e5;
}

.filter-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
}

/* 产品列表 */
.products-section {
  padding: 4rem 0;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.product-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  transition: all 0.3s;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.product-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-icon {
  font-size: 5rem;
}

.product-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ffd700 100%);
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
}

.product-content {
  padding: 1.5rem;
}

.product-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.75rem;
}

.product-description {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.product-price {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.price-label {
  font-size: 1rem;
  color: #667eea;
  font-weight: 600;
}

.price-value {
  font-size: 2rem;
  font-weight: 800;
  color: #667eea;
}

.price-unit {
  font-size: 0.9rem;
  color: #9ca3af;
}

.btn-buy {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-buy:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(102, 126, 234, 0.3);
}

.product-features {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.feature-item {
  color: #4b5563;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

/* 页脚 */
.footer {
  background: #1f2937;
  color: white;
  padding: 2rem 0;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .nav-menu {
    display: none;
  }
}
</style>
