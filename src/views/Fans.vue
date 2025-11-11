<template>
  <div class="fans-page">
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">粉丝生态</h1>
        <p class="page-subtitle">感恩每一份支持与陪伴</p>
      </div>
    </div>

    <div class="fans-content">
      <div class="container">
        <!-- 应援色介绍 -->
        <section class="fan-color-section">
          <div class="section-header">
            <h2 class="section-title">应援色</h2>
          </div>
          <div class="fan-color-card">
            <div class="color-display">
              <div class="color-block"></div>
              <div class="color-info">
                <h3>葵花黄</h3>
                <p class="color-code">#FFD700</p>
                <p class="color-meaning">
                  葵花黄象征着阳光、温暖和希望，代表着蔡徐坤积极向上的形象，
                  也寓意着粉丝们像向日葵一样，永远向着阳光、追随梦想。
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- 粉丝名称 -->
        <section class="fan-name-section">
          <div class="section-header">
            <h2 class="section-title">粉丝名称</h2>
          </div>
          <div class="fan-name-card">
            <div class="fan-name-icon">🌻</div>
            <h3>IKUN</h3>
            <p>蔡徐坤的粉丝被称为"IKUN"，这个名字承载着粉丝对偶像的热爱与支持</p>
          </div>
        </section>

        <!-- 粉丝活动 -->
        <section class="fan-activities-section">
          <div class="section-header">
            <h2 class="section-title">粉丝活动</h2>
          </div>
          <div class="activities-grid">
            <div
              v-for="activity in activities"
              :key="activity.id"
              class="activity-card"
            >
              <div class="activity-icon">{{ activity.icon }}</div>
              <h3 class="activity-title">{{ activity.title }}</h3>
              <p class="activity-description">{{ activity.description }}</p>
              <div class="activity-examples">
                <div
                  v-for="example in activity.examples"
                  :key="example"
                  class="example-item"
                >
                  • {{ example }}
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 粉丝文化 -->
        <section class="fan-culture-section">
          <div class="section-header">
            <h2 class="section-title">粉丝文化</h2>
          </div>
          <div class="culture-list">
            <div
              v-for="culture in cultures"
              :key="culture.id"
              class="culture-item"
            >
              <div class="culture-icon">{{ culture.icon }}</div>
              <div class="culture-content">
                <h3>{{ culture.title }}</h3>
                <p>{{ culture.description }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- 应援口号 -->
        <section class="slogan-section">
          <div class="section-header">
            <h2 class="section-title">应援口号</h2>
          </div>
          <div class="slogan-card">
            <div class="slogan-text">
              "蔡徐坤，我们永远支持你！"
            </div>
            <div class="slogan-subtext">
              无论何时何地，IKUN永远是你最坚强的后盾
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const activities = ref([
  {
    id: 1,
    icon: '🎂',
    title: '生日应援',
    description: '每年的生日，粉丝都会组织各种应援活动',
    examples: [
      '包场影院播放VCR',
      '地铁站广告应援',
      '公益捐赠',
      '生日应援曲创作'
    ]
  },
  {
    id: 2,
    icon: '🎵',
    title: '音乐支持',
    description: '新歌发布时，粉丝积极打榜和宣传',
    examples: [
      '音乐平台打榜',
      '社交媒体宣传',
      '翻唱视频创作',
      '应援数据统计'
    ]
  },
  {
    id: 3,
    icon: '💝',
    title: '公益活动',
    description: '以蔡徐坤的名义参与各类公益项目',
    examples: [
      '助学项目',
      '环保活动',
      '动物保护',
      '抗疫捐赠'
    ]
  },
  {
    id: 4,
    icon: '📸',
    title: '创作支持',
    description: '粉丝创作各类应援作品',
    examples: [
      '手绘插画',
      '视频剪辑',
      '摄影作品',
      '同人文创作'
    ]
  }
]);

const cultures = ref([
  {
    id: 1,
    icon: '🌟',
    title: '理性追星',
    description: '提倡文明理性的追星方式，不打扰偶像的私人生活，用正确的方式表达喜爱'
  },
  {
    id: 2,
    icon: '🤝',
    title: '互帮互助',
    description: '粉丝之间互相帮助，新粉丝能快速融入社群，老粉丝乐于分享经验'
  },
  {
    id: 3,
    icon: '💪',
    title: '积极向上',
    description: '受到蔡徐坤的影响，粉丝们也努力让自己变得更好，在各自的领域发光发热'
  },
  {
    id: 4,
    icon: '❤️',
    title: '温暖陪伴',
    description: '无论顺境逆境，粉丝都会陪伴在侧，给予支持和鼓励'
  }
]);
</script>

<style scoped>
.fans-page {
  padding-top: 64px;
  min-height: 100vh;
  background: #F5F5F5;
}

.page-header {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: #333333;
  padding: 80px 0 60px;
  text-align: center;
}

.page-title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
}

