<template>
  <div class="timeline-container">
    <!-- 时间线标题 -->
    <div class="timeline-header">
      <h3 class="timeline-title">历史时间线</h3>
      <div class="timeline-controls">
        <button @click="scrollLeft" class="timeline-btn" :disabled="!canScrollLeft">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4L6 10L12 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button @click="scrollRight" class="timeline-btn" :disabled="!canScrollRight">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 4L14 10L8 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 时间线滚动容器 -->
    <div class="timeline-scroll" ref="timelineScroll" @scroll="updateScrollState">
      <div class="timeline-track">
        <!-- 时间线线条 -->
        <div class="timeline-line"></div>

        <!-- 时间节点 -->
        <div
          v-for="item in timelineItems"
          :key="item.id"
          class="timeline-item"
          :class="{ active: item.id === currentId }"
          @click="$emit('select', item.id)"
        >
          <div class="timeline-dot">
            <div class="dot-inner"></div>
          </div>
          <div class="timeline-content">
            <div class="timeline-year">{{ item.year }}</div>
            <div class="timeline-label">{{ item.os }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 导航按钮（移动端） -->
    <div class="mobile-nav">
      <button @click="gotoPrevious" class="nav-button" :disabled="!canGoPrev">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        上一个
      </button>
      <div class="nav-indicator">
        {{ currentIndex + 1 }} / {{ timelineItems.length }}
      </div>
      <button @click="gotoNext" class="nav-button" :disabled="!canGoNext">
        下一个
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue';

const props = defineProps({
  timelineItems: {
    type: Array,
    required: true
  },
  currentId: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['select']);

const timelineScroll = ref(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);

// 当前索引
const currentIndex = computed(() => {
  return props.timelineItems.findIndex(item => item.id === props.currentId);
});

// 是否可以前进/后退
const canGoPrev = computed(() => currentIndex.value > 0);
const canGoNext = computed(() => currentIndex.value < props.timelineItems.length - 1);

// 更新滚动状态
const updateScrollState = () => {
  if (!timelineScroll.value) return;

  const { scrollLeft, scrollWidth, clientWidth } = timelineScroll.value;
  canScrollLeft.value = scrollLeft > 0;
  canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 10;
};

// 滚动方法
const scrollLeft = () => {
  if (timelineScroll.value) {
    timelineScroll.value.scrollBy({ left: -300, behavior: 'smooth' });
  }
};

const scrollRight = () => {
  if (timelineScroll.value) {
    timelineScroll.value.scrollBy({ left: 300, behavior: 'smooth' });
  }
};

// 导航到上一个/下一个
const gotoPrevious = () => {
  if (canGoPrev.value) {
    emit('select', props.timelineItems[currentIndex.value - 1].id);
  }
};

const gotoNext = () => {
  if (canGoNext.value) {
    emit('select', props.timelineItems[currentIndex.value + 1].id);
  }
};

// 当当前项变化时，滚动到可见区域
watch(() => props.currentId, async () => {
  await nextTick();
  if (timelineScroll.value) {
    const activeItem = timelineScroll.value.querySelector('.timeline-item.active');
    if (activeItem) {
      activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }
});

onMounted(() => {
  updateScrollState();
  if (timelineScroll.value) {
    timelineScroll.value.addEventListener('scroll', updateScrollState);
  }
});
</script>

<style scoped>
.timeline-container {
  width: 100%;
  padding: 32px 0;
  background: rgba(26, 43, 66, 0.5);
  border-radius: 8px;
  margin-bottom: 48px;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32px 24px;
}

.timeline-title {
  color: #00FFCC;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  letter-spacing: 1px;
}

.timeline-controls {
  display: flex;
  gap: 12px;
}

.timeline-btn {
  background: rgba(0, 255, 204, 0.1);
  border: 1px solid #00FFCC;
  color: #00FFCC;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timeline-btn:hover:not(:disabled) {
  background: rgba(0, 255, 204, 0.2);
  transform: translateY(-2px);
}

.timeline-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.timeline-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0 32px;
  scroll-behavior: smooth;
}

.timeline-scroll::-webkit-scrollbar {
  height: 8px;
}

.timeline-scroll::-webkit-scrollbar-track {
  background: rgba(0, 255, 204, 0.1);
  border-radius: 4px;
}

.timeline-scroll::-webkit-scrollbar-thumb {
  background: #00FFCC;
  border-radius: 4px;
}

.timeline-track {
  display: flex;
  gap: 48px;
  position: relative;
  min-width: min-content;
  padding: 40px 0;
}

.timeline-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(to right,
    rgba(0, 255, 204, 0.1) 0%,
    #00FFCC 50%,
    rgba(0, 255, 204, 0.1) 100%);
  transform: translateY(-50%);
}

.timeline-item {
  position: relative;
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.3s;
}

.timeline-item:hover .timeline-dot {
  transform: scale(1.2);
}

.timeline-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #1A2B42;
  border: 2px solid #E0E0E0;
  position: relative;
  z-index: 2;
  transition: all 0.3s;
  margin: 0 auto;
}

.timeline-item.active .timeline-dot {
  border-color: #00FFCC;
  background: #00FFCC;
  box-shadow: 0 0 20px rgba(0, 255, 204, 0.6);
}

.dot-inner {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #E0E0E0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.3s;
}

.timeline-item.active .dot-inner {
  background: #0A192F;
}

.timeline-content {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 16px;
  text-align: center;
  white-space: nowrap;
}

.timeline-year {
  color: #00FFCC;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
  transition: all 0.3s;
}

.timeline-item.active .timeline-year {
  font-size: 22px;
  text-shadow: 0 0 10px rgba(0, 255, 204, 0.8);
}

.timeline-label {
  color: #E0E0E0;
  font-size: 13px;
  opacity: 0.8;
  transition: all 0.3s;
}

.timeline-item.active .timeline-label {
  opacity: 1;
  color: #FFFFFF;
  font-size: 14px;
}

.mobile-nav {
  display: none;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px 0;
  margin-top: 24px;
  border-top: 1px solid rgba(0, 255, 204, 0.2);
}

.nav-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 255, 204, 0.1);
  border: 1px solid #00FFCC;
  color: #00FFCC;
  padding: 12px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  font-weight: 500;
}

.nav-button:hover:not(:disabled) {
  background: rgba(0, 255, 204, 0.2);
  transform: translateY(-2px);
}

.nav-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.nav-indicator {
  color: #B0B0B0;
  font-size: 14px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .timeline-container {
    padding: 24px 0;
  }

  .timeline-header {
    padding: 0 16px 16px;
  }

  .timeline-title {
    font-size: 16px;
  }

  .timeline-controls {
    display: none;
  }

  .timeline-scroll {
    padding: 0 16px;
  }

  .timeline-track {
    gap: 32px;
    padding: 30px 0;
  }

  .mobile-nav {
    display: flex;
    padding: 24px 16px 0;
  }

  .nav-button {
    padding: 10px 16px;
    font-size: 13px;
  }

  .timeline-year {
    font-size: 16px;
  }

  .timeline-item.active .timeline-year {
    font-size: 18px;
  }

  .timeline-label {
    font-size: 12px;
  }
}
</style>
