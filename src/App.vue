<template>
  <div class="bg-tech-dark text-gray-100 font-sans antialiased selection:bg-tea-green selection:text-white">
    <!-- 导航栏 -->
    <nav class="fixed w-full z-50 glass-effect top-0">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex-shrink-0 font-serif text-xl tracking-widest text-tea-light">
            长安 · <span class="text-tech-accent">AI</span> · 智茗
          </div>
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-8">
              <a href="#about" class="hover:text-tea-green px-3 py-2 rounded-md text-sm font-medium transition">空间理念</a>
              <a href="#events" class="hover:text-tea-green px-3 py-2 rounded-md text-sm font-medium transition">社群活动</a>
              <a href="#membership" class="bg-tea-green hover:bg-opacity-80 text-white px-4 py-2 rounded-full text-sm transition">加入社群</a>
            </div>
          </div>
          <!-- 移动端菜单按钮 -->
          <div class="md:hidden">
            <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-gray-300 hover:text-white">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <!-- 移动端菜单 -->
      <div v-if="mobileMenuOpen" class="md:hidden glass-effect">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a href="#about" @click="mobileMenuOpen = false" class="block hover:text-tea-green px-3 py-2 rounded-md text-base font-medium">空间理念</a>
          <a href="#events" @click="mobileMenuOpen = false" class="block hover:text-tea-green px-3 py-2 rounded-md text-base font-medium">社群活动</a>
          <a href="#membership" @click="mobileMenuOpen = false" class="block bg-tea-green hover:bg-opacity-80 text-white px-3 py-2 rounded-md text-base font-medium">加入社群</a>
        </div>
      </div>
    </nav>

    <!-- 英雄区 -->
    <div class="relative h-screen flex items-center justify-center bg-ink bg-gray-900">
      <div class="absolute inset-0 bg-black bg-opacity-60"></div>
      <div class="relative z-10 text-center px-4">
        <h1 class="font-serif text-5xl md:text-7xl font-bold text-white mb-6 tracking-wide">
          煮茶论道 <br class="md:hidden" /> <span class="text-transparent bg-clip-text bg-gradient-to-r from-tea-green to-tech-accent">算法修心</span>
        </h1>
        <p class="mt-4 text-xl text-gray-300 max-w-2xl mx-auto font-light">
          立足西安，连接未来。
          <br>在这里，古老的茶香与最前沿的生成式AI思想碰撞。
        </p>
        <div class="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <a href="#about" class="border border-white hover:bg-white hover:text-black text-white px-8 py-3 rounded text-lg transition">
            探索空间
          </a>
          <a href="#contact" class="bg-gradient-to-r from-tea-green to-green-700 hover:from-green-600 hover:to-green-800 text-white px-8 py-3 rounded text-lg transition shadow-lg shadow-green-900/50">
            成为会员
          </a>
        </div>
      </div>
      <div class="absolute right-10 top-1/4 hidden lg:block opacity-40">
        <p class="vertical-text font-serif text-4xl text-white border-r-2 border-white pr-4">长安三万里</p>
      </div>
      <div class="absolute left-10 bottom-1/4 hidden lg:block opacity-40">
        <p class="vertical-text font-serif text-4xl text-tea-green border-l-2 border-tea-green pl-4">代码一行山</p>
      </div>
    </div>

    <!-- 关于我们 -->
    <section id="about" class="py-20 bg-tech-dark">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-serif text-tea-light">硬科技之都的柔软角落</h2>
          <div class="w-16 h-1 bg-tea-green mx-auto mt-4"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div class="glass-effect p-8 rounded-xl hover:-translate-y-2 transition duration-300">
            <div class="text-4xl mb-4">🍵</div>
            <h3 class="text-xl font-bold text-white mb-2">新中式茶饮</h3>
            <p class="text-gray-400 text-sm leading-relaxed">
              严选秦岭以南高山原叶，结合现代冷萃工艺。在品茶的同时，让大脑从代码海洋中片刻抽离。
            </p>
          </div>
          <div class="glass-effect p-8 rounded-xl hover:-translate-y-2 transition duration-300 border-tech-accent border-opacity-30">
            <div class="text-4xl mb-4">🤖</div>
            <h3 class="text-xl font-bold text-white mb-2">AI 极客沙龙</h3>
            <p class="text-gray-400 text-sm leading-relaxed">
              每周举办 LLM、AIGC、具身智能主题分享。不仅是茶馆，更是西安AI创业者的情报局。
            </p>
          </div>
          <div class="glass-effect p-8 rounded-xl hover:-translate-y-2 transition duration-300">
            <div class="text-4xl mb-4">🏯</div>
            <h3 class="text-xl font-bold text-white mb-2">资源链接</h3>
            <p class="text-gray-400 text-sm leading-relaxed">
              连接西安高校、高新区资本与独立开发者。在古朴的环境中，促成最前沿的合作。
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 引用区 -->
    <div class="h-64 bg-fixed bg-center bg-cover bg-quote">
      <div class="h-full w-full bg-black bg-opacity-50 flex items-center justify-center">
        <p class="text-3xl font-serif text-white italic px-4">"茶气氤氲处，灵感自来时"</p>
      </div>
    </div>

    <!-- 社群活动 -->
    <section id="events" class="py-20 bg-gray-900">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 class="text-3xl font-serif text-white">近期活动</h2>
            <p class="text-gray-500 mt-2">Events & Workshops</p>
          </div>
          <a href="#" class="text-tea-green hover:text-white transition mt-4 md:mt-0">查看全部日历 -></a>
        </div>

        <div class="grid gap-6">
          <div
            v-for="event in events"
            :key="event.id"
            class="group relative bg-gray-800 rounded-lg overflow-hidden flex flex-col md:flex-row hover:bg-gray-700 transition"
          >
            <div class="md:w-1/3 h-48 md:h-auto bg-cover bg-center" :style="{ backgroundImage: `url(${event.image})` }"></div>
            <div class="p-6 flex-1">
              <div class="text-tea-green text-sm font-bold mb-2">{{ event.date }} | {{ event.time }}</div>
              <h3 class="text-2xl font-serif text-white mb-3 group-hover:text-tea-green transition">{{ event.title }}</h3>
              <p class="text-gray-400 mb-4">{{ event.description }}</p>
              <span class="inline-block bg-gray-900 px-3 py-1 rounded text-xs text-gray-300">{{ event.tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 联系我们 -->
    <section id="contact" class="py-20 bg-gradient-to-b from-tech-dark to-black text-center">
      <div class="max-w-3xl mx-auto px-4">
        <h2 class="text-4xl font-serif text-white mb-6">共建西安 AI 新生态</h2>
        <p class="text-gray-400 mb-10 text-lg">
          无论你是寻找灵感的程序员，还是寻找技术合伙人的创业者，<br class="hidden sm:block">
          长安智茗都为你留了一盏灯，一杯茶。
        </p>
        <form @submit.prevent="handleSubmit" class="flex flex-col sm:flex-row gap-4 justify-center">
          <input
            v-model="email"
            type="email"
            placeholder="输入您的邮箱订阅活动通知"
            class="px-6 py-4 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-tea-green w-full sm:w-auto"
            required
          >
          <button
            type="submit"
            class="px-8 py-4 rounded bg-tea-green text-white font-bold hover:bg-green-700 transition w-full sm:w-auto"
          >
            加入社群
          </button>
        </form>
        <p v-if="submitMessage" class="mt-4 text-tea-green">{{ submitMessage }}</p>
        <div class="mt-12 flex justify-center space-x-6 opacity-50">
          <span class="cursor-pointer hover:text-white transition">WeChat</span>
          <span class="cursor-pointer hover:text-white transition">Xiaohongshu</span>
          <span class="cursor-pointer hover:text-white transition">GitHub</span>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="bg-black py-8 text-center text-gray-600 text-sm">
      <p>&copy; 2023 Chang'an AI Tea Space. All rights reserved.</p>
      <p class="mt-2">📍 中国 · 西安 · 高新区 / 曲江新区</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 移动端菜单状态
const mobileMenuOpen = ref(false)

// 邮箱订阅
const email = ref('')
const submitMessage = ref('')

// 活动数据（存储在内存中）
const events = ref([
  {
    id: 1,
    date: '2024.12.15',
    time: '14:00 - 17:00',
    title: 'AIGC 落地实战：从Prompt到产品',
    description: '邀请大厂算法专家，现场演示Stable Diffusion工作流，并在茶歇期间进行分组实操。',
    tag: '限额 20 人',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    date: '2024.12.22',
    time: '19:00 - 21:00',
    title: '围炉夜话：独立开发者的出海之路',
    description: '冬日围炉煮茶，邀请三位西安本地成功出海的独立开发者分享他们的踩坑经验。',
    tag: '会员专属',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
])

// 表单提交处理
const handleSubmit = () => {
  if (email.value) {
    submitMessage.value = '感谢订阅！我们会及时将活动信息发送到您的邮箱。'
    setTimeout(() => {
      email.value = ''
      submitMessage.value = ''
    }, 3000)
  }
}
</script>

<style scoped>
.glass-effect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.vertical-text {
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

/* 模拟水墨晕染背景 */
.bg-ink {
  background-image: url('https://images.unsplash.com/photo-1528459061998-56fd57ad86e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80');
  background-size: cover;
  background-position: center;
  background-blend-mode: overlay;
}

/* 引用区背景 */
.bg-quote {
  background-image: url('https://images.unsplash.com/photo-1531973576160-7125cd663d86?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80');
}

/* 平滑滚动 */
html {
  scroll-behavior: smooth;
}
</style>
