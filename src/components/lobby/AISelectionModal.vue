<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="ai-selection-modal">
      <div class="modal-header">
        <h3>选择AI对手</h3>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>
      <div class="ai-options">
        <div
          v-for="ai in aiOptions"
          :key="ai.level"
          class="ai-option"
          :class="{ 'selected': selectedLevel === ai.level }"
          @click="selectAI(ai.level)"
        >
          <div class="ai-option-icon">{{ ai.icon }}</div>
          <div class="ai-option-info">
            <div class="ai-option-name">{{ ai.name }}</div>
            <div class="ai-option-desc">{{ ai.description }}</div>
          </div>
          <div class="ai-option-difficulty">
            <span
              v-for="star in 5"
              :key="star"
              class="difficulty-star"
              :class="{ 'filled': star <= ai.difficulty }"
            >★</span>
          </div>
        </div>
      </div>
      <div class="modal-actions">
        <button class="cancel-btn" @click="$emit('close')">取消</button>
        <button class="confirm-btn" @click="confirmSelection">开始对战</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  aiOptions: {
    type: Array,
    required: true
  },
  initialLevel: {
    type: String,
    default: 'normal'
  }
})

const emit = defineEmits(['close', 'confirm'])

const selectedLevel = ref(props.initialLevel)

const selectAI = (level) => {
  selectedLevel.value = level
}

const confirmSelection = () => {
  emit('confirm', selectedLevel.value)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.ai-selection-modal {
  background: linear-gradient(145deg, #1e2a3a, #2a3a4f);
  border-radius: 16px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #FFD700;
}

.close-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 20px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: #ff6b6b;
}

.ai-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.ai-option {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ai-option:hover {
  background: rgba(255, 215, 0, 0.1);
  border-color: rgba(255, 215, 0, 0.3);
}

.ai-option.selected {
  background: rgba(255, 215, 0, 0.15);
  border-color: #FFD700;
}

.ai-option-icon {
  font-size: 32px;
}

.ai-option-info {
  flex: 1;
}

.ai-option-name {
  font-size: 16px;
  font-weight: 600;
  color: #f0f0f0;
  margin-bottom: 4px;
}

.ai-option-desc {
  font-size: 12px;
  color: #94a3b8;
}

.ai-option-difficulty {
  display: flex;
  gap: 2px;
}

.difficulty-star {
  color: #4a5568;
  font-size: 14px;
}

.difficulty-star.filled {
  color: #FFD700;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.cancel-btn {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  color: #f0f0f0;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 12px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.confirm-btn {
  flex: 1;
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.confirm-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(74, 222, 128, 0.4);
}
</style>
