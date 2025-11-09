<template>
  <div class="retro-page">
    <!-- 顶部标题栏 -->
    <div class="header-bar">
      <marquee behavior="scroll" direction="left">
        欢迎来到互联网导航中心 - 您的网络之旅从这里开始！ - Welcome to Internet Navigator - Your Gateway to the Web!
      </marquee>
    </div>

    <!-- 主标题 -->
    <center>
      <h1 class="main-title">
        <font color="#0000FF">★</font>
        <font color="#FF0000">网络导航中心</font>
        <font color="#0000FF">★</font>
      </h1>
      <p class="subtitle">Internet Navigator - Since 1997</p>

      <!-- 访问计数器 -->
      <table border="1" cellpadding="5" cellspacing="0" bgcolor="#FFFF99" class="counter">
        <tr>
          <td align="center">
            <b>您是第 <font color="#FF0000" size="+1">{{ visitorCount }}</font> 位访客</b>
          </td>
        </tr>
      </table>

      <br>
      <hr width="80%" size="3" color="#0000FF">
    </center>

    <!-- 主要内容区域 -->
    <center>
      <table width="90%" border="3" cellpadding="10" cellspacing="0" bgcolor="#C0C0C0">
        <tr>
          <td colspan="2" bgcolor="#000080">
            <center>
              <font color="#FFFF00" size="+2"><b>≡≡≡ 网站分类导航 ≡≡≡</b></font>
            </center>
          </td>
        </tr>

        <!-- 搜索引擎分类 -->
        <tr>
          <td width="30%" bgcolor="#008080" valign="top">
            <center>
              <font color="#FFFFFF" size="+1"><b>🔍 搜索引擎</b></font>
            </center>
          </td>
          <td bgcolor="#E0E0E0">
            <ul>
              <li><router-link to="/search"><b>🔍 复古搜索引擎</b></router-link> - 🌟 全新搜索工具（内置）</li>
              <li><a href="https://www.google.com" target="_blank">Google</a> - 最流行的搜索引擎</li>
              <li><a href="https://www.bing.com" target="_blank">Bing</a> - 微软搜索引擎</li>
              <li><a href="https://www.baidu.com" target="_blank">百度</a> - 中文搜索引擎</li>
              <li><a href="https://duckduckgo.com" target="_blank">DuckDuckGo</a> - 注重隐私的搜索</li>
            </ul>
          </td>
        </tr>

        <!-- 新闻门户 -->
        <tr>
          <td bgcolor="#008080" valign="top">
            <center>
              <font color="#FFFFFF" size="+1"><b>📰 新闻资讯</b></font>
            </center>
          </td>
          <td bgcolor="#FFFFFF">
            <ul>
              <li><a href="https://news.ycombinator.com" target="_blank">Hacker News</a> - 科技新闻</li>
              <li><a href="https://www.bbc.com" target="_blank">BBC News</a> - 国际新闻</li>
              <li><a href="https://www.reuters.com" target="_blank">Reuters</a> - 路透社</li>
              <li><a href="https://techcrunch.com" target="_blank">TechCrunch</a> - 科技媒体</li>
            </ul>
          </td>
        </tr>

        <!-- 社交媒体 -->
        <tr>
          <td bgcolor="#008080" valign="top">
            <center>
              <font color="#FFFFFF" size="+1"><b>👥 社交网络</b></font>
            </center>
          </td>
          <td bgcolor="#E0E0E0">
            <ul>
              <li><a href="https://twitter.com" target="_blank">Twitter</a> - 微博客平台</li>
              <li><a href="https://www.reddit.com" target="_blank">Reddit</a> - 社区讨论</li>
              <li><a href="https://github.com" target="_blank">GitHub</a> - 代码托管平台</li>
              <li><a href="https://stackoverflow.com" target="_blank">Stack Overflow</a> - 编程问答</li>
            </ul>
          </td>
        </tr>

        <!-- 学习资源 -->
        <tr>
          <td bgcolor="#008080" valign="top">
            <center>
              <font color="#FFFFFF" size="+1"><b>📚 学习教育</b></font>
            </center>
          </td>
          <td bgcolor="#FFFFFF">
            <ul>
              <li><a href="https://www.wikipedia.org" target="_blank">Wikipedia</a> - 维基百科</li>
              <li><a href="https://www.coursera.org" target="_blank">Coursera</a> - 在线课程</li>
              <li><a href="https://www.khanacademy.org" target="_blank">Khan Academy</a> - 可汗学院</li>
              <li><a href="https://developer.mozilla.org" target="_blank">MDN Web Docs</a> - Web开发文档</li>
            </ul>
          </td>
        </tr>

        <!-- 娱乐休闲 -->
        <tr>
          <td bgcolor="#008080" valign="top">
            <center>
              <font color="#FFFFFF" size="+1"><b>🎮 娱乐休闲</b></font>
            </center>
          </td>
          <td bgcolor="#E0E0E0">
            <ul>
              <li><a href="https://www.youtube.com" target="_blank">YouTube</a> - 视频分享平台</li>
              <li><a href="https://www.spotify.com" target="_blank">Spotify</a> - 音乐流媒体</li>
              <li><a href="https://www.twitch.tv" target="_blank">Twitch</a> - 游戏直播</li>
              <li><a href="https://www.imdb.com" target="_blank">IMDB</a> - 电影数据库</li>
            </ul>
          </td>
        </tr>

        <!-- 工具软件 -->
        <tr>
          <td bgcolor="#008080" valign="top">
            <center>
              <font color="#FFFFFF" size="+1"><b>🔧 实用工具</b></font>
            </center>
          </td>
          <td bgcolor="#FFFFFF">
            <ul>
              <li><router-link to="/random-site"><b>🎲 随机网站生成器</b></router-link> - 🌟 每5分钟自动生成新网站（内置）</li>
              <li><a href="https://mail.google.com" target="_blank">Gmail</a> - 电子邮件</li>
              <li><a href="https://translate.google.com" target="_blank">Google Translate</a> - 在线翻译</li>
              <li><a href="https://drive.google.com" target="_blank">Google Drive</a> - 云存储</li>
              <li><a href="https://www.notion.so" target="_blank">Notion</a> - 笔记工具</li>
            </ul>
          </td>
        </tr>

        <!-- 底部信息 -->
        <tr>
          <td colspan="2" bgcolor="#800080">
            <center>
              <font color="#FFFF00"><b>⭐ 本站特色 ⭐</b></font>
            </center>
          </td>
        </tr>
        <tr>
          <td colspan="2" bgcolor="#FFFACD">
            <center>
              <blink style="animation: blink 1s infinite;">
                <b>★ 每日更新 ★ 精选链接 ★ 完全免费 ★</b>
              </blink>
              <br><br>
              <img :src="constructionGif" alt="Under Construction" v-if="showConstruction" style="max-width: 100px;">
              <br>
              <font size="-1">
                <i>Best viewed with Internet Explorer 4.0 or Netscape Navigator 4.0</i><br>
                <i>最佳浏览分辨率: 800x600</i>
              </font>
            </center>
          </td>
        </tr>
      </table>

      <br>

      <!-- 友情链接 -->
      <table width="90%" border="2" cellpadding="8" bgcolor="#FFCCCC">
        <tr>
          <td>
            <center>
              <b>≡ 友情链接 ≡</b><br><br>
              <a href="#">网站A</a> |
              <a href="#">网站B</a> |
              <a href="#">网站C</a> |
              <a href="#">网站D</a> |
              <a href="#">网站E</a>
            </center>
          </td>
        </tr>
      </table>

      <br>

      <!-- 页脚 -->
      <hr width="80%" size="2" color="#FF0000">
      <p class="footer">
        <font size="-1">
          <b>网络导航中心</b><br>
          版权所有 © 1997-2025<br>
          网站管理员: webmaster@navigator.com<br>
          最后更新时间: {{ lastUpdate }}
        </font>
      </p>

      <br>

      <!-- 动态时间显示 -->
      <table border="2" cellpadding="5" bgcolor="#CCFFCC">
        <tr>
          <td align="center">
            <b>当前时间: <font color="#FF0000">{{ currentTime }}</font></b>
          </td>
        </tr>
      </table>

      <br><br>
    </center>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// 访客计数器
