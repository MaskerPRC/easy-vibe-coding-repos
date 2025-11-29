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
  { language: 'Suomi', hello: 'Hei', pronunciation: 'hay', country: '芬兰', lang: 'fi-FI' },
  { language: 'Українська', hello: 'Добрий день', pronunciation: 'Dobryi den', country: '乌克兰', lang: 'uk-UA' }
])

// 当前正在播放的卡片索引（存储在内存中）
const playingIndex = ref(-1)

// 可用的语音引擎列表（存储在内存中）
const voices = ref([])

// 语音引擎是否已加载（存储在内存中）
const voicesLoaded = ref(false)

// 加载可用的语音引擎
const loadVoices = () => {
  return new Promise((resolve) => {
    let availableVoices = window.speechSynthesis.getVoices()

    const processVoices = (voicesList) => {
      voices.value = voicesList
      voicesLoaded.value = true

      console.log(`✓ 成功加载 ${voicesList.length} 个语音引擎`)

      // 显示所有可用的语音引擎
      console.log('可用的语音引擎列表:')
      voicesList.forEach((voice, index) => {
        console.log(`  ${index + 1}. ${voice.name} (${voice.lang}) ${voice.default ? '[默认]' : ''}`)
      })

      // 检查是否有乌克兰语语音
      const ukrainianVoice = voicesList.find(v => v.lang.startsWith('uk'))
      if (ukrainianVoice) {
        console.log(`✓ 找到乌克兰语语音: ${ukrainianVoice.name}`)
      } else {
        console.warn('⚠ 未找到乌克兰语语音，将使用俄语或默认语音作为后备')
        const russianVoice = voicesList.find(v => v.lang.startsWith('ru'))
        if (russianVoice) {
          console.log(`  后备方案: 使用俄语语音 ${russianVoice.name}`)
        }
      }

      resolve(voicesList)
    }

    if (availableVoices.length > 0) {
      processVoices(availableVoices)
    } else {
      // 如果语音列表为空，等待 voiceschanged 事件
      console.log('等待语音引擎加载...')
      window.speechSynthesis.addEventListener('voiceschanged', () => {
        availableVoices = window.speechSynthesis.getVoices()
        processVoices(availableVoices)
      }, { once: true })
    }
  })
}

// 根据语言代码选择最合适的语音引擎
const selectVoice = (langCode) => {
  if (voices.value.length === 0) {
    console.warn('没有可用的语音引擎')
    return null
  }

  // 1. 首先尝试精确匹配语言代码（如 ja-JP, ru-RU）
  let voice = voices.value.find(v => v.lang === langCode)
  if (voice) {
    console.log(`找到精确匹配的语音: ${voice.name} (${voice.lang})`)
    return voice
  }

  // 2. 尝试匹配语言前缀（如 ja, ru）
  const langPrefix = langCode.split('-')[0]
  voice = voices.value.find(v => v.lang.startsWith(langPrefix))
  if (voice) {
    console.log(`找到语言前缀匹配的语音: ${voice.name} (${voice.lang})`)
    return voice
  }

  // 3. 尝试找到该语言的任何可用语音
  voice = voices.value.find(v => v.lang.toLowerCase().includes(langPrefix.toLowerCase()))
  if (voice) {
    console.log(`找到部分匹配的语音: ${voice.name} (${voice.lang})`)
    return voice
  }

  // 4. 特殊处理：为乌克兰语提供后备语音
  // 如果没有找到乌克兰语语音，尝试使用俄语语音（因为它们使用相似的西里尔字母）
  if (langPrefix === 'uk') {
    console.log('未找到乌克兰语语音，尝试使用俄语语音作为后备')
    voice = voices.value.find(v => v.lang.startsWith('ru'))
    if (voice) {
      console.log(`使用后备语音: ${voice.name} (${voice.lang})`)
      return voice
    }
  }

  // 5. 如果都没找到，返回默认语音
  console.warn(`未找到 ${langCode} 的语音引擎，使用默认语音`)
  return voices.value[0] || null
}

// 播放读音功能
const playPronunciation = async (greeting, index) => {
  // 检查浏览器是否支持 Web Speech API
  if (!('speechSynthesis' in window)) {
    alert('您的浏览器不支持语音播放功能')
    return
  }

  try {
    // 如果正在播放，先停止
    window.speechSynthesis.cancel()

    // 确保语音引擎已加载
    if (!voicesLoaded.value) {
      console.log('正在加载语音引擎...')
      await loadVoices()
    }

    console.log(`准备播放: ${greeting.language} - ${greeting.hello}`)
    console.log(`可用的语音引擎数量: ${voices.value.length}`)

    // 设置当前播放状态
    playingIndex.value = index

    // 创建语音合成实例
    const utterance = new SpeechSynthesisUtterance(greeting.hello)

    // 设置语言
    utterance.lang = greeting.lang
    console.log(`目标语言代码: ${greeting.lang}`)

    // 选择合适的语音引擎
    const selectedVoice = selectVoice(greeting.lang)
    if (selectedVoice) {
      utterance.voice = selectedVoice
      console.log(`✓ 成功选择语音引擎: ${selectedVoice.name} (${selectedVoice.lang})`)
    } else {
      console.warn(`⚠ 未找到合适的语音引擎，将使用浏览器默认语音`)
    }

    // 设置语速和音量
    utterance.rate = 0.9
    utterance.volume = 1.0

    // 播放开始
    utterance.onstart = () => {
      console.log(`开始播放: ${greeting.language}`)
    }

    // 播放结束后清除状态
    utterance.onend = () => {
      console.log(`播放完成: ${greeting.language}`)
      playingIndex.value = -1
    }

    // 播放失败时也清除状态
    utterance.onerror = (event) => {
      console.error('语音播放错误:', event.error)
      console.error('错误详情:', event)
      playingIndex.value = -1

      // 对于某些特定错误，给用户友好提示
      if (event.error === 'synthesis-unavailable') {
        alert(`抱歉，您的浏览器暂不支持 ${greeting.language} 语音播放`)
      } else if (event.error === 'network') {
        alert(`网络错误：无法加载 ${greeting.language} 语音`)
      } else if (event.error === 'not-allowed') {
        alert('语音播放被浏览器阻止，请检查浏览器权限设置')
      } else {
        // 对于其他错误，显示更详细的信息
        console.error(`播放 ${greeting.language} 时出现错误: ${event.error}`)
      }
    }

    // 开始播放
    console.log('调用 speechSynthesis.speak()')
    window.speechSynthesis.speak(utterance)
  } catch (error) {
    console.error('播放语音时出错:', error)
    playingIndex.value = -1
    alert('语音播放失败，请稍后重试')
  }
}

// 页面加载时预加载语音引擎
if ('speechSynthesis' in window) {
  loadVoices()
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
