<template>
  <div class="file-explorer">
    <div class="explorer-header">
      <span class="header-title">文件资源管理器</span>
      <button @click="refreshFileTree" class="refresh-btn" title="刷新">↻</button>
    </div>
    <div class="explorer-content" v-if="fileTree">
      <FileTreeNode :node="fileTree" :depth="0" />
    </div>
    <div class="explorer-loading" v-else-if="loading">
      加载中...
    </div>
    <div class="explorer-error" v-else-if="error">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import FileTreeNode from './FileTreeNode.vue';

const fileTree = ref(null);
const loading = ref(false);
const error = ref(null);

const fetchFileTree = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get('/api/filetree');
    if (response.data.success) {
      fileTree.value = response.data.data.tree;
    } else {
      error.value = response.data.message || '获取文件树失败';
    }
  } catch (err) {
    console.error('获取文件树失败:', err);
    error.value = '获取文件树失败: ' + err.message;
  } finally {
    loading.value = false;
  }
};

const refreshFileTree = () => {
  fetchFileTree();
};

onMounted(() => {
  fetchFileTree();
});
</script>

<style scoped>
.file-explorer {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  border-right: 1px solid black;
  font-size: 13px;
}

.explorer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid black;
  background: white;
}

.header-title {
  font-weight: bold;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: black;
}

.refresh-btn {
  background: white;
  border: 1px solid black;
  color: black;
  cursor: pointer;
  padding: 2px 8px;
  font-size: 16px;
  line-height: 1;
}

.refresh-btn:hover {
  background: black;
  color: white;
}

.explorer-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 4px 0;
}

.explorer-loading,
.explorer-error {
  padding: 12px;
  text-align: center;
  color: black;
}

.explorer-error {
  color: #cc0000;
}
</style>
