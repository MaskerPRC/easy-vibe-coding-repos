<template>
  <div class="cat-ascii-container">
    <div class="cat-header">
      <h1>猫咪字符画</h1>
      <p class="subtitle">ASCII Art Gallery</p>
    </div>

    <div class="cat-gallery">
      <div class="cat-card" v-for="(cat, index) in cats" :key="index">
        <div class="cat-title">{{ cat.name }}</div>
        <pre class="cat-art">{{ cat.art }}</pre>
        <div class="cat-description">{{ cat.description }}</div>
      </div>
    </div>

    <div class="control-panel">
      <button @click="addRandomCat" class="action-btn">随机生成猫咪</button>
      <button @click="clearCats" class="action-btn">清空画廊</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 预定义的猫咪字符画集合
const catTemplates = [
  {
    name: '坐着的猫咪',
    art: `
    /\\_/\\
   ( o.o )
    > ^ <
   /|   |\\
  (_|   |_)`,
    description: '一只乖巧坐着的小猫'
  },
  {
    name: '伸懒腰的猫',
    art: `
  /\\_/\\
 ( ^.^ )~~~
  > = <`,
    description: '伸个懒腰，好舒服呀'
  },
  {
    name: '睡觉的猫',
    art: `
   /\\_/\\
  ( -.- )
   > - <
  /     \\`,
    description: 'Zzz... 正在做美梦'
  },
  {
    name: '调皮的猫',
    art: `
    /\\_/\\
   ( ^w^ )
    > ^ <
   /|   |\\
  (  \\_/  )`,
    description: '淘气包来啦！'
  },
  {
    name: '好奇的猫',
    art: `
   /\\_/\\
  ( o_o )
   > ? <
  /|   |\\`,
    description: '这是什么东西呀？'
  },
  {
    name: '开心的猫',
    art: `
    /\\_/\\
   ( ^_^ )
    > v <
   /     \\
  /       \\`,
    description: '今天心情真好！'
  },
  {
    name: '跳跃的猫',
    art: `
      /\\_/\\
     ( o.o )
  ~~~~> ^ <~~~~
       / \\`,
    description: '看我飞起来！'
  },
  {
    name: '害羞的猫',
    art: `
   /\\_/\\
  ( >.< )
   > ~ <
  /|   |\\`,
    description: '有点不好意思呢...'
  },
  {
    name: '大花猫',
    art: `
    /\\_/\\
   ( @.@ )
    > ^ <
   /|   |\\
  (_|___|_)
    |   |`,
    description: '圆滚滚的大花猫'
  },
  {
    name: '小猫咪',
    art: `
  /\\_/\\
 ( °.° )
  > ^ <`,
    description: '我还是个宝宝'
  }
];

// 当前显示的猫咪列表
const cats = ref([catTemplates[0], catTemplates[1], catTemplates[2]]);

// 添加随机猫咪
const addRandomCat = () => {
  const randomIndex = Math.floor(Math.random() * catTemplates.length);
  const newCat = { ...catTemplates[randomIndex] };
  cats.value.push(newCat);

  // 最多显示10只猫
  if (cats.value.length > 10) {
    cats.value.shift();
  }
};

// 清空猫咪
const clearCats = () => {
  cats.value = [];
};
</script>

<style scoped>
.cat-ascii-container {
  min-height: 100vh;
  padding: 30px;
  background: #0000AA;
  color: #FFFFFF;
}

.cat-header {
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 2px solid #FFFFFF;
}

.cat-header h1 {
  font-size: 2.5em;
  font-weight: bold;
  font-family: 'Courier New', 'Fixedsys', monospace;
  letter-spacing: 3px;
  margin-bottom: 10px;
  text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.5);
}

.subtitle {
  font-size: 1.2em;
  color: #AAAAAA;
  font-family: 'Courier New', monospace;
  letter-spacing: 2px;
}

.cat-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.cat-card {
  background: #000088;
  border: 3px solid #FFFFFF;
  padding: 20px;
  border-radius: 0;
  transition: all 0.3s ease;
  box-shadow: 5px 5px 0px rgba(0, 0, 0, 0.5);
}

.cat-card:hover {
  transform: translateY(-5px);
  box-shadow: 8px 8px 0px rgba(0, 0, 0, 0.7);
  background: #0000CC;
}

.cat-title {
  font-size: 1.3em;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
  color: #FFFFFF;
  font-family: 'Courier New', monospace;
  letter-spacing: 1px;
  border-bottom: 1px solid #AAAAAA;
  padding-bottom: 10px;
}

.cat-art {
  font-size: 1.2em;
  line-height: 1.2;
  color: #FFFFFF;
  font-family: 'Courier New', monospace;
  white-space: pre;
  text-align: center;
  margin: 20px 0;
  background: #000066;
  padding: 20px;
  border: 1px solid #AAAAAA;
  overflow-x: auto;
}

.cat-description {
  text-align: center;
  color: #CCCCCC;
  font-style: italic;
  font-size: 1em;
  font-family: 'Courier New', monospace;
  margin-top: 10px;
}

.control-panel {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  padding-top: 30px;
  border-top: 2px solid #FFFFFF;
}

.action-btn {
  padding: 15px 30px;
  background: #0000AA;
  border: 3px solid #FFFFFF;
  border-radius: 0;
  color: #FFFFFF;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Courier New', monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 3px 3px 0px rgba(0, 0, 0, 0.5);
}

.action-btn:hover {
  background: #0000CC;
  transform: translateY(-2px);
  box-shadow: 5px 5px 0px rgba(0, 0, 0, 0.7);
}

.action-btn:active {
  transform: translateY(0);
  box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.5);
}

/* 滚动条样式 */
.cat-art::-webkit-scrollbar {
  height: 8px;
}

.cat-art::-webkit-scrollbar-track {
  background: #000044;
}

.cat-art::-webkit-scrollbar-thumb {
  background: #AAAAAA;
  border: 1px solid #FFFFFF;
}

.cat-art::-webkit-scrollbar-thumb:hover {
  background: #CCCCCC;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cat-ascii-container {
    padding: 15px;
  }

  .cat-header h1 {
    font-size: 1.8em;
  }

  .cat-gallery {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .cat-art {
    font-size: 1em;
    padding: 15px;
  }

  .control-panel {
    flex-direction: column;
    gap: 15px;
  }

  .action-btn {
    width: 100%;
    padding: 12px 20px;
  }
}
</style>
