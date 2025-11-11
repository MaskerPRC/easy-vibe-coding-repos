<template>
  <div class="kill-feed top-right">
    <div v-for="(kill, index) in killFeed" :key="index" class="kill-entry">
      <span class="killer">{{ kill.killer }}</span>
      <span class="weapon-icon">{{ kill.weapon }}</span>
      <span class="victim">{{ kill.victim }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  killFeed: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.kill-feed {
  position: absolute;
  top: 100px;
  right: 20px;
  max-width: 300px;
}

.kill-entry {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  background: rgba(26, 35, 50, 0.8);
  border-left: 3px solid #ff8c00;
  margin-bottom: 5px;
  font-size: 14px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.killer {
  color: #ffffff;
  font-weight: 600;
}

.weapon-icon {
  color: #ff8c00;
}

.victim {
  color: #cccccc;
}
</style>
