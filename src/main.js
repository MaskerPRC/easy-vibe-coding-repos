import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// 创建应用并使用路由
const app = createApp(App);
app.use(router);
app.mount('#app');

