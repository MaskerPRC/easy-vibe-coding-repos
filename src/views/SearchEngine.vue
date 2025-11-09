<template>
  <div class="retro-page">
    <!-- 顶部标题栏 -->
    <div class="header-bar">
      <marquee behavior="scroll" direction="left">
        欢迎使用复古搜索引擎 - 探索互联网的无限可能！ - Welcome to Retro Search Engine - Explore the Internet!
      </marquee>
    </div>

    <!-- 主标题 -->
    <center>
      <h1 class="main-title">
        <font color="#0000FF">🔍</font>
        <font color="#FF0000">复古搜索引擎</font>
        <font color="#0000FF">🔍</font>
      </h1>
      <p class="subtitle">Retro Search Engine - Since 1997</p>

      <br>
      <hr width="80%" size="3" color="#0000FF">
    </center>

    <!-- 主搜索区域 -->
    <center>
      <table width="90%" border="3" cellpadding="15" cellspacing="0" bgcolor="#C0C0C0">
        <tr>
          <td bgcolor="#000080">
            <center>
              <font color="#FFFF00" size="+2"><b>≡≡≡ 网络搜索中心 ≡≡≡</b></font>
            </center>
          </td>
        </tr>
        <tr>
          <td bgcolor="#E0E0E0">
            <center>
              <!-- 搜索框 -->
              <table border="2" cellpadding="10" bgcolor="#FFFFFF" width="80%">
                <tr>
                  <td>
                    <form @submit.prevent="performSearch">
                      <table width="100%" border="0">
                        <tr>
                          <td colspan="2" align="center">
                            <font size="+1"><b>请输入搜索关键词：</b></font>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" colspan="2">
                            <input
                              type="text"
                              v-model="searchQuery"
                              size="50"
                              style="font-size: 16px; padding: 5px;"
                              placeholder="输入您要搜索的内容..."
                            >
                          </td>
                        </tr>
                        <tr>
                          <td colspan="2" align="center">
                            <font size="-1"><b>选择搜索引擎：</b></font>
                          </td>
                        </tr>
                        <tr>
                          <td colspan="2" align="center">
                            <select v-model="selectedEngine" style="font-size: 14px; padding: 5px; width: 200px;">
                              <option value="baidu">百度 (Baidu)</option>
                              <option value="google">谷歌 (Google)</option>
                              <option value="bing">必应 (Bing)</option>
                              <option value="sogou">搜狗 (Sogou)</option>
                              <option value="360">360搜索</option>
                            </select>
                          </td>
                        </tr>
                        <tr>
                          <td colspan="2" align="center">
                            <br>
                            <button type="submit" style="font-size: 16px; padding: 10px 30px; cursor: pointer;">
                              <b>🔍 开始搜索</b>
                            </button>
                          </td>
                        </tr>
                      </table>
                    </form>
                  </td>
                </tr>
              </table>

              <br><br>

              <!-- 搜索引擎快捷入口 -->
              <table width="80%" border="2" cellpadding="10" bgcolor="#FFFF99">
                <tr>
                  <td bgcolor="#008080">
                    <center>
                      <font color="#FFFFFF" size="+1"><b>🌐 热门搜索引擎直达</b></font>
                    </center>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table width="100%" border="0" cellpadding="5">
                      <tr>
                        <td width="50%">
                          <b>• <a href="https://www.baidu.com" target="_blank">百度搜索</a></b> - 中文搜索领先者
                        </td>
                        <td width="50%">
                          <b>• <a href="https://www.google.com" target="_blank">Google搜索</a></b> - 全球最大搜索引擎
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <b>• <a href="https://www.bing.com" target="_blank">必应搜索</a></b> - 微软搜索引擎
                        </td>
                        <td>
                          <b>• <a href="https://www.sogou.com" target="_blank">搜狗搜索</a></b> - 智能搜索引擎
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <b>• <a href="https://www.so.com" target="_blank">360搜索</a></b> - 安全搜索引擎
                        </td>
                        <td>
                          <b>• <a href="https://duckduckgo.com" target="_blank">DuckDuckGo</a></b> - 隐私保护搜索
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </center>
          </td>
        </tr>
      </table>

      <br><br>

      <!-- 搜索历史 -->
      <table width="90%" border="3" cellpadding="10" cellspacing="0" bgcolor="#C0C0C0" v-if="searchHistory.length > 0">
        <tr>
          <td bgcolor="#800000">
            <center>
              <font color="#FFFF00" size="+1"><b>📜 最近搜索历史</b></font>
            </center>
          </td>
        </tr>
        <tr>
          <td bgcolor="#FFE4B5">
            <table width="100%" border="1" cellpadding="5">
              <tr bgcolor="#D3D3D3">
                <th width="10%">序号</th>
                <th width="30%">搜索内容</th>
                <th width="20%">搜索引擎</th>
                <th width="30%">搜索时间</th>
                <th width="10%">操作</th>
              </tr>
              <tr v-for="(item, index) in searchHistory" :key="index" bgcolor="#FFFFFF">
                <td align="center">{{ index + 1 }}</td>
                <td>{{ item.query }}</td>
                <td align="center">{{ getEngineName(item.engine) }}</td>
                <td align="center">{{ formatDate(item.timestamp) }}</td>
                <td align="center">
                  <a href="#" @click.prevent="searchAgain(item)" style="text-decoration: none;">
                    <b>[重新搜索]</b>
                  </a>
                </td>
              </tr>
            </table>
            <br>
            <center>
              <button @click="clearHistory" style="padding: 5px 15px; cursor: pointer;">
                <b>🗑️ 清空历史</b>
              </button>
            </center>
          </td>
        </tr>
      </table>

      <br>

      <!-- 返回链接 -->
      <p>
        <a href="#" @click.prevent="$router.push('/')">
          <b>&lt;&lt; 返回主页</b>
        </a>
      </p>

      <br>

      <!-- 页脚 -->
      <table border="1" cellpadding="5" bgcolor="#D3D3D3" width="80%">
        <tr>
          <td align="center">
            <font size="-1">
              <b>提示：</b> 选择您喜欢的搜索引擎，输入关键词即可开始搜索。搜索将在新窗口打开。
            </font>
          </td>
        </tr>
      </table>

      <br>
      <hr width="80%" size="3" color="#0000FF">

      <p>
        <font size="-1" color="#808080">
          © 1997 Retro Search Engine - Powered by Web 1.0 Technology
        </font>
      </p>
    </center>
  </div>
