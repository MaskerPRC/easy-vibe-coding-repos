<template>
  <div class="ai-battle-section">
    <div class="ai-battle-card" @click="$emit('click')">
      <div class="ai-card-glow"></div>
      <div class="ai-card-content">
        <div class="ai-icon">🤖</div>
        <div class="ai-title">AI对战</div>
        <div class="ai-desc">选择不同难度的AI对手</div>
        <button class="ai-start-btn">立即开始</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['click'])
</script>

<style scoped>
.ai-battle-section {
  margin-bottom: 32px;
}

.ai-battle-card {
  position: relative;
  background: linear-gradient(135deg, #1e3a5f 0%, #2d4a7c 100%);
  border-radius: 16px;
  padding: 32px;
  cursor: pointer;
  overflow: hidden;
  border: 2px solid rgba(255, 215, 0, 0.3);
  transition: all 0.4s ease;
}

.ai-battle-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 215, 0, 0.6);
  box-shadow: 0 12px 40px rgba(255, 215, 0, 0.2);
}

.ai-card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.15) 0%, transparent 50%);
  animation: rotate 10s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.ai-card-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.ai-icon {
  font-size: 64px;
  margin-bottom: 16px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.ai-title {
  font-size: 28px;
  font-weight: 700;
  color: #FFD700;
  margin-bottom: 8px;
}

.ai-desc {
  color: #a0aec0;
  margin-bottom: 20px;
}

.ai-start-btn {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(74, 222, 128, 0.4);
}

.ai-start-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(74, 222, 128, 0.6);
}

@media (max-width: 768px) {
  .ai-battle-card {
    padding: 24px;
  }

  .ai-icon {
    font-size: 48px;
  }

  .ai-title {
    font-size: 24px;
  }
}
</style>
