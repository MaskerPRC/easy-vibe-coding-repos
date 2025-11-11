<template>
  <div class="app">
    <main class="content">
      <h1 class="title">欢迎</h1>
      <p class="subtitle">极简主义</p>
    </main>
  </div>
</template>

<script setup>
// 极简风格首页
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans CJK SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.content {
  text-align: center;
  padding: 40px;
}

.title {
  font-size: 48px;
  font-weight: 300;
  color: #333333;
  margin-bottom: 16px;
  letter-spacing: 2px;
}

.subtitle {
  font-size: 16px;
  font-weight: 300;
  color: #999999;
  letter-spacing: 4px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .title {
    font-size: 36px;
  }

  .subtitle {
    font-size: 14px;
    letter-spacing: 3px;
  }
}

@media (max-width: 480px) {
  .content {
    padding: 20px;
  }

  .title {
    font-size: 28px;
    letter-spacing: 1px;
  }

  .subtitle {
    font-size: 12px;
    letter-spacing: 2px;
  }
}
</style>
