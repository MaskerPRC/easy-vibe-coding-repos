<template>
  <div class="app">
    <!-- 开始页面 -->
    <div v-if="currentPage === 'start'" class="page start-page">
      <div class="content-box">
        <h1 class="title">AI依赖程度测试</h1>
        <p class="subtitle">通过20个问题，了解你对AI的依赖程度</p>
        <div class="info-box">
          <div class="info-item">
            <span class="info-icon">📝</span>
            <span>20道选择题</span>
          </div>
          <div class="info-item">
            <span class="info-icon">⏱️</span>
            <span>约5分钟</span>
          </div>
          <div class="info-item">
            <span class="info-icon">📊</span>
            <span>即时获得结果</span>
          </div>
        </div>
        <button class="start-btn" @click="startTest">开始测试</button>
      </div>
    </div>

    <!-- 测试页面 -->
    <div v-if="currentPage === 'test'" class="page test-page">
      <div class="test-container">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <div class="question-info">
          <span class="question-number">问题 {{ currentQuestion + 1 }} / 20</span>
        </div>

        <div class="question-card">
          <h2 class="question-text">{{ questions[currentQuestion].question }}</h2>
          <div class="options">
            <div
              v-for="(option, index) in questions[currentQuestion].options"
              :key="index"
              class="option"
              :class="{ 'selected': answers[currentQuestion] === index }"
              @click="selectOption(index)"
            >
              <div class="option-radio">
                <div class="option-radio-inner"></div>
              </div>
              <span class="option-text">{{ option.text }}</span>
            </div>
          </div>
        </div>

        <div class="navigation">
          <button
            class="nav-btn prev-btn"
            @click="prevQuestion"
            :disabled="currentQuestion === 0"
          >
            上一题
          </button>
          <button
            class="nav-btn next-btn"
            @click="nextQuestion"
            :disabled="answers[currentQuestion] === null"
          >
            {{ currentQuestion === 19 ? '完成测试' : '下一题' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 结果页面 -->
    <div v-if="currentPage === 'result'" class="page result-page">
      <div class="result-container">
        <h1 class="result-title">测试结果</h1>

        <div class="score-circle">
          <svg viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="90" fill="none" stroke="#f0f0f0" stroke-width="10"/>
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              :stroke="result.color"
              stroke-width="10"
              stroke-linecap="round"
              :stroke-dasharray="565.48"
              :stroke-dashoffset="565.48 - (565.48 * result.score / 100)"
              transform="rotate(-90 100 100)"
            />
          </svg>
          <div class="score-text">
            <div class="score-number">{{ result.score }}</div>
            <div class="score-total">/ 100</div>
          </div>
        </div>

        <div class="result-card">
          <h2 class="result-type" :style="{ color: result.color }">{{ result.type }}</h2>
          <p class="result-description">{{ result.description }}</p>

          <div class="result-details">
            <h3 class="details-title">详细分析</h3>
            <div class="detail-item">
              <span class="detail-label">依赖等级：</span>
              <div class="level-bar">
                <div
                  class="level-fill"
                  :style="{ width: result.level + '%', backgroundColor: result.color }"
                ></div>
              </div>
              <span class="level-text">{{ result.levelText }}</span>
            </div>

            <div class="suggestions">
              <h4 class="suggestions-title">建议</h4>
              <ul class="suggestions-list">
                <li v-for="(suggestion, index) in result.suggestions" :key="index">
                  {{ suggestion }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="result-actions">
          <button class="action-btn restart-btn" @click="restartTest">重新测试</button>
        </div>

        <div class="statistics">
          <p class="stat-text">已有 {{ totalTests }} 人完成测试</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';

// 页面状态：start, test, result
const currentPage = ref('start');
const currentQuestion = ref(0);
const answers = ref(Array(20).fill(null));
const result = ref(null);
const totalTests = ref(0);

// 20个测试问题
const questions = [
  // 工作/学习相关 (1-5)
  {
    question: '当遇到工作或学习上的问题时，你会：',
    options: [
      { text: '先自己思考和尝试解决', score: 1 },
      { text: '先自己思考，遇到困难再查资料', score: 2 },
      { text: '同时自己思考和使用AI辅助', score: 3 },
      { text: '主要依靠AI提供解决方案', score: 4 },
      { text: '完全依赖AI来解决问题', score: 5 }
    ]
  },
  {
    question: '写邮件或文档时，你会：',
    options: [
      { text: '完全自己撰写', score: 1 },
      { text: '自己写好后用AI检查语法', score: 2 },
      { text: '自己打草稿，让AI润色', score: 3 },
      { text: '让AI生成初稿，自己修改', score: 4 },
      { text: '让AI直接生成，略作修改或不改', score: 5 }
    ]
  },
  {
    question: '准备演讲或报告时，你会：',
    options: [
      { text: '完全自己准备内容和结构', score: 1 },
      { text: '自己准备，用AI查找相关资料', score: 2 },
      { text: '与AI讨论思路，自己完成大部分', score: 3 },
      { text: '让AI提供框架，自己填充内容', score: 4 },
      { text: '主要由AI生成内容和结构', score: 5 }
    ]
  },
  {
    question: '编程或技术工作时，你会：',
    options: [
      { text: '完全自己编写代码', score: 1 },
      { text: '自己编写，遇到bug才问AI', score: 2 },
      { text: '自己写主要逻辑，用AI辅助细节', score: 3 },
      { text: '让AI生成代码框架，自己调整', score: 4 },
      { text: '大部分代码由AI生成', score: 5 }
    ]
  },
  {
    question: '学习新知识时，你会：',
    options: [
      { text: '主要通过书籍和课程系统学习', score: 1 },
      { text: '系统学习为主，偶尔问AI', score: 2 },
      { text: '结合传统学习和AI问答', score: 3 },
      { text: '主要通过与AI对话来学习', score: 4 },
      { text: '完全依赖AI来解释和教学', score: 5 }
    ]
  },

  // 日常生活相关 (6-9)
  {
    question: '计划旅行或活动时，你会：',
    options: [
      { text: '自己研究和制定详细计划', score: 1 },
      { text: '自己做主要规划，用AI查信息', score: 2 },
      { text: '与AI讨论，共同制定计划', score: 3 },
      { text: '让AI提供方案，自己选择', score: 4 },
      { text: '完全按AI建议的方案执行', score: 5 }
    ]
  },
  {
    question: '做饭时遇到新菜谱，你会：',
    options: [
      { text: '看传统食谱或凭经验尝试', score: 1 },
      { text: '主要看食谱，不懂的问AI', score: 2 },
      { text: '同时参考食谱和AI建议', score: 3 },
      { text: '主要问AI要做法和技巧', score: 4 },
      { text: '每一步都要AI指导', score: 5 }
    ]
  },
  {
    question: '购物选择商品时，你会：',
    options: [
      { text: '根据自己的经验和需求选择', score: 1 },
      { text: '自己初选，看评价做决定', score: 2 },
      { text: '咨询AI意见作为参考之一', score: 3 },
      { text: '主要依据AI的推荐和分析', score: 4 },
      { text: '完全按AI推荐购买', score: 5 }
    ]
  },
  {
    question: '生活中遇到小困扰（如电器故障），你会：',
    options: [
      { text: '先自己尝试排查解决', score: 1 },
      { text: '自己尝试，不行再查资料', score: 2 },
      { text: '同时自己摸索和咨询AI', score: 3 },
      { text: '先问AI再按建议操作', score: 4 },
      { text: '立即问AI，完全按指示做', score: 5 }
    ]
  },

  // 决策制定相关 (10-13)
  {
    question: '做重要决定（如换工作、买房）时，你会：',
    options: [
      { text: '自己分析利弊做决定', score: 1 },
      { text: '自己决定，用AI补充信息', score: 2 },
      { text: '与AI讨论不同角度的看法', score: 3 },
      { text: 'AI的分析是重要决策依据', score: 4 },
      { text: '主要依据AI的建议做决定', score: 5 }
    ]
  },
  {
    question: '处理人际关系问题时，你会：',
    options: [
      { text: '依靠自己的情商和经验', score: 1 },
      { text: '主要靠自己，偶尔听AI建议', score: 2 },
      { text: '用AI帮助分析但自己判断', score: 3 },
      { text: '很依赖AI的建议和策略', score: 4 },
      { text: '完全按AI建议处理', score: 5 }
    ]
  },
  {
    question: '选择职业发展方向时，你会：',
    options: [
      { text: '根据自己的兴趣和目标决定', score: 1 },
      { text: '自己规划，用AI了解行业信息', score: 2 },
      { text: '结合AI分析和个人意愿', score: 3 },
      { text: '主要参考AI的职业规划建议', score: 4 },
      { text: '让AI分析并决定发展方向', score: 5 }
    ]
  },
  {
    question: '面对道德或价值观的问题，你会：',
    options: [
      { text: '完全根据自己的价值观判断', score: 1 },
      { text: '主要靠自己，可能听听AI看法', score: 2 },
      { text: '用AI提供不同视角供参考', score: 3 },
      { text: 'AI的观点会很大影响我', score: 4 },
      { text: '倾向于接受AI的观点', score: 5 }
    ]
  },

  // 信息获取相关 (14-17)
  {
    question: '想了解新闻或时事时，你会：',
    options: [
      { text: '阅读多个新闻来源', score: 1 },
      { text: '看新闻，偶尔问AI解释背景', score: 2 },
      { text: '看新闻同时问AI总结和分析', score: 3 },
      { text: '主要通过AI获取新闻摘要', score: 4 },
      { text: '只通过AI了解所有新闻', score: 5 }
    ]
  },
  {
    question: '验证信息真实性时，你会：',
    options: [
      { text: '自己查证多个可靠来源', score: 1 },
      { text: '主要自己查证，用AI辅助', score: 2 },
      { text: '结合自己查证和AI验证', score: 3 },
      { text: '主要依靠AI验证信息', score: 4 },
      { text: '完全相信AI的验证结果', score: 5 }
    ]
  },
  {
    question: '遇到不懂的概念或词汇，你会：',
    options: [
      { text: '查词典或专业资料', score: 1 },
      { text: '先查资料，不够再问AI', score: 2 },
      { text: '同时查资料和问AI', score: 3 },
      { text: '主要问AI解释', score: 4 },
      { text: '只问AI，不查其他资料', score: 5 }
    ]
  },
  {
    question: '研究专业或深度话题时，你会：',
    options: [
      { text: '系统阅读专业文献和书籍', score: 1 },
      { text: '以专业资料为主，用AI答疑', score: 2 },
      { text: '专业资料和AI各占一半', score: 3 },
      { text: '主要通过AI学习和研究', score: 4 },
      { text: '完全依赖AI提供专业知识', score: 5 }
    ]
  },

  // 创作/表达相关 (18-20)
  {
    question: '写创意内容（如故事、文章）时，你会：',
    options: [
      { text: '完全原创，表达自己想法', score: 1 },
      { text: '自己创作，用AI检查修改', score: 2 },
      { text: '自己写主体，用AI丰富细节', score: 3 },
      { text: '让AI提供创意，自己改写', score: 4 },
      { text: '主要由AI生成创意内容', score: 5 }
    ]
  },
  {
    question: '表达个人观点或情感时，你会：',
    options: [
      { text: '完全用自己的语言表达', score: 1 },
      { text: '自己表达，用AI优化措辞', score: 2 },
      { text: '自己想法，让AI帮助表达', score: 3 },
      { text: '告诉AI意思，让它来表达', score: 4 },
      { text: '让AI代为表达情感和观点', score: 5 }
    ]
  },
  {
    question: '总的来说，你认为AI在生活中的角色是：',
    options: [
      { text: '几乎不使用AI工具', score: 1 },
      { text: '偶尔使用的辅助工具', score: 2 },
      { text: '日常使用的得力助手', score: 3 },
      { text: '生活中的重要依赖', score: 4 },
      { text: '不可或缺的必需品', score: 5 }
    ]
  }
];

// 计算进度
const progress = computed(() => {
  return ((currentQuestion.value + 1) / 20) * 100;
});

// 开始测试
function startTest() {
  currentPage.value = 'test';
  currentQuestion.value = 0;
  answers.value = Array(20).fill(null);
}

// 选择选项
function selectOption(index) {
  answers.value[currentQuestion.value] = index;
}

// 上一题
function prevQuestion() {
  if (currentQuestion.value > 0) {
    currentQuestion.value--;
  }
}

// 下一题或完成
async function nextQuestion() {
  if (currentQuestion.value < 19) {
    currentQuestion.value++;
  } else {
    // 完成测试，计算结果
    await submitTest();
  }
}

// 提交测试
async function submitTest() {
  // 计算总分
  let totalScore = 0;
  answers.value.forEach((answerIndex, questionIndex) => {
    totalScore += questions[questionIndex].options[answerIndex].score;
  });

  // 发送结果到后端
  try {
    const response = await axios.post('/api/test/submit', {
      answers: answers.value,
      score: totalScore
    });

    result.value = response.data.result;
    totalTests.value = response.data.totalTests;
    currentPage.value = 'result';
  } catch (error) {
    console.error('提交测试失败:', error);
    // 如果后端失败，使用本地计算
    result.value = calculateResult(totalScore);
    currentPage.value = 'result';
  }
}

// 本地计算结果（备用）
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

// 重新测试
function restartTest() {
  currentPage.value = 'start';
  currentQuestion.value = 0;
  answers.value = Array(20).fill(null);
  result.value = null;
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* 开始页面样式 */
.start-page .content-box {
  background: white;
  border-radius: 20px;
  padding: 60px 40px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.title {
  font-size: 36px;
  font-weight: 700;
  color: #333;
  margin-bottom: 15px;
}

.subtitle {
  font-size: 16px;
  color: #666;
  margin-bottom: 40px;
}

.info-box {
  display: flex;
  justify-content: space-around;
  margin-bottom: 40px;
  padding: 30px 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.info-icon {
  font-size: 32px;
}

.info-item span:last-child {
  font-size: 14px;
  color: #666;
}

.start-btn {
  width: 100%;
  padding: 18px;
  font-size: 18px;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

/* 测试页面样式 */
.test-container {
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 700px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 20px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.question-info {
  text-align: center;
  margin-bottom: 30px;
}

.question-number {
  font-size: 14px;
  color: #667eea;
  font-weight: 600;
}

.question-card {
  margin-bottom: 40px;
}

.question-text {
  font-size: 22px;
  color: #333;
  margin-bottom: 30px;
  line-height: 1.5;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.option {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 18px 20px;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.option:hover {
  background: #e9ecef;
  border-color: #667eea;
}

.option.selected {
  background: #ede7f6;
  border-color: #667eea;
}

.option-radio {
  width: 24px;
  height: 24px;
  border: 2px solid #adb5bd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color 0.2s;
}

.option.selected .option-radio {
  border-color: #667eea;
}

.option-radio-inner {
  width: 12px;
  height: 12px;
  background: #667eea;
  border-radius: 50%;
  transform: scale(0);
  transition: transform 0.2s;
}

.option.selected .option-radio-inner {
  transform: scale(1);
}

.option-text {
  font-size: 16px;
  color: #333;
  line-height: 1.5;
}

.navigation {
  display: flex;
  gap: 15px;
}

.nav-btn {
  flex: 1;
  padding: 15px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.prev-btn {
  background: #f8f9fa;
  color: #333;
}

.prev-btn:hover:not(:disabled) {
  background: #e9ecef;
}

.next-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.next-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 结果页面样式 */
.result-container {
  background: white;
  border-radius: 20px;
  padding: 50px 40px;
  max-width: 700px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.result-title {
  font-size: 32px;
  text-align: center;
  color: #333;
  margin-bottom: 40px;
}

.score-circle {
  width: 200px;
  height: 200px;
  margin: 0 auto 40px;
  position: relative;
}

.score-circle svg {
  width: 100%;
  height: 100%;
}

.score-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.score-number {
  font-size: 48px;
  font-weight: 700;
  color: #333;
}

.score-total {
  font-size: 18px;
  color: #999;
  margin-top: -5px;
}

.result-card {
  text-align: center;
  margin-bottom: 30px;
}

.result-type {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 15px;
}

.result-description {
  font-size: 16px;
  color: #666;
  line-height: 1.8;
  margin-bottom: 30px;
}

.result-details {
  background: #f8f9fa;
  padding: 30px;
  border-radius: 12px;
  text-align: left;
}

.details-title {
  font-size: 20px;
  color: #333;
  margin-bottom: 20px;
}

.detail-item {
  margin-bottom: 25px;
}

.detail-label {
  font-size: 14px;
  color: #666;
  display: block;
  margin-bottom: 8px;
}

.level-bar {
  width: 100%;
  height: 12px;
  background: #e9ecef;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 8px;
}

.level-fill {
  height: 100%;
  transition: width 0.5s ease;
}

.level-text {
  font-size: 14px;
  color: #333;
  font-weight: 600;
}

.suggestions {
  margin-top: 25px;
}

.suggestions-title {
  font-size: 18px;
  color: #333;
  margin-bottom: 15px;
}

.suggestions-list {
  list-style: none;
  padding-left: 0;
}

.suggestions-list li {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
  padding-left: 20px;
  position: relative;
  margin-bottom: 8px;
}

.suggestions-list li:before {
  content: '•';
  position: absolute;
  left: 5px;
  color: #667eea;
  font-size: 18px;
}

.result-actions {
  margin-top: 30px;
  text-align: center;
}

.action-btn {
  padding: 15px 40px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.statistics {
  text-align: center;
  margin-top: 25px;
  padding-top: 25px;
  border-top: 1px solid #e9ecef;
}

.stat-text {
  font-size: 14px;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .start-page .content-box {
    padding: 40px 30px;
  }

  .title {
    font-size: 28px;
  }

  .test-container,
  .result-container {
    padding: 30px 20px;
  }

  .question-text {
    font-size: 18px;
  }

  .info-box {
    flex-direction: column;
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .page {
    padding: 10px;
  }

  .start-page .content-box {
    padding: 30px 20px;
  }

  .title {
    font-size: 24px;
  }

  .subtitle {
    font-size: 14px;
  }

  .test-container,
  .result-container {
    padding: 25px 15px;
  }

  .question-text {
    font-size: 16px;
  }

  .option {
    padding: 15px;
  }

  .option-text {
    font-size: 14px;
  }

  .result-title {
    font-size: 24px;
  }

  .score-circle {
    width: 160px;
    height: 160px;
  }

  .score-number {
    font-size: 36px;
  }
}
</style>
