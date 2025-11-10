<template>
  <div class="app">
    <div class="container">
      <!-- 页面标题 -->
      <header class="page-header">
        <h1 class="main-title">你好，世界！</h1>
        <p class="subtitle">探索世界各地的问候方式</p>
      </header>

      <!-- 语言卡片网格 -->
      <div class="cards-grid">
        <div
          v-for="(greeting, index) in greetings"
          :key="index"
          class="greeting-card"
          :class="{ 'playing': playingIndex === index }"
          @click="playPronunciation(greeting, index)"
          :title="'点击播放 ' + greeting.hello"
        >
          <div class="language-name">{{ greeting.language }}</div>
          <div class="greeting-text">{{ greeting.hello }}</div>
          <div class="pronunciation" v-if="greeting.pronunciation">
            {{ greeting.pronunciation }}
          </div>
          <!-- 国家标识（右下角） -->
          <div class="country-badge">{{ greeting.country }}</div>
          <!-- 播放图标提示 -->
          <div class="play-icon" v-if="playingIndex !== index">🔊</div>
          <div class="playing-icon" v-else>🎵</div>
        </div>
      </div>

      <!-- 页脚 -->
      <footer class="page-footer">
        <p>&copy; 2025 你好，世界！让世界更加互联互通</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 万国语言数据（存储在内存中）
const greetings = ref([
  { language: '中文', hello: '你好', pronunciation: 'Nǐ hǎo', country: '中国', lang: 'zh-CN' },
  { language: 'English', hello: 'Hello', pronunciation: 'hə-ˈlō', country: '英国/美国', lang: 'en-US' },
  { language: '日本語', hello: 'こんにちは', pronunciation: 'Konnichiwa', country: '日本', lang: 'ja-JP' },
  { language: '한국어', hello: '안녕하세요', pronunciation: 'Annyeonghaseyo', country: '韩国', lang: 'ko-KR' },
  { language: 'Español', hello: 'Hola', pronunciation: 'OH-lah', country: '西班牙', lang: 'es-ES' },
  { language: 'Français', hello: 'Bonjour', pronunciation: 'bohn-ZHOOR', country: '法国', lang: 'fr-FR' },
  { language: 'Deutsch', hello: 'Guten Tag', pronunciation: 'GOO-ten tahk', country: '德国', lang: 'de-DE' },
  { language: 'Italiano', hello: 'Ciao', pronunciation: 'chow', country: '意大利', lang: 'it-IT' },
  { language: 'Português', hello: 'Olá', pronunciation: 'oh-LAH', country: '葡萄牙/巴西', lang: 'pt-PT' },
  { language: 'Русский', hello: 'Здравствуйте', pronunciation: 'ZDRAH-stvooy-tye', country: '俄罗斯', lang: 'ru-RU' },
  { language: 'العربية', hello: 'مرحبا', pronunciation: 'Marhaba', country: '阿拉伯地区', lang: 'ar-SA' },
  { language: 'हिन्दी', hello: 'नमस्ते', pronunciation: 'Namaste', country: '印度', lang: 'hi-IN' },
  { language: 'Türkçe', hello: 'Merhaba', pronunciation: 'mer-ha-BAH', country: '土耳其', lang: 'tr-TR' },
  { language: 'Nederlands', hello: 'Hallo', pronunciation: 'HAH-loh', country: '荷兰', lang: 'nl-NL' },
  { language: 'Svenska', hello: 'Hej', pronunciation: 'hey', country: '瑞典', lang: 'sv-SE' },
  { language: 'Polski', hello: 'Cześć', pronunciation: 'cheshch', country: '波兰', lang: 'pl-PL' },
  { language: 'Ελληνικά', hello: 'Γεια σας', pronunciation: 'YAH-sas', country: '希腊', lang: 'el-GR' },
  { language: 'עברית', hello: 'שלום', pronunciation: 'Shalom', country: '以色列', lang: 'he-IL' },
  { language: 'ไทย', hello: 'สวัสดี', pronunciation: 'Sawatdee', country: '泰国', lang: 'th-TH' },
  { language: 'Tiếng Việt', hello: 'Xin chào', pronunciation: 'sin chow', country: '越南', lang: 'vi-VN' },
  { language: 'Bahasa Indonesia', hello: 'Halo', pronunciation: 'HAH-loh', country: '印度尼西亚', lang: 'id-ID' },
  { language: 'Tagalog', hello: 'Kamusta', pronunciation: 'kah-moos-TAH', country: '菲律宾', lang: 'tl-PH' },
  { language: 'Kiswahili', hello: 'Jambo', pronunciation: 'JAHM-boh', country: '坦桑尼亚/肯尼亚', lang: 'sw-KE' },
  { language: 'Suomi', hello: 'Hei', pronunciation: 'hay', country: '芬兰', lang: 'fi-FI' }
])

// 当前正在播放的卡片索引（存储在内存中）
const playingIndex = ref(-1)

// 播放读音功能
const playPronunciation = (greeting, index) => {
  // 检查浏览器是否支持 Web Speech API
  if ('speechSynthesis' in window) {
    // 如果正在播放，先停止
    window.speechSynthesis.cancel()

    // 设置当前播放状态
    playingIndex.value = index

    // 创建语音合成实例
    const utterance = new SpeechSynthesisUtterance(greeting.hello)

    // 设置语言
    utterance.lang = greeting.lang

    // 设置语速和音量
    utterance.rate = 0.9
    utterance.volume = 1.0

    // 播放结束后清除状态
    utterance.onend = () => {
      playingIndex.value = -1
    }

    // 播放失败时也清除状态
    utterance.onerror = () => {
      playingIndex.value = -1
    }

    // 开始播放
    window.speechSynthesis.speak(utterance)
  } else {
    alert('您的浏览器不支持语音播放功能')
  }
}
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
  position: relative;
  overflow: hidden;
}

.greeting-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 123, 255, 0.2);
  border-color: #007BFF;
}

/* 播放状态 */
.greeting-card.playing {
  border-color: #28a745;
  box-shadow: 0 4px 20px rgba(40, 167, 69, 0.3);
  background: linear-gradient(135deg, #ffffff 0%, #f0fff4 100%);
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

/* 国家标识（右下角） */
.country-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 123, 255, 0.1);
  color: #007BFF;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 500;
  border: 1px solid rgba(0, 123, 255, 0.2);
}

/* 播放图标（右上角） */
.play-icon,
.playing-icon {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 20px;
  opacity: 0.6;
  transition: all 0.3s ease;
}

.greeting-card:hover .play-icon {
  opacity: 1;
  transform: scale(1.2);
}

.playing-icon {
  opacity: 1;
  animation: pulse 1s ease-in-out infinite;
}

/* 播放动画 */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
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
