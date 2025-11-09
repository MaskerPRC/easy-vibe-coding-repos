import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// 自动跳转到百度
window.location.href = 'https://www.baidu.com';

const app = createApp(App);
app.use(router);
app.mount('#app');

