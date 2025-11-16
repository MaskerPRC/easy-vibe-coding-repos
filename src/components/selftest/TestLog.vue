<template>
  <div class="test-log" v-if="logs.length > 0">
    <h3>📝 测试日志</h3>
    <div class="log-content">
      <div v-for="(log, index) in logs" :key="index" :class="['log-item', log.type]">
        <span class="timestamp">{{ log.timestamp }}</span>
        <span class="log-message">{{ log.message }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TestLog',
  props: {
    logs: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped>
.test-log {
  max-width: 1200px;
  margin: 30px auto 0;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  padding: 20px;
}

.test-log h3 {
  margin-top: 0;
  margin-bottom: 15px;
}

.log-content {
  max-height: 300px;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

.log-item {
  display: flex;
  gap: 15px;
  padding: 5px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.log-item .timestamp {
  color: #636e72;
  min-width: 80px;
}

.log-item.info .log-message {
  color: #74b9ff;
}

.log-item.success .log-message {
  color: #00b894;
}

.log-item.error .log-message {
  color: #d63031;
}

.log-item.warning .log-message {
  color: #fdcb6e;
}
</style>
