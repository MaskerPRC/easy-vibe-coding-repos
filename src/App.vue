<template>
  <div class="app">
    <div class="container">
      <!-- 页面标题 -->
      <header class="page-header">
        <h1 class="main-title">Hello, World!</h1>
        <p class="subtitle">探索世界各地的问候方式</p>
      </header>

      <!-- 语言卡片网格 -->
      <div class="cards-grid">
        <div
          v-for="(greeting, index) in greetings"
          :key="index"
          class="greeting-card"
        >
          <div class="language-name">{{ greeting.language }}</div>
          <div class="greeting-text">{{ greeting.hello }}</div>
          <div class="pronunciation" v-if="greeting.pronunciation">
            {{ greeting.pronunciation }}
          </div>
        </div>
      </div>

      <!-- 页脚 -->
      <footer class="page-footer">
        <p>&copy; 2025 Hello World. 让世界更加互联互通</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 万国语言数据（存储在内存中）
const greetings = ref([
  { language: '中文', hello: '你好', pronunciation: 'Nǐ hǎo' },
  { language: 'English', hello: 'Hello', pronunciation: 'hə-ˈlō' },
  { language: '日本語', hello: 'こんにちは', pronunciation: 'Konnichiwa' },
  { language: '한국어', hello: '안녕하세요', pronunciation: 'Annyeonghaseyo' },
  { language: 'Español', hello: 'Hola', pronunciation: 'OH-lah' },
  { language: 'Français', hello: 'Bonjour', pronunciation: 'bohn-ZHOOR' },
  { language: 'Deutsch', hello: 'Guten Tag', pronunciation: 'GOO-ten tahk' },
  { language: 'Italiano', hello: 'Ciao', pronunciation: 'chow' },
  { language: 'Português', hello: 'Olá', pronunciation: 'oh-LAH' },
  { language: 'Русский', hello: 'Здравствуйте', pronunciation: 'ZDRAH-stvooy-tye' },
  { language: 'العربية', hello: 'مرحبا', pronunciation: 'Marhaba' },
  { language: 'हिन्दी', hello: 'नमस्ते', pronunciation: 'Namaste' },
  { language: 'Türkçe', hello: 'Merhaba', pronunciation: 'mer-ha-BAH' },
  { language: 'Nederlands', hello: 'Hallo', pronunciation: 'HAH-loh' },
  { language: 'Svenska', hello: 'Hej', pronunciation: 'hey' },
  { language: 'Polski', hello: 'Cześć', pronunciation: 'cheshch' },
  { language: 'Ελληνικά', hello: 'Γεια σας', pronunciation: 'YAH-sas' },
  { language: 'עברית', hello: 'שלום', pronunciation: 'Shalom' },
  { language: 'ไทย', hello: 'สวัสดี', pronunciation: 'Sawatdee' },
  { language: 'Tiếng Việt', hello: 'Xin chào', pronunciation: 'sin chow' },
  { language: 'Bahasa Indonesia', hello: 'Halo', pronunciation: 'HAH-loh' },
  { language: 'Tagalog', hello: 'Kamusta', pronunciation: 'kah-moos-TAH' },
  { language: 'Kiswahili', hello: 'Jambo', pronunciation: 'JAHM-boh' },
  { language: 'Suomi', hello: 'Hei', pronunciation: 'hay' }
])
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 主容器 */
.app {
  min-height: 100vh;
  background: #F8F9FA;
  padding: 20px;
  font-family: "Noto Sans SC", "思源黑体", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 页面标题区 */
.page-header {
  text-align: center;
  margin-bottom: 48px;
  padding-top: 40px;
}

.main-title {
  font-size: 48px;
  font-weight: 700;
  color: #007BFF;
  margin-bottom: 16px;
  letter-spacing: 1px;
}

.subtitle {
  font-size: 18px;
  color: #6C757D;
  font-weight: 400;
}

/* 卡片网格布局 */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 60px;
}

/* 语言卡片 */
.greeting-card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 32px 24px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.greeting-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 123, 255, 0.2);
  border-color: #007BFF;
}

/* 语言名称 */
.language-name {
  font-size: 18px;
  font-weight: 600;
  color: #007BFF;
  margin-bottom: 16px;
  letter-spacing: 0.5px;
}

/* 问候语文字 */
.greeting-text {
  font-size: 32px;
  font-weight: 700;
  color: #343A40;
  margin-bottom: 12px;
  line-height: 1.4;
}

/* 发音 */
.pronunciation {
  font-size: 14px;
  color: #6C757D;
  font-style: italic;
  margin-top: 8px;
}

/* 页脚 */
.page-footer {
  text-align: center;
  padding: 32px 20px;
  color: #6C757D;
  font-size: 14px;
  border-top: 1px solid #DEE2E6;
  margin-top: 40px;
}

/* 平板适配 */
@media (max-width: 768px) {
  .main-title {
    font-size: 36px;
  }

  .subtitle {
    font-size: 16px;
  }

  .cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
  }

  .greeting-card {
    padding: 24px 20px;
  }

  .greeting-text {
    font-size: 28px;
  }

  .language-name {
    font-size: 16px;
  }
}

/* 手机适配 */
@media (max-width: 480px) {
  .app {
    padding: 15px;
  }

  .page-header {
    margin-bottom: 32px;
    padding-top: 20px;
  }

  .main-title {
    font-size: 28px;
    margin-bottom: 12px;
  }

  .subtitle {
    font-size: 14px;
  }

  .cards-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .greeting-card {
    padding: 20px 16px;
  }

  .greeting-text {
    font-size: 24px;
  }

  .language-name {
    font-size: 15px;
  }

  .pronunciation {
    font-size: 13px;
  }

  .page-footer {
    font-size: 12px;
    padding: 24px 15px;
  }
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.greeting-card {
  animation: fadeIn 0.5s ease-out;
}
</style>
