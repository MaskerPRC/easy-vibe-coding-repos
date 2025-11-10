<template>
  <div class="file-manager">
    <div class="file-header">
      <div class="path-bar">
        <input
          v-model="currentPath"
          @keyup.enter="loadDirectory"
          class="path-input"
          placeholder="输入路径..."
        />
        <button @click="loadDirectory" class="btn-load">刷新</button>
        <button @click="goToParent" class="btn-parent">上级目录</button>
      </div>
      <div class="actions-bar">
        <button @click="showCreateDialog('file')" class="btn-action">新建文件</button>
        <button @click="showCreateDialog('directory')" class="btn-action">新建目录</button>
        <button @click="showUploadDialog" class="btn-action">上传文件</button>
      </div>
    </div>

    <div class="file-list">
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="files.length === 0" class="no-files">目录为空</div>
      <table v-else class="file-table">
        <thead>
          <tr>
            <th>名称</th>
            <th>大小</th>
            <th>修改时间</th>
            <th>权限</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="file in files" :key="file.path" :class="{ directory: file.isDirectory }">
            <td @click="handleFileClick(file)" class="file-name">
              <span class="file-icon">{{ file.isDirectory ? '📁' : '📄' }}</span>
              {{ file.name }}
            </td>
            <td>{{ formatSize(file.size) }}</td>
            <td>{{ formatDate(file.modified) }}</td>
            <td>{{ file.permissions || '-' }}</td>
            <td class="actions">
              <button v-if="file.isFile" @click="editFile(file)" class="btn-small btn-edit">编辑</button>
              <button v-if="file.isFile" @click="downloadFile(file)" class="btn-small btn-download">下载</button>
              <button @click="deleteFile(file)" class="btn-small btn-delete">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 文件编辑器对话框 -->
    <div v-if="editDialog.show" class="dialog-overlay" @click.self="closeEditDialog">
      <div class="dialog">
        <div class="dialog-header">
          <h3>编辑文件: {{ editDialog.fileName }}</h3>
          <button @click="closeEditDialog" class="btn-close">✕</button>
        </div>
        <div class="dialog-body">
          <textarea
            v-model="editDialog.content"
            class="file-editor"
            placeholder="文件内容..."
          ></textarea>
        </div>
        <div class="dialog-footer">
          <button @click="saveFile" class="btn-primary">保存</button>
          <button @click="closeEditDialog" class="btn-secondary">取消</button>
        </div>
      </div>
    </div>

    <!-- 创建文件/目录对话框 -->
    <div v-if="createDialog.show" class="dialog-overlay" @click.self="closeCreateDialog">
      <div class="dialog dialog-small">
        <div class="dialog-header">
          <h3>{{ createDialog.type === 'file' ? '新建文件' : '新建目录' }}</h3>
          <button @click="closeCreateDialog" class="btn-close">✕</button>
        </div>
        <div class="dialog-body">
          <input
            v-model="createDialog.name"
            @keyup.enter="createItem"
            class="input-text"
            :placeholder="createDialog.type === 'file' ? '文件名' : '目录名'"
          />
        </div>
        <div class="dialog-footer">
          <button @click="createItem" class="btn-primary">创建</button>
          <button @click="closeCreateDialog" class="btn-secondary">取消</button>
        </div>
      </div>
    </div>

    <!-- 上传文件对话框 -->
    <div v-if="uploadDialog.show" class="dialog-overlay" @click.self="closeUploadDialog">
      <div class="dialog dialog-small">
        <div class="dialog-header">
          <h3>上传文件</h3>
          <button @click="closeUploadDialog" class="btn-close">✕</button>
        </div>
        <div class="dialog-body">
          <input
            type="file"
            @change="handleFileSelect"
            class="input-file"
          />
          <p v-if="uploadDialog.fileName" class="file-info">
            已选择: {{ uploadDialog.fileName }} ({{ formatSize(uploadDialog.fileSize) }})
          </p>
        </div>
        <div class="dialog-footer">
          <button @click="uploadFile" :disabled="!uploadDialog.file" class="btn-primary">上传</button>
          <button @click="closeUploadDialog" class="btn-secondary">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const currentPath = ref('');
