// 开发人格数据定义

// 四个维度的定义
export const dimensions = {
  PI: {
    name: '编码风格',
    P: {
      letter: 'P',
      name: 'Pragmatic',
      title: '实用主义者',
      description: '注重实用性和快速实现，能跑就行，追求效率'
    },
    I: {
      letter: 'I',
      name: 'Idealist',
      title: '理想主义者',
      description: '注重代码质量和优雅，追求完美，代码要经得起推敲'
    }
  },
  MD: {
    name: '架构思维',
    M: {
      letter: 'M',
      name: 'Monolith',
      title: '单体思维',
      description: '偏好简单直接的架构，先做出来再说，避免过度设计'
    },
    D: {
      letter: 'D',
      name: 'Distributed',
      title: '分布式思维',
      description: '偏好模块化和可扩展架构，提前考虑未来扩展性'
    }
  },
  CT: {
    name: '调试方式',
    C: {
      letter: 'C',
      name: 'Console',
      title: '控制台派',
      description: '喜欢用 console.log/print 调试，简单直接'
    },
    T: {
      letter: 'T',
      name: 'Tool',
      title: '工具派',
      description: '喜欢用断点调试器等专业工具，精确定位问题'
    }
  },
  SE: {
    name: '技术选型',
    S: {
      letter: 'S',
      name: 'Stable',
      title: '稳定派',
      description: '偏好成熟稳定的技术栈，追求可靠性'
    },
    E: {
      letter: 'E',
      name: 'Explorer',
      title: '探索派',
      description: '喜欢尝试新技术，追求创新和前沿'
    }
  }
};

