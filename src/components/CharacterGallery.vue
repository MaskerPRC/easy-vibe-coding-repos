<template>
  <div class="character-gallery">
    <!-- 标题区域 -->
    <div class="gallery-header">
      <h1 class="main-title">🍰 日向美ビタースイーツ♪ 🍰</h1>
      <h2 class="subtitle">ひなビタ♪ 角色介绍</h2>
      <p class="description">
        日向美ビタースイーツ♪是KONAMI旗下的女子音乐企划，<br/>
        以甜点为主题，充满活力和梦想的少女乐队！
      </p>
    </div>

    <!-- 角色卡片区域 -->
    <div class="characters-container">
      <div
        v-for="character in characters"
        :key="character.id"
        class="character-card"
        :style="{ borderColor: character.color }"
        @mouseenter="hoveredCharacter = character.id"
        @mouseleave="hoveredCharacter = null"
      >
        <div class="card-header" :style="{ background: character.gradient }">
          <div class="character-image-container">
            <img :src="character.image" :alt="character.name" class="character-image" />
          </div>
          <div class="character-icon">{{ character.icon }}</div>
          <h3 class="character-name">{{ character.name }}</h3>
          <p class="character-name-jp">{{ character.nameJp }}</p>
        </div>

        <div class="card-body">
          <div class="info-item">
            <span class="label">担当:</span>
            <span class="value">{{ character.role }}</span>
          </div>
          <div class="info-item">
            <span class="label">年龄:</span>
            <span class="value">{{ character.age }}</span>
          </div>
          <div class="info-item">
            <span class="label">生日:</span>
            <span class="value">{{ character.birthday }}</span>
          </div>
          <div class="info-item">
            <span class="label">主题色:</span>
            <span class="color-preview" :style="{ background: character.color }"></span>
          </div>
          <div class="description-box">
            <p class="character-description">{{ character.description }}</p>
          </div>
          <div class="traits">
            <span class="trait" v-for="trait in character.traits" :key="trait">
              {{ trait }}
            </span>
          </div>
        </div>

        <div class="card-footer">
          <button
            class="favorite-btn"
            :style="{ background: character.gradient }"
            @click="toggleFavorite(character.id)"
          >
            {{ favorites.includes(character.id) ? '💖 已收藏' : '💗 收藏' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 企划信息 -->
    <div class="project-info">
      <h3>🎵 关于企划 🎵</h3>
      <div class="info-content">
        <p>
          <strong>日向美ビタースイーツ♪</strong>（ひなビタ♪）是KONAMI于2012年开始的跨媒体音乐企划。
        </p>
        <p>
          以架空城市「日向美市」为舞台，讲述了五位少女组建乐队，追逐音乐梦想的故事。
        </p>
        <p>
          企划包括音乐CD、游戏、漫画、广播剧等多种形式，深受粉丝喜爱！
        </p>
        <div class="project-tags">
          <span class="tag">🎮 BEMANI系列</span>
          <span class="tag">🎵 音乐游戏</span>
          <span class="tag">🍰 甜点主题</span>
          <span class="tag">💕 青春故事</span>
          <span class="tag">🎸 乐队企划</span>
        </div>
      </div>
    </div>

    <!-- 浮动音符装饰 -->
    <div class="floating-notes">
      <div class="note" v-for="i in 15" :key="i" :style="getNoteStyle(i)">
        {{ ['🎵', '🎶', '♪', '♫', '🎼'][i % 5] }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 角色数据
const characters = ref([
  {
    id: 1,
    name: '春日咲子',
    nameJp: 'Kasuga Sakiko',
    icon: '🌸',
    image: '/images/characters/sakiko.svg',
    role: '主唱',
    age: '16岁',
    birthday: '3月21日',
    color: '#FF69B4',
    gradient: 'linear-gradient(135deg, #FFB6D9 0%, #FF69B4 100%)',
    description: '乐队的主唱，性格开朗活泼，充满活力。喜欢甜点，梦想是成为职业歌手。',
    traits: ['元气满满', '甜点爱好者', '天生歌姬', '乐观向上']
  },
  {
    id: 2,
    name: '芽兔めう',
    nameJp: 'Meu Meu',
    icon: '🐰',
    image: '/images/characters/meu.svg',
    role: '吉他手',
    age: '15岁',
    birthday: '1月8日',
    color: '#FFD700',
    gradient: 'linear-gradient(135deg, #FFF4B0 0%, #FFD700 100%)',
    description: '吉他手兼作曲，像兔子一样可爱。擅长创作旋律，性格天真烂漫。',
    traits: ['兔子系少女', '作曲天才', '天真可爱', '创意无限']
  },
  {
    id: 3,
    name: '和泉一舞',
    nameJp: 'Izumi Ibuki',
    icon: '🎸',
    image: '/images/characters/ibuki.svg',
    role: '贝斯手',
    age: '17岁',
    birthday: '11月3日',
    color: '#87CEEB',
    gradient: 'linear-gradient(135deg, #B4E7FF 0%, #87CEEB 100%)',
    description: '贝斯手，冷静沉稳的大姐姐角色。负责乐队的节奏基础，可靠的存在。',
    traits: ['冷静沉稳', '可靠大姐', '节奏大师', '温柔体贴']
  },
  {
    id: 4,
    name: '山形まり花',
    nameJp: 'Yamagata Marika',
    icon: '🎹',
    image: '/images/characters/marika.svg',
    role: '键盘手',
    age: '16岁',
    birthday: '7月15日',
    color: '#98FB98',
    gradient: 'linear-gradient(135deg, #C1FFC1 0%, #98FB98 100%)',
    description: '键盘手，文静温柔的少女。音乐素养深厚，负责乐队的和声编排。',
    traits: ['温柔文静', '音乐才女', '细腻敏感', '和声专家']
  },
  {
    id: 5,
    name: '霜月凛',
    nameJp: 'Shimotsuki Rin',
    icon: '🥁',
    image: '/images/characters/rin.svg',
    role: '鼓手',
    age: '15岁',
    birthday: '12月1日',
    color: '#DDA0DD',
    gradient: 'linear-gradient(135deg, #F0C4F0 0%, #DDA0DD 100%)',
    description: '鼓手，活力四射的节奏担当。虽然年纪最小，但打鼓技术一流。',
    traits: ['活力少女', '节奏感超群', '开朗热情', '运动健将']
  }
]);

// 收藏状态
const favorites = ref([]);
const hoveredCharacter = ref(null);

// 切换收藏
const toggleFavorite = (id) => {
  const index = favorites.value.indexOf(id);
  if (index > -1) {
    favorites.value.splice(index, 1);
  } else {
    favorites.value.push(id);
  }
};

// 生成音符样式
const getNoteStyle = (index) => {
  return {
    left: `${(index * 6.66) % 100}%`,
    top: `${(index * 7.5) % 100}%`,
    animationDelay: `${index * 0.5}s`,
    fontSize: `${1 + (index % 3) * 0.5}rem`,
    opacity: 0.15
  };
};
</script>

<style scoped>
.character-gallery {
  min-height: 100vh;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

/* 标题区域 */
.gallery-header {
  text-align: center;
  margin-bottom: 50px;
  position: relative;
  z-index: 1;
}

.main-title {
  font-size: 3rem;
  color: #FF69B4;
  text-shadow: 3px 3px 6px rgba(255, 105, 180, 0.3);
  margin-bottom: 10px;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.subtitle {
  font-size: 1.8rem;
  color: #FF1493;
  margin-bottom: 15px;
}

.description {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.8;
}

/* 角色卡片容器 */
.characters-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
  max-width: 1400px;
  margin: 0 auto 60px;
  position: relative;
  z-index: 1;
}

/* 角色卡片 */
.character-card {
  background: white;
  border-radius: 20px;
  border: 4px solid #FFB6D9;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(255, 182, 217, 0.3);
}

.character-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 15px 40px rgba(255, 105, 180, 0.5);
}

/* 卡片头部 */
.card-header {
  padding: 30px 20px;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
}

/* 人物立绘容器 */
.character-image-container {
  position: relative;
  width: 180px;
  height: 240px;
  margin: 0 auto 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.character-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3));
  animation: character-appear 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
  transition: transform 0.3s ease;
}

.character-card:hover .character-image {
  transform: scale(1.1) translateY(-10px);
  filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.4));
}

