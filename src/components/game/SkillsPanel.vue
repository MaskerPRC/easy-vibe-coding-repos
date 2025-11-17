<template>
  <div class="skills-panel">
    <h3>技能 <span class="skill-points">{{ mySkills?.points || 0 }}点</span></h3>
    <div class="skills-list">
      <div
        v-for="skillName in mySkills?.selectedSkills || []"
        :key="skillName"
        @click="handleUseSkill(skillName)"
        :class="['skill-button', {
          disabled: !canUseSkill(skillName),
          cooldown: isSkillOnCooldown(skillName)
        }]"
      >
        <div class="skill-button-icon">{{ getSkillIcon(skillName) }}</div>
        <div class="skill-button-name">{{ skillName }}</div>
        <div class="skill-button-info">
          <span v-if="isSkillOnCooldown(skillName)" class="cooldown-text">
            冷却中
          </span>
          <span v-else class="cost-text">
            {{ getSkillCost(skillName) }}点
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getSkillIcon, getSkillCost } from '@/constants/skills';

const props = defineProps({
  mySkills: Object,
  canUseSkill: Function,
  isSkillOnCooldown: Function,
  useSkill: Function
});

const handleUseSkill = (skillName) => {
  props.useSkill(skillName);
};
</script>

<style scoped>
.skills-panel {
  background: rgba(255, 255, 255, 0.03);
  padding: 20px;
  border-radius: 15px;
  border: 1px solid rgba(138, 43, 226, 0.3);
}

.skills-panel h3 {
  color: #8a2be2;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.skill-points {
  color: #32cd32;
  font-size: 20px;
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skill-button {
  background: linear-gradient(135deg, rgba(138, 43, 226, 0.2), rgba(106, 13, 173, 0.2));
  padding: 15px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 2px solid rgba(138, 43, 226, 0.5);
}

.skill-button:hover:not(.disabled) {
  transform: translateX(5px);
  box-shadow: 0 5px 20px rgba(138, 43, 226, 0.5);
}

.skill-button.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.skill-button.cooldown {
  border-color: #666;
}

.skill-button-icon {
  font-size: 32px;
}

.skill-button-name {
  flex: 1;
  font-weight: 600;
  color: #e0e0e0;
}

.cost-text {
  color: #8a2be2;
  font-weight: 600;
}

.cooldown-text {
  color: #666;
  font-size: 12px;
}
</style>
