import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// 内存存储测试结果（使用 Map）
const testResults = new Map();
let resultIdCounter = 1;

// 题目数据
const questions = [
  {
    id: 1,
    dimension: 'PI',
    question: '当你面对一个紧急的 bug 需要修复时，你会：',
    options: [
      { text: '快速找到问题所在，用最直接的方式修复，确保功能正常运行', value: 3 },
      { text: '即使时间紧迫，也要找到根本原因，用优雅的方式解决问题', value: -3 }
    ]
  },
  {
    id: 2,
    dimension: 'PI',
    question: '在代码审查时，你更关注：',
    options: [
      { text: '代码是否能正确实现功能需求，性能是否达标', value: 3 },
      { text: '代码的可读性、优雅性和是否符合最佳实践', value: -3 }
    ]
  },
  {
    id: 3,
    dimension: 'PI',
    question: '对于代码重构，你的态度是：',
    options: [
      { text: '"如果它能运行，就不要动它"，重构的优先级较低', value: 3 },
      { text: '即使功能正常，也应该定期重构以保持代码质量', value: -3 }
    ]
  },
  {
    id: 4,
    dimension: 'PI',
    question: '写代码注释时，你倾向于：',
    options: [
      { text: '只在必要时写注释，代码能说明一切就不需要注释', value: 3 },
      { text: '详细注释代码意图和实现思路，让代码更易理解', value: -3 }
    ]
  },
  {
    id: 5,
    dimension: 'PI',
    question: '面对技术债务，你会：',
    options: [
      { text: '先快速实现功能，技术债务以后再还', value: 3 },
      { text: '尽量避免产生技术债务，即使速度慢一点', value: -3 }
    ]
  },
  {
    id: 6,
    dimension: 'PI',
    question: '对于单元测试，你认为：',
    options: [
      { text: '测试是必要的，但不需要追求 100% 覆盖率', value: 3 },
      { text: '应该追求高测试覆盖率，确保代码质量', value: -3 }
    ]
  },
  {
    id: 7,
    dimension: 'MD',
    question: '开始一个新项目时，你倾向于：',
    options: [
      { text: '从简单的单体架构开始，有需要再拆分', value: 3 },
      { text: '提前规划模块化架构，为将来的扩展做准备', value: -3 }
    ]
  },
  {
    id: 8,
    dimension: 'MD',
    question: '对于服务拆分，你认为：',
    options: [
      { text: '保持简单，一个服务能解决的不要拆成多个', value: 3 },
      { text: '按业务领域合理拆分，每个服务职责单一', value: -3 }
    ]
  },
  {
    id: 9,
    dimension: 'MD',
    question: '当系统需要添加新功能时，你会：',
    options: [
      { text: '在现有代码基础上直接添加，保持简单', value: 3 },
      { text: '考虑是否需要重构现有架构以更好地支持新功能', value: -3 }
    ]
  },
  {
    id: 10,
    dimension: 'MD',
    question: '对于代码组织，你倾向于：',
    options: [
      { text: '功能相关的代码放在一起，便于理解和修改', value: 3 },
      { text: '按照职责和层次划分模块，清晰的边界更重要', value: -3 }
    ]
  },
  {
    id: 11,
    dimension: 'MD',
    question: '面对系统性能问题，你会：',
    options: [
      { text: '优化瓶颈点，提升单体性能', value: 3 },
      { text: '考虑水平扩展和分布式方案', value: -3 }
    ]
  },
  {
    id: 12,
    dimension: 'MD',
    question: '对于数据库设计，你认为：',
    options: [
      { text: '一个数据库简单高效，便于管理', value: 3 },
      { text: '按服务拆分数据库，实现数据隔离', value: -3 }
    ]
  },
  {
    id: 13,
    dimension: 'CT',
    question: '调试代码时，你习惯：',
    options: [
      { text: '在代码中加入 console.log/print 语句，快速定位问题', value: 3 },
      { text: '使用断点调试器，逐步跟踪代码执行', value: -3 }
    ]
  },
  {
    id: 14,
    dimension: 'CT',
    question: '排查复杂问题时，你倾向于：',
    options: [
      { text: '在关键位置输出日志，通过日志分析问题', value: 3 },
      { text: '使用专业的调试和性能分析工具', value: -3 }
    ]
  },
  {
    id: 15,
    dimension: 'CT',
    question: '对于生产环境问题排查，你会：',
    options: [
      { text: '依赖应用日志和监控数据', value: 3 },
      { text: '使用 APM、链路追踪等专业监控工具', value: -3 }
    ]
  },
  {
    id: 16,
    dimension: 'CT',
    question: '学习新的编程语言或框架时，你会：',
    options: [
      { text: '直接写代码，用 print/console 验证理解', value: 3 },
      { text: '先学习使用 IDE 和调试工具', value: -3 }
    ]
  },
  {
    id: 17,
    dimension: 'CT',
    question: '对于代码性能优化，你倾向于：',
    options: [
      { text: '通过添加计时日志来找出性能瓶颈', value: 3 },
      { text: '使用性能分析工具(profiler)精确定位', value: -3 }
    ]
  },
  {
    id: 18,
    dimension: 'CT',
    question: '解决内存泄漏问题时，你会：',
    options: [
      { text: '通过日志和经验推测可能的原因', value: 3 },
      { text: '使用内存分析工具精确定位泄漏点', value: -3 }
    ]
  },
  {
    id: 19,
    dimension: 'SE',
    question: '选择技术栈时，你更看重：',
    options: [
      { text: '技术的成熟度和稳定性，社区支持是否完善', value: 3 },
      { text: '技术的先进性和创新性，是否代表未来方向', value: -3 }
    ]
  },
  {
    id: 20,
    dimension: 'SE',
    question: '对于新技术/框架的发布，你的态度是：',
    options: [
      { text: '等待一段时间，看社区反馈再决定是否使用', value: 3 },
      { text: '积极尝试，喜欢成为早期采用者', value: -3 }
    ]
  },
  {
    id: 21,
    dimension: 'SE',
    question: '在技术选型会议上，你会：',
    options: [
      { text: '推荐久经考验的成熟技术方案', value: 3 },
      { text: '介绍新兴技术，探讨其应用可能性', value: -3 }
    ]
  },
  {
    id: 22,
    dimension: 'SE',
    question: '对于依赖库的版本更新，你倾向于：',
    options: [
      { text: '保持稳定，只更新重要的安全补丁', value: 3 },
      { text: '及时跟进最新版本，体验新特性', value: -3 }
    ]
  },
  {
    id: 23,
    dimension: 'SE',
    question: '学习新知识时，你更喜欢：',
    options: [
      { text: '深入学习当前使用的技术栈', value: 3 },
      { text: '探索不同的技术和编程范式', value: -3 }
    ]
  },
  {
    id: 24,
    dimension: 'SE',
    question: '对于编程语言的选择，你认为：',
    options: [
      { text: '掌握一两门主流语言就够了', value: 3 },
      { text: '应该学习多种语言，每种都有独特价值', value: -3 }
    ]
  },
  {
    id: 25,
    dimension: 'SE',
    question: '关注技术动态时，你会：',
    options: [
      { text: '主要关注工作相关的技术更新', value: 3 },
      { text: '广泛了解各领域的技术趋势和创新', value: -3 }
    ]
  },
  {
    id: 26,
    dimension: 'PI',
    question: '对于设计模式，你的看法是：',
    options: [
      { text: '实用就好，不必拘泥于各种模式', value: 3 },
      { text: '应该正确运用设计模式，提升代码质量', value: -3 }
    ]
  },
  {
    id: 27,
    dimension: 'MD',
    question: '对于配置管理，你认为：',
    options: [
      { text: '集中配置管理，统一维护', value: 3 },
      { text: '每个服务独立配置，解耦更重要', value: -3 }
    ]
  },
  {
    id: 28,
    dimension: 'CT',
    question: '团队开发工具方面，你倾向于：',
    options: [
      { text: '保持简单，基本的开发工具就够用', value: 3 },
      { text: '引入各种提升效率的工具和插件', value: -3 }
    ]
  },
  {
    id: 29,
    dimension: 'SE',
    question: '面对技术栈迁移，你会：',
    options: [
      { text: '谨慎评估，迁移风险和成本很高', value: 3 },
      { text: '积极支持，是技术升级的好机会', value: -3 }
    ]
  },
  {
    id: 30,
    dimension: 'PI',
    question: '对于代码复用，你认为：',
    options: [
      { text: '适度复用，过度抽象会增加复杂度', value: 3 },
      { text: 'DRY 原则很重要，应该尽量避免重复代码', value: -3 }
    ]
  }
];

