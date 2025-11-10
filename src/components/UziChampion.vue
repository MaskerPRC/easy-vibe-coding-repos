<template>
  <div v-if="visible" class="uzi-champion-overlay" @click="close">
    <div class="close-hint">点击任意处关闭</div>
    <div class="image-container">
      <img
        src="https://img1.baidu.com/it/u=3602773692,2793605246&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500"
        alt="UZI 夺冠合照"
        class="champion-image"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const visible = ref(props.show);

watch(() => props.show, (newVal) => {
  visible.value = newVal;
  // 当显示时阻止页面滚动
  if (newVal) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

const close = () => {
  visible.value = false;
  document.body.style.overflow = '';
  emit('close');
};
</script>

<style scoped>
.uzi-champion-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  cursor: pointer;
}

.close-hint {
  position: absolute;
  top: 20px;
  right: 20px;
  color: #fff;
  font-size: 18px;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 10000;
}

.image-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.champion-image {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
}

/* 响应式：在小屏幕上确保图片完全显示 */
@media (max-width: 768px) {
  .close-hint {
    font-size: 14px;
    padding: 8px 15px;
    top: 10px;
    right: 10px;
  }

  .image-container {
    padding: 10px;
  }
}
</style>
