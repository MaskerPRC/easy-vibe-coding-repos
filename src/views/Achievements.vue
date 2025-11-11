<template>
  <div class="achievements">
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">辉煌事迹</h1>
        <p class="page-subtitle">记录每一个闪光时刻</p>
      </div>
    </div>

    <div class="achievements-content">
      <div class="container">
        <!-- 分类标签 -->
        <div class="category-tabs">
          <button
            v-for="category in categories"
            :key="category.id"
            :class="{ active: activeCategory === category.id }"
            @click="activeCategory = category.id"
          >
            {{ category.name }}
          </button>
        </div>

        <!-- 成就列表 -->
        <div class="achievements-grid">
          <div
            v-for="achievement in filteredAchievements"
            :key="achievement.id"
            class="achievement-card"
          >
            <div class="achievement-icon">{{ achievement.icon }}</div>
            <div class="achievement-content">
              <h3 class="achievement-title">{{ achievement.title }}</h3>
              <p class="achievement-year">{{ achievement.year }}</p>
              <p class="achievement-description">{{ achievement.description }}</p>
              <div class="achievement-tags">
                <span
                  v-for="tag in achievement.tags"
                  :key="tag"
                  class="tag"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const activeCategory = ref('all');

const categories = ref([
  { id: 'all', name: '全部' },
  { id: 'music', name: '音乐' },
  { id: 'dance', name: '舞蹈' },
  { id: 'film', name: '影视' },
  { id: 'awards', name: '奖项' }
]);

const achievements = ref([
  {
    id: 1,
    category: 'music',
    icon: '🎵',
    title: '个人专辑《迷》发布',
    year: '2022',
    description: '首张个人专辑《迷》全网发布，展现多元音乐风格',
    tags: ['原创', '专辑']
  },
  {
    id: 2,
    category: 'music',
    icon: '🎤',
    title: '单曲《情人》发布',
    year: '2021',
    description: '个人单曲《情人》获得广泛好评，展现音乐实力',
    tags: ['单曲', '原创']
  },
  {
    id: 3,
    category: 'dance',
    icon: '💃',
    title: '舞蹈创作《Wait Wait Wait》',
    year: '2020',
    description: '原创舞蹈作品《Wait Wait Wait》引发全网热潮',
    tags: ['编舞', '原创']
  },
  {
    id: 4,
    category: 'film',
    icon: '🎬',
    title: '电视剧《天官赐福》',
    year: '2023',
    description: '出演电视剧《天官赐福》，展现演技实力',
    tags: ['主演', '古装']
  },
  {
    id: 5,
    category: 'awards',
    icon: '🏆',
    title: '亚洲音乐大奖最佳男艺人',
    year: '2022',
    description: '获得亚洲音乐大奖最佳男艺人殊荣',
    tags: ['音乐', '奖项']
  },
  {
    id: 6,
    category: 'music',
    icon: '🎼',
    title: '音乐制作人身份',
    year: '2021',
    description: '参与多首歌曲的制作和创作，展现音乐才华',
    tags: ['制作人', '创作']
  },
  {
    id: 7,
    category: 'dance',
    icon: '🕺',
    title: '舞蹈导师',
    year: '2020',
    description: '担任多个节目的舞蹈导师，指导新人练习生',
    tags: ['导师', '综艺']
  },
  {
    id: 8,
    category: 'awards',
    icon: '🌟',
    title: '年度最受欢迎男歌手',
    year: '2021',
    description: '获得多个音乐平台年度最受欢迎男歌手称号',
    tags: ['人气', '奖项']
  },
  {
    id: 9,
    category: 'music',
    icon: '🎸',
    title: '全国巡回演唱会',
    year: '2023',
    description: '举办个人全国巡回演唱会，场场爆满',
    tags: ['演唱会', '巡演']
  }
]);

const filteredAchievements = computed(() => {
  if (activeCategory.value === 'all') {
    return achievements.value;
  }
  return achievements.value.filter(a => a.category === activeCategory.value);
});
</script>

<style scoped>
.achievements {
  padding-top: 64px;
  min-height: 100vh;
  background: #F5F5F5;
}

.page-header {
  background: linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%);
  color: #FFFFFF;
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

.achievements-content {
  padding: 48px 0 80px;
}

/* 分类标签 */
.category-tabs {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 48px;
  flex-wrap: wrap;
}

.category-tabs button {
  padding: 12px 32px;
  background: #FFFFFF;
  border: 2px solid #DDDDDD;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 500;
  color: #666666;
  cursor: pointer;
  transition: all 0.3s;
}

.category-tabs button:hover {
  border-color: #007AFF;
  color: #007AFF;
}

.category-tabs button.active {
  background: #007AFF;
  border-color: #007AFF;
  color: #FFFFFF;
}

/* 成就网格 */
.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.achievement-card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  display: flex;
  gap: 20px;
}

.achievement-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 122, 255, 0.15);
}

.achievement-icon {
  font-size: 48px;
  flex-shrink: 0;
}

.achievement-content {
  flex: 1;
}

.achievement-title {
  font-size: 20px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 8px;
}

.achievement-year {
  font-size: 14px;
  color: #007AFF;
  font-weight: 600;
  margin-bottom: 12px;
}

.achievement-description {
  font-size: 16px;
  color: #666666;
  line-height: 1.6;
  margin-bottom: 16px;
}

.achievement-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 4px 12px;
  background: #F0F0F0;
  border-radius: 12px;
  font-size: 14px;
  color: #666666;
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

  .achievements-grid {
    grid-template-columns: 1fr;
  }

  .achievement-card {
    padding: 24px;
  }

  .achievement-icon {
    font-size: 40px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 28px;
  }

  .page-subtitle {
    font-size: 16px;
  }

  .category-tabs button {
    padding: 10px 24px;
    font-size: 14px;
  }

  .achievement-card {
    flex-direction: column;
    text-align: center;
  }

  .achievement-icon {
    font-size: 56px;
  }

  .achievement-tags {
    justify-content: center;
  }
}
</style>
