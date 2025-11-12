<template>
  <Layout>
    <div class="projects-page">
      <div class="page-header">
        <h2>项目管理</h2>
        <el-button type="primary" @click="handleCreate">
          <el-icon><Plus /></el-icon>
          创建项目
        </el-button>
      </div>

      <el-card v-loading="projectStore.loading">
        <el-empty v-if="projects.length === 0" description="暂无项目，点击上方按钮创建第一个项目" />

        <el-table v-else :data="projects" stripe>
          <el-table-column prop="name" label="项目名称" min-width="150" />
          <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
          <el-table-column label="关键词" min-width="150">
            <template #default="{ row }">
              <el-tag v-for="keyword in row.keywords.slice(0, 3)" :key="keyword" size="small" style="margin-right: 5px">
                {{ keyword }}
              </el-tag>
              <el-tag v-if="row.keywords.length > 3" size="small">+{{ row.keywords.length - 3 }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="优先级" width="100" align="center">
            <template #default="{ row }">
              <el-rate v-model="row.priority" disabled />
            </template>
          </el-table-column>
          <el-table-column label="阈值" width="100" align="center">
            <template #default="{ row }">
              {{ (row.threshold * 100).toFixed(0) }}%
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="180">
            <template #default="{ row }">
              {{ formatTime(row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="handleEdit(row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 创建/编辑对话框 -->
      <el-dialog
        v-model="dialogVisible"
        :title="editingProject ? '编辑项目' : '创建项目'"
        width="600px"
      >
        <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
          <el-form-item label="项目名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入项目名称" />
          </el-form-item>

          <el-form-item label="项目描述" prop="description">
            <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入项目描述" />
          </el-form-item>

          <el-form-item label="关键词" prop="keywords">
            <el-select
              v-model="form.keywords"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="输入关键词并回车添加"
              style="width: 100%"
            >
              <el-option
                v-for="item in keywordOptions"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="项目上下文" prop="context">
            <el-input
              v-model="form.context"
              type="textarea"
              :rows="4"
              placeholder="描述项目的背景、目标等信息，帮助 AI 更好地理解项目"
            />
          </el-form-item>

          <el-form-item label="优先级" prop="priority">
            <el-rate v-model="form.priority" />
            <span style="margin-left: 10px; color: #909399">优先级越高，消息推送越重要</span>
          </el-form-item>

          <el-form-item label="相关性阈值" prop="threshold">
            <el-slider v-model="thresholdPercent" :min="0" :max="100" :step="5" show-input />
            <span style="color: #909399; font-size: 12px">
              只有相关性分数 >= {{ thresholdPercent }}% 的消息才会被推送
            </span>
          </el-form-item>
        </el-form>

        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            {{ editingProject ? '保存' : '创建' }}
          </el-button>
        </template>
      </el-dialog>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useProjectStore } from '../stores';
import { ElMessage, ElMessageBox } from 'element-plus';
import Layout from '../components/Layout.vue';

const projectStore = useProjectStore();

const projects = computed(() => projectStore.projects);
const dialogVisible = ref(false);
const editingProject = ref(null);
const submitting = ref(false);
const formRef = ref(null);

const form = ref({
  name: '',
  description: '',
  keywords: [],
  context: '',
  priority: 3,
  threshold: 0.6
});

const thresholdPercent = computed({
  get: () => Math.round(form.value.threshold * 100),
  set: (val) => {
    form.value.threshold = val / 100;
  }
});

const keywordOptions = ref(['AI', '机器学习', '深度学习', 'NLP', 'GPT', '大模型', '开源', 'GitHub']);

const rules = {
  name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  keywords: [{ required: true, message: '请至少添加一个关键词', trigger: 'change' }]
};

const handleCreate = () => {
  editingProject.value = null;
  form.value = {
    name: '',
    description: '',
    keywords: [],
    context: '',
    priority: 3,
    threshold: 0.6
  };
  dialogVisible.value = true;
};

const handleEdit = (project) => {
  editingProject.value = project;
  form.value = { ...project };
  dialogVisible.value = true;
};

const handleSubmit = async () => {
  await formRef.value.validate(async (valid) => {
    if (!valid) return;

    submitting.value = true;

    try {
      let result;
      if (editingProject.value) {
        result = await projectStore.updateProject(editingProject.value.id, form.value);
      } else {
        result = await projectStore.createProject(form.value);
      }

      if (result.success) {
        ElMessage.success(editingProject.value ? '项目已更新' : '项目已创建');
        dialogVisible.value = false;
      } else {
        ElMessage.error(result.error || '操作失败');
      }
    } finally {
      submitting.value = false;
    }
  });
};

const handleDelete = async (project) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除项目"${project.name}"吗？此操作不可恢复。`,
      '警告',
      { type: 'warning' }
    );

    const result = await projectStore.deleteProject(project.id);

    if (result.success) {
      ElMessage.success('项目已删除');
    } else {
      ElMessage.error(result.error || '删除失败');
    }
  } catch {
    // 用户取消
  }
};

const formatTime = (time) => {
  return new Date(time).toLocaleString('zh-CN');
};

onMounted(() => {
  projectStore.fetchProjects();
});
</script>

<style scoped>
.projects-page {
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
