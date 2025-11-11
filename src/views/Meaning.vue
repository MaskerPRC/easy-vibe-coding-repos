<template>
  <div class="meaning-page">
    <!-- 页面标题 -->
    <section class="page-header">
      <div class="container">
        <h1>生命的意义</h1>
        <p>探索存在的价值，找到属于你的人生目标</p>
      </div>
    </section>

    <!-- 主要内容 -->
    <section class="content-section">
      <div class="container">
        <!-- 什么是生命的意义 -->
        <div class="content-block">
          <h2>什么是生命的意义？</h2>
          <p>
            生命的意义是一个永恒的哲学问题。它不仅仅是关于我们为何存在，
            更是关于我们如何生活，如何创造价值，如何在有限的时间里留下无限的印记。
          </p>
          <p>
            每个人的生命意义都是独特的。它可能来自于：创造、爱、成长、帮助他人、
            追求真理、实现梦想，或是简单地享受当下的美好。
          </p>
        </div>

        <!-- 寻找意义的途径 -->
        <div class="paths-section">
          <h2>寻找意义的途径</h2>
          <div class="path-grid">
            <div class="path-card">
              <div class="path-number">1</div>
              <h3>自我认知</h3>
              <p>了解真实的自己，发现内心的热情和天赋</p>
            </div>
            <div class="path-card">
              <div class="path-number">2</div>
              <h3>建立联系</h3>
              <p>与他人建立深刻的情感连接，在关系中找到归属</p>
            </div>
            <div class="path-card">
              <div class="path-number">3</div>
              <h3>创造价值</h3>
              <p>通过工作、艺术或其他方式为世界贡献独特价值</p>
            </div>
            <div class="path-card">
              <div class="path-number">4</div>
              <h3>体验成长</h3>
              <p>在挑战中成长，在困难中发现生命的韧性</p>
            </div>
            <div class="path-card">
              <div class="path-number">5</div>
              <h3>服务他人</h3>
              <p>帮助他人，在付出中获得深层的满足感</p>
            </div>
            <div class="path-card">
              <div class="path-number">6</div>
              <h3>追求超越</h3>
              <p>探索精神层面，寻找超越物质的永恒价值</p>
            </div>
          </div>
        </div>

        <!-- 思考练习 -->
        <div class="reflection-section">
          <h2>思考练习</h2>
          <div class="reflection-box">
            <h3>关于生命意义的三个问题</h3>
            <ul class="question-list">
              <li>
                <strong>问题一：</strong>如果今天是生命的最后一天，你最想做什么？
              </li>
              <li>
                <strong>问题二：</strong>什么事情让你感到最有活力和充实？
              </li>
              <li>
                <strong>问题三：</strong>你希望在离开这个世界时留下什么？
              </li>
            </ul>
            <p class="reflection-tip">
              💡 提示：花时间认真思考这些问题，它们能帮助你更清楚地了解自己的人生方向。
            </p>
          </div>
        </div>

        <!-- 名人观点 -->
        <div class="quotes-section">
          <h2>关于生命意义的智慧</h2>
          <div class="quotes-grid">
            <div class="quote-box" v-for="quote in quotes" :key="quote.id">
              <p class="quote-text">"{{ quote.text }}"</p>
              <p class="quote-author">— {{ quote.author }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 名言列表（内存存储）
const quotes = ref([
  {
    id: 1,
    text: '生命的意义在于寻找意义本身',
    author: '维克多·弗兰克'
  },
  {
    id: 2,
    text: '你的时间有限，不要浪费在重复他人的生活上',
    author: '史蒂夫·乔布斯'
  },
  {
    id: 3,
    text: '生命不在于长短，而在于是否痛快地活过',
    author: '塞内加'
  },
  {
    id: 4,
    text: '人生的价值不在于你得到了什么，而在于你成为了什么样的人',
    author: '爱默生'
  }
])
</script>

<style scoped>
.meaning-page {
  min-height: 100vh;
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
  max-width: 1000px;
  margin: 0 auto;
}

.content-block {
  margin-bottom: 4rem;
}

.content-block h2 {
  color: #2d3748;
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.content-block p {
  color: #4a5568;
  line-height: 1.8;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

/* 途径卡片 */
.paths-section {
  margin-bottom: 4rem;
}

.paths-section h2 {
  color: #2d3748;
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

.path-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.path-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  position: relative;
}

.path-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.path-number {
  position: absolute;
  top: -15px;
  right: 20px;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.path-card h3 {
  color: #2d3748;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.path-card p {
  color: #718096;
  line-height: 1.6;
}

/* 思考练习 */
.reflection-section {
  margin-bottom: 4rem;
}

.reflection-section h2 {
  color: #2d3748;
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

.reflection-box {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.reflection-box h3 {
  color: #2d3748;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.question-list {
  list-style: none;
  padding: 0;
}

.question-list li {
  background: white;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  line-height: 1.6;
  color: #4a5568;
}

.question-list li strong {
  color: #f5576c;
}

.reflection-tip {
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  color: #2d3748;
  font-style: italic;
}

/* 名言区域 */
.quotes-section h2 {
  color: #2d3748;
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

.quotes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.quote-box {
  background: white;
  padding: 2rem;
  border-left: 4px solid #f5576c;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.quote-box:hover {
  transform: translateX(5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.quote-text {
  font-size: 1.1rem;
  font-style: italic;
  color: #2d3748;
  margin-bottom: 1rem;
  line-height: 1.8;
}

.quote-author {
  color: #718096;
  text-align: right;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }

  .page-header p {
    font-size: 1.1rem;
  }

  .path-grid,
  .quotes-grid {
    grid-template-columns: 1fr;
  }
}
</style>
