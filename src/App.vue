<template>
  <div class="app">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="container">
        <h1 class="logo">商业规划框架</h1>
        <nav class="nav">
          <button
            @click="currentTab = 'framework'"
            :class="['nav-btn', { active: currentTab === 'framework' }]"
          >
            核心框架
          </button>
          <button
            @click="currentTab = 'notes'"
            :class="['nav-btn', { active: currentTab === 'notes' }]"
          >
            详细笔记
          </button>
          <button
            @click="currentTab = 'template'"
            :class="['nav-btn', { active: currentTab === 'template' }]"
          >
            一页纸模板
          </button>
        </nav>
      </div>
    </header>

    <!-- 主体内容 -->
    <main class="main">
      <div class="container">
        <!-- 核心框架标签页 -->
        <div v-show="currentTab === 'framework'" class="tab-content">
          <section class="section">
            <h2 class="section-title">四个核心问题</h2>
            <p class="section-desc">清晰回答这四个问题,让你的商业计划更具说服力</p>

            <div class="card-grid">
              <div v-for="(framework, index) in frameworks" :key="index" class="card">
                <div class="card-header">
                  <div class="card-number">{{ index + 1 }}</div>
                  <h3 class="card-title">{{ framework.title }}</h3>
                </div>
                <ul class="card-list">
                  <li v-for="(item, idx) in framework.items" :key="idx" class="card-list-item">
                    <strong>{{ item.label }}:</strong> {{ item.content }}
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        <!-- 详细笔记标签页 -->
        <div v-show="currentTab === 'notes'" class="tab-content">
          <section class="section">
            <h2 class="section-title">逐条解析</h2>
            <p class="section-desc">深入理解每个关键概念背后的商业逻辑</p>

            <div class="notes-container">
              <div v-for="(note, index) in notes" :key="index" class="note-card">
                <div class="note-header">
                  <h3 class="note-title">{{ note.title }}</h3>
                  <span class="note-tags">{{ note.tags }}</span>
                </div>
                <div class="note-content">
                  <div v-for="(point, idx) in note.points" :key="idx" class="note-point">
                    <h4 v-if="point.subtitle" class="point-subtitle">{{ point.subtitle }}</h4>
                    <p class="point-text">{{ point.text }}</p>
                    <ul v-if="point.subItems" class="point-list">
                      <li v-for="(sub, subIdx) in point.subItems" :key="subIdx">{{ sub }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- 一页纸模板标签页 -->
        <div v-show="currentTab === 'template'" class="tab-content">
          <section class="section">
            <h2 class="section-title">一页纸商业计划</h2>
            <p class="section-desc">用这个框架整理你的商业想法,让投资人一目了然</p>

            <div class="template-container">
              <div v-for="(item, index) in templateItems" :key="index" class="template-card">
                <div class="template-number">{{ index + 1 }}</div>
                <div class="template-content">
                  <h3 class="template-title">{{ item.title }}</h3>
                  <p class="template-desc">{{ item.description }}</p>
                  <div class="template-input">
                    <textarea
                      v-model="userAnswers[index]"
                      :placeholder="item.placeholder"
                      class="template-textarea"
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div class="template-actions">
                <button @click="exportPlan" class="btn-primary">导出计划</button>
                <button @click="clearAnswers" class="btn-secondary">清空内容</button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="container">
        <p class="footer-text">商业规划框架 © 2025 - 帮助创业者理清思路</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const currentTab = ref('framework');
const userAnswers = ref(Array(9).fill(''));

// 四大框架数据
const frameworks = [
  {
    title: '你在做的东西有什么价值?',
    items: [
      { label: '经济价值', content: '能赚多少钱 / 节省多少钱 / 多快能看到回报' },
      { label: '技术价值', content: '技术是不是有门槛,有没有壁垒' },
      { label: '核心要素', content: '必然性和信息差' }
    ]
  },
  {
    title: '时间维度怎么规划?',
    items: [
      { label: '起步时间', content: '冷启动需要多长时间' },
      { label: '数据验证', content: '多久能看到清晰的数据' },
      { label: '盈利周期', content: '什么时候考虑盈利或下一轮融资' }
    ]
  },
  {
    title: '人和钱从哪里来?',
    items: [
      { label: '团队背景', content: '技术团队的经验和能力' },
      { label: '资金来源', content: '天使投资人、个人投资者' },
      { label: '创业经验', content: '连续创业者的优势' }
    ]
  },
  {
    title: '商业模式和用户路径是否完整?',
    items: [
      { label: '目标客户', content: '2C / 2B / 2VC / 卖给大厂?' },
      { label: '盈利模式', content: '怎么赚钱,壁垒在哪' },
      { label: '用户获取', content: '用户在哪里,怎么找到,怎么转化' }
    ]
  }
];

// 详细笔记数据
const notes = [
  {
    title: '价值:经济+技术',
    tags: '1, 7, 9',
    points: [
      {
        subtitle: '经济价值',
        text: '不要只讲愿景和故事,要明确:',
        subItems: [
          '帮用户多赚钱?帮谁多挣?',
          '帮用户省成本?哪个环节省?'
        ]
      },
      {
        subtitle: '技术价值',
        text: '是否有技术壁垒和信息差:',
        subItems: [
          '必然性:技术或基础设施的必然需求',
          '信息差:比别人更早看到、更懂这个领域'
        ]
      },
      {
        subtitle: '钱迹',
        text: '理解钱从哪里来、怎么流动:',
        subItems: [
          '用户为什么掏钱?',
          '钱先到谁手里,再怎么分到你?',
          '一单的钱路径能不能画出来?'
        ]
      }
    ]
  },
  {
    title: '时间与选择',
    tags: '2, 8, 12, 13',
    points: [
      {
        subtitle: '时间维度',
        text: '包含几个关键时间点:',
        subItems: [
          '冷启动期:1-3个月要做到什么',
          '多久能有清晰的数据验证?',
          '多久考虑盈利/融资下一轮?'
        ]
      },
      {
        subtitle: '选择与两难',
        text: '明确当前必须做的选择:',
        subItems: [
          '先赚服务费还是先做产品?',
          '先2C还是先2B?',
          '每个选择的机会成本是什么?'
        ]
      },
      {
        subtitle: '冷启动策略',
        text: '广告投放要集中:',
        subItems: [
          '明确1-3个月用户目标数字',
          '控制获客成本(CAC)',
          '乘势而为:借助行业趋势和平台红利'
        ]
      }
    ]
  },
  {
    title: '团队与背景',
    tags: '3, 4, 10, 11, 14',
    points: [
      {
        subtitle: '资金来源',
        text: '几种钱的来源:',
        subItems: [
          '技术团队自己的钱',
          '天使投资人(看人很重)',
          '个人投资(熟人、专家、行业人士)'
        ]
      },
      {
        subtitle: '经历影响',
        text: '工作经历对项目方向的影响:',
        subItems: [
          '之前的公司/项目经验',
          '对行业和用户的理解',
          '背景如何转化为优势(资源、人脉、认知)'
        ]
      },
      {
        subtitle: '目标客户',
        text: '明确你的主要客户/对手盘:',
        subItems: [
          'To C: 赚用户的钱',
          'To B: 赚企业的钱',
          'To VC: 讲故事融钱',
          '卖给大厂: 技术能力或数据能力被并购'
        ]
      }
    ]
  },
  {
    title: '产品思维完整性',
    tags: '5, 6, 7',
    points: [
      {
        subtitle: '产品经理vs程序员',
        text: '两种思维方式的区别:',
        subItems: [
          '程序员:关注怎么实现、技术细节、稳定性',
          '产品经理:关注做什么、为谁做、为什么做'
        ]
      },
      {
        subtitle: '完整性要求',
        text: '成熟产品经理的思路链路:',
        subItems: [
          '用户画像、场景、痛点',
          '竞品分析:别人怎么解决,你的差异点',
          '全流程:看见→下载→使用→留存→付费',
          '数据和指标:每一步用什么数字衡量'
        ]
      }
    ]
  },
  {
    title: '商业模式与成本',
    tags: '12, 15, 16',
    points: [
      {
        subtitle: '盈利模式',
        text: '常见收费方式:',
        subItems: [
          '一次性、订阅、抽佣、广告、增值服务',
          '别人付费给谁:用户/商家/平台/品牌方?'
        ]
      },
      {
        subtitle: '壁垒来源',
        text: '竞争优势从哪里来:',
        subItems: [
          '数据积累、算法模型',
          '供应链/渠道资源',
          '品牌/社区/内容生态',
          '产品体验+网络效应'
        ]
      },
      {
        subtitle: '全流程成本',
        text: '从触达到付费的每一步:',
        subItems: [
          '触达→点击→注册→激活→留存→付费',
          '单人获客成本(CAC)',
          '用户生命周期价值(LTV)',
          'LTV/CAC≈3是健康假设'
        ]
      }
    ]
  }
];

// 一页纸模板
const templateItems = [
  {
    title: '我在做什么(一句话)',
    description: '用最简洁的语言描述你的项目核心',
    placeholder: '例如:一个帮助中小企业快速搭建在线商城的SaaS平台'
  },
  {
    title: '经济价值 & 技术价值',
    description: '分别说明能创造什么经济价值和技术价值',
    placeholder: '经济:帮商家节省80%建站成本\n技术:独创的模板引擎,5分钟生成商城'
  },
  {
    title: '目标用户是谁、在哪里、怎么触达',
    description: '精准定位你的用户群体和获客渠道',
    placeholder: '用户:年营收100-500万的淘宝店主\n位置:淘宝、拼多多平台\n触达:短视频教程+KOL合作'
  },
  {
    title: '竞品情况与差异化',
    description: '现在别人怎么做,你有什么不同',
    placeholder: '竞品:有赞、微盟\n差异:更低价格(5折),更简单操作(零代码)'
  },
  {
    title: '商业模式:谁付钱、怎么付、壁垒在哪',
    description: '清晰的盈利逻辑和竞争壁垒',
    placeholder: '收费:年费订阅制\n付费方:商家\n壁垒:200+行业模板库,2年积累'
  },
  {
    title: '冷启动1-3个月目标',
    description: '可量化的阶段性指标',
    placeholder: '1个月:100个种子用户\n2个月:500个付费用户\n3个月:月GMV达50万'
  },
  {
    title: '全流程用户路径 & 成本假设',
    description: '从看见到付费的完整链路和关键数据',
    placeholder: '看见→注册(转化率20%)→试用(激活率50%)→付费(转化率30%)\nCAC:200元,LTV:800元'
  },
  {
    title: '团队背景:为什么是我们',
    description: '团队的独特优势和相关经验',
    placeholder: '创始人:前阿里P8,5年电商SaaS经验\n技术:前美团核心研发,有类似系统经验'
  },
  {
    title: '关键选择与决策',
    description: '当前2-3个核心两难问题及你的选择',
    placeholder: '1. 先2B还是2C? → 选2B,现金流更稳定\n2. 自研还是外包? → 核心自研,周边外包'
  }
];

// 导出计划
const exportPlan = () => {
  let content = '# 商业计划 - 一页纸\n\n';
  templateItems.forEach((item, index) => {
    content += `## ${index + 1}. ${item.title}\n\n`;
    content += `${userAnswers.value[index] || '(待填写)'}\n\n`;
  });

  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `商业计划_${new Date().toISOString().split('T')[0]}.md`;
  a.click();
  URL.revokeObjectURL(url);
};

// 清空答案
const clearAnswers = () => {
  if (confirm('确定要清空所有内容吗?')) {
    userAnswers.value = Array(9).fill('');
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: #F8F8F8;
  font-family: 'PingFang SC', 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
}

/* 头部样式 */
.header {
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 20px;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: #2980B9;
  letter-spacing: 1px;
}

.nav {
  display: flex;
  gap: 8px;
}

.nav-btn {
  padding: 10px 20px;
  border: none;
  background: transparent;
  color: #666666;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: #F0F0F0;
  color: #2980B9;
}

.nav-btn.active {
  background: #2980B9;
  color: #ffffff;
}

/* 主体内容 */
.main {
  padding: 40px 0 80px;
}

.section {
  margin-bottom: 48px;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  color: #333333;
  margin-bottom: 12px;
  text-align: center;
}

.section-desc {
  font-size: 16px;
  color: #666666;
  text-align: center;
  margin-bottom: 40px;
}

/* 卡片网格 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(41, 128, 185, 0.15);
  border-color: #2980B9;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.card-number {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3498DB, #2980B9);
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  flex-shrink: 0;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  line-height: 1.4;
}

.card-list {
  list-style: none;
}

.card-list-item {
  padding: 12px 0;
  border-bottom: 1px solid #EEEEEE;
  font-size: 14px;
  color: #666666;
  line-height: 1.6;
}

.card-list-item:last-child {
  border-bottom: none;
}

.card-list-item strong {
  color: #2980B9;
  font-weight: 600;
}

/* 笔记容器 */
.notes-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.note-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #2980B9;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.note-title {
  font-size: 20px;
  font-weight: 600;
  color: #333333;
}

.note-tags {
  background: #E8F4F8;
  color: #2980B9;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.note-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.note-point {
  padding-left: 16px;
  border-left: 2px solid #EEEEEE;
}

.point-subtitle {
  font-size: 16px;
  font-weight: 600;
  color: #2980B9;
  margin-bottom: 8px;
}

.point-text {
  font-size: 15px;
  color: #666666;
  line-height: 1.6;
  margin-bottom: 8px;
}

.point-list {
  list-style: none;
  padding-left: 20px;
}

.point-list li {
  position: relative;
  padding-left: 20px;
  font-size: 14px;
  color: #666666;
  line-height: 1.8;
  margin-bottom: 6px;
}

.point-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #2ECC71;
  font-weight: 700;
}

