<template>
  <Layout>
    <div class="projects-page">
      <div class="page-header">
        <h2>项目管理</h2>
        <el-button type="primary" @click="showCreateDialog">
          <el-icon><Plus /></el-icon>
          创建项目
        </el-button>
      </div>

      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :lg="8" v-for="project in projects" :key="project.id">
          <el-card class="project-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <h3>{{ project.name }}</h3>
                <el-dropdown @command="(cmd) => handleCommand(cmd, project)">
                  <el-icon class="more-icon"><More /></el-icon>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="edit">编辑</el-dropdown-item>
                      <el-dropdown-item command="delete" divided>删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </template>

            <div class="project-content">
              <p class="description">{{ project.description || '无描述' }}</p>

              <div class="project-meta">
                <el-tag size="small">优先级: {{ project.priority }}</el-tag>
                <el-tag size="small" type="info">阈值: {{ (project.threshold * 100).toFixed(0) }}%</el-tag>
              </div>

              <div class="keywords">
                <el-tag
                  v-for="keyword in project.keywords.slice(0, 5)"
                  :key="keyword"
                  size="small"
                  effect="plain"
                >
                  {{ keyword }}
                </el-tag>
                <span v-if="project.keywords.length > 5" class="more-keywords">
                  +{{ project.keywords.length - 5 }}
                </span>
              </div>

              <el-button
                type="primary"
                text
                @click="$router.push(`/messages?project=${project.id}`)"
                style="margin-top: 10px"
              >
                查看消息
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-empty v-if="projects.length === 0" description="暂无项目，点击右上角创建第一个项目" />

      <!-- 创建/编辑对话框 -->
      <el-dialog
        v-model="dialogVisible"
        :title="isEditing ? '编辑项目' : '创建项目'"
        width="600px"
      >
        <el-form :model="formData" label-width="100px">
          <el-form-item label="项目名称">
            <el-input v-model="formData.name" placeholder="请输入项目名称" />
          </el-form-item>

          <el-form-item label="项目描述">
            <el-input
              v-model="formData.description"
              type="textarea"
              :rows="3"
              placeholder="请输入项目描述"
            />
          </el-form-item>

          <el-form-item label="关键词">
            <el-input
              v-model="keywordsInput"
              placeholder="用逗号分隔，例如：AI,机器学习,深度学习"
            />
          </el-form-item>

          <el-form-item label="上下文">
            <el-input
              v-model="formData.context"
              type="textarea"
              :rows="3"
              placeholder="描述项目的背景和关注点"
            />
          </el-form-item>

          <el-form-item label="优先级">
            <el-slider v-model="formData.priority" :min="1" :max="5" show-stops />
          </el-form-item>

          <el-form-item label="相关性阈值">
            <el-slider v-model="thresholdPercent" :min="0" :max="100" :format-tooltip="(val) => val + '%'" />
          </el-form-item>
        </el-form>

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
import { useProjectStore } from '../stores';
import { ElMessage, ElMessageBox } from 'element-plus';
import Layout from '../components/Layout.vue';

const projectStore = useProjectStore();

const projects = computed(() => projectStore.projects);
const dialogVisible = ref(false);
const isEditing = ref(false);
const currentProject = ref(null);

const formData = ref({
  name: '',
  description: '',
  keywords: [],
  context: '',
  priority: 3,
  threshold: 0.6
});

const keywordsInput = ref('');
const thresholdPercent = ref(60);

const showCreateDialog = () => {
  isEditing.value = false;
  currentProject.value = null;
  formData.value = {
    name: '',
    description: '',
    keywords: [],
    context: '',
    priority: 3,
    threshold: 0.6
  };
  keywordsInput.value = '';
  thresholdPercent.value = 60;
  dialogVisible.value = true;
};

const showEditDialog = (project) => {
  isEditing.value = true;
  currentProject.value = project;
  formData.value = {
    ...project
  };
  keywordsInput.value = project.keywords.join(',');
  thresholdPercent.value = project.threshold * 100;
  dialogVisible.value = true;
};

const handleSubmit = async () => {
  if (!formData.value.name) {
    ElMessage.warning('请输入项目名称');
    return;
  }

  // 解析关键词
  const keywords = keywordsInput.value
    .split(',')
    .map(k => k.trim())
    .filter(k => k);

  const data = {
    ...formData.value,
    keywords,
    threshold: thresholdPercent.value / 100
  };

  let result;
  if (isEditing.value) {
    result = await projectStore.updateProject(currentProject.value.id, data);
  } else {
    result = await projectStore.createProject(data);
  }

  if (result.success) {
    ElMessage.success(isEditing.value ? '项目更新成功' : '项目创建成功');
    dialogVisible.value = false;
  } else {
    ElMessage.error(result.error || '操作失败');
  }
};

const handleCommand = (command, project) => {
  if (command === 'edit') {
    showEditDialog(project);
  } else if (command === 'delete') {
    handleDelete(project);
  }
};

const handleDelete = async (project) => {
  try {
    await ElMessageBox.confirm(`确定要删除项目 "${project.name}" 吗？`, '警告', { type: 'warning' });

    const result = await projectStore.deleteProject(project.id);

    if (result.success) {
      ElMessage.success('项目已删除');
    } else {
      ElMessage.error('删除失败');
    }
  } catch {
    // 用户取消
  }
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

.project-card {
  margin-bottom: 20px;
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.more-icon {
  cursor: pointer;
  font-size: 18px;
}

.more-icon:hover {
  color: #409eff;
}

.project-content {
  min-height: 150px;
}

.description {
  color: #606266;
  margin-bottom: 15px;
  line-height: 1.6;
}

.project-meta {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.more-keywords {
  font-size: 12px;
  color: #909399;
}
</style>
