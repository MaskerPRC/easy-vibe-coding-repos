#!/usr/bin/env node

import readline from 'readline';

// 大学专业数学题库
const mathQuestions = [
  {
    question: '求极限: lim(x→0) (sin(x) / x) = ?',
    answer: '1',
    hints: ['使用洛必达法则', '或使用泰勒级数展开']
  },
  {
    question: '求导数: d/dx(x^2 * e^x) = ?',
    answer: '2x*e^x+x^2*e^x',
    acceptableAnswers: ['2x*e^x+x^2*e^x', 'e^x*(2x+x^2)', 'x*e^x*(2+x)', 'e^x*x*(x+2)'],
    hints: ['使用乘积法则: (uv)\' = u\'v + uv\'']
  },
  {
    question: '计算定积分: ∫(0到π) sin(x) dx = ?',
    answer: '2',
    hints: ['sin(x)的原函数是-cos(x)']
  },
  {
    question: '线性代数: 若矩阵A = [[1,2],[3,4]]，求det(A) = ?',
    answer: '-2',
    acceptableAnswers: ['-2', 'fu2', '负2'],
    hints: ['2阶行列式: ad - bc']
  },
  {
    question: '概率论: 掷一个公平骰子两次，两次点数之和为7的概率是多少？(用分数表示，如1/6)',
    answer: '1/6',
    acceptableAnswers: ['1/6', '0.1666', '0.167', '16.67%', '六分之一'],
    hints: ['总共有36种可能，满足条件的有(1,6),(2,5),(3,4),(4,3),(5,2),(6,1)']
  },
  {
    question: '复变函数: e^(iπ) + 1 = ? (欧拉公式)',
    answer: '0',
    hints: ['这是数学中最美的公式之一']
  },
  {
    question: '微分方程: y\' = y 的通解是? (用C表示常数)',
    answer: 'Ce^x',
    acceptableAnswers: ['Ce^x', 'c*e^x', 'C*e^x', 'ce^x', 'e^x*C'],
    hints: ['这是一个可分离变量的微分方程']
  },
  {
    question: '级数: ∑(n=1到∞) 1/2^n = ?',
    answer: '1',
    acceptableAnswers: ['1', '1.0'],
    hints: ['这是一个等比级数，首项a=1/2，公比r=1/2']
  },
  {
    question: '向量运算: 若向量a=(3,4)，求|a| = ?',
    answer: '5',
    hints: ['向量的模: √(x²+y²)']
  },
  {
    question: '拉普拉斯变换: L{1} = ? (s为复变量)',
    answer: '1/s',
    acceptableAnswers: ['1/s', '1/s(s>0)'],
    hints: ['∫(0到∞) e^(-st) dt']
  }
];

// 随机选择一道题
const selectRandomQuestion = () => {
  return mathQuestions[Math.floor(Math.random() * mathQuestions.length)];
};

// 标准化答案（去除空格、转小写）
const normalizeAnswer = (answer) => {
  return answer.replace(/\s+/g, '').toLowerCase();
};

// 验证答案
const checkAnswer = (userAnswer, question) => {
  const normalizedUserAnswer = normalizeAnswer(userAnswer);
  const normalizedCorrectAnswer = normalizeAnswer(question.answer);

  // 检查标准答案
  if (normalizedUserAnswer === normalizedCorrectAnswer) {
    return true;
  }

  // 检查可接受的答案
  if (question.acceptableAnswers) {
    return question.acceptableAnswers.some(ans =>
      normalizeAnswer(ans) === normalizedUserAnswer
    );
  }

  return false;
};

// 主函数
const main = async () => {
  const question = selectRandomQuestion();

  console.log('\n' + '='.repeat(70));
  console.log('🎓 代码提交前的数学挑战！');
  console.log('='.repeat(70));
  console.log('\n请回答以下大学数学题才能继续提交代码：\n');
  console.log(`📚 问题: ${question.question}\n`);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  let attempts = 0;
  const maxAttempts = 3;

  const askQuestion = () => {
    return new Promise((resolve) => {
      rl.question('💡 你的答案: ', (answer) => {
        attempts++;

        if (checkAnswer(answer, question)) {
          console.log('\n✅ 回答正确！你可以继续提交代码了。\n');
          console.log('='.repeat(70) + '\n');
          rl.close();
          resolve(true);
        } else {
          if (attempts < maxAttempts) {
            console.log(`\n❌ 答案错误，你还有 ${maxAttempts - attempts} 次机会。`);
            if (question.hints && attempts > 0) {
              console.log(`💭 提示 ${attempts}: ${question.hints[attempts - 1] || question.hints[0]}\n`);
            }
            askQuestion().then(resolve);
          } else {
            console.log('\n❌ 很遗憾，答案错误。');
            console.log(`✏️  正确答案是: ${question.answer}\n`);
            console.log('📖 请复习相关知识后再尝试提交代码。\n');
            console.log('='.repeat(70) + '\n');
            rl.close();
            resolve(false);
          }
        }
      });
    });
  };

  const success = await askQuestion();
  process.exit(success ? 0 : 1);
};

main().catch((error) => {
  console.error('❌ 发生错误:', error.message);
  process.exit(1);
});
