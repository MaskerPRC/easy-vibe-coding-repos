<template>
  <div class="video-card" @click="$emit('play', video)">
    <div class="thumbnail">
      <img :src="video.thumbnail" :alt="video.title" />
      <div class="duration">{{ video.duration }}</div>
      <div class="play-overlay">
        <div class="play-icon">▶</div>
      </div>
    </div>
    <div class="video-info">
      <h3 class="video-title">{{ video.title }}</h3>
      <div class="video-meta">
        <span class="views">{{ formatViews(video.views) }} views</span>
        <span class="rating">{{ video.rating }}%</span>
      </div>
      <div class="video-stats">
        <span>{{ video.uploadDate }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  video: {
    type: Object,
    required: true
  }
});

defineEmits(['play']);

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
.video-card {
  background: #2a2a2a;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.video-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(255, 144, 0, 0.3);
}

.thumbnail {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 aspect ratio */
  background: #1a1a1a;
  overflow: hidden;
}

.thumbnail img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: bold;
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.video-card:hover .play-overlay {
  background: rgba(0, 0, 0, 0.5);
}

.play-icon {
  width: 60px;
  height: 60px;
  background: rgba(255, 144, 0, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #000;
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 0.3s, transform 0.3s;
}

.video-card:hover .play-icon {
  opacity: 1;
  transform: scale(1);
}

.video-info {
  padding: 12px;
}

.video-title {
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.video-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.views {
  font-size: 12px;
  color: #aaa;
}

.rating {
  font-size: 12px;
  color: #ff9000;
  font-weight: bold;
}

.video-stats {
  font-size: 11px;
  color: #888;
}
</style>