.page-subtitle {
  font-size: 20px;
  opacity: 0.9;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.fans-content {
  padding: 48px 0 80px;
}

section {
  margin-bottom: 80px;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  color: #333333;
  position: relative;
  display: inline-block;
  padding-bottom: 16px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: linear-gradient(to right, #007AFF, #FFD700);
  border-radius: 2px;
}

/* 应援色卡片 */
.fan-color-card {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 48px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.color-display {
  display: flex;
  align-items: center;
  gap: 48px;
}

.color-block {
  width: 200px;
  height: 200px;
  background: #FFD700;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(255, 215, 0, 0.4);
  flex-shrink: 0;
}

.color-info h3 {
  font-size: 36px;
  font-weight: 700;
  color: #333333;
  margin-bottom: 8px;
}

.color-code {
  font-size: 24px;
  font-weight: 600;
  color: #FFD700;
  margin-bottom: 24px;
  font-family: 'Courier New', monospace;
}

.color-meaning {
  font-size: 16px;
  color: #666666;
  line-height: 1.8;
}

/* 粉丝名称卡片 */
.fan-name-card {
  background: linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%);
  color: #FFFFFF;
  border-radius: 16px;
  padding: 48px;
  text-align: center;
}

.fan-name-icon {
  font-size: 80px;
  margin-bottom: 24px;
}

.fan-name-card h3 {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
}

.fan-name-card p {
  font-size: 18px;
  opacity: 0.95;
  line-height: 1.6;
}

/* 活动网格 */
.activities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.activity-card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  text-align: center;
}

.activity-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0, 122, 255, 0.15);
}

.activity-icon {
  font-size: 56px;
  margin-bottom: 16px;
}

.activity-title {
  font-size: 24px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 12px;
}

.activity-description {
  font-size: 16px;
  color: #666666;
  margin-bottom: 20px;
  line-height: 1.6;
}

.activity-examples {
  text-align: left;
  padding-left: 8px;
}

.example-item {
  font-size: 14px;
  color: #888888;
  margin-bottom: 6px;
}

/* 文化列表 */
.culture-list {
  display: grid;
  gap: 24px;
}

.culture-item {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  gap: 24px;
  align-items: flex-start;
  transition: all 0.3s;
}

.culture-item:hover {
  transform: translateX(8px);
  box-shadow: 0 8px 24px rgba(0, 122, 255, 0.15);
}

.culture-icon {
  font-size: 48px;
  flex-shrink: 0;
}

.culture-content h3 {
  font-size: 24px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 12px;
}

.culture-content p {
  font-size: 16px;
  color: #666666;
  line-height: 1.8;
}

/* 应援口号 */
.slogan-card {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  border-radius: 16px;
  padding: 60px 48px;
  text-align: center;
}

.slogan-text {
  font-size: 36px;
  font-weight: 700;
  color: #333333;
  margin-bottom: 16px;
  text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.5);
}

.slogan-subtext {
  font-size: 18px;
  color: #555555;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .page-header {
    padding: 60px 0 40px;
  }

  .page-title {
    font-size: 36px;
  }

  .page-subtitle {
    font-size: 18px;
  }

  .section-title {
    font-size: 28px;
  }

  .fan-color-card {
    padding: 32px 24px;
  }

  .color-display {
    flex-direction: column;
    gap: 32px;
  }

  .color-block {
    width: 150px;
    height: 150px;
  }

  .color-info h3 {
    font-size: 28px;
  }

  .color-code {
    font-size: 20px;
  }

  .fan-name-card {
    padding: 40px 24px;
  }

  .fan-name-icon {
    font-size: 60px;
  }

  .fan-name-card h3 {
    font-size: 36px;
  }

  .activities-grid {
    grid-template-columns: 1fr;
  }

  .culture-item {
    flex-direction: column;
    text-align: center;
  }

  .slogan-card {
    padding: 40px 24px;
  }

  .slogan-text {
    font-size: 28px;
  }

  .slogan-subtext {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 28px;
  }

  .page-subtitle {
    font-size: 16px;
  }

  .section-title {
    font-size: 24px;
  }

  .slogan-text {
    font-size: 24px;
  }
}
</style>
