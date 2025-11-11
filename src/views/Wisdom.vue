<template>
  <div class="wisdom-page">
    <!-- 页面标题 -->
    <section class="page-header">
      <div class="container">
        <h1>生命的智慧</h1>
        <p>汲取古今中外的智慧，学习如何更好地生活</p>
      </div>
    </section>

    <!-- 主要内容 -->
    <section class="content-section">
      <div class="container">
        <!-- 智慧的核心原则 -->
        <div class="principles-section">
          <h2>智慧生活的十大原则</h2>
          <div class="principles-grid">
            <div class="principle-card" v-for="principle in principles" :key="principle.id">
              <div class="principle-icon">{{ principle.icon }}</div>
              <h3>{{ principle.title }}</h3>
              <p>{{ principle.description }}</p>
            </div>
          </div>
        </div>

        <!-- 智慧实践 -->
        <div class="practice-section">
          <h2>日常智慧实践</h2>
          <div class="practice-list">
            <div class="practice-item" v-for="practice in practices" :key="practice.id">
              <div class="practice-header">
                <span class="practice-emoji">{{ practice.emoji }}</span>
                <h3>{{ practice.title }}</h3>
              </div>
              <p>{{ practice.description }}</p>
              <div class="practice-tips">
                <strong>实践方法：</strong>
                <ul>
                  <li v-for="(tip, index) in practice.tips" :key="index">{{ tip }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- 古代智慧 -->
        <div class="ancient-wisdom">
          <h2>古代智慧精选</h2>
          <div class="wisdom-tabs">
            <button
              v-for="tab in wisdomTabs"
              :key="tab.id"
              :class="['tab-button', { active: activeTab === tab.id }]"
              @click="activeTab = tab.id"
            >
              {{ tab.name }}
            </button>
          </div>
          <div class="wisdom-content">
            <div v-for="item in getCurrentWisdom" :key="item.id" class="wisdom-item">
              <h4>{{ item.title }}</h4>
              <p class="wisdom-text">{{ item.text }}</p>
              <p class="wisdom-explanation">{{ item.explanation }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 智慧原则（内存存储）
const principles = ref([
  { id: 1, icon: '🎯', title: '活在当下', description: '专注于此刻，不被过去束缚，不为未来焦虑' },
  { id: 2, icon: '💪', title: '持续成长', description: '保持学习的态度，每天进步一点点' },
  { id: 3, icon: '🤝', title: '善待他人', description: '以同理心对待每一个人，创造和谐关系' },
  { id: 4, icon: '🧘', title: '内心平静', description: '培养内在的宁静，不被外界干扰' },
  { id: 5, icon: '🌱', title: '拥抱变化', description: '接受生命的无常，灵活应对变化' },
  { id: 6, icon: '⚖️', title: '保持平衡', description: '在工作与生活间找到适当的平衡点' },
  { id: 7, icon: '🙏', title: '心怀感恩', description: '感激生命中的美好，珍惜所拥有的' },
  { id: 8, icon: '🎨', title: '发挥创造', description: '释放创造力，为世界带来独特价值' },
  { id: 9, icon: '💖', title: '真诚待己', description: '诚实面对自己，接纳真实的自我' },
  { id: 10, icon: '🌟', title: '追求卓越', description: '在重要的事情上追求卓越，而非完美' }
])

// 实践方法（内存存储）
const practices = ref([
  {
    id: 1,
    emoji: '🧘‍♀️',
    title: '冥想与正念',
    description: '通过冥想练习培养觉察力和内心的平静',
    tips: [
      '每天早晨花10分钟进行冥想',
      '在日常活动中保持正念，专注当下',
      '使用呼吸作为回到当下的锚点'
    ]
  },
  {
    id: 2,
    emoji: '📖',
    title: '阅读与思考',
    description: '通过阅读经典著作获取智慧，通过思考内化知识',
    tips: [
      '每天至少阅读30分钟',
      '选择经典哲学、心理学、传记类书籍',
      '记录阅读笔记和个人思考'
    ]
  },
  {
    id: 3,
    emoji: '✍️',
    title: '写作与反思',
    description: '通过写作整理思绪，通过反思认识自己',
    tips: [
      '每晚写日记，记录一天的经历和感受',
      '定期进行自我反思，总结经验教训',
      '写下人生目标和实现计划'
    ]
  },
  {
    id: 4,
    emoji: '🤲',
    title: '服务与奉献',
    description: '通过帮助他人获得生命的深层满足',
    tips: [
      '参与志愿服务活动',
      '在日常生活中主动帮助需要的人',
      '分享自己的知识和经验'
    ]
  }
])

// 古代智慧标签
const wisdomTabs = ref([
  { id: 'chinese', name: '中国智慧' },
  { id: 'western', name: '西方哲学' },
  { id: 'eastern', name: '东方禅学' }
])

const activeTab = ref('chinese')

// 古代智慧内容（内存存储）
const wisdomData = ref({
  chinese: [
    {
      id: 1,
      title: '道德经',
      text: '上善若水，水善利万物而不争',
      explanation: '最高的善像水一样，水善于滋润万物而不与万物相争。启示我们要像水一样柔软、谦逊，默默奉献。'
    },
    {
      id: 2,
      title: '论语',
      text: '己所不欲，勿施于人',
      explanation: '自己不愿意的事，不要强加给别人。这是处理人际关系的黄金法则。'
    },
    {
      id: 3,
      title: '庄子',
      text: '人生天地之间，若白驹过隙，忽然而已',
      explanation: '人生在天地之间，就像白色的骏马在细小的缝隙前跑过一样，转瞬即逝。提醒我们珍惜时光。'
    }
  ],
  western: [
    {
      id: 1,
      title: '苏格拉底',
      text: '认识你自己',
      explanation: '自我认知是智慧的开始。只有真正了解自己，才能做出正确的选择。'
    },
    {
      id: 2,
      title: '亚里士多德',
      text: '人是寻求意义的动物',
      explanation: '人的本质在于追求意义和目标。找到生命的意义是幸福的关键。'
    },
    {
      id: 3,
      title: '斯多葛学派',
      text: '改变能改变的，接受不能改变的',
      explanation: '智慧在于区分什么是我们能控制的，什么是不能控制的，并据此行动。'
    }
  ],
  eastern: [
    {
      id: 1,
      title: '禅宗',
      text: '当下即是',
      explanation: '真理就在当下这一刻。不要向外寻求，向内观照即可发现智慧。'
    },
    {
      id: 2,
      title: '佛陀',
      text: '万物皆无常',
      explanation: '世间一切都在变化之中。接受无常，就能减少痛苦，获得自由。'
    },
    {
      id: 3,
      title: '禅语',
      text: '行住坐卧，皆是修行',
      explanation: '修行不在特定的时间和地点，日常生活的每一刻都可以是修行。'
    }
  ]
})

const getCurrentWisdom = computed(() => {
  return wisdomData.value[activeTab.value]
})
</script>

<style scoped>
.wisdom-page {
  min-height: 100vh;
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  padding: 4rem 2rem;
  text-align: center;
}

.page-header h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.page-header p {
  font-size: 1.3rem;
  opacity: 0.95;
}

/* 内容区域 */
.content-section {
  padding: 4rem 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 原则区域 */
.principles-section {
  margin-bottom: 4rem;
}

.principles-section h2 {
  color: #2d3748;
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

.principles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.principle-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: all 0.3s;
}

.principle-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.principle-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.principle-card h3 {
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.principle-card p {
  color: #718096;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* 实践区域 */
.practice-section {
  margin-bottom: 4rem;
}

.practice-section h2 {
  color: #2d3748;
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

.practice-list {
  display: grid;
  gap: 2rem;
}

.practice-item {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.practice-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.practice-emoji {
  font-size: 2rem;
}

.practice-item h3 {
  color: #2d3748;
  font-size: 1.5rem;
}

.practice-item > p {
  color: #4a5568;
  line-height: 1.8;
  margin-bottom: 1rem;
}

.practice-tips {
  background: #f7fafc;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #4facfe;
}

.practice-tips strong {
  color: #2d3748;
  display: block;
  margin-bottom: 0.5rem;
}

.practice-tips ul {
  margin: 0;
  padding-left: 1.5rem;
}

.practice-tips li {
  color: #4a5568;
  line-height: 1.8;
  margin-bottom: 0.5rem;
}

/* 古代智慧区域 */
.ancient-wisdom {
  margin-bottom: 4rem;
}

.ancient-wisdom h2 {
  color: #2d3748;
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

.wisdom-tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.tab-button {
  padding: 0.75rem 2rem;
  border: 2px solid #4facfe;
  background: white;
  color: #4facfe;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-button:hover {
  background: #e6f7ff;
}

.tab-button.active {
  background: #4facfe;
  color: white;
}

.wisdom-content {
  display: grid;
  gap: 2rem;
}

.wisdom-item {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-top: 4px solid #4facfe;
}

.wisdom-item h4 {
  color: #4facfe;
  font-size: 1.3rem;
  margin-bottom: 1rem;
}

.wisdom-text {
  font-size: 1.3rem;
  font-style: italic;
  color: #2d3748;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f7fafc;
  border-left: 4px solid #4facfe;
  line-height: 1.8;
}

.wisdom-explanation {
  color: #718096;
  line-height: 1.8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }

  .page-header p {
    font-size: 1.1rem;
  }

  .principles-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }

  .wisdom-tabs {
    flex-direction: column;
  }

  .tab-button {
    width: 100%;
  }
}
</style>