const files = ref([]);
const loading = ref(false);

const editDialog = ref({
  show: false,
  path: '',
  fileName: '',
  content: ''
});

const createDialog = ref({
  show: false,
  type: 'file',
  name: ''
});

const uploadDialog = ref({
  show: false,
  file: null,
  fileName: '',
  fileSize: 0
});

// 加载目录
const loadDirectory = async () => {
  loading.value = true;
  try {
    const response = await axios.post('/api/files/list', {
      path: currentPath.value || undefined
    });

    if (response.data.success) {
      currentPath.value = response.data.path;
      files.value = response.data.files;
    } else {
      alert('加载失败: ' + response.data.message);
    }
  } catch (error) {
    alert('加载失败: ' + error.message);
  } finally {
    loading.value = false;
  }
};

// 返回上级目录
const goToParent = () => {
  const parts = currentPath.value.split('/').filter(p => p);
  parts.pop();
  currentPath.value = '/' + parts.join('/');
  loadDirectory();
};

// 处理文件点击
const handleFileClick = (file) => {
  if (file.isDirectory) {
    currentPath.value = file.path;
    loadDirectory();
  } else {
    editFile(file);
  }
};

// 编辑文件
const editFile = async (file) => {
  try {
    const response = await axios.post('/api/files/read', {
      path: file.path
    });

    if (response.data.success) {
      editDialog.value = {
        show: true,
        path: file.path,
        fileName: file.name,
        content: response.data.content
      };
    } else {
      alert('读取文件失败: ' + response.data.message);
    }
  } catch (error) {
    alert('读取文件失败: ' + error.message);
  }
};

// 保存文件
const saveFile = async () => {
  try {
    const response = await axios.post('/api/files/write', {
      path: editDialog.value.path,
      content: editDialog.value.content
    });

    if (response.data.success) {
      alert('保存成功');
      closeEditDialog();
      loadDirectory();
    } else {
      alert('保存失败: ' + response.data.message);
    }
  } catch (error) {
    alert('保存失败: ' + error.message);
  }
};

// 关闭编辑对话框
const closeEditDialog = () => {
  editDialog.value.show = false;
};

// 显示创建对话框
const showCreateDialog = (type) => {
  createDialog.value = {
    show: true,
    type,
    name: ''
  };
};

// 创建文件/目录
const createItem = async () => {
  if (!createDialog.value.name) {
    alert('请输入名称');
    return;
  }

  try {
    const targetPath = currentPath.value + '/' + createDialog.value.name;
    const response = await axios.post('/api/files/create', {
      path: targetPath,
      type: createDialog.value.type
    });

    if (response.data.success) {
      alert(response.data.message);
      closeCreateDialog();
      loadDirectory();
    } else {
      alert('创建失败: ' + response.data.message);
    }
  } catch (error) {
    alert('创建失败: ' + error.message);
  }
};

// 关闭创建对话框
const closeCreateDialog = () => {
  createDialog.value.show = false;
};

// 删除文件
const deleteFile = async (file) => {
  if (!confirm(`确定要删除 ${file.name} 吗？`)) {
    return;
  }

  try {
    const response = await axios.post('/api/files/delete', {
      path: file.path
    });

    if (response.data.success) {
      alert('删除成功');
      loadDirectory();
    } else {
      alert('删除失败: ' + response.data.message);
    }
  } catch (error) {
    alert('删除失败: ' + error.message);
  }
};

// 显示上传对话框
const showUploadDialog = () => {
  uploadDialog.value = {
    show: true,
    file: null,
    fileName: '',
    fileSize: 0
  };
};

// 处理文件选择
const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    uploadDialog.value.file = file;
    uploadDialog.value.fileName = file.name;
    uploadDialog.value.fileSize = file.size;
  }
};

