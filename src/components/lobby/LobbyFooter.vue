<template>
  <footer class="lobby-footer">
    <button class="footer-btn" @click="$emit('aiClick')">
      <span class="btn-icon">🤖</span>
      <span class="btn-text">AI对战</span>
    </button>
    <button class="footer-btn" @click="$emit('createRoom')">
      <span class="btn-icon">🏠</span>
      <span class="btn-text">创建房间</span>
    </button>
    <button class="footer-btn">
      <span class="btn-icon">👥</span>
      <span class="btn-text">好友</span>
    </button>
    <button class="footer-btn" @click="$emit('selfTest')">
      <span class="btn-icon">🧪</span>
      <span class="btn-text">自测</span>
    </button>
    <button class="footer-btn">
      <span class="btn-icon">🏆</span>
      <span class="btn-text">排行榜</span>
    </button>
  </footer>
</template>

<script setup>
defineEmits(['aiClick', 'createRoom', 'selfTest'])
</script>

<style scoped>
.lobby-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  padding: 12px 24px;
  background: linear-gradient(180deg, rgba(15, 23, 41, 0.95) 0%, rgba(26, 39, 68, 0.98) 100%);
  border-top: 2px solid rgba(255, 215, 0, 0.3);
  backdrop-filter: blur(10px);
}

.footer-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px 16px;
}

.footer-btn:hover {
  color: #FFD700;
  transform: translateY(-2px);
}

.btn-icon {
  font-size: 24px;
}

.btn-text {
  font-size: 12px;
  font-weight: 500;
}
</style>