/* 模板容器 */
.template-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.template-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  gap: 20px;
}

.template-number {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #2ECC71, #27AE60);
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  flex-shrink: 0;
}

.template-content {
  flex: 1;
}

.template-title {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 8px;
}

.template-desc {
  font-size: 14px;
  color: #999999;
  margin-bottom: 12px;
}

.template-input {
  margin-top: 12px;
}

.template-textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #EEEEEE;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  color: #333333;
  resize: vertical;
  transition: border-color 0.3s ease;
}

.template-textarea:focus {
  outline: none;
  border-color: #2980B9;
}

.template-textarea::placeholder {
  color: #CCCCCC;
}

.template-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 16px;
}

.btn-primary,
.btn-secondary {
  padding: 12px 32px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #3498DB, #2980B9);
  color: #ffffff;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(41, 128, 185, 0.3);
}

.btn-secondary {
  background: #EEEEEE;
  color: #666666;
}

.btn-secondary:hover {
  background: #E0E0E0;
}

/* 页脚 */
.footer {
  background: #ffffff;
  border-top: 1px solid #EEEEEE;
  padding: 24px 0;
}

.footer-text {
  text-align: center;
  font-size: 14px;
  color: #999999;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header .container {
    flex-direction: column;
    gap: 16px;
  }

  .logo {
    font-size: 20px;
  }

  .nav {
    width: 100%;
    justify-content: center;
  }

  .nav-btn {
    padding: 8px 16px;
    font-size: 14px;
  }

  .card-grid {
    grid-template-columns: 1fr;
  }

  .template-card {
    flex-direction: column;
  }

  .template-actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }

  .section-title {
    font-size: 24px;
  }
}
</style>
