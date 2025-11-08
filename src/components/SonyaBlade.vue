<template>
  <div class="sonya-page">
    <!-- 头部横幅 -->
    <header class="hero-section">
      <div class="hero-content">
        <h1 class="title">SONYA BLADE</h1>
        <p class="subtitle">Special Forces Lieutenant</p>
        <div class="quote">"I'm not your typical American girl"</div>
      </div>
      <div class="hero-overlay"></div>
    </header>

    <!-- 导航栏 -->
    <nav class="navigation">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['nav-btn', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        {{ tab.name }}
      </button>
    </nav>

    <!-- 内容区域 -->
    <main class="content-section">
      <!-- 角色简介 -->
      <section v-if="activeTab === 'bio'" class="tab-content">
        <h2>角色简介</h2>
        <div class="bio-grid">
          <div class="bio-card">
            <h3>基本信息</h3>
            <ul class="info-list">
              <li><strong>真实姓名：</strong>Sonya Blade</li>
              <li><strong>职业：</strong>美国特种部队中尉</li>
              <li><strong>隶属：</strong>Outer World Investigation Agency (OIA)</li>
              <li><strong>首次登场：</strong>真人快打 (1992)</li>
              <li><strong>格斗风格：</strong>军事格斗术、Kenpo空手道</li>
            </ul>
          </div>
          <div class="bio-card">
            <h3>背景故事</h3>
            <p>Sonya Blade是真人快打系列中的标志性女性角色之一，也是游戏中首批可玩女性角色。她是一名坚韧的美国特种部队军官，专门追捕国际犯罪组织"黑龙"。</p>
            <p>在追捕黑龙成员Kano的过程中，Sonya意外卷入了真人快打锦标赛，从此踏上了保卫地球领域免受外界威胁的征程。</p>
          </div>
          <div class="bio-card">
            <h3>性格特点</h3>
            <p>Sonya以其坚强、独立和勇敢的性格著称。她是一位出色的战士，将职责置于个人感情之上。尽管外表冷酷，但她对队友极为忠诚，并致力于保护无辜者。</p>
          </div>
        </div>
      </section>

      <!-- 技能招式 -->
      <section v-if="activeTab === 'moves'" class="tab-content">
        <h2>特殊技能</h2>
        <div class="moves-grid">
          <div class="move-card" v-for="move in specialMoves" :key="move.name">
            <div class="move-header">
              <h3>{{ move.name }}</h3>
              <span class="move-type">{{ move.type }}</span>
            </div>
            <p class="move-desc">{{ move.description }}</p>
          </div>
        </div>
      </section>

      <!-- 关系网络 -->
      <section v-if="activeTab === 'relationships'" class="tab-content">
        <h2>人物关系</h2>
        <div class="relationships-grid">
          <div class="relationship-card" v-for="rel in relationships" :key="rel.name">
            <h3>{{ rel.name }}</h3>
            <span class="relation-type">{{ rel.relation }}</span>
            <p>{{ rel.description }}</p>
          </div>
        </div>
      </section>

      <!-- 时间线 -->
      <section v-if="activeTab === 'timeline'" class="tab-content">
        <h2>角色发展时间线</h2>
        <div class="timeline">
          <div class="timeline-item" v-for="event in timeline" :key="event.game">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <h3>{{ event.game }}</h3>
              <p>{{ event.description }}</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <p>真人快打角色专题 - Sonya Blade</p>
      <p class="disclaimer">本页面内容仅供娱乐和学习交流，所有权利归原版权方所有</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const activeTab = ref('bio');

const tabs = [
  { id: 'bio', name: '角色简介' },
  { id: 'moves', name: '技能招式' },
  { id: 'relationships', name: '人物关系' },
  { id: 'timeline', name: '发展时间线' }
];

const specialMoves = [
  {
    name: 'Energy Rings',
    type: '远程攻击',
    description: 'Sonya的标志性技能，发射紫色能量环攻击敌人。这是她最具代表性的招式之一。'
  },
  {
    name: 'Leg Grab',
    type: '投技',
    description: '使用强有力的双腿夹住对手并将其摔倒，展现了她的军事格斗训练。'
  },
  {
    name: 'Square Wave Punch',
    type: '特殊移动',
    description: '向空中跃起并发出强力上勾拳，可以打击空中和地面的敌人。'
  },
  {
    name: 'Arc Kick',
    type: '空中技',
    description: '在空中施展优雅而致命的踢击，结合了力量与技巧。'
  },
  {
    name: 'Drone Attack',
    type: '召唤技',
    description: '在新作中，Sonya可以召唤军事无人机协助作战，体现了现代军事科技。'
  }
];

const relationships = [
  {
    name: 'Johnny Cage',
    relation: '前夫',
    description: '尽管两人最初因性格不合产生冲突,但在并肩作战中逐渐产生感情并结婚。虽然最终离异,但仍然共同抚养女儿Cassie。'
  },
  {
    name: 'Cassie Cage',
    relation: '女儿',
    description: 'Sonya和Johnny Cage的女儿,继承了父母的战斗天赋。Sonya对她要求严格,希望她能成为出色的战士。'
  },
  {
    name: 'Jax Briggs',
    relation: '战友/搭档',
    description: '长期搭档和最信任的战友,两人在特种部队中并肩作战多年,彼此信任,配合默契。'
  },
  {
    name: 'Kano',
    relation: '宿敌',
    description: '黑龙组织成员,Sonya的头号追捕目标。两人之间的对抗贯穿整个系列,充满了个人恩怨。'
  },
  {
    name: 'Raiden',
    relation: '盟友',
    description: '雷电神,保卫地球领域的导师。Sonya在保卫地球的战斗中与其并肩作战。'
  }
];

const timeline = [
  {
    game: '真人快打 (1992)',
    description: '首次登场。Sonya作为特种部队军官追捕Kano,意外参加了真人快打锦标赛。'
  },
  {
    game: '真人快打2 (1993)',
    description: '被Shao Kahn囚禁在外域,最终逃脱并继续对抗外域的威胁。'
  },
  {
    game: '真人快打3 (1995)',
    description: '领导特种部队对抗外域入侵,在保卫地球的战斗中扮演关键角色。'
  },
  {
    game: '真人快打4 (1997)',
    description: '在和平时期继续追捕黑龙组织的残余势力。'
  },
  {
    game: '真人快打X (2015)',
    description: '成为特种部队将军,领导新一代战士。与Johnny Cage结婚并育有女儿Cassie。'
  },
  {
    game: '真人快打11 (2019)',
    description: '在时间线崩塌的危机中,不同时期的Sonya相遇。最终为保卫地球做出了巨大牺牲。'
  }
];
</script>

<style scoped>
.sonya-page {
  min-height: 100vh;
  background: #f8f9fa;
  color: #333;
  font-family: 'Arial', sans-serif;
}

/* 头部横幅 */
.hero-section {
  position: relative;
  height: 400px;
  background: #8b5cf6;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 20px;
}

.title {
  font-size: 4.5rem;
  font-weight: bold;
  margin: 0;
  text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.5rem;
  color: #ffd700;
}

.subtitle {
  font-size: 1.8rem;
  margin: 15px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  color: #ffd700;
  letter-spacing: 0.2rem;
}

.quote {
  font-size: 1.2rem;
  font-style: italic;
  margin-top: 20px;
  opacity: 0.9;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

/* 导航栏 */
.navigation {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 30px 20px;
  background: rgba(255, 255, 255, 0.95);
  flex-wrap: wrap;
}

.nav-btn {
  padding: 12px 30px;
  background: #ffffff;
  border: 2px solid #8b5cf6;
  color: #8b5cf6;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 5px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.nav-btn:hover {
  background: rgba(139, 92, 246, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.nav-btn.active {
  background: #8b5cf6;
  border-color: #8b5cf6;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

/* 内容区域 */
.content-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.tab-content h2 {
  font-size: 2.5rem;
  margin-bottom: 30px;
  text-align: center;
  color: #8b5cf6;
}

/* 角色简介网格 */
.bio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin-top: 30px;
}

.bio-card {
  background: #ffffff;
  border: 2px solid rgba(139, 92, 246, 0.3);
  border-radius: 10px;
  padding: 25px;
  transition: all 0.3s ease;
}

.bio-card:hover {
  border-color: #8b5cf6;
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3);
  transform: translateY(-5px);
}

.bio-card h3 {
  color: #ec4899;
  margin-bottom: 15px;
  font-size: 1.5rem;
}

.info-list {
  list-style: none;
  padding: 0;
}

.info-list li {
  padding: 8px 0;
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
  line-height: 1.6;
}

.info-list li:last-child {
  border-bottom: none;
}

.bio-card p {
  line-height: 1.8;
  color: #555;
  margin-bottom: 15px;
}

/* 技能招式网格 */
.moves-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.move-card {
  background: #ffffff;
  border: 2px solid rgba(139, 92, 246, 0.4);
  border-radius: 10px;
  padding: 20px;
  transition: all 0.3s ease;
}

.move-card:hover {
  border-color: #ec4899;
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(236, 72, 153, 0.4);
}

.move-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.move-header h3 {
  color: #ffd700;
  font-size: 1.3rem;
  margin: 0;
}

.move-type {
  background: rgba(245, 158, 11, 0.3);
  color: #fbbf24;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.85rem;
  border: 1px solid #f59e0b;
}

.move-desc {
  color: #555;
  line-height: 1.6;
  margin: 0;
}

/* 人物关系网格 */
.relationships-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.relationship-card {
  background: #ffffff;
  border: 2px solid rgba(236, 72, 153, 0.3);
  border-radius: 10px;
  padding: 20px;
  transition: all 0.3s ease;
}

.relationship-card:hover {
  border-color: #ec4899;
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(236, 72, 153, 0.3);
}

.relationship-card h3 {
  color: #8b5cf6;
  margin-bottom: 10px;
  font-size: 1.4rem;
}

.relation-type {
  display: inline-block;
  background: rgba(139, 92, 246, 0.3);
  color: #c4b5fd;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.9rem;
  margin-bottom: 12px;
  border: 1px solid #8b5cf6;
}

.relationship-card p {
  color: #555;
  line-height: 1.7;
  margin: 0;
}

/* 时间线 */
.timeline {
  position: relative;
  max-width: 800px;
  margin: 30px auto;
  padding-left: 40px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 10px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #8b5cf6;
}

.timeline-item {
  position: relative;
  margin-bottom: 30px;
}

.timeline-marker {
  position: absolute;
  left: -33px;
  top: 5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #8b5cf6;
  border: 3px solid #f8f9fa;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.3);
}

.timeline-content {
  background: #ffffff;
  border: 2px solid rgba(139, 92, 246, 0.3);
  border-radius: 10px;
  padding: 20px;
  transition: all 0.3s ease;
}

.timeline-content:hover {
  border-color: #8b5cf6;
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.3);
}

.timeline-content h3 {
  color: #ec4899;
  margin-bottom: 10px;
  font-size: 1.3rem;
}

.timeline-content p {
  color: #555;
  line-height: 1.7;
  margin: 0;
}

/* 页脚 */
.footer {
  background: rgba(255, 255, 255, 0.95);
  text-align: center;
  padding: 30px 20px;
  margin-top: 50px;
  border-top: 2px solid rgba(139, 92, 246, 0.3);
}

.footer p {
  margin: 8px 0;
  color: #666;
}

.disclaimer {
  font-size: 0.9rem;
  font-style: italic;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .title {
    font-size: 2.5rem;
    letter-spacing: 0.2rem;
  }

  .subtitle {
    font-size: 1.2rem;
  }

  .quote {
    font-size: 1rem;
  }

  .hero-section {
    height: 300px;
  }

  .tab-content h2 {
    font-size: 2rem;
  }

  .bio-grid,
  .moves-grid,
  .relationships-grid {
    grid-template-columns: 1fr;
  }

  .timeline {
    padding-left: 30px;
  }
}
</style>
