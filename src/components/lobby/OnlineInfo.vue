<template>
  <div class="online-info">
    <span class="online-dot"></span>
    <span>当前在线: <strong>{{ count }}</strong> 人</span>
  </div>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    required: true
  }
})
</script>

<style scoped>
.online-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: rgba(255, 215, 0, 0.1);
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
}

.online-dot {
  width: 10px;
  height: 10px;
  background: #4ade80;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.2); }
}

.online-info strong {
  color: #ff6b6b;
  font-size: 18px;
}
</style>
