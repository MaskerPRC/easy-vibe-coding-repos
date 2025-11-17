<template>
  <div class="home-view">
    <div class="home-header">
      <h1 class="game-title">
        <span class="title-glow">技能五子棋</span>
        <span class="subtitle">赖子版对战</span>
      </h1>

      <div class="user-info" v-if="userInfo">
        <span class="user-icon">{{ userInfo.browserIcon }}</span>
        <span class="username">{{ userInfo.username }}</span>
        <span class="province">{{ userInfo.province }}</span>
      </div>

      <div class="stats">
        <div class="stat-item">
          <span class="stat-value">{{ stats.onlineUsers }}</span>
          <span class="stat-label">在线</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ stats.activeGames }}</span>
          <span class="stat-label">对局</span>
        </div>
      </div>
    </div>

    <div class="home-content">
      <div class="main-actions">
        <button @click="handleStartMatch" class="btn-primary btn-glow">
          <span class="btn-icon">⚡</span>
          <span class="btn-text">随机对局</span>
        </button>
        <button @click="handleSpectate" class="btn-secondary">
          <span class="btn-icon">👁</span>
          <span class="btn-text">围观对局</span>
        </button>
        <button @click="handleHistory" class="btn-secondary">
          <span class="btn-icon">📜</span>
          <span class="btn-text">历史对局</span>
        </button>
      </div>

      <div class="game-intro">
        <h3>游戏特色</h3>
        <div class="features">
          <div class="feature-item">🎲 6种技能随机组合</div>
          <div class="feature-item">⚔️ 实时技能对抗</div>
          <div class="feature-item">💬 匿名弹幕社交</div>
          <div class="feature-item">🎭 荒诞赖子玩法</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  userInfo: Object,
  stats: Object
});

const emit = defineEmits(['start-match', 'spectate', 'history']);

const handleStartMatch = () => {
  emit('start-match');
};

const handleSpectate = () => {
  emit('spectate');
};

const handleHistory = () => {
  emit('history');
};
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
}

.home-header {
  text-align: center;
  margin-bottom: 60px;
}

.game-title {
  margin-bottom: 20px;
}

.title-glow {
  font-size: 56px;
  font-weight: 900;
  background: linear-gradient(135deg, #8a2be2, #32cd32);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(138, 43, 226, 0.5);
  display: block;
  animation: pulse 2s ease-in-out infinite;
}

.subtitle {
  display: block;
  font-size: 24px;
  color: #32cd32;
  font-weight: 600;
  margin-top: 10px;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.02); }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  margin: 20px 0;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  border: 1px solid rgba(138, 43, 226, 0.3);
}

.user-icon {
  font-size: 20px;
}

.username {
  font-weight: 600;
  color: #8a2be2;
}

.province {
  color: #aaa;
  font-size: 14px;
}

.stats {
  display: flex;
  gap: 40px;
  justify-content: center;
  margin-top: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #32cd32;
}

.stat-label {
  font-size: 14px;
  color: #999;
}

.home-content {
  width: 100%;
  max-width: 600px;
}

.main-actions {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 60px;
}

.btn-primary, .btn-secondary {
  padding: 20px 40px;
  font-size: 20px;
  font-weight: 700;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.btn-primary {
  background: linear-gradient(135deg, #8a2be2, #6a0dad);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(138, 43, 226, 0.5);
}

.btn-glow {
  animation: glow 2s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px rgba(138, 43, 226, 0.5); }
  50% { box-shadow: 0 0 40px rgba(138, 43, 226, 0.8); }
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  color: #e0e0e0;
  border: 2px solid rgba(138, 43, 226, 0.3);
}

.btn-secondary:hover {
  background: rgba(138, 43, 226, 0.1);
  border-color: #8a2be2;
}

.btn-icon {
  font-size: 24px;
}

.game-intro {
  background: rgba(255, 255, 255, 0.03);
  padding: 30px;
  border-radius: 20px;
  border: 1px solid rgba(50, 205, 50, 0.2);
}

.game-intro h3 {
  color: #32cd32;
  margin-bottom: 20px;
  font-size: 20px;
}

.features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.feature-item {
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  text-align: center;
  font-size: 14px;
}

@media (max-width: 768px) {
  .title-glow {
    font-size: 40px;
  }

  .subtitle {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .features {
    grid-template-columns: 1fr;
  }
}
</style>