// 16种开发人格类型
export const personalities = {
  PMCS: {
    code: 'PMCS',
    name: '务实工匠',
    nickname: 'The Pragmatic Craftsman',
    description: '你是一个追求实用主义的开发者，喜欢用最简单的方式解决问题。你相信"能跑就行"的哲学，用console.log快速定位问题，选择稳定可靠的技术栈。你的代码可能不是最优雅的，但一定是最实用的。',
    traits: ['高效执行', '快速迭代', '注重实用', '稳定可靠'],
    strengths: '能够快速交付可用的产品，在时间紧迫的情况下表现出色',
    weaknesses: '可能忽视代码质量和长期维护性，技术债务可能累积',
    advice: '适当关注代码质量，避免过多的技术债务'
  },
  PMCE: {
    code: 'PMCE',
    name: '快速探索者',
    nickname: 'The Rapid Explorer',
    description: '你热衷于用最新的技术快速实现想法。虽然你不追求代码完美，但你喜欢尝试新工具和框架。console.log是你的好伙伴，简单的架构让你能够快速验证新技术的可行性。',
    traits: ['勇于尝新', '快速验证', '灵活应变', '创新思维'],
    strengths: '能够快速掌握新技术，善于技术选型和创新',
    weaknesses: '可能陷入"新技术陷阱"，项目稳定性有待提高',
    advice: '平衡创新与稳定，不要为了新而新'
  },
  PMTS: {
    code: 'PMTS',
    name: '稳健实干家',
    nickname: 'The Steady Doer',
    description: '你是团队中最靠谱的开发者。使用成熟的技术栈，借助专业调试工具精确定位问题，保持简单的架构。虽然不追求代码艺术，但你的代码稳定可靠，问题总能被快速解决。',
    traits: ['稳定可靠', '工具娴熟', '问题解决', '注重实效'],
    strengths: '项目稳定性高，问题定位准确，交付可靠',
    weaknesses: '可能过于保守，错过一些创新机会',
    advice: '适度尝试新工具和技术，保持学习热情'
  },
  PMTE: {
    code: 'PMTE',
    name: '效率黑客',
    nickname: 'The Efficiency Hacker',
    description: '你是追求效率的极客。喜欢尝试各种新工具来提升开发效率，使用专业的调试工具快速定位问题。你不追求完美的代码，但会用最新的工具和技术来提高生产力。',
    traits: ['效率至上', '工具达人', '技术敏感', '快速交付'],
    strengths: '开发效率高，善于利用工具提升生产力',
    weaknesses: '可能在工具选择上花费过多时间，忽视基础',
    advice: '工具是手段不是目的，注重解决问题本身'
  },
  PDCS: {
    code: 'PDCS',
    name: '架构实用派',
    nickname: 'The Practical Architect',
    description: '你在简单和复杂之间找到了平衡。喜欢模块化的架构，但不过度设计。使用console.log快速调试，选择稳定的技术栈。你的系统既有良好的扩展性，又不失实用性。',
    traits: ['架构思维', '实用导向', '模块化', '稳定优先'],
    strengths: '能设计出可扩展但不过度复杂的系统',
    weaknesses: '有时可能在简单和复杂之间犹豫不决',
    advice: '相信自己的判断，KISS原则很重要'
  },
  PDCE: {
    code: 'PDCE',
    name: '技术先锋',
    nickname: 'The Tech Pioneer',
    description: '你是团队中的技术领袖。喜欢用微服务、容器化等现代架构，尝试最新的技术栈，虽然调试方式简单，但你的系统设计超前。你总是第一个吃螃蟹的人。',
    traits: ['技术前沿', '架构创新', '勇于尝试', '视野开阔'],
    strengths: '能够引入先进的技术和架构理念',
    weaknesses: '可能过度工程化，增加系统复杂度',
    advice: '评估新技术的实际价值，避免为了酷而酷'
  },
  PDTE: {
    code: 'PDTE',
    name: '现代工程师',
    nickname: 'The Modern Engineer',
    description: '你代表着现代软件工程的实践者。使用微服务架构、容器化部署，借助专业的调试和监控工具，尝试最新的技术栈。你追求的是用现代化的方式高效交付。',
    traits: ['现代化', '工具链完善', '技术创新', '工程化'],
    strengths: '掌握现代软件工程最佳实践',
    weaknesses: '技术栈可能过于复杂，学习成本高',
    advice: '确保团队能够跟上你的节奏'
  },
  PDTS: {
    code: 'PDTS',
    name: '系统架构师',
    nickname: 'The System Architect',
    description: '你是传统意义上的架构师。使用成熟的架构模式，借助专业工具进行系统调试和监控，选择久经考验的技术栈。你的系统设计周全，可扩展性强，稳定可靠。',
    traits: ['架构专家', '系统思维', '稳定可靠', '专业工具'],
    strengths: '能够设计出稳定可靠的大型系统',
    weaknesses: '可能过于保守，错过一些创新机会',
    advice: '保持对新技术的关注，适度创新'
  },
  IMCS: {
    code: 'IMCS',
    name: '完美主义者',
    nickname: 'The Perfectionist',
    description: '你追求代码的完美和优雅。即使是简单的项目，你也会精心设计每一行代码。使用console.log调试，选择稳定的技术，但代码质量是你永不妥协的底线。',
    traits: ['代码优雅', '追求完美', '质量至上', '简约设计'],
    strengths: '代码质量高，可读性强，维护性好',
    weaknesses: '可能过度纠结细节，影响开发效率',
    advice: '适当平衡完美与效率，避免过度优化'
  },
  IMCE: {
    code: 'IMCE',
    name: '优雅探险家',
    nickname: 'The Elegant Explorer',
    description: '你既追求代码的优雅，又喜欢尝试新技术。你用最新的语言特性写出漂亮的代码，保持简单的架构，用console.log快速验证想法。你相信好的代码应该既优雅又现代。',
    traits: ['代码优雅', '技术敏感', '创新思维', '追求美感'],
    strengths: '能用新技术写出优雅的代码',
    weaknesses: '可能在技术选择上犹豫不决',
    advice: '不要让追求完美阻碍你尝试新事物'
  },
  IMTS: {
    code: 'IMTS',
    name: '代码艺术家',
    nickname: 'The Code Artist',
    description: '你是真正的代码艺术家。使用专业工具精雕细琢每一行代码，选择经典稳定的技术栈，追求简约而不简单的架构。你的代码不仅能运行，更是一件艺术品。',
    traits: ['代码艺术', '精益求精', '工匠精神', '经典稳重'],
    strengths: '代码质量极高，注重细节，可维护性强',
    weaknesses: '可能过分追求完美，开发周期较长',
    advice: '记住，完成比完美更重要'
  },
  IMTE: {
    code: 'IMTE',
    name: '创新匠人',
    nickname: 'The Innovative Craftsman',
    description: '你既是工匠，也是创新者。使用最新的工具和技术，追求代码的优雅和质量，借助专业的开发工具打造精品。你相信好的代码需要好的工具和新的技术。',
    traits: ['创新工匠', '工具精通', '质量优先', '技术前沿'],
    strengths: '能用最新的技术和工具打造高质量代码',
    weaknesses: '可能陷入工具和技术的选择困难',
    advice: '工具和技术服务于目标，不要本末倒置'
  },
  IDCS: {
    code: 'IDCS',
    name: '优雅架构师',
    nickname: 'The Elegant Architect',
    description: '你追求架构的优雅和代码的完美。设计清晰的模块边界，编写高质量的代码，使用console.log保持调试的简单性，选择稳定可靠的技术栈。你的系统既美观又实用。',
    traits: ['架构优雅', '代码质量', '模块清晰', '稳定可靠'],
    strengths: '能设计出既优雅又实用的系统架构',
    weaknesses: '可能在设计上花费过多时间',
    advice: '适度设计，避免过度工程化'
  },
  IDCE: {
    code: 'IDCE',
    name: '理想主义先锋',
    nickname: 'The Idealist Pioneer',
    description: '你是理想主义和创新的结合体。追求最优雅的架构设计，尝试最前沿的技术，虽然调试方式简单，但你的目标是用最新的技术构建最完美的系统。',
    traits: ['理想主义', '技术前沿', '架构创新', '追求极致'],
    strengths: '具有远见，能引领技术方向',
    weaknesses: '理想与现实可能存在差距，实施困难',
    advice: '保持理想，但要脚踏实地'
  },
  IDTE: {
    code: 'IDTE',
    name: '完美工程师',
    nickname: 'The Perfect Engineer',
    description: '你代表了软件工程的最高追求。优雅的代码，完善的架构，专业的工具，前沿的技术。你不仅要做出来，还要做得完美。你是团队中的标杆，也是自己最严格的审查者。',
    traits: ['追求卓越', '全面发展', '技术深度', '工程典范'],
    strengths: '全方位的技术能力，高标准的工程实践',
    weaknesses: '标准太高可能影响效率和团队协作',
    advice: '记住团队目标，不要让完美成为负担'
  },
  IDTS: {
    code: 'IDTS',
    name: '大师级架构师',
    nickname: 'The Master Architect',
    description: '你是经验丰富的架构大师。设计优雅而强大的系统架构，编写高质量的代码，使用专业的工具和方法，选择久经考验的技术。你的作品经得起时间的考验。',
    traits: ['架构大师', '代码质量', '经验丰富', '稳健可靠'],
    strengths: '能够设计和实现企业级的高质量系统',
    weaknesses: '可能对新技术不够敏感',
    advice: '保持开放的心态，年轻一代也有值得学习的地方'
  }
};

// 获取人格类型
export function getPersonalityType(scores) {
  const code =
    (scores.PI >= 0 ? 'P' : 'I') +
    (scores.MD >= 0 ? 'M' : 'D') +
    (scores.CT >= 0 ? 'C' : 'T') +
    (scores.SE >= 0 ? 'S' : 'E');

  return personalities[code];
}

// 获取维度描述
export function getDimensionResult(dimension, score) {
  const dims = dimensions[dimension];
  if (score >= 0) {
    return dims[dimension[0]];
  } else {
    return dims[dimension[1]];
  }
}
