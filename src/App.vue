<template>
  <div class="app">
    <div class="content-container">
      <div class="character-card">
        <!-- SVG人物形象 -->
        <div class="character-avatar">
          <svg viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg">
            <!-- 头部 -->
            <ellipse cx="100" cy="60" rx="40" ry="50" fill="#FFD4A3" />

            <!-- 发型 -->
            <path d="M 60 40 Q 60 10, 100 10 Q 140 10, 140 40 L 140 65 Q 140 35, 100 35 Q 60 35, 60 65 Z" fill="#2C1810" />

            <!-- 眼睛 -->
            <ellipse cx="85" cy="60" rx="4" ry="6" fill="#2C1810" />
            <ellipse cx="115" cy="60" rx="4" ry="6" fill="#2C1810" />

            <!-- 眉毛 -->
            <path d="M 75 50 Q 85 48, 95 50" stroke="#2C1810" stroke-width="2" fill="none" stroke-linecap="round" />
            <path d="M 105 50 Q 115 48, 125 50" stroke="#2C1810" stroke-width="2" fill="none" stroke-linecap="round" />

            <!-- 嘴巴 -->
            <path d="M 90 75 Q 100 80, 110 75" stroke="#2C1810" stroke-width="2" fill="none" stroke-linecap="round" />

            <!-- 脖子 -->
            <rect x="90" y="100" width="20" height="15" fill="#FFD4A3" rx="3" />

            <!-- 身体（时尚外套） -->
            <path d="M 70 115 L 70 200 Q 70 210, 80 210 L 120 210 Q 130 210, 130 200 L 130 115 Q 130 115, 100 120 Q 70 115, 70 115 Z" fill="#4A90E2" />

            <!-- 衣领 -->
            <path d="M 85 115 L 90 125 L 100 120 L 110 125 L 115 115" fill="#FFFFFF" stroke="#4A90E2" stroke-width="1" />

            <!-- 衣服装饰线 -->
            <line x1="100" y1="125" x2="100" y2="205" stroke="#FFFFFF" stroke-width="1" opacity="0.5" />

            <!-- 左臂 -->
            <rect x="55" y="125" width="15" height="70" fill="#4A90E2" rx="7" />
            <ellipse cx="62.5" cy="200" rx="10" ry="12" fill="#FFD4A3" />

            <!-- 右臂 -->
            <rect x="130" y="125" width="15" height="70" fill="#4A90E2" rx="7" />
            <ellipse cx="137.5" cy="200" rx="10" ry="12" fill="#FFD4A3" />

            <!-- 裤子 -->
            <rect x="75" y="210" width="20" height="50" fill="#333333" rx="4" />
            <rect x="105" y="210" width="20" height="50" fill="#333333" rx="4" />

            <!-- 鞋子 -->
            <ellipse cx="85" cy="265" rx="12" ry="8" fill="#000000" />
            <ellipse cx="115" cy="265" rx="12" ry="8" fill="#000000" />

            <!-- 篮球装饰元素 -->
            <circle cx="155" cy="155" r="18" fill="#F5A623" stroke="#2C1810" stroke-width="2" />
            <path d="M 155 137 L 155 173" stroke="#2C1810" stroke-width="1.5" />
            <path d="M 137 155 L 173 155" stroke="#2C1810" stroke-width="1.5" />
            <path d="M 145 145 Q 155 155, 165 145" stroke="#2C1810" stroke-width="1.5" fill="none" />
            <path d="M 145 165 Q 155 155, 165 165" stroke="#2C1810" stroke-width="1.5" fill="none" />
          </svg>
        </div>

        <!-- 姓名标题 -->
        <h1 class="character-name">蔡徐坤</h1>

        <!-- 副标题 -->
        <p class="character-subtitle">歌手 · 演员 · 制作人</p>

        <!-- 标签 -->
        <div class="character-tags">
          <span class="tag">音乐</span>
          <span class="tag">篮球</span>
          <span class="tag">时尚</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 蔡徐坤展示页面
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: #F5F5F5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  font-family: 'PingFang SC', 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

.content-container {
  width: 100%;
  max-width: 500px;
  text-align: center;
}

.character-card {
  background: #FFFFFF;
  padding: 48px 32px;
  border-radius: 8px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.character-card:hover {
  transform: translateY(-4px);
  box-shadow: 0px 4px 16px rgba(74, 144, 226, 0.15);
}

.character-avatar {
  width: 200px;
  height: 280px;
  margin: 0 auto 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.character-avatar svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.08));
}

.character-name {
  font-size: 36px;
  font-weight: 700;
  color: #333333;
  margin-bottom: 16px;
  letter-spacing: 2px;
}

.character-subtitle {
  font-size: 16px;
  color: #666666;
  margin-bottom: 24px;
  line-height: 1.6;
}

.character-tags {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.tag {
  display: inline-block;
  padding: 8px 16px;
  background: #4A90E2;
  color: #FFFFFF;
  font-size: 14px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: default;
}

.tag:hover {
  background: #357ABD;
  transform: scale(1.05);
}

.tag:nth-child(2) {
  background: #F5A623;
}

.tag:nth-child(2):hover {
  background: #D4891C;
}

.tag:nth-child(3) {
  background: #BBBBBB;
}

.tag:nth-child(3):hover {
  background: #999999;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .app {
    padding: 16px;
  }

  .character-card {
    padding: 32px 24px;
  }

  .character-avatar {
    width: 180px;
    height: 252px;
    margin-bottom: 24px;
  }

  .character-name {
    font-size: 28px;
    margin-bottom: 12px;
  }

  .character-subtitle {
    font-size: 14px;
    margin-bottom: 20px;
  }

  .character-tags {
    gap: 8px;
  }

  .tag {
    padding: 6px 12px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .character-card {
    padding: 24px 16px;
  }

  .character-avatar {
    width: 160px;
    height: 224px;
    margin-bottom: 20px;
  }

  .character-name {
    font-size: 24px;
    margin-bottom: 10px;
  }

  .character-subtitle {
    font-size: 13px;
    margin-bottom: 16px;
  }

  .tag {
    padding: 5px 10px;
    font-size: 12px;
  }
}
</style>
