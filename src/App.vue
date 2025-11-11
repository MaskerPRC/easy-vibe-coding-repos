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
          <!-- 知名人物头像区域 -->
          <div class="famous-person-section" v-if="greeting.famousPerson">
            <img
              :src="greeting.famousPerson.image"
              :alt="greeting.famousPerson.name"
              class="person-avatar"
            />
            <div class="person-info">
              <div class="person-name">{{ greeting.famousPerson.name }}</div>
              <div class="person-role">{{ greeting.famousPerson.role }}</div>
            </div>
          </div>

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

// 万国语言数据（存储在内存中，包含知名人物信息）
const greetings = ref([
  { language: '中文', hello: '你好', pronunciation: 'Nǐ hǎo', country: '中国', lang: 'zh-CN',
    famousPerson: { name: '孔子', role: '思想家', image: 'https://ui-avatars.com/api/?name=Confucius&size=128&background=DC143C&color=fff' } },
  { language: 'English', hello: 'Hello', pronunciation: 'hə-ˈlō', country: '英国/美国', lang: 'en-US',
    famousPerson: { name: 'Shakespeare', role: '文学家', image: 'https://ui-avatars.com/api/?name=Shakespeare&size=128&background=012169&color=fff' } },
  { language: '日本語', hello: 'こんにちは', pronunciation: 'Konnichiwa', country: '日本', lang: 'ja-JP',
    famousPerson: { name: '宮崎駿', role: '导演', image: 'https://ui-avatars.com/api/?name=Miyazaki&size=128&background=BC002D&color=fff' } },
  { language: '한국어', hello: '안녕하세요', pronunciation: 'Annyeonghaseyo', country: '韩国', lang: 'ko-KR',
    famousPerson: { name: '李舜臣', role: '将军', image: 'https://ui-avatars.com/api/?name=Yi+Sun-sin&size=128&background=003478&color=fff' } },
  { language: 'Español', hello: 'Hola', pronunciation: 'OH-lah', country: '西班牙', lang: 'es-ES',
    famousPerson: { name: 'Cervantes', role: '作家', image: 'https://ui-avatars.com/api/?name=Cervantes&size=128&background=AA151B&color=fff' } },
  { language: 'Français', hello: 'Bonjour', pronunciation: 'bohn-ZHOOR', country: '法国', lang: 'fr-FR',
    famousPerson: { name: 'Victor Hugo', role: '作家', image: 'https://ui-avatars.com/api/?name=Victor+Hugo&size=128&background=0055A4&color=fff' } },
  { language: 'Deutsch', hello: 'Guten Tag', pronunciation: 'GOO-ten tahk', country: '德国', lang: 'de-DE',
    famousPerson: { name: 'Beethoven', role: '音乐家', image: 'https://ui-avatars.com/api/?name=Beethoven&size=128&background=000000&color=fff' } },
  { language: 'Italiano', hello: 'Ciao', pronunciation: 'chow', country: '意大利', lang: 'it-IT',
    famousPerson: { name: 'Da Vinci', role: '艺术家', image: 'https://ui-avatars.com/api/?name=Da+Vinci&size=128&background=009246&color=fff' } },
  { language: 'Português', hello: 'Olá', pronunciation: 'oh-LAH', country: '葡萄牙/巴西', lang: 'pt-PT',
    famousPerson: { name: 'Cristiano Ronaldo', role: '足球运动员', image: 'https://ui-avatars.com/api/?name=CR7&size=128&background=FF0000&color=fff' } },
  { language: 'Русский', hello: 'Здравствуйте', pronunciation: 'ZDRAH-stvooy-tye', country: '俄罗斯', lang: 'ru-RU',
    famousPerson: { name: 'Tolstoy', role: '作家', image: 'https://ui-avatars.com/api/?name=Tolstoy&size=128&background=0039A6&color=fff' } },
  { language: 'العربية', hello: 'مرحبا', pronunciation: 'Marhaba', country: '阿拉伯地区', lang: 'ar-SA',
    famousPerson: { name: 'Ibn Sina', role: '哲学家', image: 'https://ui-avatars.com/api/?name=Ibn+Sina&size=128&background=007A3D&color=fff' } },
  { language: 'हिन्दी', hello: 'नमस्ते', pronunciation: 'Namaste', country: '印度', lang: 'hi-IN',
    famousPerson: { name: 'Gandhi', role: '政治家', image: 'https://ui-avatars.com/api/?name=Gandhi&size=128&background=FF9933&color=fff' } },
  { language: 'Türkçe', hello: 'Merhaba', pronunciation: 'mer-ha-BAH', country: '土耳其', lang: 'tr-TR',
    famousPerson: { name: 'Rumi', role: '诗人', image: 'https://ui-avatars.com/api/?name=Rumi&size=128&background=E30A17&color=fff' } },
  { language: 'Nederlands', hello: 'Hallo', pronunciation: 'HAH-loh', country: '荷兰', lang: 'nl-NL',
    famousPerson: { name: 'Van Gogh', role: '画家', image: 'https://ui-avatars.com/api/?name=Van+Gogh&size=128&background=21468B&color=fff' } },
  { language: 'Svenska', hello: 'Hej', pronunciation: 'hey', country: '瑞典', lang: 'sv-SE',
    famousPerson: { name: 'Nobel', role: '化学家', image: 'https://ui-avatars.com/api/?name=Nobel&size=128&background=006AA7&color=fff' } },
  { language: 'Polski', hello: 'Cześć', pronunciation: 'cheshch', country: '波兰', lang: 'pl-PL',
    famousPerson: { name: 'Chopin', role: '音乐家', image: 'https://ui-avatars.com/api/?name=Chopin&size=128&background=DC143C&color=fff' } },
  { language: 'Ελληνικά', hello: 'Γεια σας', pronunciation: 'YAH-sas', country: '希腊', lang: 'el-GR',
    famousPerson: { name: 'Socrates', role: '哲学家', image: 'https://ui-avatars.com/api/?name=Socrates&size=128&background=0D5EAF&color=fff' } },
  { language: 'עברית', hello: 'שלום', pronunciation: 'Shalom', country: '以色列', lang: 'he-IL',
    famousPerson: { name: 'Einstein', role: '物理学家', image: 'https://ui-avatars.com/api/?name=Einstein&size=128&background=0038B8&color=fff' } },
  { language: 'ไทย', hello: 'สวัสดี', pronunciation: 'Sawatdee', country: '泰国', lang: 'th-TH',
    famousPerson: { name: 'Rama V', role: '国王', image: 'https://ui-avatars.com/api/?name=Rama+V&size=128&background=A51931&color=fff' } },
  { language: 'Tiếng Việt', hello: 'Xin chào', pronunciation: 'sin chow', country: '越南', lang: 'vi-VN',
    famousPerson: { name: 'Ho Chi Minh', role: '政治家', image: 'https://ui-avatars.com/api/?name=Ho+Chi+Minh&size=128&background=DA251D&color=fff' } },
  { language: 'Bahasa Indonesia', hello: 'Halo', pronunciation: 'HAH-loh', country: '印度尼西亚', lang: 'id-ID',
    famousPerson: { name: 'Sukarno', role: '总统', image: 'https://ui-avatars.com/api/?name=Sukarno&size=128&background=FF0000&color=fff' } },
  { language: 'Tagalog', hello: 'Kamusta', pronunciation: 'kah-moos-TAH', country: '菲律宾', lang: 'tl-PH',
    famousPerson: { name: 'Jose Rizal', role: '民族英雄', image: 'https://ui-avatars.com/api/?name=Jose+Rizal&size=128&background=0038A8&color=fff' } },
  { language: 'Kiswahili', hello: 'Jambo', pronunciation: 'JAHM-boh', country: '坦桑尼亚/肯尼亚', lang: 'sw-KE',
    famousPerson: { name: 'Nyerere', role: '政治家', image: 'https://ui-avatars.com/api/?name=Nyerere&size=128&background=1EB53A&color=fff' } },
  { language: 'Suomi', hello: 'Hei', pronunciation: 'hay', country: '芬兰', lang: 'fi-FI',
    famousPerson: { name: 'Sibelius', role: '作曲家', image: 'https://ui-avatars.com/api/?name=Sibelius&size=128&background=003580&color=fff' } }
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

    if (availableVoices.length > 0) {
      voices.value = availableVoices
      voicesLoaded.value = true
      resolve(availableVoices)
    } else {
      // 如果语音列表为空，等待 voiceschanged 事件
      window.speechSynthesis.addEventListener('voiceschanged', () => {
        availableVoices = window.speechSynthesis.getVoices()
        voices.value = availableVoices
        voicesLoaded.value = true
        resolve(availableVoices)
      }, { once: true })
    }
  })
}