// 获取题目列表（打乱顺序）
app.get('/api/questions', (req, res) => {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  res.json(shuffled);
});

// 提交答案并获取结果
app.post('/api/submit', (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: '答案格式错误' });
    }

    // 计算各维度得分
    const scores = {
      PI: 0,
      MD: 0,
      CT: 0,
      SE: 0
    };

    answers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (question) {
        scores[question.dimension] += answer.value;
      }
    });

    // 确定人格类型
    const code =
      (scores.PI >= 0 ? 'P' : 'I') +
      (scores.MD >= 0 ? 'M' : 'D') +
      (scores.CT >= 0 ? 'C' : 'T') +
      (scores.SE >= 0 ? 'S' : 'E');

    // 存储结果到内存
    const resultId = resultIdCounter++;
    const result = {
      id: resultId,
      code,
      scores,
      timestamp: new Date().toISOString()
    };
    testResults.set(resultId, result);

    res.json({
      success: true,
      resultId,
      code,
      scores
    });
  } catch (error) {
    console.error('提交答案错误:', error);
    res.status(500).json({ error: '处理答案时出错' });
  }
});

// 获取测试结果
app.get('/api/result/:id', (req, res) => {
  const resultId = parseInt(req.params.id);
  const result = testResults.get(resultId);

  if (!result) {
    return res.status(404).json({ error: '未找到测试结果' });
  }

  res.json(result);
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    port: PORT,
    timestamp: new Date().toISOString(),
    storedResults: testResults.size
  });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('错误:', err);
  res.status(500).json({
    error: '服务器内部错误',
    message: err.message
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    error: '未找到资源',
    path: req.path
  });
});

app.listen(PORT, () => {
  console.log(`应用项目后端运行在端口 ${PORT}`);
  console.log(`健康检查: http://localhost:${PORT}/api/health`);
  console.log(`MTBI 开发人格测试 API 已启动`);
});

