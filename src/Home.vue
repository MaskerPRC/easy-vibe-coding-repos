<template>
  <div class="home-page">
    <div class="content">
      <h1 class="title">欢迎访问</h1>
      <p class="subtitle">这是一个演示项目</p>

      <div class="demo-section">
        <h2 class="section-title">功能演示</h2>
        <p class="description">点击下方按钮查看 404 页面效果</p>
        <button @click="goTo404" class="btn-demo">
          查看 404 页面
        </button>
      </div>

      <div class="info-section">
        <p class="info-text">
          您也可以在浏览器地址栏输入一个不存在的路径（如 /test），<br>
          系统会自动跳转到 404 页面。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 跳转到不存在的页面，触发 404
const goTo404 = () => {
  router.push('/this-page-does-not-exist')
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  font-family: 'Roboto', 'Arial', 'Helvetica', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.content {
  max-width: 600px;
  width: 100%;
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  padding: 60px 40px;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.title {
  font-size: 48px;
  font-weight: bold;
  color: #3C4043;
  margin: 0 0 16px 0;
}

.subtitle {
  font-size: 20px;
  color: #5F6368;
  margin: 0 0 48px 0;
}

.demo-section {
  margin-bottom: 40px;
  padding: 32px;
  background: #F8F9FA;
  border-radius: 4px;
}

.section-title {
  font-size: 24px;
  font-weight: 500;
  color: #3C4043;
  margin: 0 0 16px 0;
}

.description {
  font-size: 16px;
  color: #5F6368;
  margin: 0 0 24px 0;
  line-height: 1.6;
}

.btn-demo {
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 500;
  color: #FFFFFF;
  background-color: #1a73e8;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
}

.btn-demo:hover {
  background-color: #1557b0;
  box-shadow: 0 1px 3px 0 rgba(60, 64, 67, 0.3), 0 4px 8px 3px rgba(60, 64, 67, 0.15);
}

.btn-demo:active {
  background-color: #1557b0;
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
}

.info-section {
  padding-top: 24px;
  border-top: 1px solid #DADCE0;
}

.info-text {
  font-size: 14px;
  color: #5F6368;
  line-height: 1.6;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content {
    padding: 40px 24px;
  }

  .title {
    font-size: 36px;
  }

  .subtitle {
    font-size: 18px;
    margin-bottom: 32px;
  }

  .demo-section {
    padding: 24px;
  }

  .section-title {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .content {
    padding: 32px 20px;
  }

  .title {
    font-size: 28px;
  }

  .subtitle {
    font-size: 16px;
  }

  .demo-section {
    padding: 20px;
  }

  .section-title {
    font-size: 18px;
  }

  .description {
    font-size: 14px;
  }

  .btn-demo {
    width: 100%;
    padding: 10px 24px;
    font-size: 14px;
  }

  .info-text {
    font-size: 13px;
  }
}
</style>