// 根据语言代码选择最合适的语音引擎
const selectVoice = (langCode) => {
  if (voices.value.length === 0) {
    return null
  }

  // 1. 首先尝试精确匹配语言代码（如 ja-JP, ru-RU）
  let voice = voices.value.find(v => v.lang === langCode)
  if (voice) return voice

  // 2. 尝试匹配语言前缀（如 ja, ru）
  const langPrefix = langCode.split('-')[0]
  voice = voices.value.find(v => v.lang.startsWith(langPrefix))
  if (voice) return voice

  // 3. 尝试找到该语言的任何可用语音
  voice = voices.value.find(v => v.lang.toLowerCase().includes(langPrefix.toLowerCase()))
  if (voice) return voice

  // 4. 如果都没找到，返回默认语音
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
      await loadVoices()
    }

    // 设置当前播放状态
    playingIndex.value = index

    // 创建语音合成实例
    const utterance = new SpeechSynthesisUtterance(greeting.hello)

    // 设置语言
    utterance.lang = greeting.lang

    // 选择合适的语音引擎
    const selectedVoice = selectVoice(greeting.lang)
    if (selectedVoice) {
      utterance.voice = selectedVoice
      console.log(`使用语音引擎: ${selectedVoice.name} (${selectedVoice.lang})`)
    }

    // 设置语速和音量
    utterance.rate = 0.9
    utterance.volume = 1.0

    // 播放结束后清除状态
    utterance.onend = () => {
      playingIndex.value = -1
    }

    // 播放失败时也清除状态
    utterance.onerror = (event) => {
      console.error('语音播放错误:', event.error)
      playingIndex.value = -1

      // 对于某些特定错误，给用户友好提示
      if (event.error === 'synthesis-unavailable') {
        alert(`抱歉，您的浏览器暂不支持 ${greeting.language} 语音播放`)
      }
    }

    // 开始播放
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
  background: #EBF5F9;
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
  color: #006994;
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

