import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// ==================== 内存数据存储 ====================
// 使用内存变量存储测试结果数据
const testResults = [];
let totalTestsCount = 0;

// ==================== API 端点 ====================

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// 提交测试结果
app.post('/api/test/submit', (req, res) => {
  try {
    const { answers, score } = req.body;

    // 验证数据
    if (!answers || !Array.isArray(answers) || answers.length !== 20) {
      return res.status(400).json({
        error: '无效的答案数据'
      });
    }

    if (typeof score !== 'number' || score < 20 || score > 100) {
      return res.status(400).json({
        error: '无效的分数'
      });
    }

    // 计算结果类型和建议
    const result = calculateResult(score);

    // 保存测试结果到内存（包含时间戳）
    const testRecord = {
      id: totalTestsCount + 1,
      answers,
      score,
      result,
      timestamp: new Date().toISOString()
    };

    testResults.push(testRecord);
    totalTestsCount++;

    // 返回结果
    res.json({
      success: true,
      result,
      totalTests: totalTestsCount
    });
  } catch (error) {
    console.error('提交测试错误:', error);
    res.status(500).json({
      error: '处理测试结果时出错',
      message: error.message
    });
  }
});

// 获取测试统计信息
app.get('/api/test/stats', (req, res) => {
  try {
    // 计算各类型的数量
    const typeCount = {
      'AI独立型': 0,
      'AI辅助型': 0,
      'AI依赖型': 0,
      'AI重度型': 0,
      'AI必需型': 0
    };

    testResults.forEach(record => {
      if (typeCount[record.result.type] !== undefined) {
        typeCount[record.result.type]++;
      }
    });

    // 计算平均分
    const avgScore = testResults.length > 0
      ? Math.round(testResults.reduce((sum, r) => sum + r.score, 0) / testResults.length)
      : 0;

    res.json({
      success: true,
      totalTests: totalTestsCount,
      averageScore: avgScore,
      typeDistribution: typeCount
    });
  } catch (error) {
    console.error('获取统计信息错误:', error);
    res.status(500).json({
      error: '获取统计信息时出错',
      message: error.message
    });
  }
});

// ==================== 辅助函数 ====================

// 根据分数计算测试结果
function calculateResult(score) {
  let type, description, color, level, levelText, suggestions;

  if (score <= 20) {
    type = 'AI独立型';
    description = '你很少依赖AI工具，更倾向于依靠自己的能力和传统方法来解决问题。你保持着独立思考和自主决策的习惯。';
    color = '#52c41a';
    level = 20;
    levelText = '很少依赖';
    suggestions = [
      '可以适当尝试使用AI工具来提高效率',
      '在信息查询等简单任务上AI可以节省时间',
      '保持当前的独立思考能力很重要'
    ];
  } else if (score <= 40) {
    type = 'AI辅助型';
    description = '你适度使用AI作为辅助工具，能够平衡自主能力和AI协助。你懂得在合适的场景使用AI来提升效率。';
    color = '#1890ff';
    level = 40;
    levelText = '适度使用';
    suggestions = [
      '你已经找到了AI使用的平衡点',
      '继续保持独立思考的同时善用AI',
      '可以探索更多AI的应用场景'
    ];
  } else if (score <= 60) {
    type = 'AI依赖型';
    description = '你在生活和工作中较多地依赖AI工具，AI已经成为你日常的重要助手。建议在某些领域保持独立思考。';
    color = '#faad14';
    level = 60;
    levelText = '较多依赖';
    suggestions = [
      '在重要决策上应该多加自己的思考',
      '保持批判性思维，不要完全信任AI',
      '在创意性工作中多发挥自己的想象力',
      '定期锻炼独立解决问题的能力'
    ];
  } else if (score <= 80) {
    type = 'AI重度型';
    description = '你高度依赖AI工具，在很多场景下AI是你的首选方案。需要警惕过度依赖可能带来的独立思考能力退化。';
    color = '#ff7875';
    level = 80;
    levelText = '高度依赖';
    suggestions = [
      '建议有意识地减少对AI的依赖',
      '在某些任务上尝试完全不用AI',
      '重视培养独立思考和判断能力',
      '不要让AI代替你做重要决定',
      '警惕信息茧房和思维固化'
    ];
  } else {
    type = 'AI必需型';
    description = '你极度依赖AI工具，几乎在所有场景都离不开AI。强烈建议重新审视AI的使用方式，培养独立能力。';
    color = '#ff4d4f';
    level = 100;
    levelText = '极度依赖';
    suggestions = [
      '需要重新建立独立思考的习惯',
      '尝试一段时间不使用AI来锻炼能力',
      '在决策、创作等领域减少AI使用',
      '警惕思维能力和创造力的退化',
      '寻求人与人之间的真实交流',
      '考虑AI使用对心理健康的影响'
    ];
  }

  return {
    score,
    type,
    description,
    color,
    level,
    levelText,
    suggestions
  };
}

// ==================== 错误处理 ====================

// 错误处理中间件
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

// ==================== 启动服务器 ====================

app.listen(PORT, () => {
  console.log(`应用项目后端运行在端口 ${PORT}`);
  console.log(`健康检查: http://localhost:${PORT}/api/health`);
  console.log(`测试提交: http://localhost:${PORT}/api/test/submit`);
  console.log(`测试统计: http://localhost:${PORT}/api/test/stats`);
  console.log(`数据存储: 使用内存存储（重启后数据将丢失）`);
});