</template>

<script>
export default {
  name: 'SearchEngine',
  data() {
    return {
      searchQuery: '',
      selectedEngine: 'baidu',
      searchHistory: []
    }
  },
  mounted() {
    this.loadSearchHistory()
  },
  methods: {
    performSearch() {
      if (!this.searchQuery.trim()) {
        alert('请输入搜索关键词！')
        return
      }

      const searchEngines = {
        baidu: `https://www.baidu.com/s?wd=${encodeURIComponent(this.searchQuery)}`,
        google: `https://www.google.com/search?q=${encodeURIComponent(this.searchQuery)}`,
        bing: `https://www.bing.com/search?q=${encodeURIComponent(this.searchQuery)}`,
        sogou: `https://www.sogou.com/web?query=${encodeURIComponent(this.searchQuery)}`,
        360: `https://www.so.com/s?q=${encodeURIComponent(this.searchQuery)}`
      }

      const url = searchEngines[this.selectedEngine]

      // 保存搜索历史
      this.saveSearchHistory(this.searchQuery, this.selectedEngine)

      // 在新窗口打开搜索结果
      window.open(url, '_blank')
    },

    async saveSearchHistory(query, engine) {
      const historyItem = {
        query,
        engine,
        timestamp: new Date().toISOString()
      }

      this.searchHistory.unshift(historyItem)

      // 只保留最近20条
      if (this.searchHistory.length > 20) {
        this.searchHistory = this.searchHistory.slice(0, 20)
      }

      // 保存到后端
      try {
        await fetch('/api/search-history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.searchHistory)
        })
      } catch (error) {
        console.error('保存搜索历史失败:', error)
      }
    },

    async loadSearchHistory() {
      try {
        const response = await fetch('/api/search-history')
        if (response.ok) {
          const data = await response.json()
          this.searchHistory = data || []
        }
      } catch (error) {
        console.error('加载搜索历史失败:', error)
      }
    },

    async clearHistory() {
      if (confirm('确定要清空所有搜索历史吗？')) {
        this.searchHistory = []
        try {
          await fetch('/api/search-history', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify([])
          })
        } catch (error) {
          console.error('清空搜索历史失败:', error)
        }
      }
    },

    searchAgain(item) {
      this.searchQuery = item.query
      this.selectedEngine = item.engine
      this.performSearch()
    },

    getEngineName(engine) {
      const names = {
        baidu: '百度',
        google: '谷歌',
        bing: '必应',
        sogou: '搜狗',
        360: '360搜索'
      }
      return names[engine] || engine
    },

    formatDate(timestamp) {
      const date = new Date(timestamp)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }
  }
}
</script>

<style scoped>
.retro-page {
  background-color: #C0C0C0;
  min-height: 100vh;
  padding: 20px;
  font-family: "MS Sans Serif", "Microsoft Sans Serif", sans-serif;
}

.header-bar {
  background-color: #000080;
  color: #FFFFFF;
  padding: 5px;
  margin-bottom: 20px;
  border: 2px solid #000000;
}

.main-title {
  margin: 20px 0 10px 0;
  text-shadow: 2px 2px #000000;
}

.subtitle {
  color: #008080;
  font-style: italic;
  margin: 5px 0;
}

a {
  color: #0000FF;
  text-decoration: underline;
}

a:visited {
  color: #800080;
}

a:hover {
  color: #FF0000;
}

table {
  margin: 10px auto;
}

input[type="text"] {
  border: 2px inset #808080;
}

button {
  border: 2px outset #808080;
  background-color: #C0C0C0;
  font-family: "MS Sans Serif", sans-serif;
}

button:active {
  border-style: inset;
}

select {
  border: 2px inset #808080;
  background-color: #FFFFFF;
  font-family: "MS Sans Serif", sans-serif;
}
</style>