// 上传文件
const uploadFile = async () => {
  if (!uploadDialog.value.file) {
    return;
  }

  try {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target.result.split(',')[1]; // 获取base64内容
      const targetPath = currentPath.value + '/' + uploadDialog.value.fileName;

      const response = await axios.post('/api/files/upload', {
        path: targetPath,
        content,
        encoding: 'base64'
      });

      if (response.data.success) {
        alert('上传成功');
        closeUploadDialog();
        loadDirectory();
      } else {
        alert('上传失败: ' + response.data.message);
      }
    };
    reader.readAsDataURL(uploadDialog.value.file);
  } catch (error) {
    alert('上传失败: ' + error.message);
  }
};

// 关闭上传对话框
const closeUploadDialog = () => {
  uploadDialog.value.show = false;
};

// 下载文件
const downloadFile = async (file) => {
  try {
    const response = await axios.post('/api/files/download', {
      path: file.path
    });

    if (response.data.success) {
      const link = document.createElement('a');
      link.href = 'data:application/octet-stream;base64,' + response.data.content;
      link.download = file.name;
      link.click();
    } else {
      alert('下载失败: ' + response.data.message);
    }
  } catch (error) {
    alert('下载失败: ' + error.message);
  }
};

// 格式化文件大小
const formatSize = (bytes) => {
  if (!bytes) return '-';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  return (bytes / 1024 / 1024 / 1024).toFixed(2) + ' GB';
};

// 格式化日期
const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleString('zh-CN');
};

onMounted(() => {
  loadDirectory();
});
</script>

<style scoped>
.file-manager {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #1a1a1a;
}

.file-header {
  padding: 15px;
  background: #2d2d2d;
  border-bottom: 1px solid #444;
}

.path-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.path-input {
  flex: 1;
  padding: 10px;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 5px;
  color: #e0e0e0;
  font-size: 14px;
  font-family: monospace;
}

.btn-load,
.btn-parent {
  padding: 10px 20px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.btn-load:hover,
.btn-parent:hover {
  background: #357abd;
}

.actions-bar {
  display: flex;
  gap: 10px;
}

.btn-action {
  padding: 10px 20px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.btn-action:hover {
  background: #229954;
}

.file-list {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
}

.loading,
.no-files {
  text-align: center;
  padding: 50px;
  color: #999;
  font-size: 16px;
}

.file-table {
  width: 100%;
  border-collapse: collapse;
  background: #2d2d2d;
  border-radius: 8px;
  overflow: hidden;
}

.file-table thead {
  background: #1a1a1a;
}

.file-table th {
  padding: 12px;
  text-align: left;
  color: #00ff88;
  font-weight: 600;
  border-bottom: 2px solid #444;
}

.file-table td {
  padding: 12px;
  border-bottom: 1px solid #444;
  color: #e0e0e0;
}

.file-table tr:hover {
  background: #1a1a1a;
}

.file-table tr.directory {
  background: rgba(74, 144, 226, 0.05);
}

.file-name {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-name:hover {
  color: #00ff88;
}

.file-icon {
  font-size: 18px;
}

.actions {
  display: flex;
  gap: 5px;
}

.btn-small {
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.btn-edit {
  background: #4a90e2;
  color: white;
}

.btn-edit:hover {
  background: #357abd;
}

.btn-download {
  background: #27ae60;
  color: white;
}

.btn-download:hover {
  background: #229954;
}

.btn-delete {
  background: #e74c3c;
  color: white;
}

.btn-delete:hover {
  background: #c0392b;
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

.dialog-small {
  max-width: 500px;
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

.file-editor {
  width: 100%;
  min-height: 400px;
  padding: 15px;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 5px;
  color: #e0e0e0;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  resize: vertical;
}

.input-text {
  width: 100%;
  padding: 10px;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 5px;
  color: #e0e0e0;
  font-size: 14px;
}

.input-file {
  width: 100%;
  padding: 10px;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 5px;
  color: #e0e0e0;
  font-size: 14px;
}

.file-info {
  margin-top: 10px;
  color: #999;
  font-size: 14px;
}

.dialog-footer {
  padding: 15px 20px;
  border-top: 1px solid #444;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-primary {
  padding: 10px 20px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary:hover {
  background: #357abd;
}

.btn-primary:disabled {
  background: #555;
  cursor: not-allowed;
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
