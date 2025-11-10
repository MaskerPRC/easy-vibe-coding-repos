<template>
  <div class="jspspy-app">
    <header class="app-header">
      <div class="header-left">
        <h1 class="app-title">JSpspy - JavaScript Spy Tool</h1>
        <p class="app-subtitle">浏览器API拦截与监控工具</p>
      </div>
      <div class="header-center">
        <div class="view-tabs">
          <button
            @click="currentView = 'monitor'"
            class="tab-btn"
            :class="{ active: currentView === 'monitor' }">
            🎯 监控面板
          </button>
          <button
            @click="currentView = 'detector'"
            class="tab-btn"
            :class="{ active: currentView === 'detector' }">
            📊 项目检测
          </button>
          <button
            @click="currentView = 'birthday'"
            class="tab-btn"
            :class="{ active: currentView === 'birthday' }">
            🎂 生日快乐
          </button>
        </div>
      </div>
      <div class="header-right">
        <button v-if="currentView === 'monitor'" @click="exportData" class="btn btn-export">导出记录</button>
        <button v-if="currentView === 'monitor'" @click="clearRecords" class="btn btn-clear">清空记录</button>
      </div>
    </header>

    <!-- 监控面板视图 -->
    <div class="app-body" v-show="currentView === 'monitor'">
      <!-- 左侧：Hook控制面板 -->
      <aside class="control-panel">
        <div class="panel-header">
          <h2>Hook控制面板</h2>
          <div class="panel-actions">
            <button @click="enableAll" class="btn-small btn-success">全部启用</button>
            <button @click="disableAll" class="btn-small btn-danger">全部禁用</button>
          </div>
        </div>

        <div class="hook-list">
          <div v-for="(hook, name) in hooks" :key="name" class="hook-item">
            <div class="hook-info">
              <span class="hook-icon" :class="getHookIconClass(name)">{{ getHookIcon(name) }}</span>
              <div class="hook-details">
                <span class="hook-name">{{ getHookName(name) }}</span>
                <span class="hook-desc">{{ getHookDesc(name) }}</span>
              </div>
            </div>
            <label class="switch">
              <input
                type="checkbox"
                :checked="hook.enabled"
                @change="toggleHook(name)"
              />
              <span class="slider"></span>
            </label>
          </div>
        </div>

        <div class="stats-panel">
          <h3>统计信息</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">{{ totalRecords }}</div>
              <div class="stat-label">总记录数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ enabledHooksCount }}</div>
              <div class="stat-label">已启用Hook</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ getRecordsByType('network').length }}</div>
              <div class="stat-label">网络请求</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ getRecordsByType('storage').length }}</div>
              <div class="stat-label">存储操作</div>
            </div>
          </div>
        </div>
      </aside>

      <!-- 右侧：记录展示区域 -->
      <main class="records-panel">
        <div class="records-header">
          <h2>拦截记录</h2>
          <div class="records-filters">
            <select v-model="filterType" class="filter-select">
              <option value="">全部类型</option>
              <option value="network">网络请求</option>
              <option value="storage">存储操作</option>
              <option value="cookie">Cookie操作</option>
              <option value="console">控制台输出</option>
              <option value="timer">定时器</option>
              <option value="dangerous">危险操作</option>
            </select>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索记录..."
              class="search-input"
            />
          </div>
        </div>

        <div class="records-list" ref="recordsList">
          <div v-if="filteredRecords.length === 0" class="no-records">
            <div class="no-records-icon">🔍</div>
            <p>暂无拦截记录</p>
            <p class="no-records-hint">启用Hook后，所有API调用将被记录在这里</p>
          </div>

          <div
            v-for="record in filteredRecords"
            :key="record.id"
            class="record-item"
            :class="`record-type-${record.type}`"
          >
            <div class="record-header">
              <span class="record-type-badge" :class="`badge-${record.type}`">
                {{ getTypeName(record.type) }}
              </span>
              <span class="record-method">{{ record.method }}</span>
              <span class="record-time">{{ formatTime(record.timestamp) }}</span>
            </div>
            <div class="record-body">
              <pre class="record-data">{{ formatData(record.data) }}</pre>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- 测试按钮区域 - 只在监控视图显示 -->
    <div class="test-panel" v-show="currentView === 'monitor'">
      <h3>测试区域</h3>
      <div class="test-buttons">
        <button @click="testFetch" class="btn-test">测试Fetch</button>
        <button @click="testXHR" class="btn-test">测试XHR</button>
        <button @click="testLocalStorage" class="btn-test">测试LocalStorage</button>
        <button @click="testCookie" class="btn-test">测试Cookie</button>
        <button @click="testConsole" class="btn-test">测试Console</button>
        <button @click="testTimer" class="btn-test">测试Timer</button>
      </div>
    </div>

    <!-- 项目检测视图 -->
    <div class="detector-view" v-show="currentView === 'detector'">
      <ProjectDetector />
    </div>

    <!-- 生日快乐视图 -->
    <div class="birthday-view" v-show="currentView === 'birthday'">
      <BirthdayWish />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import jspspy from './utils/jspspy.js';
