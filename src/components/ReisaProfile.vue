<template>
  <div class="reisa-profile">
    <div class="profile-container">
      <!-- 头部信息 -->
      <div class="profile-header">
        <div class="avatar-section">
          <div class="avatar-circle">
            <img :src="profileData.avatar" alt="宇泽玲纱" />
          </div>
          <div class="status-badge" :class="profileData.status">
            {{ profileData.statusText }}
          </div>
        </div>
        <div class="header-info">
          <h1 class="character-name">{{ profileData.name }}</h1>
          <p class="character-title">{{ profileData.title }}</p>
          <div class="basic-info">
            <div class="info-item">
              <span class="label">学校：</span>
              <span class="value">{{ profileData.school }}</span>
            </div>
            <div class="info-item">
              <span class="label">年龄：</span>
              <span class="value">{{ profileData.age }}</span>
            </div>
            <div class="info-item">
              <span class="label">生日：</span>
              <span class="value">{{ profileData.birthday }}</span>
            </div>
            <div class="info-item">
              <span class="label">身高：</span>
              <span class="value">{{ profileData.height }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 个人简介 -->
      <div class="profile-section bio-section">
        <h2 class="section-title">个人简介</h2>
        <p class="bio-text">{{ profileData.bio }}</p>
      </div>

      <!-- 技能信息 -->
      <div class="profile-section skills-section">
        <h2 class="section-title">技能特长</h2>
        <div class="skills-grid">
          <div
            v-for="skill in profileData.skills"
            :key="skill.name"
            class="skill-card"
          >
            <div class="skill-icon">{{ skill.icon }}</div>
            <div class="skill-name">{{ skill.name }}</div>
            <div class="skill-level">
              <div class="skill-bar">
                <div
                  class="skill-progress"
                  :style="{ width: skill.level + '%' }"
                ></div>
              </div>
              <span class="skill-percent">{{ skill.level }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 爱好兴趣 -->
      <div class="profile-section hobbies-section">
        <h2 class="section-title">爱好兴趣</h2>
        <div class="hobbies-list">
          <div
            v-for="hobby in profileData.hobbies"
            :key="hobby"
            class="hobby-tag"
          >
            {{ hobby }}
          </div>
        </div>
      </div>

      <!-- 个人语录 -->
      <div class="profile-section quotes-section">
        <h2 class="section-title">个人语录</h2>
        <div class="quotes-carousel">
          <div class="quote-card">
            <div class="quote-icon">"</div>
            <p class="quote-text">{{ currentQuote }}</p>
            <button @click="nextQuote" class="next-quote-btn">下一句</button>
          </div>
        </div>
      </div>

      <!-- 联系方式 -->
      <div class="profile-section contact-section">
        <h2 class="section-title">联系方式</h2>
        <div class="contact-grid">
          <div
            v-for="contact in profileData.contacts"
            :key="contact.type"
            class="contact-item"
          >
            <span class="contact-icon">{{ contact.icon }}</span>
            <span class="contact-value">{{ contact.value }}</span>
          </div>
        </div>
      </div>

      <!-- 页面访问统计 -->
      <div class="profile-section stats-section">
        <h2 class="section-title">访问统计</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">{{ visitStats.total }}</div>
            <div class="stat-label">总访问量</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ visitStats.today }}</div>
            <div class="stat-label">今日访问</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ visitStats.likes }}</div>
            <div class="stat-label">点赞数</div>
          </div>
        </div>
        <button @click="addLike" class="like-button" :class="{ liked: hasLiked }">
          {{ hasLiked ? '已点赞 ♥' : '点赞 ♡' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const profileData = ref({
  name: '宇泽玲纱',
  title: 'SRT特殊学园成员 · 战术指挥',
  school: 'SRT特殊学园',
  age: '17岁',
  birthday: '3月15日',
  height: '165cm',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
  status: 'online',
  statusText: '在线',
  bio: '大家好，我是宇泽玲纱。作为SRT特殊学园的一员，我负责战术指挥和团队协调工作。虽然平时看起来有些严肃，但我也很喜欢和大家一起度过轻松的时光。我相信团队合作的力量，每个人都有自己独特的价值。希望能和各位老师一起，守护基沃托斯的和平！',
  skills: [
    { name: '战术指挥', level: 95, icon: '🎯' },
    { name: '团队协调', level: 90, icon: '🤝' },
    { name: '射击技巧', level: 88, icon: '🎯' },
    { name: '战场分析', level: 92, icon: '📊' },
    { name: '应急处理', level: 87, icon: '⚡' },
    { name: '战术规划', level: 93, icon: '📋' }
  ],
  hobbies: ['战术研究', '阅读', '咖啡', '团队训练', '音乐欣赏', '策略游戏'],
  quotes: [
    '作战开始，请各位做好准备。',
    '团队合作才是胜利的关键。',
    '不要急躁，冷静分析局势。',
    '相信自己，也相信队友。',
    '这次作战，我会全力支援大家！',
    '老师，有你在真是太好了。'
  ],
  contacts: [
    { type: 'email', icon: '📧', value: 'reisa@srt.kivothos' },
    { type: 'phone', icon: '📱', value: 'SRT-1501' },
    { type: 'location', icon: '📍', value: 'SRT特殊学园' }
  ]
})

const visitStats = ref({
  total: 0,
  today: 0,
  likes: 0
})

const currentQuoteIndex = ref(0)
const hasLiked = ref(false)

const currentQuote = computed(() => {
  return profileData.value.quotes[currentQuoteIndex.value]
})

const nextQuote = () => {
  currentQuoteIndex.value = (currentQuoteIndex.value + 1) % profileData.value.quotes.length
}

const addLike = async () => {
  if (hasLiked.value) return

  try {
    const response = await fetch('/api/reisa/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      const data = await response.json()
      visitStats.value.likes = data.likes
      hasLiked.value = true
      localStorage.setItem('reisa_liked', 'true')
    }
  } catch (error) {
    console.error('点赞失败:', error)
    // 即使API失败也允许本地点赞
    visitStats.value.likes++
    hasLiked.value = true
    localStorage.setItem('reisa_liked', 'true')
  }
}

const loadStats = async () => {
  try {
    const response = await fetch('/api/reisa/stats')
    if (response.ok) {
      const data = await response.json()
      visitStats.value = data
    }
  } catch (error) {
    console.error('加载统计失败:', error)
    // 使用默认值
    visitStats.value = {
      total: 1024,
      today: 42,
      likes: 888
    }
  }

  // 检查是否已点赞
  hasLiked.value = localStorage.getItem('reisa_liked') === 'true'
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.reisa-profile {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

.profile-container {
  max-width: 1000px;
  margin: 0 auto;
}

.profile-header {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 40px;
  margin-bottom: 30px;
  animation: fadeInUp 0.6s ease;
}

.avatar-section {
  position: relative;
  flex-shrink: 0;
}

.avatar-circle {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  overflow: hidden;
  border: 5px solid #667eea;
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.3);
}

.avatar-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-badge {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: #4ade80;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(74, 222, 128, 0.4);
}

.status-badge.online {
  background: #4ade80;
}

.header-info {
  flex: 1;
}

.character-name {
  font-size: 36px;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 10px 0;
}

.character-title {
  font-size: 18px;
  color: #667eea;
  margin: 0 0 20px 0;
  font-weight: 500;
}

.basic-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.info-item {
  display: flex;
  gap: 8px;
}

.info-item .label {
  color: #6b7280;
  font-weight: 500;
}

.info-item .value {
  color: #1f2937;
  font-weight: 600;
}

.profile-section {
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  animation: fadeInUp 0.6s ease;
  animation-fill-mode: both;
}

.profile-section:nth-child(2) { animation-delay: 0.1s; }
.profile-section:nth-child(3) { animation-delay: 0.2s; }
.profile-section:nth-child(4) { animation-delay: 0.3s; }
.profile-section:nth-child(5) { animation-delay: 0.4s; }
.profile-section:nth-child(6) { animation-delay: 0.5s; }
.profile-section:nth-child(7) { animation-delay: 0.6s; }

.section-title {
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 20px 0;
  padding-bottom: 15px;
  border-bottom: 3px solid #667eea;
}

.bio-text {
  color: #4b5563;
  line-height: 1.8;
  font-size: 16px;
  margin: 0;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.skill-card {
  background: #f9fafb;
  padding: 20px;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;
}

.skill-card:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.skill-icon {
  font-size: 32px;
  margin-bottom: 10px;
}

.skill-name {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 10px;
}

.skill-level {
  display: flex;
  align-items: center;
  gap: 10px;
}

.skill-bar {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.skill-progress {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 4px;
  transition: width 1s ease;
}

.skill-percent {
  font-size: 14px;
  font-weight: 600;
  color: #667eea;
  min-width: 45px;
}

.hobbies-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.hobby-tag {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: default;
}

.hobby-tag:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.quote-card {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 40px;
  border-radius: 15px;
  text-align: center;
  position: relative;
}

.quote-icon {
  font-size: 60px;
  opacity: 0.3;
  position: absolute;
  top: 20px;
  left: 30px;
}

.quote-text {
  font-size: 20px;
  line-height: 1.6;
  margin: 20px 0 30px;
  position: relative;
  z-index: 1;
}

.next-quote-btn {
  background: white;
  color: #667eea;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.next-quote-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  background: #f9fafb;
  border-radius: 10px;
  border: 2px solid #e5e7eb;
}

.contact-icon {
  font-size: 24px;
}

.contact-value {
  color: #1f2937;
  font-weight: 500;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
  padding: 25px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  color: white;
}

.stat-number {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
}

.like-button {
  width: 100%;
  padding: 15px;
  background: #f3f4f6;
  border: 2px solid #667eea;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  color: #667eea;
  cursor: pointer;
  transition: all 0.3s ease;
}

.like-button:hover {
  background: #667eea;
  color: white;
  transform: scale(1.02);
}

.like-button.liked {
  background: #667eea;
  color: white;
  cursor: default;
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

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .basic-info {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .character-name {
    font-size: 28px;
  }
}
</style>
