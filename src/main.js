import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);
app.use(router);
app.mount('#app');

// 每隔200毫秒检查并隐藏class为'chat-button'的按钮
setInterval(() => {
  const chatButton = document.querySelector('.chat-button');
  if (chatButton) {
    chatButton.style.display = 'none';
  }
}, 200);