@keyframes character-appear {
  0% {
    opacity: 0;
    transform: scale(0.3) translateY(50px);
  }
  60% {
    transform: scale(1.1) translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.character-icon {
  font-size: 2.5rem;
  margin-bottom: 10px;
  animation: rotate 3s ease-in-out infinite;
  display: inline-block;
}

@keyframes rotate {
  0%, 100% {
    transform: rotate(-5deg);
  }
  50% {
    transform: rotate(5deg);
  }
}

.character-name {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 5px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.character-name-jp {
  font-size: 1rem;
  opacity: 0.9;
}

/* 卡片主体 */
.card-body {
  padding: 25px;
}

.info-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 8px 12px;
  background: #FFF9FC;
  border-radius: 8px;
}

.label {
  font-weight: bold;
  color: #666;
}

.value {
  color: #333;
}

.color-preview {
  width: 40px;
  height: 25px;
  border-radius: 5px;
  border: 2px solid #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.description-box {
  margin: 20px 0;
  padding: 15px;
  background: linear-gradient(135deg, #FFF0F5 0%, #FFE5EC 100%);
  border-radius: 10px;
  border-left: 4px solid #FF69B4;
}

.character-description {
  color: #555;
  line-height: 1.6;
  font-size: 0.95rem;
}

/* 特征标签 */
.traits {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 15px;
}

.trait {
  background: linear-gradient(135deg, #FFB6D9 0%, #FF69B4 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 2px 5px rgba(255, 105, 180, 0.3);
}

/* 卡片底部 */
.card-footer {
  padding: 0 25px 25px;
}

.favorite-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 25px;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.3);
}

.favorite-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(255, 105, 180, 0.5);
}

.favorite-btn:active {
  transform: scale(0.98);
}

/* 企划信息 */
.project-info {
  max-width: 900px;
  margin: 60px auto 0;
  padding: 30px;
  background: white;
  border-radius: 20px;
  border: 3px solid #FFB6D9;
  box-shadow: 0 8px 25px rgba(255, 182, 217, 0.3);
  position: relative;
  z-index: 1;
}

.project-info h3 {
  text-align: center;
  font-size: 2rem;
  color: #FF69B4;
  margin-bottom: 25px;
}

.info-content p {
  margin-bottom: 15px;
  line-height: 1.8;
  color: #555;
  font-size: 1.05rem;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 25px;
  justify-content: center;
}

.tag {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  box-shadow: 0 3px 10px rgba(255, 215, 0, 0.3);
}

/* 浮动音符装饰 */
.floating-notes {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.note {
  position: absolute;
  animation: float-note 8s ease-in-out infinite;
}

@keyframes float-note {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.1;
  }
  50% {
    transform: translateY(-50px) rotate(360deg);
    opacity: 0.3;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1.3rem;
  }

  .characters-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .project-info {
    padding: 20px;
  }
}
</style>
