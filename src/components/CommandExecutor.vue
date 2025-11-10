<template>
  <div class="command-executor">
    <div class="executor-header">
      <h2>命令执行终端</h2>
      <div class="header-actions">
        <button @click="clearHistory" class="btn-clear">清空历史</button>
        <button @click="loadSystemInfo" class="btn-info">系统信息</button>
      </div>
    </div>

    <div class="command-input-area">
      <div class="input-row">
        <label>工作目录:</label>
        <input
          v-model="workingDirectory"
          class="input-cwd"
          placeholder="当前工作目录"
        />
      </div>
      <div class="input-row">
        <label>命令:</label>
        <input
          v-model="command"
          @keyup.enter="executeCommand"
          class="input-command"
          placeholder="输入命令... (按 Enter 执行)"
        />
        <button @click="executeCommand" :disabled="executing" class="btn-execute">
          {{ executing ? '执行中...' : '执行' }}
        </button>
      </div>
    </div>

    <div class="quick-commands">
      <h3>快捷命令</h3>
      <div class="commands-grid">
        <button
          v-for="cmd in quickCommands"
          :key="cmd.label"
          @click="setCommand(cmd.command)"
          class="btn-quick"
          :title="cmd.description"
        >
          {{ cmd.label }}
        </button>
      </div>
    </div>

    <div class="command-output">
      <h3>执行历史</h3>
      <div class="output-list" ref="outputList">
        <div v-if="commandHistory.length === 0" class="no-output">
          暂无命令执行记录
        </div>
        <div
          v-for="(item, index) in commandHistory"
          :key="index"
          class="output-item"
          :class="{ error: !item.success }"
        >
          <div class="output-header">
            <span class="output-command">$ {{ item.command }}</span>
            <span class="output-time">{{ formatTime(item.timestamp) }}</span>
          </div>
          <div class="output-cwd">
            <span class="label">目录:</span> {{ item.cwd }}
          </div>
          <div v-if="item.stdout" class="output-stdout">
            <div class="output-label">标准输出:</div>
            <pre>{{ item.stdout }}</pre>
          </div>
          <div v-if="item.stderr" class="output-stderr">
            <div class="output-label">错误输出:</div>
            <pre>{{ item.stderr }}</pre>
          </div>
          <div v-if="item.error" class="output-error">
            <div class="output-label">错误:</div>
            <pre>{{ item.error }}</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- 系统信息对话框 -->
    <div v-if="systemInfoDialog.show" class="dialog-overlay" @click.self="closeSystemInfo">
      <div class="dialog">
        <div class="dialog-header">
          <h3>系统信息</h3>
          <button @click="closeSystemInfo" class="btn-close">✕</button>
        </div>
        <div class="dialog-body">
          <div v-if="systemInfoDialog.loading" class="loading">加载中...</div>
          <div v-else class="system-info">
            <div class="info-section">
              <h4>基本信息</h4>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">平台:</span>
                  <span class="info-value">{{ systemInfo.platform }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">架构:</span>
                  <span class="info-value">{{ systemInfo.arch }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">主机名:</span>
                  <span class="info-value">{{ systemInfo.hostname }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">系统类型:</span>
                  <span class="info-value">{{ systemInfo.type }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">版本:</span>
                  <span class="info-value">{{ systemInfo.release }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Node版本:</span>
                  <span class="info-value">{{ systemInfo.nodeVersion }}</span>
                </div>
              </div>
            </div>
            <div class="info-section">
              <h4>资源信息</h4>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">CPU核心数:</span>
                  <span class="info-value">{{ systemInfo.cpus }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">总内存:</span>
                  <span class="info-value">{{ formatMemory(systemInfo.totalMemory) }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">空闲内存:</span>
                  <span class="info-value">{{ formatMemory(systemInfo.freeMemory) }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">运行时间:</span>
                  <span class="info-value">{{ formatUptime(systemInfo.uptime) }}</span>
                </div>
              </div>
            </div>
            <div class="info-section">
              <h4>工作目录</h4>
              <div class="info-value-full">{{ systemInfo.cwd }}</div>
            </div>
            <div class="info-section">
              <h4>用户信息</h4>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">用户名:</span>
                  <span class="info-value">{{ systemInfo.user?.username }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">主目录:</span>
                  <span class="info-value">{{ systemInfo.user?.homedir }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <button @click="closeSystemInfo" class="btn-secondary">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import axios from 'axios';

const command = ref('');
const workingDirectory = ref('');
const executing = ref(false);
const commandHistory = ref([]);
const outputList = ref(null);

const systemInfoDialog = ref({
  show: false,
  loading: false
});

const systemInfo = ref({});

const quickCommands = [
  { label: 'ls -la', command: 'ls -la', description: '列出目录详细信息' },
  { label: 'pwd', command: 'pwd', description: '显示当前目录' },
  { label: 'whoami', command: 'whoami', description: '显示当前用户' },
  { label: 'ps aux', command: 'ps aux', description: '显示所有进程' },
  { label: 'df -h', command: 'df -h', description: '磁盘使用情况' },
  { label: 'free -h', command: 'free -h', description: '内存使用情况' },
  { label: 'uname -a', command: 'uname -a', description: '系统信息' },
  { label: 'env', command: 'env', description: '环境变量' },
  { label: 'netstat -tulpn', command: 'netstat -tulpn', description: '网络连接' },
  { label: 'top -b -n 1', command: 'top -b -n 1', description: '系统资源' }
];

// 执行命令
const executeCommand = async () => {
  if (!command.value.trim()) {
    alert('请输入命令');
    return;
  }

  executing.value = true;

  try {
    const response = await axios.post('/api/command/exec', {
      command: command.value,
      cwd: workingDirectory.value || undefined
    });

    const result = {
      command: command.value,
      cwd: response.data.cwd || workingDirectory.value,
      success: response.data.success,
      stdout: response.data.stdout,
      stderr: response.data.stderr,
      error: response.data.error,
      timestamp: new Date()
    };

    commandHistory.value.unshift(result);

    // 自动滚动到顶部
    nextTick(() => {
      if (outputList.value) {
        outputList.value.scrollTop = 0;
      }
    });

    // 清空命令输入
    command.value = '';
  } catch (error) {
    const result = {
      command: command.value,
      cwd: workingDirectory.value,
      success: false,
      error: error.message,
      timestamp: new Date()
    };

    commandHistory.value.unshift(result);
  } finally {
    executing.value = false;
  }
};

// 设置命令
const setCommand = (cmd) => {
  command.value = cmd;
};

// 清空历史
const clearHistory = () => {
  if (confirm('确定清空所有命令历史吗？')) {
    commandHistory.value = [];
  }
};

// 加载系统信息
const loadSystemInfo = async () => {
  systemInfoDialog.value.show = true;
  systemInfoDialog.value.loading = true;

  try {
    const response = await axios.get('/api/system/info');

    if (response.data.success) {
      systemInfo.value = response.data.data;
      if (!workingDirectory.value) {
        workingDirectory.value = systemInfo.value.cwd;
      }
    }
  } catch (error) {
    alert('获取系统信息失败: ' + error.message);
  } finally {
    systemInfoDialog.value.loading = false;
  }
};

// 关闭系统信息
const closeSystemInfo = () => {
  systemInfoDialog.value.show = false;
};

// 格式化时间
const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('zh-CN', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

// 格式化内存
const formatMemory = (bytes) => {
  if (!bytes) return '-';
  const gb = bytes / 1024 / 1024 / 1024;
  return gb.toFixed(2) + ' GB';
};

// 格式化运行时间
const formatUptime = (seconds) => {
  if (!seconds) return '-';
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${days}天 ${hours}小时 ${minutes}分钟`;
};
</script>

<style scoped>
.command-executor {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #1a1a1a;
}

.executor-header {
  padding: 15px 20px;
  background: #2d2d2d;
  border-bottom: 2px solid #00ff88;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.executor-header h2 {
  margin: 0;
  color: #00ff88;
  font-size: 20px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.btn-clear,
.btn-info {
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.btn-clear {
  background: #e74c3c;
  color: white;
}

.btn-clear:hover {
  background: #c0392b;
}

.btn-info {
  background: #4a90e2;
  color: white;
}

.btn-info:hover {
  background: #357abd;
}

.command-input-area {
  padding: 20px;
  background: #2d2d2d;
  border-bottom: 1px solid #444;
}

.input-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.input-row:last-child {
  margin-bottom: 0;
}

.input-row label {
  color: #00ff88;
  font-weight: 600;
  min-width: 80px;
}

.input-cwd,
.input-command {
  flex: 1;
  padding: 10px;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 5px;
  color: #e0e0e0;
  font-family: 'Courier New', monospace;
  font-size: 14px;
}

.btn-execute {
  padding: 10px 30px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  min-width: 100px;
}

.btn-execute:hover:not(:disabled) {
  background: #229954;
}

.btn-execute:disabled {
  background: #555;
  cursor: not-allowed;
}

.quick-commands {
  padding: 20px;
  background: #2d2d2d;
  border-bottom: 1px solid #444;
}

.quick-commands h3 {
  margin: 0 0 15px 0;
  color: #00ff88;
  font-size: 16px;
}

.commands-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
}

.btn-quick {
  padding: 8px 12px;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 5px;
  color: #e0e0e0;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  transition: all 0.3s ease;
}

.btn-quick:hover {
  background: #4a90e2;
  border-color: #4a90e2;
  color: white;
}

.command-output {
  flex: 1;
  padding: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.command-output h3 {
  margin: 0 0 15px 0;
  color: #00ff88;
  font-size: 16px;
}

.output-list {
  flex: 1;
  overflow-y: auto;
}

.no-output {
  text-align: center;
  padding: 50px;
  color: #999;
  font-size: 16px;
}

.output-item {
  margin-bottom: 20px;
  background: #2d2d2d;
  border: 1px solid #444;
  border-left: 4px solid #27ae60;
  border-radius: 8px;
  overflow: hidden;
}

.output-item.error {
  border-left-color: #e74c3c;
}

.output-header {
  padding: 12px 15px;
  background: #1a1a1a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #444;
}

.output-command {
  color: #00ff88;
  font-family: 'Courier New', monospace;
  font-weight: 600;
}

.output-time {
  color: #999;
  font-size: 12px;
  font-family: monospace;
}

.output-cwd {
  padding: 8px 15px;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid #444;
  font-size: 12px;
  color: #999;
}

.output-cwd .label {
  color: #00ff88;
  font-weight: 600;
}

.output-stdout,
.output-stderr,
.output-error {
  padding: 15px;
}

.output-label {
  color: #00ff88;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 12px;
  text-transform: uppercase;
}

.output-stdout pre,
.output-stderr pre,
.output-error pre {
  margin: 0;
  padding: 12px;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 5px;
  color: #e0e0e0;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-x: auto;
}

.output-stderr pre {
  color: #f39c12;
}

.output-error pre {
  color: #e74c3c;
}

/* 对话框样式 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog {
  background: #2d2d2d;
  border-radius: 8px;
  border: 1px solid #444;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.dialog-header {
  padding: 15px 20px;
  border-bottom: 1px solid #444;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-header h3 {
  margin: 0;
  color: #00ff88;
  font-size: 18px;
}

.btn-close {
  background: none;
  border: none;
  color: #999;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close:hover {
  color: #e74c3c;
}

.dialog-body {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

.loading {
  text-align: center;
  padding: 50px;
  color: #999;
}

.system-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-section h4 {
  margin: 0 0 15px 0;
  color: #00ff88;
  font-size: 16px;
  border-bottom: 1px solid #444;
  padding-bottom: 8px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 12px;
}

.info-item {
  display: flex;
  gap: 10px;
}

.info-label {
  color: #999;
  font-weight: 600;
  min-width: 100px;
}

.info-value {
  color: #e0e0e0;
  font-family: 'Courier New', monospace;
}

.info-value-full {
  color: #e0e0e0;
  font-family: 'Courier New', monospace;
  padding: 10px;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 5px;
}

.dialog-footer {
  padding: 15px 20px;
  border-top: 1px solid #444;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-secondary {
  padding: 10px 20px;
  background: #555;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.btn-secondary:hover {
  background: #666;
}

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
</style>
