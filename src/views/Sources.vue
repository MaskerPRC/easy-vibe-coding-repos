<template>
  <Layout>
    <div class="sources-page">
      <div class="page-header">
        <h2>信息源管理</h2>
        <div class="header-actions">
          <el-button @click="batchDialogVisible = true">
            <el-icon><DocumentAdd /></el-icon>
            批量导入
          </el-button>
          <el-button type="primary" @click="handleCreate">
            <el-icon><Plus /></el-icon>
            添加信息源
          </el-button>
        </div>
      </div>

      <el-card v-loading="sourceStore.loading">
        <el-empty v-if="sources.length === 0" description="暂无信息源，点击上方按钮添加" />

        <el-table v-else :data="sources" stripe>
          <el-table-column prop="name" label="名称" min-width="150" />
          <el-table-column label="类型" width="100">
            <template #default="{ row }">
              <el-tag :type="getTypeColor(row.type)" size="small">
                {{ getTypeLabel(row.type) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="url" label="URL" min-width="300" show-overflow-tooltip />
          <el-table-column label="轮询间隔" width="120" align="center">
            <template #default="{ row }">
              {{ formatInterval(row.interval) }}
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-switch
                v-model="row.enabled"
                @change="handleToggle(row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="最后抓取" width="180">
            <template #default="{ row }">
              {{ row.lastFetchedAt ? formatTime(row.lastFetchedAt) : '从未抓取' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="handleEdit(row)">编辑</el-button>
              <el-button size="small" type="primary" @click="handleFetch(row)">抓取</el-button>
              <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 创建/编辑对话框 -->
      <el-dialog
        v-model="dialogVisible"
        :title="editingSource ? '编辑信息源' : '添加信息源'"
        width="600px"
      >
        <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入信息源名称" />
          </el-form-item>

          <el-form-item label="类型" prop="type">
            <el-select v-model="form.type" placeholder="选择类型" style="width: 100%">
              <el-option label="RSS" value="rss" />
              <el-option label="API" value="api" />
              <el-option label="网站" value="website" />
              <el-option label="GitHub" value="github" />
              <el-option label="Twitter" value="twitter" />
            </el-select>
          </el-form-item>

          <el-form-item label="URL" prop="url">
            <el-input v-model="form.url" placeholder="请输入 URL 地址" />
          </el-form-item>

          <el-form-item label="轮询间隔">
            <el-input-number v-model="form.interval" :min="60" :step="60" style="width: 150px" />
            <span style="margin-left: 10px">秒</span>
          </el-form-item>

          <el-form-item label="启用">
            <el-switch v-model="form.enabled" />
          </el-form-item>
        </el-form>

        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            {{ editingSource ? '保存' : '创建' }}
          </el-button>
        </template>
      </el-dialog>

      <!-- 批量导入对话框 -->
      <el-dialog v-model="batchDialogVisible" title="批量导入信息源" width="600px">
        <el-alert type="info" :closable="false" style="margin-bottom: 20px">
          每行一个 URL，系统将自动检测 URL 类型
        </el-alert>

        <el-input
          v-model="batchUrls"
          type="textarea"
          :rows="10"
          placeholder="https://example.com/feed.xml&#10;https://github.com/user/repo&#10;https://api.example.com/news"
        />

        <template #footer>
          <el-button @click="batchDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleBatchImport" :loading="submitting">
            导入
          </el-button>
        </template>
      </el-dialog>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSourceStore } from '../stores';
import { ElMessage, ElMessageBox } from 'element-plus';
import Layout from '../components/Layout.vue';
import axios from 'axios';

const sourceStore = useSourceStore();

const sources = computed(() => sourceStore.sources);
const dialogVisible = ref(false);
const batchDialogVisible = ref(false);
const editingSource = ref(null);
const submitting = ref(false);
const formRef = ref(null);
const batchUrls = ref('');

const form = ref({
  name: '',
  type: 'rss',
  url: '',
  interval: 3600,
  enabled: true
});

const rules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  url: [
    { required: true, message: '请输入 URL', trigger: 'blur' },
    { type: 'url', message: '请输入有效的 URL', trigger: 'blur' }
  ]
};

const getTypeLabel = (type) => {
  const map = { rss: 'RSS', api: 'API', website: '网站', github: 'GitHub', twitter: 'Twitter' };
  return map[type] || type;
};

const getTypeColor = (type) => {
  const map = { rss: 'success', api: 'primary', website: 'info', github: '', twitter: 'warning' };
  return map[type] || '';
};

const formatInterval = (seconds) => {
  if (seconds < 3600) return `${Math.floor(seconds / 60)} 分钟`;
  return `${Math.floor(seconds / 3600)} 小时`;
};

const formatTime = (time) => {
  return new Date(time).toLocaleString('zh-CN');
};

const handleCreate = () => {
  editingSource.value = null;
  form.value = {
    name: '',
    type: 'rss',
    url: '',
    interval: 3600,
    enabled: true
  };
  dialogVisible.value = true;
};

const handleEdit = (source) => {
  editingSource.value = source;
  form.value = { ...source };
  dialogVisible.value = true;
};

const handleSubmit = async () => {
  await formRef.value.validate(async (valid) => {
    if (!valid) return;

    submitting.value = true;

    try {
      let result;
      if (editingSource.value) {
        result = await sourceStore.updateSource(editingSource.value.id, form.value);
      } else {
        result = await sourceStore.createSource(form.value);
      }

      if (result.success) {
        ElMessage.success(editingSource.value ? '信息源已更新' : '信息源已创建');
        dialogVisible.value = false;
      } else {
        ElMessage.error(result.error || '操作失败');
      }
    } finally {
      submitting.value = false;
    }
  });
};

const handleToggle = async (source) => {
  const result = await sourceStore.updateSource(source.id, { enabled: source.enabled });
  if (result.success) {
    ElMessage.success(source.enabled ? '已启用' : '已禁用');
  } else {
    source.enabled = !source.enabled;
    ElMessage.error('操作失败');
  }
};

const handleFetch = async (source) => {
  const loading = ElMessage.loading('抓取中...');

  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`/api/sources/${source.id}/fetch`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });

    loading.close();

    if (response.data.success) {
      ElMessage.success(`抓取成功！获取到 ${response.data.items.length} 条消息`);
    } else {
      ElMessage.error(response.data.error || '抓取失败');
    }
  } catch (error) {
    loading.close();
    ElMessage.error('抓取失败：' + error.message);
  }
};

const handleDelete = async (source) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除信息源"${source.name}"吗？`,
      '警告',
      { type: 'warning' }
    );

    const result = await sourceStore.deleteSource(source.id);

    if (result.success) {
      ElMessage.success('信息源已删除');
    } else {
      ElMessage.error(result.error || '删除失败');
    }
  } catch {
    // 用户取消
  }
};

const handleBatchImport = async () => {
  const urls = batchUrls.value.split('\n').filter(url => url.trim());

  if (urls.length === 0) {
    ElMessage.warning('请输入至少一个 URL');
    return;
  }

  submitting.value = true;

  try {
    const result = await sourceStore.batchCreateSources(urls);

    if (result.success) {
      ElMessage.success(`成功导入 ${result.count} 个信息源`);
      batchDialogVisible.value = false;
      batchUrls.value = '';
    } else {
      ElMessage.error(result.error || '导入失败');
    }
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  sourceStore.fetchSources();
});
</script>

<style scoped>
.sources-page {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 10px;
}
</style>
