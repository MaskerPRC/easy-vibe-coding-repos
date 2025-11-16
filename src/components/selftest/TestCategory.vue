<template>
  <div class="test-category">
    <div class="category-header" @click="$emit('toggle')">
      <h3>{{ icon }} {{ title }}</h3>
      <span class="toggle">{{ expanded ? '▼' : '▶' }}</span>
    </div>
    <div class="category-content" v-show="expanded">
      <button @click="$emit('run')" :disabled="disabled" class="category-btn">
        {{ buttonText }}
      </button>
      <div class="test-list">
        <div
          v-for="result in results"
          :key="result.name"
          :class="['test-item', result.passed ? 'passed' : 'failed']"
        >
          <span class="status">{{ result.passed ? '✅' : '❌' }}</span>
          <span class="name">{{ result.name }}</span>
          <span class="message">{{ result.message }}</span>
          <span class="time" v-if="result.time">{{ result.time }}ms</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TestCategory',
  props: {
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    buttonText: {
      type: String,
      required: true
    },
    results: {
      type: Array,
      default: () => []
    },
    expanded: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['toggle', 'run']
}
</script>

<style scoped>
.test-category {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  margin-bottom: 20px;
  overflow: hidden;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: background 0.3s ease;
}

.category-header:hover {
  background: rgba(255, 255, 255, 0.15);
}

.category-header h3 {
  margin: 0;
  font-size: 1.3em;
}

.toggle {
  font-size: 1.2em;
  color: #74b9ff;
}

.category-content {
  padding: 20px;
}

.category-btn {
  background: linear-gradient(45deg, #6c5ce7, #a29bfe);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.category-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(108, 92, 231, 0.4);
}

.category-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.test-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.test-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  border-left: 4px solid;
  flex-wrap: wrap;
}

.test-item.passed {
  border-left-color: #00b894;
}

.test-item.failed {
  border-left-color: #d63031;
}

.test-item .status {
  font-size: 1.2em;
}

.test-item .name {
  font-weight: bold;
  min-width: 200px;
}

.test-item .message {
  color: #b0b0b0;
  flex: 1;
}

.test-item .time {
  color: #74b9ff;
  font-size: 0.9em;
}

@media (max-width: 768px) {
  .test-item .name {
    min-width: 150px;
  }
}
</style>
