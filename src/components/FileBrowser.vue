<template>
  <div class="file-browser">
    <div class="browser-header">
      <h1>文件浏览器</h1>
      <div class="path-info">
        <span class="label">当前路径:</span>
        <span class="path">{{ currentPath }}</span>
      </div>
    </div>

    <div class="browser-controls">
      <button @click="goToHome" class="control-btn">
        主目录 (~)
      </button>
      <button @click="goToParent" class="control-btn" :disabled="!canGoParent">
        上级目录
      </button>
      <button @click="refresh" class="control-btn">
        刷新
      </button>
      <button @click="toggleHidden" class="control-btn">
        {{ showHidden ? '隐藏 隐藏文件' : '显示 隐藏文件' }}
      </button>
    </div>

    <div v-if="loading" class="loading">
      加载中...
    </div>

    <div v-else-if="error" class="error-message">
      错误: {{ error }}
    </div>

    <div v-else class="file-list">
      <div class="file-count">
        共 {{ filteredFiles.length }} 项
      </div>

      <div class="table-container">
        <table class="file-table">
          <thead>
            <tr>
              <th class="name-col">名称</th>
              <th class="type-col">类型</th>
              <th class="size-col">大小</th>
              <th class="modified-col">修改时间</th>
              <th class="action-col">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="file in filteredFiles"
              :key="file.path"
              :class="['file-row', file.type, { hidden: file.isHidden }]"
            >
              <td class="name-col">
                <span class="icon">{{ file.type === 'directory' ? '📁' : '📄' }}</span>
                <span class="name">{{ file.name }}</span>
              </td>
              <td class="type-col">
                {{ file.type === 'directory' ? '目录' : '文件' }}
              </td>
              <td class="size-col">
                {{ formatSize(file.size) }}
              </td>
              <td class="modified-col">
                {{ formatDate(file.modified) }}
              </td>
              <td class="action-col">
                <button
                  v-if="file.type === 'directory'"
                  @click="openDirectory(file.path)"
                  class="action-btn"
                >
                  打开
                </button>
                <button
                  v-else
                  @click="viewFile(file)"
                  class="action-btn"
                >
                  查看
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 文件查看器模态框 -->
    <div v-if="viewingFile" class="modal-overlay" @click="closeFileViewer">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ viewingFile.name }}</h2>
          <button @click="closeFileViewer" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <div v-if="fileContent.loading" class="loading">
            加载文件内容中...
          </div>
          <div v-else-if="fileContent.error" class="error-message">
            {{ fileContent.error }}
          </div>
          <div v-else class="file-content">
            <pre><code>{{ fileContent.content }}</code></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const currentPath = ref('');
const files = ref([]);
const loading = ref(true);
const error = ref('');
const showHidden = ref(false);
const viewingFile = ref(null);
const fileContent = ref({
  content: '',
  loading: false,
  error: ''
});

// 过滤后的文件列表
const filteredFiles = computed(() => {
  if (showHidden.value) {
    return files.value;
  }
  return files.value.filter(file => !file.isHidden);
});

// 是否可以返回上级目录
const canGoParent = computed(() => {
  return currentPath.value !== '/' && currentPath.value !== '';
});

// 加载目录内容
const loadDirectory = async (path = '') => {
  loading.value = true;
  error.value = '';

  try {
    const url = path ? `/api/files?path=${encodeURIComponent(path)}` : '/api/files';
    const response = await fetch(url);
    const data = await response.json();

    if (data.success) {
      currentPath.value = data.path;
      files.value = data.files;
    } else {
      error.value = data.error || '加载失败';
    }
  } catch (err) {
    error.value = '网络请求失败: ' + err.message;
  } finally {
    loading.value = false;
  }
};

// 打开目录
const openDirectory = (path) => {
  loadDirectory(path);
};

// 返回上级目录
const goToParent = () => {
  if (!canGoParent.value) return;

  const parentPath = currentPath.value.split('/').slice(0, -1).join('/') || '/';
  loadDirectory(parentPath);
};

// 返回主目录
const goToHome = () => {
  loadDirectory('');
};

// 刷新当前目录
const refresh = () => {
  loadDirectory(currentPath.value);
};

// 切换显示隐藏文件
const toggleHidden = () => {
  showHidden.value = !showHidden.value;
};

// 查看文件
const viewFile = async (file) => {
  viewingFile.value = file;
  fileContent.value = {
    content: '',
    loading: true,
    error: ''
  };

  try {
    const response = await fetch(`/api/files/read?path=${encodeURIComponent(file.path)}`);
    const data = await response.json();

    if (data.success) {
      fileContent.value.content = data.content;
      fileContent.value.loading = false;
    } else {
      fileContent.value.error = data.error || '读取文件失败';
      fileContent.value.loading = false;
    }
  } catch (err) {
    fileContent.value.error = '网络请求失败: ' + err.message;
    fileContent.value.loading = false;
  }
};

