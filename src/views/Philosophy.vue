<template>
  <div class="philosophy-page">
    <!-- 页面标题 -->
    <section class="page-header">
      <div class="container">
        <h1>生命哲学</h1>
        <p>深入探讨存在、自由、死亡等永恒的哲学命题</p>
      </div>
    </section>

    <!-- 主要内容 -->
    <section class="content-section">
      <div class="container">
        <!-- 核心哲学问题 -->
        <div class="questions-section">
          <h2>生命的五个终极问题</h2>
          <div class="questions-grid">
            <div class="question-card" v-for="question in questions" :key="question.id">
              <div class="question-number">{{ question.id }}</div>
              <h3>{{ question.title }}</h3>
              <p class="question-text">{{ question.question }}</p>
              <div class="perspectives">
                <h4>不同的视角：</h4>
                <div class="perspective-item" v-for="(perspective, index) in question.perspectives" :key="index">
                  <strong>{{ perspective.school }}：</strong>
                  <span>{{ perspective.view }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 存在主义 -->
        <div class="philosophy-school">
          <h2>存在主义：存在先于本质</h2>
          <div class="school-content">
            <div class="school-intro">
              <p>
                存在主义认为，人首先存在，然后通过自己的选择和行动来定义自己的本质。
                我们不是被预先定义的，而是通过自由选择创造自己的人生。
              </p>
            </div>
            <div class="concepts-grid">
              <div class="concept-card">
                <div class="concept-icon">
                  <Unlock :size="24" />
                </div>
                <h3>自由</h3>
                <p>人被判定为自由的。我们对自己的选择负有完全的责任。</p>
              </div>
              <div class="concept-card">
                <div class="concept-icon">
                  <AlertCircle :size="24" />
                </div>
                <h3>焦虑</h3>
                <p>面对无限可能性和责任时产生的存在性焦虑是人生的常态。</p>
              </div>
              <div class="concept-card">
                <div class="concept-icon">
                  <User :size="24" />
                </div>
                <h3>真诚</h3>
                <p>以真实的自我生活，而不是扮演社会期待的角色。</p>
              </div>
              <div class="concept-card">
                <div class="concept-icon">
                  <Hourglass :size="24" />
                </div>
                <h3>向死而生</h3>
                <p>正视死亡的必然性，从而更真实、更有意义地活着。</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 哲学流派 -->
        <div class="schools-section">
          <h2>主要哲学流派</h2>
          <div class="schools-list">
            <div class="school-item" v-for="school in schools" :key="school.id">
              <div class="school-header">
                <component :is="school.icon" :size="28" class="school-icon" />
                <h3>{{ school.name }}</h3>
              </div>
              <p class="school-description">{{ school.description }}</p>
              <div class="school-keypoints">
                <strong>核心观点：</strong>
                <ul>
                  <li v-for="(point, index) in school.keyPoints" :key="index">{{ point }}</li>
                </ul>
              </div>
              <div class="school-representatives">
                <strong>代表人物：</strong>{{ school.representatives }}
              </div>
            </div>
          </div>
        </div>

        <!-- 思考练习 -->
        <div class="reflection-section">
          <h2>哲学思考练习</h2>
          <div class="reflection-cards">
            <div class="reflection-card" v-for="exercise in exercises" :key="exercise.id">
              <h3>{{ exercise.title }}</h3>
              <p class="exercise-description">{{ exercise.description }}</p>
              <div class="exercise-questions">
                <p v-for="(q, index) in exercise.questions" :key="index" class="exercise-question">
                  {{ index + 1 }}. {{ q }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Building, Waves, Brain, Scale, Unlock, AlertCircle, User, Hourglass } from 'lucide-vue-next'

// 终极问题（内存存储）
const questions = ref([
  {
    id: 1,
    title: '存在的意义',
    question: '我为什么存在？生命有意义吗？',
    perspectives: [
      { school: '存在主义', view: '我们自己创造生命的意义' },
      { school: '虚无主义', view: '生命本身没有固有意义' },
      { school: '宗教哲学', view: '意义来自更高的存在或目的' }
    ]
  },
  {
    id: 2,
    title: '自由与命运',
    question: '人是真正自由的吗？还是一切都是命中注定？',
    perspectives: [
      { school: '自由意志论', view: '人拥有真正的选择自由' },
      { school: '决定论', view: '一切都由因果律决定' },
      { school: '兼容论', view: '自由与决定论可以共存' }
    ]
  },
  {
    id: 3,
    title: '死亡的本质',
    question: '死亡意味着什么？如何面对死亡？',
    perspectives: [
      { school: '存在主义', view: '向死而生，死亡让生命更有意义' },
      { school: '伊壁鸠鲁', view: '死亡与我无关，因为我在时它不在' },
      { school: '佛教', view: '死亡是轮回的一部分，非终点' }
    ]
  },
  {
    id: 4,
    title: '他人与自我',
    question: '他人对于我的存在意味着什么？',
    perspectives: [
      { school: '萨特', view: '他人即地狱，他人的目光定义了我' },
      { school: '布伯', view: '真正的存在发生在我与你的关系中' },
      { school: '儒家', view: '人是社会关系中的存在' }
    ]
  },
  {
    id: 5,
    title: '幸福的本质',
    question: '什么是真正的幸福？如何获得幸福？',
    perspectives: [
      { school: '亚里士多德', view: '幸福是德性的实现' },
      { school: '伊壁鸠鲁', view: '幸福是宁静和免于痛苦' },
      { school: '斯多葛学派', view: '幸福来自内心的平静' }
    ]
  }
])

// 哲学流派（内存存储）
const schools = ref([
  {
    id: 1,
    icon: Scale,
    name: '斯多葛主义',
    description: '强调理性、德性和内心的平静，认为我们应该接受不能改变的事物。',
    keyPoints: [
      '区分可控与不可控的事物',
      '通过理性控制情绪',
      '接受命运，专注于自己的选择',
      '德性是唯一的善'
    ],
    representatives: '塞内加、马可·奥勒留、爱比克泰德'
  },
  {
    id: 2,
    icon: Waves,
    name: '道家哲学',
    description: '主张顺应自然，无为而治，追求与宇宙的和谐统一。',
    keyPoints: [
      '道法自然，顺应天道',
      '无为而无不为',
      '柔弱胜刚强',
      '返璞归真，追求本真'
    ],
    representatives: '老子、庄子'
  },
  {
    id: 3,
    icon: Brain,
    name: '存在主义',
    description: '强调个人存在、自由选择和责任，认为存在先于本质。',
    keyPoints: [
      '人有绝对的自由',
      '我们对自己的选择负责',
      '存在性焦虑是不可避免的',
      '通过行动创造自己的本质'
    ],
    representatives: '萨特、加缪、海德格尔、克尔凯郭尔'
  },
  {
    id: 4,
    icon: Building,
    name: '佛教哲学',
    description: '关注苦的本质和解脱之道，强调无常、无我和涅槃。',
    keyPoints: [
      '四圣谛：苦、集、灭、道',
      '万物无常，变化是永恒的',
      '无我：自我是虚幻的',
      '通过正念和修行获得解脱'
    ],
    representatives: '释迦牟尼、龙树、僧璨'
  },
  {
    id: 5,
    icon: Scale,
    name: '功利主义',
    description: '以最大多数人的最大幸福为道德标准的伦理学说。',
    keyPoints: [
      '行为的道德取决于其后果',
      '追求最大化总体幸福',
      '每个人的幸福同等重要',
      '理性计算利益得失'
    ],
    representatives: '边沁、密尔'
  }
])

// 思考练习（内存存储）
const exercises = ref([
  {
    id: 1,
    title: '存在的镜子',
    description: '通过反思自己的存在，更深入地理解生命。',
    questions: [
      '如果明天就是生命的最后一天，你会做什么改变？',
      '什么事情让你感到"这就是我"？',
      '你希望别人如何记住你？'
    ]
  },
  {
    id: 2,
    title: '自由的重量',
    description: '思考自由意味着什么，以及它带来的责任。',
    questions: [
      '你最近做的一个重要决定是什么？为什么这样选择？',
      '有什么事情是你一直想做但没有做的？是什么阻止了你？',
      '如果你对自己的生活有完全的责任，你会做出什么改变？'
    ]
  },
  {
    id: 3,
    title: '向死而生',
    description: '正视死亡，从而更真实地活着。',
    questions: [
      '想到死亡时，你有什么感受？',
      '如果知道自己还有一年的生命，你会如何度过？',
      '死亡的必然性如何影响你对生活的看法？'
    ]
  }
])
</script>

<style scoped>
.philosophy-page {
  min-height: 100vh;
  background: #f7fafc;
}

/* 页面头部 */
.page-header {
  background: white;
  color: #333;
  padding: 3rem 2rem 2.5rem;
  text-align: center;
  border-bottom: 1px solid #e2e8f0;
}

.page-header h1 {
  font-size: 2.25rem;
  margin-bottom: 0.75rem;
  color: #1a202c;
  font-weight: 700;
}

.page-header p {
  font-size: 1.0625rem;
  color: #4a5568;
}

/* 内容区域 */
.content-section {
  padding: 3rem 2rem;
  background: #f7fafc;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

/* 问题区域 */
.questions-section {
  margin-bottom: 3rem;
}

.questions-section h2 {
  color: #1a202c;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.questions-grid {
  display: grid;
  gap: 1.25rem;
}

.question-card {
  background: white;
  padding: 1.75rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: relative;
  border: 1px solid #e2e8f0;
}

.question-number {
  position: absolute;
  top: -12px;
  left: 1.25rem;
  width: 36px;
  height: 36px;
  background: white;
  color: #2d3748;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.0625rem;
  border: 2px solid #2d3748;
}

.question-card h3 {
  color: #2d3748;
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  margin-top: 0.5rem;
  font-weight: 600;
}

.question-text {
  color: #4a5568;
  font-size: 1rem;
  margin-bottom: 1.25rem;
  line-height: 1.75;
}

.perspectives h4 {
  color: #2d3748;
  margin-bottom: 0.75rem;
  font-size: 0.9375rem;
  font-weight: 600;
}

.perspective-item {
  padding: 0.875rem;
  background: #f7fafc;
  border-left: 3px solid #cbd5e0;
  margin-bottom: 0.5rem;
  line-height: 1.6;
  font-size: 0.9375rem;
}

.perspective-item:last-child {
  margin-bottom: 0;
}

.perspective-item strong {
  color: #2d3748;
  font-weight: 600;
}

.perspective-item span {
  color: #718096;
}

/* 存在主义区域 */
.philosophy-school {
  margin-bottom: 3rem;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.philosophy-school h2 {
  color: #1a202c;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 600;
}

.school-intro {
  margin-bottom: 1.5rem;
}

.school-intro p {
  color: #4a5568;
  line-height: 1.75;
  font-size: 1rem;
  text-align: center;
}

.concepts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.concept-card {
  background: #f7fafc;
  padding: 1.25rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.concept-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 0.75rem;
  color: #2d3748;
}

.concept-card h3 {
  color: #2d3748;
  font-size: 1.0625rem;
  margin-bottom: 0.5rem;
  text-align: center;
  font-weight: 600;
}

.concept-card p {
  color: #718096;
  line-height: 1.6;
  text-align: center;
  font-size: 0.875rem;
  margin: 0;
}

/* 流派区域 */
.schools-section {
  margin-bottom: 3rem;
}

.schools-section h2 {
  color: #1a202c;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.schools-list {
  display: grid;
  gap: 1.25rem;
}

.school-item {
  background: white;
  padding: 1.75rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.school-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.school-icon {
  color: #2d3748;
  flex-shrink: 0;
}

.school-item h3 {
  color: #2d3748;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.school-description {
  color: #4a5568;
  line-height: 1.75;
  margin-bottom: 1.25rem;
  font-size: 0.9375rem;
}

.school-keypoints {
  background: #f7fafc;
  padding: 1.25rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  border: 1px solid #e2e8f0;
}

.school-keypoints strong {
  color: #2d3748;
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 0.9375rem;
}

.school-keypoints ul {
  margin: 0;
  padding-left: 1.5rem;
}

.school-keypoints li {
  color: #4a5568;
  line-height: 1.75;
  margin-bottom: 0.375rem;
  font-size: 0.9375rem;
}

.school-representatives {
  color: #718096;
  font-size: 0.9375rem;
}

.school-representatives strong {
  color: #2d3748;
  font-weight: 600;
}

/* 思考练习 */
.reflection-section h2 {
  color: #1a202c;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.reflection-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
}

.reflection-card {
  background: white;
  padding: 1.75rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.reflection-card h3 {
  color: #2d3748;
  font-size: 1.125rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.exercise-description {
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1.25rem;
  font-size: 0.9375rem;
}

.exercise-questions {
  background: #f7fafc;
  padding: 1.25rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.exercise-question {
  color: #2d3748;
  line-height: 1.75;
  margin-bottom: 0.875rem;
  padding-bottom: 0.875rem;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.9375rem;
}

.exercise-question:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header h1 {
    font-size: 1.75rem;
  }

  .page-header p {
    font-size: 1rem;
  }

  .concepts-grid {
    grid-template-columns: 1fr;
  }

  .reflection-cards {
    grid-template-columns: 1fr;
  }
}
</style>
