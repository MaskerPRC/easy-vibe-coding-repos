<template>
  <div class="xss-demo-container">
    <div class="demo-header">
      <h1>🔓 XSS 漏洞演示靶场</h1>
      <p class="subtitle">Cross-Site Scripting (XSS) 安全教育演示</p>
    </div>

    <div class="demo-section">
      <div class="alert-box">
        <h2>⚠️ 警告</h2>
        <p>这是一个教育性的安全演示环境，用于学习和理解XSS漏洞。</p>
        <p>请勿用于非法目的！</p>
      </div>

      <div class="demo-content">
        <h3>什么是 XSS 攻击？</h3>
        <p>跨站脚本攻击（Cross-Site Scripting，XSS）是一种网络安全漏洞，允许攻击者在网页中注入恶意脚本。</p>

        <div class="example-box">
          <h4>演示示例：</h4>
          <p>当您进入此页面时，已经触发了一个XSS演示脚本：</p>
          <code>alert('xss')</code>
        </div>

        <div class="info-box">
          <h4>XSS 的类型：</h4>
          <ul>
            <li><strong>反射型 XSS：</strong> 恶意脚本通过URL参数传递并立即执行</li>
            <li><strong>存储型 XSS：</strong> 恶意脚本被存储在服务器中，每次访问都会执行</li>
            <li><strong>DOM型 XSS：</strong> 通过修改页面的DOM结构来执行恶意脚本</li>
          </ul>
        </div>

        <div class="prevention-box">
          <h4>如何防御 XSS 攻击：</h4>
          <ul>
            <li>对用户输入进行严格的过滤和转义</li>
            <li>使用内容安全策略（CSP）</li>
            <li>设置HttpOnly Cookie标志</li>
            <li>使用现代框架的自动转义功能</li>
            <li>永远不要使用 innerHTML 或 eval() 处理用户输入</li>
          </ul>
        </div>

        <div class="interactive-demo">
          <h4>交互式演示区域：</h4>
          <p>输入框（已做安全处理，不会执行脚本）：</p>
          <input
            v-model="userInput"
            type="text"
            placeholder="尝试输入 <script>alert('test')</script>"
            class="demo-input"
          />
          <p class="output-label">安全输出（已转义）：</p>
          <div class="safe-output">{{ userInput }}</div>
          <p class="output-label">如果不安全（仅展示代码，未执行）：</p>
          <div class="unsafe-output-demo">
            <code v-html="highlightCode(userInput)"></code>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <p>🎓 本演示仅用于安全教育目的</p>
      <p>学习网络安全，保护数字世界</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const userInput = ref('');

// 页面加载时触发 XSS 演示
onMounted(() => {
  // 演示 XSS 弹框
  alert('xss');
});

// 高亮显示代码（安全方式）
const highlightCode = (text) => {
  // 转义HTML标签，防止实际执行
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  return `<span style="color: #ff6b6b;">${escaped}</span>`;
};
</script>

<style scoped>
.xss-demo-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  color: #ffffff;
}

.demo-header {
  text-align: center;
  padding: 40px 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
}

.demo-header h1 {
  font-size: 3em;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.subtitle {
  font-size: 1.2em;
  opacity: 0.9;
}

.demo-section {
  max-width: 1200px;
  margin: 0 auto;
}

.alert-box {
  background: #ff6b6b;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 30px;
  border: 3px solid #ff5252;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.alert-box h2 {
  margin-top: 0;
  font-size: 1.8em;
}

.demo-content {
  background: rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.demo-content h3 {
  color: #ffd700;
  font-size: 2em;
  margin-top: 0;
  border-bottom: 2px solid #ffd700;
  padding-bottom: 10px;
}

.demo-content h4 {
  color: #ffd700;
  font-size: 1.5em;
  margin-top: 20px;
}

.example-box,
.info-box,
.prevention-box,
.interactive-demo {
  background: rgba(0, 0, 0, 0.3);
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
  border-left: 4px solid #ffd700;
}

.example-box code {
  display: block;
  background: #1e1e1e;
  padding: 10px;
  border-radius: 5px;
  color: #4ec9b0;
  font-family: 'Courier New', monospace;
  margin-top: 10px;
}

.info-box ul,
.prevention-box ul {
  margin: 10px 0;
  padding-left: 20px;
}

.info-box li,
.prevention-box li {
  margin: 10px 0;
  line-height: 1.6;
}

.demo-input {
  width: 100%;
  padding: 12px;
  font-size: 1em;
  border: 2px solid #ffd700;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  margin: 10px 0;
}

.output-label {
  margin-top: 15px;
  font-weight: bold;
  color: #ffd700;
}

.safe-output,
.unsafe-output-demo {
  background: #1e1e1e;
  padding: 15px;
  border-radius: 5px;
  margin: 10px 0;
  min-height: 40px;
  color: #4ec9b0;
  font-family: 'Courier New', monospace;
  word-break: break-all;
}

.unsafe-output-demo {
  border: 2px solid #ff6b6b;
}

.footer {
  text-align: center;
  padding: 30px;
  margin-top: 30px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

.footer p {
  margin: 10px 0;
  font-size: 1.1em;
}

@media (max-width: 768px) {
  .demo-header h1 {
    font-size: 2em;
  }

  .demo-content {
    padding: 20px;
  }

  .demo-content h3 {
    font-size: 1.5em;
  }

  .demo-content h4 {
    font-size: 1.2em;
  }
}
</style>
