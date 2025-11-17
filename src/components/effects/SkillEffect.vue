<template>
  <div v-if="skillEffect" class="skill-effect-overlay">
    <div :class="['skill-effect', `effect-${skillEffect.name}`]">
      <div class="effect-icon">{{ getSkillIcon(skillEffect.name) }}</div>
      <div class="effect-name">{{ skillEffect.name }}</div>
      <div class="effect-slogan">{{ getSkillSlogan(skillEffect.name) }}</div>
    </div>
  </div>
</template>

<script setup>
import { getSkillIcon, getSkillSlogan } from '@/constants/skills';

defineProps({
  skillEffect: Object
});
</script>

<style scoped>
.skill-effect-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 2500;
}

.skill-effect {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  animation: skillPop 2s ease-out;
}

@keyframes skillPop {
  0% { transform: translate(-50%, -50%) scale(0) rotate(0deg); opacity: 0; }
  50% { transform: translate(-50%, -50%) scale(1.2) rotate(180deg); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(1) rotate(360deg); opacity: 0; }
}

.effect-icon {
  font-size: 120px;
  margin-bottom: 20px;
}

.effect-name {
  font-size: 48px;
  font-weight: 900;
  color: #8a2be2;
  text-shadow: 0 0 30px rgba(138, 43, 226, 0.8);
  margin-bottom: 10px;
}

.effect-slogan {
  font-size: 24px;
  color: #ffd700;
  font-style: italic;
}

/* 不同技能的特效颜色 */
.effect-飞沙走石 { filter: hue-rotate(0deg); }
.effect-力拔山兮 { filter: hue-rotate(60deg); }
.effect-静如止水 { filter: hue-rotate(180deg); }
.effect-两级反转 { filter: hue-rotate(270deg); }
.effect-时光倒流 { filter: hue-rotate(120deg); }
.effect-暗度陈仓 { filter: hue-rotate(300deg); }
</style>
