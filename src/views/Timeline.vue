<template>
  <div class="timeline-page">
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">成长历程</h1>
        <p class="page-subtitle">记录每一步的成长与蜕变</p>
      </div>
    </div>

    <div class="timeline-content">
      <div class="container">
        <div class="timeline">
          <div
            v-for="(item, index) in timelineData"
            :key="item.id"
            class="timeline-item"
            :class="{ left: index % 2 === 0, right: index % 2 !== 0 }"
          >
            <div class="timeline-marker"></div>
            <div class="timeline-card">
              <div class="timeline-year">{{ item.year }}</div>
              <h3 class="timeline-title">{{ item.title }}</h3>
              <p class="timeline-description">{{ item.description }}</p>
              <div class="timeline-highlights">
                <div
                  v-for="highlight in item.highlights"
                  :key="highlight"
                  class="highlight-item"
                >
                  <span class="highlight-dot"></span>
                  <span>{{ highlight }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const timelineData = ref([
  {
    id: 1,
    year: '1998',
    title: '出生',
    description: '蔡徐坤出生于浙江省，从小就展现出对音乐和舞蹈的热爱',
    highlights: [
      '出生于浙江',
      '展现艺术天赋'
    ]
  },
  {
    id: 2,
    year: '2012',
    title: '练习生时期开始',
    description: '加入TF家族成为练习生，开始系统的音乐和舞蹈训练',
    highlights: [
      '加入练习生体系',
      '接受专业训练',
      '积累舞台经验'
    ]
  },
  {
    id: 3,
    year: '2015',
    title: '出道',
    description: 'SWIN组合出道，正式开启演艺生涯',
    highlights: [
      'SWIN组合出道',
      '发布首张专辑',
      '参加综艺节目'
    ]
  },
  {
    id: 4,
    year: '2018',
    title: '《偶像练习生》C位出道',
    description: '参加《偶像练习生》节目，以C位身份出道，人气暴涨',
    highlights: [
      '获得C位',
      '加入NINE PERCENT',
      '人气快速上升'
    ]
  },
  {
    id: 5,
    year: '2019',
    title: '个人发展期',
    description: 'NINE PERCENT合约到期后，开启个人发展道路',
    highlights: [
      '发布个人单曲',
      '参与影视作品',
      '举办粉丝见面会'
    ]
  },
  {
    id: 6,
    year: '2020',
    title: '音乐制作人',
    description: '以音乐制作人身份参与多个节目和作品创作',
    highlights: [
      '担任音乐制作人',
      '创作多首原创歌曲',
      '参与综艺节目'
    ]
  },
  {
    id: 7,
    year: '2021',
    title: '多元发展',
    description: '在音乐、影视、综艺等多个领域全面发展',
    highlights: [
      '发布单曲《情人》',
      '参演多部影视作品',
      '担任节目导师'
    ]
  },
  {
    id: 8,
    year: '2022',
    title: '首张个人专辑',
    description: '发布首张个人专辑《迷》，展现音乐才华',
    highlights: [
      '专辑《迷》发布',
      '获得多个音乐奖项',
      '举办演唱会'
    ]
  },
  {
    id: 9,
    year: '2023',
    title: '全国巡演',
    description: '举办个人全国巡回演唱会，与粉丝近距离互动',
    highlights: [
      '全国巡回演唱会',
      '新作品筹备中',
      '公益活动参与'
    ]
  },
  {
    id: 10,
    year: '2024',
    title: '继续前行',
    description: '继续在音乐道路上探索，期待更多精彩作品',
    highlights: [
      '新专辑筹备',
      '影视作品拍摄',
      '音乐创作'
    ]
  }
]);
</script>

<style scoped>
.timeline-page {
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
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 24px;
}

.timeline-content {
  padding: 80px 0;
}

/* 时间轴 */
.timeline {
  position: relative;
  padding: 40px 0;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom, #007AFF, #FFD700);
  transform: translateX(-50%);
}

.timeline-item {
  position: relative;
  margin-bottom: 60px;
  width: 50%;
  padding: 0 40px;
}

.timeline-item.left {
  left: 0;
  text-align: right;
}

.timeline-item.right {
  left: 50%;
  text-align: left;
}

.timeline-marker {
  position: absolute;
  top: 0;
  width: 20px;
  height: 20px;
  background: #007AFF;
  border: 4px solid #FFFFFF;
  border-radius: 50%;
  box-shadow: 0 0 0 4px #F5F5F5;
  z-index: 1;
}

.timeline-item.left .timeline-marker {
  right: -10px;
}

.timeline-item.right .timeline-marker {
  left: -10px;
}

.timeline-card {
  background: #FFFFFF;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  position: relative;
}

.timeline-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 122, 255, 0.15);
}

.timeline-card::before {
  content: '';
  position: absolute;
  top: 8px;
  width: 0;
  height: 0;
  border: 10px solid transparent;
}

.timeline-item.left .timeline-card::before {
  right: -20px;
  border-left-color: #FFFFFF;
}

.timeline-item.right .timeline-card::before {
  left: -20px;
  border-right-color: #FFFFFF;
}

.timeline-year {
  display: inline-block;
  padding: 6px 16px;
  background: linear-gradient(135deg, #007AFF, #5AC8FA);
  color: #FFFFFF;
  font-size: 18px;
  font-weight: 700;
  border-radius: 20px;
  margin-bottom: 12px;
}

.timeline-title {
  font-size: 24px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 12px;
}

.timeline-description {
  font-size: 16px;
  color: #666666;
  line-height: 1.6;
  margin-bottom: 16px;
}

.timeline-highlights {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.timeline-item.left .timeline-highlights {
  align-items: flex-end;
}

.timeline-item.right .timeline-highlights {
  align-items: flex-start;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666666;
}

.highlight-dot {
  width: 6px;
  height: 6px;
  background: #FFD700;
  border-radius: 50%;
  flex-shrink: 0;
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

  .timeline::before {
    left: 20px;
  }

  .timeline-item {
    width: 100%;
    left: 0 !important;
    text-align: left;
    padding: 0 0 0 60px;
  }

  .timeline-item .timeline-marker {
    left: 11px !important;
    right: auto !important;
  }

  .timeline-card::before {
    left: -20px !important;
    right: auto !important;
    border-right-color: #FFFFFF !important;
    border-left-color: transparent !important;
  }

  .timeline-highlights {
    align-items: flex-start !important;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 28px;
  }

  .page-subtitle {
    font-size: 16px;
  }

  .timeline-item {
    padding: 0 0 0 50px;
  }

  .timeline-card {
    padding: 20px;
  }

  .timeline-title {
    font-size: 20px;
  }

  .timeline-description {
    font-size: 14px;
  }
}
</style>
