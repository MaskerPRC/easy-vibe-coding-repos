<template>
  <div class="music-player">
    <div class="music-info" @click="togglePlay">
      <div class="music-icon">
        <svg v-if="isPlaying" class="icon-playing" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
        </svg>
        <svg v-else class="icon-play" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </div>
      <div class="music-details">
        <div class="music-title">{{ currentSong.title }}</div>
        <div class="music-artist">{{ currentSong.artist }}</div>
      </div>
    </div>
    <audio
      ref="audioPlayer"
      :src="currentSong.url"
      @ended="onSongEnded"
      @play="isPlaying = true"
      @pause="isPlaying = false"
    ></audio>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const audioPlayer = ref(null);
const isPlaying = ref(false);

// 蔡徐坤的音乐信息 - 使用他的代表作《鸡你太美》
const currentSong = ref({
  title: '鸡你太美',
  artist: '蔡徐坤',
  // 使用公开可用的音乐链接，这里使用占位符，实际需要替换为真实链接
  url: 'https://music.163.com/song/media/outer/url?id=1371763011.mp3'
});

const togglePlay = async () => {
  if (!audioPlayer.value) return;

  try {
    if (isPlaying.value) {
      audioPlayer.value.pause();
    } else {
      await audioPlayer.value.play();
    }
  } catch (error) {
    console.log('播放失败:', error.message);
  }
};

const onSongEnded = () => {
  // 循环播放
  if (audioPlayer.value) {
    audioPlayer.value.currentTime = 0;
    audioPlayer.value.play();
  }
};

// 页面加载时自动播放
onMounted(async () => {
  // 延迟一点时间确保 DOM 已加载
  setTimeout(async () => {
    if (audioPlayer.value) {
      try {
        // 设置音量为适中
        audioPlayer.value.volume = 0.5;
        await audioPlayer.value.play();
      } catch (error) {
        // 自动播放可能被浏览器阻止，用户需要手动点击播放
        console.log('自动播放被阻止，请手动点击播放按钮');
      }
    }
  }, 500);
});
</script>

<style scoped>
.music-player {
  display: flex;
  align-items: center;
}

.music-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.music-info:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.5);
}

.music-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.icon-playing {
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.music-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.music-title {
  font-size: 13px;
  font-weight: 600;
  color: white;
  line-height: 1.2;
}

.music-artist {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.2;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .music-info {
    padding: 4px 8px;
  }

  .music-icon {
    width: 20px;
    height: 20px;
  }

  .music-title {
    font-size: 12px;
  }

  .music-artist {
    font-size: 10px;
  }
}
</style>
