// 技能定义常量

export const AVAILABLE_SKILLS = [
  {
    name: '飞沙走石',
    icon: '💨',
    slogan: '给我消失!',
    description: '移除对手任意1枚棋子',
    cost: 1
  },
  {
    name: '力拔山兮',
    icon: '🔥',
    slogan: '不玩了!',
    description: '掀翻棋盘,强制平局',
    cost: 3
  },
  {
    name: '静如止水',
    icon: '❄️',
    slogan: '让你冷静一下',
    description: '冻结对手10秒',
    cost: 1
  },
  {
    name: '两级反转',
    icon: '🔄',
    slogan: '世界颠倒了',
    description: '翻转棋盘180°',
    cost: 2
  },
  {
    name: '时光倒流',
    icon: '⏰',
    slogan: '重来一次',
    description: '双方各退一步',
    cost: 1
  },
  {
    name: '暗度陈仓',
    icon: '👻',
    slogan: '偷偷摸摸',
    description: '下一次可覆盖棋子',
    cost: 1
  }
];

// 技能消耗点数
export const SKILL_COSTS = {
  '飞沙走石': 1,
  '力拔山兮': 3,
  '静如止水': 1,
  '两级反转': 2,
  '时光倒流': 1,
  '暗度陈仓': 1
};

// 技能使用次数限制
export const SKILL_LIMITS = {
  '飞沙走石': 2,
  '力拔山兮': 1,
  '静如止水': 1,
  '两级反转': 1,
  '时光倒流': 2,
  '暗度陈仓': 1
};

// 根据技能名获取图标
export function getSkillIcon(skillName) {
  const skill = AVAILABLE_SKILLS.find(s => s.name === skillName);
  return skill?.icon || '?';
}

// 根据技能名获取口号
export function getSkillSlogan(skillName) {
  const skill = AVAILABLE_SKILLS.find(s => s.name === skillName);
  return skill?.slogan || '';
}

// 根据技能名获取消耗点数
export function getSkillCost(skillName) {
  return SKILL_COSTS[skillName] || 0;
}
