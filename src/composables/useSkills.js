// 技能系统管理
import { ref } from 'vue';
import { SKILL_COSTS, SKILL_LIMITS } from '@/constants/skills';

export function useSkills(game, myColor, mySkills, isSpectating) {
  const selectingSkillTarget = ref(null);
  const skillEffect = ref(null);

  // 检查是否可以使用技能
  function canUseSkill(skillName) {
    if (!mySkills.value || !game.value) return false;
    if (game.value.currentTurn !== myColor.value) return false;
    if (isSpectating.value) return false;

    if (mySkills.value.points < SKILL_COSTS[skillName]) return false;
    if (mySkills.value.used[skillName] >= SKILL_LIMITS[skillName]) return false;
    if (isSkillOnCooldown(skillName)) return false;

    return true;
  }

  // 检查技能是否在冷却中
  function isSkillOnCooldown(skillName) {
    if (!mySkills.value || !game.value) return false;
    const cooldown = mySkills.value.cooldowns[skillName];
    return cooldown && game.value.moves.length < cooldown;
  }

  // 使用技能
  function useSkill(skillName, socket) {
    if (!canUseSkill(skillName)) return;

    // 飞沙走石需要选择目标
    if (skillName === '飞沙走石') {
      selectingSkillTarget.value = skillName;
      return;
    }

    // 其他技能直接使用
    socket.value.emit('game:skill', {
      gameId: game.value.id,
      skillName: skillName
    });
  }

  // 显示技能特效
  function showSkillEffect(skillName) {
    skillEffect.value = { name: skillName };
    setTimeout(() => {
      skillEffect.value = null;
    }, 2000);
  }

  return {
    selectingSkillTarget,
    skillEffect,
    canUseSkill,
    isSkillOnCooldown,
    useSkill,
    showSkillEffect
  };
}
