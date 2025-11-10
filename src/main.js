import { createApp } from 'vue';
import App from './App.vue';

// 防止页面被嵌入到 iframe 中
if (window.self !== window.top) {
  // 检测到页面被嵌入到 iframe 中
  console.error('❌ 安全警告：检测到页面被嵌入到 iframe 中，已阻止显示！');
  // 尝试跳出 iframe
  try {
    window.top.location = window.self.location;
  } catch (e) {
    // 如果跳出失败（跨域限制），则隐藏页面内容
    document.body.innerHTML = '<h1 style="text-align:center;margin-top:50px;color:#ff4444;">⛔ 安全限制：此页面不允许在 iframe 中显示</h1>';
  }
}

createApp(App).mount('#app');

