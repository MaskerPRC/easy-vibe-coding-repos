<template>
  <div class="video-player">
    <div class="player-wrapper">
      <!-- 嵌入 YouTube "Never Gonna Give You Up" -->
      <iframe
        width="100%"
        height="100%"
        :src="videoUrl"
        title="Video Player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
    <div class="video-details">
      <h1 class="video-title">{{ video.title }}</h1>
      <div class="video-stats">
        <span class="views">{{ formatViews(video.views) }} views</span>
        <div class="rating-bar">
          <div class="rating-fill" :style="{ width: video.rating + '%' }"></div>
        </div>
        <span class="rating-text">{{ video.rating }}%</span>
      </div>
      <div class="video-description">
        <p>{{ video.description }}</p>
        <p class="upload-info">Uploaded: {{ video.uploadDate }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  video: {
    type: Object,
    required: true
  }
});

// 所有视频都播放 "Never Gonna Give You Up"
// 使用 YouTube embed，自动播放
const videoUrl = computed(() => {
  return 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0';
});

const formatViews = (views) => {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + 'M';
  } else if (views >= 1000) {
    return (views / 1000).toFixed(1) + 'K';
  }
  return views.toString();
};
</script>

<style scoped>
.video-player {
  width: 100%;
}

.player-wrapper {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 aspect ratio */
  background: #000;
  border-radius: 8px;
  overflow: hidden;
}

.player-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.video-details {
  margin-top: 20px;
  padding: 20px;
  background: #2a2a2a;
  border-radius: 8px;
}

.video-title {
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 15px;
}

.video-stats {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #444;
}

.views {
  font-size: 14px;
  color: #aaa;
}

.rating-bar {
  flex: 1;
  max-width: 200px;
  height: 8px;
  background: #444;
  border-radius: 4px;
  overflow: hidden;
}

.rating-fill {
  height: 100%;
  background: linear-gradient(to right, #ff9000, #ffa500);
  transition: width 0.3s;
}

.rating-text {
  font-size: 14px;
  color: #ff9000;
  font-weight: bold;
}

.video-description {
  color: #ccc;
  line-height: 1.6;
}

.video-description p {
  margin-bottom: 10px;
}

.upload-info {
  font-size: 12px;
  color: #888;
  margin-top: 15px;
}

@media (max-width: 768px) {
  .video-title {
    font-size: 18px;
  }

  .video-stats {
    flex-wrap: wrap;
  }

  .rating-bar {
    width: 100%;
    max-width: 100%;
  }
}
</style>
