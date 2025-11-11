<template>
  <div class="score-display top-center">
    <div class="team-score ct-score">
      <span class="team-label">CT</span>
      <span class="score">{{ ctScore }}</span>
    </div>
    <div class="timer">{{ formattedTime }}</div>
    <div class="team-score t-score">
      <span class="team-label">T</span>
      <span class="score">{{ tScore }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatTime } from '@/utils/gameUtils'

const props = defineProps({
  ctScore: {
    type: Number,
    required: true
  },
  tScore: {
    type: Number,
    required: true
  },
  roundTime: {
    type: Number,
    required: true
  }
})

const formattedTime = computed(() => formatTime(props.roundTime))
</script>

<style scoped>
.score-display {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 30px;
  background: rgba(26, 35, 50, 0.9);
  padding: 15px 30px;
  border: 2px solid rgba(170, 170, 170, 0.3);
  border-radius: 4px;
}

.team-score {
  display: flex;
  align-items: center;
  gap: 10px;
}

.team-label {
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.ct-score .team-label {
  color: #4499ff;
}

.t-score .team-label {
  color: #ff8c00;
}

.score {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
}

.timer {
  font-size: 24px;
  font-weight: 700;
  color: #ff8c00;
  min-width: 60px;
  text-align: center;
}
</style>
