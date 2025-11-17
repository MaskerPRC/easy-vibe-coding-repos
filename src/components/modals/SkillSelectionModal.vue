<template>
  <div v-if="showSkillSelection" class="skill-selection-modal">
    <div class="modal-content">
      <h2>选择你的技能组合</h2>
      <p class="modal-desc">从6种技能中选择3个进入战场</p>

      <div class="skills-grid">
        <div
          v-for="skill in availableSkills"
          :key="skill.name"
          @click="handleToggleSkill(skill.name)"
          :class="['skill-card', {
            selected: selectedSkills.includes(skill.name),
            disabled: !selectedSkills.includes(skill.name) && selectedSkills.length >= 3
          }]"
        >
          <div class="skill-icon">{{ skill.icon }}</div>
          <h3 class="skill-name">{{ skill.name }}</h3>
          <p class="skill-slogan">{{ skill.slogan }}</p>
          <p class="skill-desc">{{ skill.description }}</p>
          <div class="skill-cost">消耗: {{ skill.cost }}点</div>
        </div>
      </div>

      <div class="modal-actions">
        <button @click="handleCancel" class="btn-cancel">取消</button>
        <button
          @click="handleConfirm"
          :disabled="selectedSkills.length !== 3"
          class="btn-confirm"
        >
          确认 ({{ selectedSkills.length }}/3)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AVAILABLE_SKILLS } from '@/constants/skills';

const props = defineProps({
  showSkillSelection: Boolean,
  selectedSkills: Array
});

const emit = defineEmits(['update:showSkillSelection', 'update:selectedSkills', 'start-matching']);

const availableSkills = AVAILABLE_SKILLS;

const handleToggleSkill = (skillName) => {
  const skills = [...props.selectedSkills];
  const index = skills.indexOf(skillName);

  if (index > -1) {
    skills.splice(index, 1);
  } else if (skills.length < 3) {
    skills.push(skillName);
  }

  emit('update:selectedSkills', skills);
};

const handleCancel = () => {
  emit('update:showSkillSelection', false);
  emit('update:selectedSkills', []);
};

const handleConfirm = () => {
  if (props.selectedSkills.length === 3) {
    emit('start-matching');
  }
};
</script>

<style scoped>
.skill-selection-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: linear-gradient(135deg, #2a2a2a, #1a1a1a);
  padding: 40px;
  border-radius: 20px;
  max-width: 900px;
  width: 100%;
  border: 2px solid #8a2be2;
  box-shadow: 0 0 50px rgba(138, 43, 226, 0.5);
}

.modal-content h2 {
  color: #8a2be2;
  text-align: center;
  margin-bottom: 10px;
  font-size: 28px;
}

.modal-desc {
  text-align: center;
  color: #aaa;
  margin-bottom: 30px;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.skill-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 15px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.skill-card:hover {
  background: rgba(138, 43, 226, 0.1);
  border-color: #8a2be2;
}

.skill-card.selected {
  background: linear-gradient(135deg, rgba(138, 43, 226, 0.3), rgba(106, 13, 173, 0.3));
  border-color: #32cd32;
  box-shadow: 0 0 20px rgba(50, 205, 50, 0.5);
}

.skill-card.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.skill-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.skill-name {
  color: #32cd32;
  font-size: 18px;
  margin-bottom: 8px;
}

.skill-slogan {
  color: #ffd700;
  font-size: 14px;
  font-style: italic;
  margin-bottom: 10px;
}

.skill-desc {
  color: #aaa;
  font-size: 13px;
  margin-bottom: 10px;
  line-height: 1.5;
}

.skill-cost {
  color: #8a2be2;
  font-weight: 600;
  font-size: 14px;
}

.modal-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.btn-cancel {
  padding: 12px 30px;
  background: rgba(255, 255, 255, 0.05);
  color: #e0e0e0;
  border: 1px solid #666;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.1);
}

.btn-confirm {
  padding: 12px 30px;
  background: linear-gradient(135deg, #32cd32, #228b22);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-confirm:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(50, 205, 50, 0.5);
}

.btn-confirm:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .skills-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .skills-grid {
    grid-template-columns: 1fr;
  }
}
</style>
