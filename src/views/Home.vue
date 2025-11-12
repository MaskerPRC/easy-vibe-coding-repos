<template>
  <div class="home">
    <div class="header">
      <div class="logo">百度搜索</div>
    </div>

    <div class="search-container">
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="请输入搜索内容"
          @keyup.enter="handleSearch"
        />
        <button class="search-btn" @click="handleSearch">百度一下</button>
      </div>
    </div>

    <div class="footer">
      <p>百度搜索 - 简单可依赖</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const searchQuery = ref('')
const router = useRouter()

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      name: 'search',
      query: { q: searchQuery.value.trim() }
    })
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.header {
  padding: 20px 30px;
}

.logo {
  font-size: 28px;
  font-weight: 700;
  color: #2932e1;
  cursor: pointer;
}

.search-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  margin-top: -100px;
}

.search-box {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-input {
  width: 100%;
  height: 50px;
  padding: 0 20px;
  font-size: 16px;
  border: 2px solid #c4c7ce;
  border-radius: 10px;
  outline: none;
  transition: all 0.3s;
}

.search-input:hover {
  border-color: #a7aab3;
}

.search-input:focus {
  border-color: #4e6ef2;
  box-shadow: 0 0 0 3px rgba(78, 110, 242, 0.1);
}

.search-btn {
  width: 100%;
  height: 50px;
  background: #4e6ef2;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.search-btn:hover {
  background: #3d5ee1;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(78, 110, 242, 0.3);
}

.search-btn:active {
  transform: translateY(0);
}

.footer {
  padding: 30px;
  text-align: center;
  color: #999;
  font-size: 14px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .logo {
    font-size: 24px;
  }

  .search-container {
    margin-top: -50px;
  }

  .search-input,
  .search-btn {
    height: 44px;
  }

  .search-btn {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 15px 20px;
  }

  .logo {
    font-size: 20px;
  }

  .search-input,
  .search-btn {
    height: 40px;
    font-size: 15px;
  }
}
</style>