/* 知名人物区域 */
.famous-person-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 12px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.greeting-card:hover .famous-person-section {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
}

.person-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.greeting-card:hover .person-avatar {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 105, 148, 0.3);
}

.person-info {
  text-align: left;
  flex: 1;
  min-width: 0;
}

.person-name {
  font-size: 15px;
  font-weight: 600;
  color: #006994;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.person-role {
  font-size: 12px;
  color: #6C757D;
  font-weight: 400;
}

.greeting-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 168, 204, 0.3);
  border-color: #00A8CC;
}

/* 播放状态 */
.greeting-card.playing {
  border-color: #00A8A8;
  box-shadow: 0 4px 20px rgba(0, 168, 168, 0.3);
  background: linear-gradient(135deg, #ffffff 0%, #e8f8f8 100%);
}

/* 语言名称 */
.language-name {
  font-size: 18px;
  font-weight: 600;
  color: #006994;
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
  background: rgba(0, 105, 148, 0.1);
  color: #006994;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 500;
  border: 1px solid rgba(0, 105, 148, 0.25);
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

  .person-avatar {
    width: 50px;
    height: 50px;
  }

  .person-name {
    font-size: 14px;
  }

  .person-role {
    font-size: 11px;
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

  .famous-person-section {
    gap: 10px;
    padding: 10px;
  }

  .person-avatar {
    width: 45px;
    height: 45px;
  }

  .person-name {
    font-size: 13px;
  }

  .person-role {
    font-size: 10px;
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
