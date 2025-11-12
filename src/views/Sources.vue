<template>
  <Layout>
    <div class="sources-page">
      <div class="page-header">
        <h2>信息源管理</h2>
        <el-button type="primary" @click="showCreateDialog">
          <el-icon><Plus /></el-icon>
          添加信息源
        </el-button>
      </div>

      <el-table :data="sources" stripe>
        <el-table-column prop="name" label="名称" min-width="150" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="url" label="URL" min-width="300" show-overflow-tooltip />
        <el-table-column prop="enabled" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.enabled ? 'success' : 'info'" size="small">
              {{ row.enabled ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastFetchedAt" label="最后抓取" width="180">
          <template #default="{ row }">
            {{ row.lastFetchedAt ? formatTime(row.lastFetchedAt) : '从未' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              text
              @click="toggleEnabled(row)"
            >
              {{ row.enabled ? '禁用' : '启用' }}
            </el-button>
            <el-button
              type="danger"
              text
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-if="sources.length === 0" description="暂无信息源，点击右上角添加" />

      <!-- 创建对话框 -->
      <el-dialog v-model="dialogVisible" title="添加信息源" width="600px">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="单个添加" name="single">
            <el-form :model="formData" label-width="100px">
              <el-form-item label="信息源URL">
                <el-input v-model="formData.url" placeholder="https://example.com/feed.xml" />
              </el-form-item>

              <el-form-item label="名称">
                <el-input v-model="formData.name" placeholder="可选，留空则使用URL" />
              </el-form-item>

              <el-form-item label="类型">
                <el-select v-model="formData.type" placeholder="自动检测">
                  <el-option label="自动检测" value="" />
                  <el-option label="RSS" value="rss" />
                  <el-option label="GitHub" value="github" />
                  <el-option label="API" value="api" />
                  <el-option label="网站" value="website" />
                </el-select>
              </el-form-item>

              <el-form-item label="轮询间隔">
                <el-input-number v-model="formData.interval" :min="300" :max="86400" />
                <span style="margin-left: 10px; color: #909399">秒</span>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="批量添加" name="batch">
            <el-form label-width="100px">
              <el-form-item label="信息源列表">
                <el-input
                  v-model="batchUrls"
                  type="textarea"
                  :rows="10"
                  placeholder="每行一个URL，例如：&#10;https://hnrss.org/frontpage&#10;https://github.com/vuejs/core&#10;https://css-tricks.com/feed/"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>

        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
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

const sourceStore = useSourceStore();

const sources = computed(() => sourceStore.sources);
const dialogVisible = ref(false);
const activeTab = ref('single');

const formData = ref({
  name: '',
  type: '',
  url: '',
  interval: 3600,
  enabled: true
});

const batchUrls = ref('');

const showCreateDialog = () => {
  formData.value = {
    name: '',
    type: '',
    url: '',
    interval: 3600,
    enabled: true
  };
  batchUrls.value = '';
  activeTab.value = 'single';
  dialogVisible.value = true;
};

const handleSubmit = async () => {
  if (activeTab.value === 'single') {
    if (!formData.value.url) {
      ElMessage.warning('请输入信息源URL');
      return;
    }

    const result = await sourceStore.createSource(formData.value);

    if (result.success) {
      ElMessage.success('信息源添加成功');
      dialogVisible.value = false;
    } else {
      ElMessage.error(result.error || '添加失败');
    }
  } else {
    // 批量添加
    const urls = batchUrls.value
      .split('\n')
      .map(u => u.trim())
      .filter(u => u);

    if (urls.length === 0) {
      ElMessage.warning('请输入至少一个URL');
      return;
    }

    const result = await sourceStore.batchCreateSources(urls);

    if (result.success) {
      ElMessage.success(`成功添加 ${result.sources.length} 个信息源`);
      dialogVisible.value = false;
    } else {
      ElMessage.error(result.error || '批量添加失败');
    }
  }
};

const toggleEnabled = async (source) => {
  const result = await sourceStore.updateSource(source.id, {
    enabled: !source.enabled
  });

  if (result.success) {
    ElMessage.success(source.enabled ? '已禁用' : '已启用');
  } else {
    ElMessage.error('操作失败');
  }
};

const handleDelete = async (source) => {
  try {
    await ElMessageBox.confirm(`确定要删除信息源 "${source.name}" 吗？`, '警告', { type: 'warning' });

    const result = await sourceStore.deleteSource(source.id);

    if (result.success) {
      ElMessage.success('信息源已删除');
    } else {
      ElMessage.error('删除失败');
    }
  } catch {
    // 用户取消
  }
};

const formatTime = (time) => {
  return new Date(time).toLocaleString('zh-CN');
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
</style>
