<template>
  <header class="lobby-header">
    <div class="logo-section">
      <div class="logo">
        <span class="logo-icon">🃏</span>
        <span class="logo-text">斗地主大厅</span>
      </div>
    </div>
    <div class="user-section">
      <div class="user-stats">
        <div class="stat-item">
          <span class="stat-icon">💰</span>
          <span class="stat-value">{{ userInfo.coins }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">💎</span>
          <span class="stat-value">{{ userInfo.diamonds }}</span>
        </div>
      </div>
      <div class="user-avatar">
        <img :src="userInfo.avatar" alt="头像" />
        <span class="user-name">{{ userInfo.name }}</span>
      </div>
      <button class="settings-btn" @click="$emit('openSettings')">
        <span>⚙️</span>
      </button>
    </div>
  </header>
</template>

<script setup>
defineProps({
  userInfo: {
    type: Object,
    required: true
  }
})

defineEmits(['openSettings'])
</script>

<style scoped>
.lobby-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: linear-gradient(180deg, rgba(26, 39, 68, 0.95) 0%, rgba(15, 23, 41, 0.9) 100%);
  border-bottom: 2px solid rgba(255, 215, 0, 0.3);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 32px;
  filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6));
}

.logo-text {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
}

.user-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 12px;
  border-radius: 20px;
  border: 1px solid rgba(255, 215, 0, 0.2);
}

.stat-icon {
  font-size: 16px;
}

.stat-value {
  font-weight: 600;
  color: #FFD700;
}

.user-avatar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #FFD700;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.4);
}

.user-name {
  font-weight: 500;
  color: #f0f0f0;
}

.settings-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 20px;
}

.settings-btn:hover {
  background: rgba(255, 215, 0, 0.2);
  border-color: rgba(255, 215, 0, 0.4);
  transform: rotate(90deg);
}

@media (max-width: 768px) {
  .lobby-header {
    padding: 12px 16px;
  }

  .logo-text {
    font-size: 20px;
  }

  .user-stats {
    display: none;
  }
}
</style>