const visitorCount = ref(0);

// 当前时间
const currentTime = ref('');

// 最后更新时间
const lastUpdate = ref('');

// 是否显示施工图标
const showConstruction = ref(false);

// 施工中GIF（使用data URL）
const constructionGif = ref('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');

let timeInterval = null;

// 更新时间
const updateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  currentTime.value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 初始化
onMounted(() => {
  // 生成随机访客数
  visitorCount.value = Math.floor(Math.random() * 999999) + 100000;

  // 设置最后更新时间
  const now = new Date();
  lastUpdate.value = now.toLocaleDateString('zh-CN');

  // 开始更新时间
  updateTime();
  timeInterval = setInterval(updateTime, 1000);

  // 随机显示施工图标
  showConstruction.value = Math.random() > 0.5;
});

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
});
</script>

<style scoped>
.retro-page {
  background-color: #C0C0C0;
  font-family: 'Times New Roman', Times, serif;
  padding: 0;
  margin: 0;
  min-height: 100vh;
}

.header-bar {
  background-color: #000080;
  color: #FFFF00;
  padding: 5px;
  font-weight: bold;
  font-size: 14px;
}

.main-title {
  margin-top: 20px;
  margin-bottom: 5px;
  font-family: Arial, sans-serif;
  text-shadow: 2px 2px 4px #888888;
}

.subtitle {
  margin: 5px 0;
  font-style: italic;
  color: #666666;
}

.counter {
  margin: 15px auto;
  box-shadow: 3px 3px 5px #888888;
}

/* 表格样式 */
table {
  box-shadow: 5px 5px 10px #666666;
}

/* 链接样式 - 1997年经典蓝色下划线 */
a {
  color: #0000EE;
  text-decoration: underline;
}

a:visited {
  color: #551A8B;
}

a:hover {
  color: #FF0000;
  background-color: #FFFF00;
}

/* 列表样式 */
ul {
  margin: 5px 0;
  padding-left: 25px;
}

li {
  margin: 5px 0;
  line-height: 1.6;
}

/* 页脚样式 */
.footer {
  color: #333333;
  margin: 10px 0;
}

/* HR样式 */
hr {
  margin: 15px auto;
}

/* 闪烁动画 */
@keyframes blink {
  0%, 49% {
    opacity: 1;
  }
  50%, 100% {
    opacity: 0;
  }
}

/* Center标签支持 */
center {
  display: block;
  text-align: center;
}
</style>
