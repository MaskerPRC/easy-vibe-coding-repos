<template>
  <div class="app">
    <!-- 头部区域 -->
    <header class="header">
      <div class="header-content">
        <h1 class="main-title">怎么才能和营销大牛聊上呢？</h1>
        <p class="subtitle">代码不重要，卖出去才重要 | 程序员要突破舒适区</p>
      </div>
    </header>

    <!-- 主要内容区 -->
    <main class="main-content">
      <div class="container">
        <!-- 核心理念区域 -->
        <section class="hero-section">
          <div class="hero-card">
            <h2 class="hero-title">核心理念</h2>
            <p class="hero-text">
              获客、精准营销、推广、触达 —— 这些才是让产品爆款的关键。
              小猫补光灯的花叔就是最好的案例，营销做得好，直接爆了！
            </p>
          </div>
        </section>

        <!-- 营销大牛案例 -->
        <section class="section">
          <h2 class="section-title">营销大牛案例</h2>
          <div class="cards-grid">
            <div v-for="expert in experts" :key="expert.id" class="card">
              <div class="card-header">
                <div class="expert-icon">{{ expert.icon }}</div>
                <h3 class="card-title">{{ expert.name }}</h3>
              </div>
              <div class="card-body">
                <p class="card-description">{{ expert.description }}</p>
                <div class="card-tags">
                  <span v-for="tag in expert.tags" :key="tag" class="tag">{{ tag }}</span>
                </div>
              </div>
              <div class="card-footer">
                <button @click="takeAction(expert.action)" class="btn-action">
                  {{ expert.actionText }}
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- 联系方法 -->
        <section class="section">
          <h2 class="section-title">5种高效联系方法</h2>
          <div class="cards-grid">
            <div v-for="method in methods" :key="method.id" class="card method-card">
              <div class="method-number">{{ method.id }}</div>
              <h3 class="method-title">{{ method.title }}</h3>
              <p class="method-description">{{ method.description }}</p>
              <button @click="tryMethod(method.title)" class="btn-try">
                立即尝试
              </button>
            </div>
          </div>
        </section>

        <!-- 营销策略 -->
        <section class="section">
          <h2 class="section-title">营销策略清单</h2>
          <div class="strategy-grid">
            <div v-for="strategy in strategies" :key="strategy.id" class="strategy-card">
              <div class="strategy-icon">✓</div>
              <div class="strategy-content">
                <h4 class="strategy-title">{{ strategy.title }}</h4>
                <p class="strategy-desc">{{ strategy.description }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- 行动号召 -->
        <section class="cta-section">
          <div class="cta-card">
            <h2 class="cta-title">还有100种方法等你探索</h2>
            <p class="cta-text">
              如果觉得这些方法太简单粗暴，你可以直接问ChatGPT，<br/>
              让AI教你100种接触营销大牛的创意方法！
            </p>
            <div class="cta-buttons">
              <button @click="learnMore" class="btn-primary">
                探索更多方法
              </button>
              <button @click="startNow" class="btn-secondary">
                立即开始行动
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <p>记住：多表达、多行动、多连接 —— 成功就在前方！</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 营销大牛案例数据（存储在内存中）
const experts = ref([
  {
    id: 1,
    name: '小猫补光灯的花叔',
    icon: '🌟',
    description: '直播带货领域的营销高手，通过精准定位和高效触达，产品直接爆款。擅长社交媒体营销和用户增长。',
    tags: ['直播带货', '社交营销', '爆款打造'],
    action: 'contact_huashu',
    actionText: '学习经验'
  },
  {
    id: 2,
    name: '私域流量操盘手',
    icon: '💼',
    description: '深耕私域运营，通过朋友圈、社群、1对1沟通打造高转化率营销体系。精通用户触达和精准营销。',
    tags: ['私域流量', '社群运营', '高转化'],
    action: 'contact_private',
    actionText: '了解方法'
  },
  {
    id: 3,
    name: '增长黑客大师',
    icon: '🚀',
    description: '数据驱动的营销专家，通过A/B测试、用户分析实现指数级增长。擅长获客和留存策略。',
    tags: ['增长黑客', '数据分析', '用户增长'],
    action: 'contact_growth',
    actionText: '获取技巧'
  },
  {
    id: 4,
    name: '内容营销专家',
    icon: '✍️',
    description: '通过优质内容打造个人品牌和产品影响力，精通SEO、自媒体运营和内容推广策略。',
    tags: ['内容营销', 'SEO', '品牌建设'],
    action: 'contact_content',
    actionText: '咨询合作'
  }
])

// 联系方法数据（存储在内存中）
const methods = ref([
  {
    id: 1,
    title: '直接找 · 主动出击',
    description: '通过社交媒体、行业论坛、线下活动直接找到目标营销大牛，主动发起联系。不要害羞，大胆表达你的想法和需求。'
  },
  {
    id: 2,
    title: '加微信 · 建立连接',
    description: '微信是最直接的沟通工具。找到大牛的微信号后，发送诚恳的添加请求，说明来意和价值交换点。'
  },
  {
    id: 3,
    title: '打电话 · 真诚沟通',
    description: '电话比文字更有温度。准备好话术，选择合适时间，用真诚的态度打电话，建立信任关系。'
  },
  {
    id: 4,
    title: '朋友介绍 · 借力使力',
    description: '通过共同朋友引荐是最高效的方式。梳理你的人脉网络，找到能够搭桥的关键节点。'
  },
  {
    id: 5,
    title: '多表达 · 展示价值',
    description: '在社交媒体、行业社群中多发声，分享你的见解和成果，让大牛看到你的价值，主动建立连接。'
  }
])

// 营销策略数据（存储在内存中）
const strategies = ref([
  {
    id: 1,
    title: '精准定位目标人群',
    description: '明确你的产品适合哪些人，在哪里能找到他们'
  },
  {
    id: 2,
    title: '打造个人品牌IP',
    description: '让自己成为某个领域的专家，增加可信度'
  },
  {
    id: 3,
    title: '社交媒体矩阵布局',
    description: '多平台运营，扩大触达范围和影响力'
  },
  {
    id: 4,
    title: '用户裂变增长',
    description: '设计分享机制，让用户帮你传播'
  },
  {
    id: 5,
    title: '数据驱动决策',
    description: '追踪关键指标，持续优化营销策略'
  },
  {
    id: 6,
    title: '内容营销获客',
    description: '通过优质内容吸引潜在客户'
  }
])

// 交互方法
const takeAction = (action) => {
  const messages = {
    contact_huashu: '💡 建议：关注花叔的直播和社交媒体，学习他的营销手法，可以尝试在评论区积极互动！',
    contact_private: '💡 建议：加入相关的私域运营社群，主动分享价值，逐步建立信任关系！',
    contact_growth: '💡 建议：参加增长黑客相关的线上课程和社区，在实战中学习并建立人脉！',
    contact_content: '💡 建议：多在知识平台发布优质内容，展示你的思考，吸引专家注意！'
  }
  alert(messages[action] || '开始行动吧！')
}

const tryMethod = (method) => {
  alert(`太棒了！你选择了「${method}」\n\n现在就开始行动：\n1. 列出3个你想联系的营销大牛\n2. 准备好你的自我介绍\n3. 明确你能提供的价值\n4. 立即开始联系！`)
}

const learnMore = () => {
  alert('💡 提示：你可以这样问ChatGPT：\n\n"请给我100种接触营销大牛的创意方法，包括线上线下的各种渠道和策略。"\n\n让AI成为你的营销顾问！')
}

const startNow = () => {
  alert('🚀 行动清单：\n\n✓ 今天加3个营销相关的微信群\n✓ 关注5个营销大牛的社交账号\n✓ 发一条有价值的内容到朋友圈\n✓ 主动联系1个你想认识的人\n\n现在就开始！')
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
  background: #F8F9FA;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

/* 头部样式 */
.header {
  background: linear-gradient(135deg, #FF8C00 0%, #FFA500 100%);
  color: white;
  padding: 48px 24px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(255, 140, 0, 0.2);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.main-title {
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 16px;
  letter-spacing: 1px;
}

.subtitle {
  font-size: 18px;
  opacity: 0.95;
  font-weight: 400;
}

/* 主要内容区 */
.main-content {
  padding: 40px 24px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 核心理念区域 */
.hero-section {
  margin-bottom: 48px;
}

.hero-card {
  background: linear-gradient(135deg, #FFA500 0%, #FF8C00 100%);
  color: white;
  padding: 40px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(255, 140, 0, 0.25);
}

.hero-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 16px;
}

.hero-text {
  font-size: 18px;
  line-height: 1.8;
  opacity: 0.95;
}

/* 区块样式 */
.section {
  margin-bottom: 48px;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  color: #333333;
  margin-bottom: 24px;
  padding-left: 16px;
  border-left: 4px solid #FF8C00;
}

/* 卡片网格 */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

/* 卡片样式 */
.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(255, 140, 0, 0.2);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.expert-icon {
  font-size: 32px;
  margin-right: 12px;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: #333333;
}

.card-body {
  flex: 1;
  margin-bottom: 16px;
}

.card-description {
  font-size: 14px;
  color: #666666;
  line-height: 1.6;
  margin-bottom: 16px;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  display: inline-block;
  padding: 4px 12px;
  background: #FFF3E0;
  color: #FF8C00;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

.card-footer {
  margin-top: auto;
}

/* 按钮样式 */
.btn-action {
  width: 100%;
  padding: 12px 24px;
  background: #FF8C00;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-action:hover {
  background: #FF7F00;
  transform: scale(1.02);
}

/* 方法卡片 */
.method-card {
  position: relative;
  padding-top: 32px;
}

.method-number {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  background: #FF8C00;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
}

.method-title {
  font-size: 18px;
  font-weight: 600;
  color: #FF8C00;
  margin-bottom: 12px;
}

.method-description {
  font-size: 14px;
  color: #666666;
  line-height: 1.6;
  margin-bottom: 16px;
}

.btn-try {
  width: 100%;
  padding: 10px 20px;
  background: white;
  color: #FF8C00;
  border: 2px solid #FF8C00;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-try:hover {
  background: #FF8C00;
  color: white;
}

/* 策略网格 */
.strategy-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 16px;
}

.strategy-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.strategy-card:hover {
  box-shadow: 0 4px 16px rgba(255, 140, 0, 0.15);
}

.strategy-icon {
  width: 32px;
  height: 32px;
  background: #28A745;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  flex-shrink: 0;
}

.strategy-content {
  flex: 1;
}

.strategy-title {
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 8px;
}

.strategy-desc {
  font-size: 14px;
  color: #666666;
  line-height: 1.5;
}

/* 行动号召区域 */
.cta-section {
  margin-top: 48px;
  margin-bottom: 48px;
}

.cta-card {
  background: linear-gradient(135deg, #007BFF 0%, #0056D2 100%);
  color: white;
  padding: 48px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 123, 255, 0.25);
}

.cta-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 16px;
}

.cta-text {
  font-size: 16px;
  line-height: 1.8;
  margin-bottom: 32px;
  opacity: 0.95;
}

.cta-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary {
  padding: 16px 40px;
  background: #FFD700;
  color: #333333;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: #FFC700;
  transform: scale(1.05);
}

.btn-secondary {
  padding: 16px 40px;
  background: white;
  color: #007BFF;
  border: 2px solid white;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: transparent;
  color: white;
}

/* 页脚 */
.footer {
  background: #333333;
  color: white;
  text-align: center;
  padding: 32px 24px;
  font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-title {
    font-size: 28px;
  }

  .subtitle {
    font-size: 16px;
  }

  .hero-card {
    padding: 32px 24px;
  }

  .hero-title {
    font-size: 24px;
  }

  .hero-text {
    font-size: 16px;
  }

  .section-title {
    font-size: 24px;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }

  .strategy-grid {
    grid-template-columns: 1fr;
  }

  .cta-card {
    padding: 32px 24px;
  }

  .cta-title {
    font-size: 24px;
  }

  .cta-buttons {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 32px 16px;
  }

  .main-title {
    font-size: 24px;
  }

  .subtitle {
    font-size: 14px;
  }

  .main-content {
    padding: 24px 16px;
  }

  .hero-title {
    font-size: 20px;
  }

  .section-title {
    font-size: 20px;
  }

  .cta-title {
    font-size: 20px;
  }
}
</style>
