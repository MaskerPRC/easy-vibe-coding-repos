<template>
  <div class="test-summary" v-if="total > 0">
    <div class="summary-item passed">
      <span class="icon">✅</span>
      <span class="count">{{ passed }}</span>
      <span class="label">通过</span>
    </div>
    <div class="summary-item failed">
      <span class="icon">❌</span>
      <span class="count">{{ failed }}</span>
      <span class="label">失败</span>
    </div>
    <div class="summary-item total">
      <span class="icon">📊</span>
      <span class="count">{{ total }}</span>
      <span class="label">总计</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TestSummary',
  props: {
    passed: {
      type: Number,
      default: 0
    },
    failed: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style scoped>
.test-summary {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 20px 40px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
}

.summary-item .icon {
  font-size: 2em;
  margin-bottom: 5px;
}

.summary-item .count {
  font-size: 2.5em;
  font-weight: bold;
}

.summary-item .label {
  color: #a0a0a0;
  margin-top: 5px;
}

.summary-item.passed .count {
  color: #00b894;
}

.summary-item.failed .count {
  color: #d63031;
}

.summary-item.total .count {
  color: #74b9ff;
}

@media (max-width: 768px) {
  .test-summary {
    gap: 20px;
  }

  .summary-item {
    padding: 15px 25px;
  }
}
</style>
