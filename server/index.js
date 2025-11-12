import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3002;

// ========== 内存数据存储 ==========
// AI使用场景枚举
const AI_SCENARIOS = {
  CODE_GENERATION: '代码生成',
  CODE_REVIEW: '代码审查',
  DEBUG: '调试辅助',
  ALGORITHM: '算法设计',
  REFACTORING: '代码重构',
  DOCUMENTATION: '文档编写',
  TEST_WRITING: '测试编写',
  LEARNING: '学习辅导'
};

// 测试题目数据（每道题都有对应的AI使用场景）
const testQuestions = [
  { id: 1, title: '实现二叉树遍历', scenario: AI_SCENARIOS.ALGORITHM, difficulty: '中等' },
  { id: 2, title: '优化数据库查询', scenario: AI_SCENARIOS.CODE_REVIEW, difficulty: '困难' },
  { id: 3, title: '修复登录bug', scenario: AI_SCENARIOS.DEBUG, difficulty: '简单' },
  { id: 4, title: '编写API文档', scenario: AI_SCENARIOS.DOCUMENTATION, difficulty: '简单' },
  { id: 5, title: '重构遗留代码', scenario: AI_SCENARIOS.REFACTORING, difficulty: '困难' },
  { id: 6, title: '生成CRUD接口', scenario: AI_SCENARIOS.CODE_GENERATION, difficulty: '中等' },
  { id: 7, title: '编写单元测试', scenario: AI_SCENARIOS.TEST_WRITING, difficulty: '中等' },
  { id: 8, title: '学习React Hooks', scenario: AI_SCENARIOS.LEARNING, difficulty: '中等' }
];

// 测试结果数据（存储用户的测试结果和AI依赖程度）
// aiDependency: 1-5分，1=完全独立，5=完全依赖AI
const testResults = [
  { id: 1, userId: 'user1', userName: '张三', questionId: 1, aiDependency: 3, completedAt: '2025-01-10' },
  { id: 2, userId: 'user1', userName: '张三', questionId: 2, aiDependency: 4, completedAt: '2025-01-11' },
  { id: 3, userId: 'user2', userName: '李四', questionId: 1, aiDependency: 2, completedAt: '2025-01-10' },
  { id: 4, userId: 'user2', userName: '李四', questionId: 3, aiDependency: 1, completedAt: '2025-01-11' },
  { id: 5, userId: 'user3', userName: '王五', questionId: 4, aiDependency: 5, completedAt: '2025-01-09' },
  { id: 6, userId: 'user3', userName: '王五', questionId: 5, aiDependency: 4, completedAt: '2025-01-10' },
  { id: 7, userId: 'user4', userName: '赵六', questionId: 6, aiDependency: 3, completedAt: '2025-01-11' },
  { id: 8, userId: 'user4', userName: '赵六', questionId: 7, aiDependency: 2, completedAt: '2025-01-12' },
  { id: 9, userId: 'user5', userName: '钱七', questionId: 8, aiDependency: 4, completedAt: '2025-01-11' },
  { id: 10, userId: 'user1', userName: '张三', questionId: 3, aiDependency: 2, completedAt: '2025-01-12' },
  { id: 11, userId: 'user2', userName: '李四', questionId: 5, aiDependency: 3, completedAt: '2025-01-12' },
  { id: 12, userId: 'user3', userName: '王五', questionId: 1, aiDependency: 5, completedAt: '2025-01-11' },
];

// 用于生成新ID
let nextResultId = testResults.length + 1;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// ========== API接口 ==========

// 获取数据看板统计信息
app.get('/api/dashboard/stats', (req, res) => {
  try {
    // 1. 计算用户AI依赖程度分布
    const dependencyDistribution = {
      level1: 0, // 完全独立 (1分)
      level2: 0, // 较少依赖 (2分)
      level3: 0, // 中等依赖 (3分)
      level4: 0, // 较多依赖 (4分)
      level5: 0  // 完全依赖 (5分)
    };

    // 按用户分组，计算每个用户的平均依赖程度
    const userDependency = new Map();
    testResults.forEach(result => {
      if (!userDependency.has(result.userId)) {
        userDependency.set(result.userId, {
          userName: result.userName,
          total: 0,
          count: 0
        });
      }
      const userData = userDependency.get(result.userId);
      userData.total += result.aiDependency;
      userData.count += 1;
    });

    // 统计每个依赖程度级别的用户数
    userDependency.forEach(userData => {
      const avgDependency = Math.round(userData.total / userData.count);
      dependencyDistribution[`level${avgDependency}`]++;
    });

    // 2. 计算不同场景下的AI依赖程度
    const scenarioStats = {};

    // 初始化场景统计
    Object.values(AI_SCENARIOS).forEach(scenario => {
      scenarioStats[scenario] = {
        totalDependency: 0,
        count: 0,
        avgDependency: 0
      };
    });

    // 计算每个场景的统计数据
    testResults.forEach(result => {
      const question = testQuestions.find(q => q.id === result.questionId);
      if (question) {
        const scenario = question.scenario;
        scenarioStats[scenario].totalDependency += result.aiDependency;
        scenarioStats[scenario].count += 1;
      }
    });

    // 计算平均值
    Object.keys(scenarioStats).forEach(scenario => {
      const stats = scenarioStats[scenario];
      if (stats.count > 0) {
        stats.avgDependency = (stats.totalDependency / stats.count).toFixed(2);
      }
    });

    // 3. 其他统计信息
    const totalUsers = userDependency.size;
    const totalTests = testResults.length;
    const avgDependency = (testResults.reduce((sum, r) => sum + r.aiDependency, 0) / testResults.length).toFixed(2);

    res.json({
      success: true,
      data: {
        dependencyDistribution,
        scenarioStats,
        summary: {
          totalUsers,
          totalTests,
          avgDependency
        }
      }
    });
  } catch (error) {
    console.error('获取统计信息失败:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取所有测试题目
app.get('/api/questions', (req, res) => {
  res.json({
    success: true,
    data: testQuestions
  });
});

// 获取所有测试结果
app.get('/api/results', (req, res) => {
  // 关联题目信息
  const resultsWithDetails = testResults.map(result => {
    const question = testQuestions.find(q => q.id === result.questionId);
    return {
      ...result,
      questionTitle: question?.title || '未知题目',
      scenario: question?.scenario || '未知场景'
    };
  });

  res.json({
    success: true,
    data: resultsWithDetails
  });
});

// 添加测试结果
app.post('/api/results', (req, res) => {
  try {
    const { userId, userName, questionId, aiDependency } = req.body;

    // 验证参数
    if (!userId || !userName || !questionId || !aiDependency) {
      return res.status(400).json({
        success: false,
        error: '缺少必要参数'
      });
    }

    if (aiDependency < 1 || aiDependency > 5) {
      return res.status(400).json({
        success: false,
        error: 'AI依赖程度必须在1-5之间'
      });
    }

    // 检查题目是否存在
    const question = testQuestions.find(q => q.id === parseInt(questionId));
    if (!question) {
      return res.status(404).json({
        success: false,
        error: '题目不存在'
      });
    }

    // 创建新结果
    const newResult = {
      id: nextResultId++,
      userId,
      userName,
      questionId: parseInt(questionId),
      aiDependency: parseInt(aiDependency),
      completedAt: new Date().toISOString().split('T')[0]
    };

    testResults.push(newResult);

    res.json({
      success: true,
      data: newResult
    });
  } catch (error) {
    console.error('添加测试结果失败:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取AI使用场景列表
app.get('/api/scenarios', (req, res) => {
  res.json({
    success: true,
    data: Object.values(AI_SCENARIOS)
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
});