import ProjectDetector from './components/ProjectDetector.vue';
import BirthdayWish from './components/BirthdayWish.vue';

// 视图状态
const currentView = ref('monitor'); // 'monitor', 'detector', 或 'birthday'

// 状态
const hooks = ref({});
const records = ref([]);
const filterType = ref('');
const searchQuery = ref('');
const recordsList = ref(null);

// 计算属性
const totalRecords = computed(() => records.value.length);
const enabledHooksCount = computed(() => {
  return Object.values(hooks.value).filter(h => h.enabled).length;
});

const filteredRecords = computed(() => {
  let filtered = records.value;

  // 按类型过滤
  if (filterType.value) {
    filtered = filtered.filter(r => r.type === filterType.value);
  }

  // 按搜索词过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(r => {
      const dataStr = JSON.stringify(r.data).toLowerCase();
      const methodStr = r.method.toLowerCase();
      return dataStr.includes(query) || methodStr.includes(query);
    });
  }

  return filtered;
});

// Hook配置
const hookConfigs = {
  fetch: { name: 'Fetch API', desc: '拦截fetch请求', icon: '🌐' },
  xhr: { name: 'XMLHttpRequest', desc: '拦截XHR请求', icon: '📡' },
  localStorage: { name: 'LocalStorage', desc: '拦截本地存储', icon: '💾' },
  sessionStorage: { name: 'SessionStorage', desc: '拦截会话存储', icon: '📦' },
  cookie: { name: 'Cookie', desc: '拦截Cookie操作', icon: '🍪' },
  console: { name: 'Console', desc: '拦截控制台输出', icon: '📝' },
  setTimeout: { name: 'setTimeout', desc: '拦截延时器', icon: '⏱️' },
  setInterval: { name: 'setInterval', desc: '拦截定时器', icon: '⏰' },
  eval: { name: 'eval', desc: '拦截eval执行', icon: '⚠️' },
  Function: { name: 'Function构造器', desc: '拦截Function构造器', icon: '⚡' }
};

// 方法
const getHookName = (name) => hookConfigs[name]?.name || name;
const getHookDesc = (name) => hookConfigs[name]?.desc || '';
const getHookIcon = (name) => hookConfigs[name]?.icon || '📌';
const getHookIconClass = (name) => {
  if (name === 'eval' || name === 'Function') return 'icon-danger';
  return 'icon-normal';
};

const getTypeName = (type) => {
  const types = {
    network: '网络',
    storage: '存储',
    cookie: 'Cookie',
    console: '控制台',
    timer: '定时器',
    dangerous: '危险'
  };
  return types[type] || type;
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('zh-CN', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3
  });
};

const formatData = (data) => {
  return JSON.stringify(data, null, 2);
};

const getRecordsByType = (type) => {
  return records.value.filter(r => r.type === type);
};

const toggleHook = (name) => {
  if (hooks.value[name].enabled) {
    jspspy.disableHook(name);
  } else {
    jspspy.enableHook(name);
  }
  updateHookStatus();
};

