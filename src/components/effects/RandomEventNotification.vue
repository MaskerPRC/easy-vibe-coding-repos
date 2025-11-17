<template>
  <div v-if="show" class="random-event-notif">
    <span class="event-icon">⚡</span>
    <span class="event-text">天降正义!</span>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean
});
</script>

<style scoped>
.random-event-notif {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, #ffd700, #ffa500);
  color: #1a1a1a;
  padding: 30px 60px;
  border-radius: 20px;
  font-size: 32px;
  font-weight: 900;
  box-shadow: 0 0 50px rgba(255, 215, 0, 0.8);
  animation: eventPop 0.5s ease-out;
  z-index: 3000;
}

@keyframes eventPop {
  0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
  50% { transform: translate(-50%, -50%) scale(1.2); }
  100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
}

.event-icon {
  margin-right: 15px;
}
</style>