// 关闭文件查看器
const closeFileViewer = () => {
  viewingFile.value = null;
  fileContent.value = {
    content: '',
    loading: false,
    error: ''
  };
};

// 格式化文件大小
const formatSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 组件挂载时加载主目录
onMounted(() => {
  loadDirectory();
});
</script>

<style scoped>
.file-browser {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  color: #FFFFFF;
}

.browser-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #FFFFFF;
}

.browser-header h1 {
  font-size: 2em;
  margin-bottom: 15px;
  color: #FFFFFF;
  font-family: 'Courier New', 'Fixedsys', monospace;
  letter-spacing: 2px;
}

.path-info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Courier New', monospace;
  font-size: 1em;
}

.path-info .label {
  color: #AAAAAA;
  font-weight: bold;
}

.path-info .path {
  color: #FFFFFF;
  background: #000088;
  padding: 8px 15px;
  border: 1px solid #AAAAAA;
  font-family: 'Courier New', monospace;
  word-break: break-all;
}

.browser-controls {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.control-btn {
  padding: 10px 20px;
  background: #0000AA;
  border: 2px solid #AAAAAA;
  color: #FFFFFF;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  transition: all 0.1s ease;
}

.control-btn:hover:not(:disabled) {
  background: #0000CC;
  border-color: #FFFFFF;
}

.control-btn:disabled {
  background: #000088;
  border-color: #666666;
  color: #888888;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  font-size: 1.5em;
  padding: 40px;
  color: #FFFFFF;
  font-family: 'Courier New', monospace;
}

.error-message {
  background: #AA0000;
  border: 2px solid #FFFFFF;
  padding: 15px;
  margin: 20px 0;
  color: #FFFFFF;
  font-family: 'Courier New', monospace;
  font-weight: bold;
}

.file-list {
  background: #000088;
  border: 2px solid #FFFFFF;
  padding: 15px;
}

.file-count {
  margin-bottom: 15px;
  color: #AAAAAA;
  font-family: 'Courier New', monospace;
  font-weight: bold;
}

.table-container {
  overflow-x: auto;
}

.file-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Courier New', monospace;
}

.file-table thead {
  background: #0000AA;
  border-bottom: 2px solid #FFFFFF;
}

.file-table th {
  padding: 12px 10px;
  text-align: left;
  color: #FFFFFF;
  font-weight: bold;
  border: 1px solid #AAAAAA;
}

.file-table tbody tr {
  border-bottom: 1px solid #666666;
}

.file-table tbody tr:hover {
  background: #0000CC;
}

.file-table td {
  padding: 10px;
  border: 1px solid #666666;
}

.file-row.hidden .name {
  color: #AAAAAA;
  font-style: italic;
}

.name-col {
  min-width: 300px;
}

.icon {
  margin-right: 8px;
  font-size: 1.2em;
}

.name {
  word-break: break-all;
}

.type-col {
  width: 100px;
}

.size-col {
  width: 120px;
  text-align: right;
}

.modified-col {
  width: 180px;
}

.action-col {
  width: 100px;
  text-align: center;
}

.action-btn {
  padding: 6px 15px;
  background: #0000AA;
  border: 1px solid #AAAAAA;
  color: #FFFFFF;
  font-size: 0.9em;
  cursor: pointer;
  font-family: 'Courier New', monospace;
}

.action-btn:hover {
  background: #0000CC;
  border-color: #FFFFFF;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #0000AA;
  border: 3px solid #FFFFFF;
  width: 90%;
  max-width: 900px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 2px solid #FFFFFF;
  background: #000088;
}

.modal-header h2 {
  color: #FFFFFF;
  font-family: 'Courier New', monospace;
  font-size: 1.3em;
  margin: 0;
}

.close-btn {
  background: #AA0000;
  border: 2px solid #FFFFFF;
  color: #FFFFFF;
  font-size: 1.5em;
  width: 35px;
  height: 35px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.close-btn:hover {
  background: #CC0000;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.file-content {
  background: #000066;
  border: 1px solid #AAAAAA;
  padding: 15px;
  overflow-x: auto;
}

.file-content pre {
  margin: 0;
  color: #FFFFFF;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.file-content code {
  color: #FFFFFF;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .file-browser {
    padding: 10px;
  }

  .browser-header h1 {
    font-size: 1.5em;
  }

  .path-info {
    flex-direction: column;
    align-items: flex-start;
  }

  .control-btn {
    padding: 8px 15px;
    font-size: 0.9em;
  }

  .file-table {
    font-size: 0.85em;
  }

  .name-col {
    min-width: 200px;
  }

  .modal-content {
    width: 95%;
  }
}
</style>