const enableAll = () => {
  jspspy.enableAll();
  updateHookStatus();
};

const disableAll = () => {
  jspspy.disableAll();
  updateHookStatus();
};

const updateHookStatus = () => {
  hooks.value = jspspy.getStatus();
};

const clearRecords = () => {
  if (confirm('确定要清空所有记录吗？')) {
    jspspy.clearRecords();
    records.value = [];
  }
};

const exportData = () => {
  const data = jspspy.exportRecords();
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `jspspy-records-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

// 测试方法
const testFetch = async () => {
  try {
    await fetch('/api/health');
    alert('Fetch测试完成，请查看记录');
  } catch (error) {
    alert('Fetch测试失败: ' + error.message);
  }
};

const testXHR = () => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/api/health');
  xhr.send();
  alert('XHR测试完成，请查看记录');
};

const testLocalStorage = () => {
  localStorage.setItem('test-key', 'test-value');
  const value = localStorage.getItem('test-key');
  localStorage.removeItem('test-key');
  alert('LocalStorage测试完成，请查看记录');
};

const testCookie = () => {
  document.cookie = 'test=cookie-value';
  const cookies = document.cookie;
  alert('Cookie测试完成，请查看记录');
};

const testConsole = () => {
  console.log('This is a test log');
  console.warn('This is a test warning');
  console.error('This is a test error');
  alert('Console测试完成，请查看记录');
};

const testTimer = () => {
  setTimeout(() => {
    console.log('Timeout executed');
  }, 1000);
  setInterval(() => {
    console.log('Interval executed');
  }, 2000);
  alert('Timer测试完成，请查看记录');
};

// 监听记录更新
const onRecordAdded = (record) => {
  records.value = jspspy.getRecords();

  // 自动滚动到顶部
  if (recordsList.value) {
    recordsList.value.scrollTop = 0;
  }
};

// 生命周期
onMounted(() => {
  updateHookStatus();
  records.value = jspspy.getRecords();
  jspspy.addListener(onRecordAdded);
});

onUnmounted(() => {
  // 清理
});
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.jspspy-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #1a1a1a;
  color: #e0e0e0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

/* Header */
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background: #2d2d2d;
  border-bottom: 2px solid #00ff88;
}

.header-left {
  flex: 1;
}

.app-title {
  margin: 0;
  font-size: 28px;
  color: #00ff88;
  font-weight: 600;
}

.app-subtitle {
  margin: 5px 0 0 0;
  font-size: 14px;
  color: #999;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.view-tabs {
  display: flex;
  gap: 10px;
  background: #1a1a1a;
  padding: 5px;
  border-radius: 8px;
}

.tab-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  background: transparent;
  color: #999;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  background: #2d2d2d;
  color: #e0e0e0;
}

.tab-btn.active {
  background: #00ff88;
  color: #1a1a1a;
  font-weight: 600;
}

.header-right {
  display: flex;
  gap: 10px;
}

/* Buttons */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-export {
  background: #4a90e2;
  color: white;
}

.btn-export:hover {
  background: #357abd;
}

.btn-clear {
  background: #e74c3c;
  color: white;
}

.btn-clear:hover {
  background: #c0392b;
}

.btn-small {
  padding: 6px 12px;
  font-size: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-success {
  background: #27ae60;
  color: white;
}

.btn-success:hover {
  background: #229954;
}

.btn-danger {
  background: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background: #c0392b;
}

/* Body */
.app-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Control Panel */
.control-panel {
  width: 350px;
  min-width: 350px;
  background: #2d2d2d;
  border-right: 1px solid #444;
  overflow-y: auto;
  padding: 20px;
}

.panel-header {
  margin-bottom: 20px;
}

.panel-header h2 {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #00ff88;
}

.panel-actions {
  display: flex;
  gap: 10px;
}

/* Hook List */
.hook-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.hook-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.hook-item:hover {
  border-color: #00ff88;
  transform: translateX(5px);
}

.hook-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.hook-icon {
  font-size: 24px;
  width: 32px;
  text-align: center;
}

.icon-danger {
  filter: drop-shadow(0 0 3px #ff4444);
}

.hook-details {
  display: flex;
  flex-direction: column;
}

.hook-name {
  font-size: 14px;
  font-weight: 600;
  color: #e0e0e0;
}

.hook-desc {
  font-size: 12px;
  color: #999;
}

/* Toggle Switch */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #555;
  transition: 0.4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #00ff88;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

/* Stats Panel */
.stats-panel {
  margin-top: 30px;
  padding: 15px;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 8px;
}

.stats-panel h3 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #00ff88;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.stat-item {
  text-align: center;
  padding: 10px;
  background: #2d2d2d;
  border-radius: 6px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #00ff88;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

/* Records Panel */
.records-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1a1a1a;
  overflow: hidden;
}

.records-header {
  padding: 20px;
  background: #2d2d2d;
  border-bottom: 1px solid #444;
}

.records-header h2 {
  margin: 0 0 15px 0;
  font-size: 18px;
  color: #00ff88;
}

.records-filters {
  display: flex;
  gap: 10px;
}

.filter-select,
.search-input {
  padding: 10px;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 5px;
  color: #e0e0e0;
  font-size: 14px;
}

.filter-select {
  width: 150px;
}

.search-input {
  flex: 1;
}

.search-input::placeholder {
  color: #666;
}

/* Records List */
.records-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.no-records {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
}

.no-records-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.no-records p {
  margin: 5px 0;
}

.no-records-hint {
  font-size: 12px;
  color: #555;
}

/* Record Item */
.record-item {
  margin-bottom: 15px;
  background: #2d2d2d;
  border: 1px solid #444;
  border-left: 4px solid #00ff88;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.record-item:hover {
  border-left-width: 6px;
  transform: translateX(2px);
}

.record-type-network {
  border-left-color: #4a90e2;
}

.record-type-storage {
  border-left-color: #f39c12;
}

.record-type-cookie {
  border-left-color: #e67e22;
}

.record-type-console {
  border-left-color: #9b59b6;
}

.record-type-timer {
  border-left-color: #1abc9c;
}

.record-type-dangerous {
  border-left-color: #e74c3c;
}

.record-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  background: #1a1a1a;
  border-bottom: 1px solid #444;
}

.record-type-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-network {
  background: #4a90e2;
  color: white;
}

.badge-storage {
  background: #f39c12;
  color: white;
}

.badge-cookie {
  background: #e67e22;
  color: white;
}

.badge-console {
  background: #9b59b6;
  color: white;
}

.badge-timer {
  background: #1abc9c;
  color: white;
}

.badge-dangerous {
  background: #e74c3c;
  color: white;
}

.record-method {
  font-weight: 600;
  color: #00ff88;
}

.record-time {
  margin-left: auto;
  font-size: 12px;
  color: #999;
  font-family: monospace;
}

.record-body {
  padding: 15px;
}

.record-data {
  margin: 0;
  font-size: 12px;
  font-family: 'Courier New', monospace;
  color: #e0e0e0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* Test Panel */
.test-panel {
  padding: 20px;
  background: #2d2d2d;
  border-top: 2px solid #00ff88;
}

.test-panel h3 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #00ff88;
}

.test-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-test {
  padding: 10px 20px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-test:hover {
  background: #357abd;
  transform: translateY(-2px);
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #1a1a1a;
}

::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Detector View */
.detector-view {
  width: 100%;
  height: calc(100vh - 150px);
  overflow: hidden;
}

/* Birthday View */
.birthday-view {
  width: 100%;
  height: calc(100vh - 150px);
  overflow: hidden;
}

/* Responsive */
@media (max-width: 1024px) {
  .app-body {
    flex-direction: column;
  }

  .control-panel {
    width: 100%;
    max-height: 400px;
    border-right: none;
    border-bottom: 1px solid #444;
  }

  .header-center {
    margin: 10px 0;
  }

  .app-header {
    flex-wrap: wrap;
  }
}
</style>
