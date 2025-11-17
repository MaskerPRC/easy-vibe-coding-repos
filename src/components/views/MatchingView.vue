<template>
  <div class="matching-view">
    <div class="matching-spinner"></div>
    <h2>正在匹配对手...</h2>
    <p>已等待 {{ matchingTime }}秒</p>
    <button @click="handleCancel" class="btn-cancel">取消匹配</button>
  </div>
</template>

<script setup>
defineProps({
  matchingTime: Number
});

const emit = defineEmits(['cancel-matching']);

const handleCancel = () => {
  emit('cancel-matching');
};
</script>

<style scoped>
.matching-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
}

.matching-spinner {
  width: 80px;
  height: 80px;
  border: 8px solid rgba(138, 43, 226, 0.2);
  border-top-color: #8a2be2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.matching-view h2 {
  color: #8a2be2;
  font-size: 32px;
}

.matching-view p {
  color: #aaa;
  font-size: 18px;
}

.btn-cancel {
  padding: 12px 30px;
  background: rgba(255, 255, 255, 0.05);
  color: #e0e0e0;
  border: 1px solid #666;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>
