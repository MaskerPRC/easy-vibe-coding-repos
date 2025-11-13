<template>
  <div class="page-container">
    <div class="header">
      <div class="back-button" @click="goBack">
        <span>&lt;</span>
      </div>
      <div class="title">计时工种管理</div>
      <div class="placeholder"></div>
    </div>

    <div class="content">
      <div v-if="jobs.length === 0" class="empty-state">
        <div class="empty-icon">⚙️</div>
        <div class="empty-text">暂无工种</div>
        <div class="empty-hint">点击下方按钮添加工种</div>
      </div>

      <div v-else class="job-list">
        <div v-for="job in jobs" :key="job.id" class="job-item">
          <div class="job-info">
            <div class="job-name">{{ job.name }}</div>
            <div class="job-rate">¥{{ job.hourlyRate }} / 时</div>
          </div>
          <div class="job-actions">
            <button class="btn-edit" @click="editJob(job)">编辑</button>
            <button class="btn-delete" @click="deleteJob(job.id)">删除</button>
          </div>
        </div>
      </div>
    </div>

    <div class="action-button">
      <button class="btn-add" @click="showAddDialog = true">+ 添加工种</button>
    </div>

    <!-- 添加/编辑工种弹窗 -->
    <div v-if="showAddDialog" class="dialog-overlay" @click="showAddDialog = false">
      <div class="dialog" @click.stop>
        <div class="dialog-header">
          <div class="dialog-title">{{ editingJob ? '编辑工种' : '添加工种' }}</div>
          <div class="dialog-close" @click="showAddDialog = false">×</div>
        </div>
        <div class="dialog-body">
          <div class="form-group">
            <label>工种名称</label>
            <input v-model="formData.name" type="text" placeholder="请输入工种名称" />
          </div>
          <div class="form-group">
            <label>时薪(元/时)</label>
            <input v-model="formData.hourlyRate" type="number" step="0.01" placeholder="请输入时薪" />
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn-cancel" @click="showAddDialog = false">取消</button>
          <button class="btn-confirm" @click="saveJob">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { jobAPI } from '../api';

const router = useRouter();
const jobs = ref([]);
const showAddDialog = ref(false);
const editingJob = ref(null);

const formData = ref({
  name: '',
  hourlyRate: ''
});

const goBack = () => {
  router.back();
};

const loadJobs = async () => {
  try {
    const response = await jobAPI.getAll();
    jobs.value = response.data.data || [];
  } catch (error) {
    console.error('加载工种失败:', error);
    alert('加载工种失败');
  }
};

const editJob = (job) => {
  editingJob.value = job;
  formData.value = {
    name: job.name,
    hourlyRate: job.hourlyRate
  };
  showAddDialog.value = true;
};

const saveJob = async () => {
  if (!formData.value.name || !formData.value.hourlyRate) {
    alert('请填写完整信息');
    return;
  }

  try {
    if (editingJob.value) {
      await jobAPI.update(editingJob.value.id, formData.value);
    } else {
      await jobAPI.add(formData.value);
    }

    showAddDialog.value = false;
    editingJob.value = null;
    formData.value = { name: '', hourlyRate: '' };
    loadJobs();
  } catch (error) {
    console.error('保存工种失败:', error);
    alert('保存工种失败');
  }
};

const deleteJob = async (id) => {
  if (!confirm('确定要删除这个工种吗?')) return;

  try {
    await jobAPI.delete(id);
    loadJobs();
  } catch (error) {
    console.error('删除工种失败:', error);
    alert('删除工种失败');
  }
};

onMounted(() => {
  loadJobs();
});
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: #F8F8F8;
  padding-bottom: 100px;
}

.header {
  background: #FFFFFF;
  padding: 16px 20px;
  border-bottom: 1px solid #E0E0E0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-button {
  font-size: 24px;
  color: #1A73E8;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-button:hover {
  opacity: 0.7;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  flex: 1;
  text-align: center;
}

.placeholder {
  width: 32px;
}

.content {
  padding: 16px;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-text {
  font-size: 18px;
  color: #666666;
  margin-bottom: 10px;
  font-weight: 500;
}

.empty-hint {
  font-size: 14px;
  color: #999999;
}

.job-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.job-item {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.job-info {
  flex: 1;
}

.job-name {
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 6px;
}

.job-rate {
  font-size: 18px;
  color: #4CAF50;
  font-weight: 600;
}

.job-actions {
  display: flex;
  gap: 8px;
}

.btn-edit,
.btn-delete {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-edit {
  background: #1A73E8;
  color: #FFFFFF;
}

.btn-edit:hover {
  background: #1565C0;
}

.btn-delete {
  background: #F2F2F2;
  color: #FF5252;
}

.btn-delete:hover {
  background: #FFE8E8;
}

.action-button {
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
  padding: 0 16px;
}

.btn-add {
  width: 100%;
  height: 52px;
  border-radius: 26px;
  border: none;
  background: #1A73E8;
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(26, 115, 232, 0.3);
}

.btn-add:hover {
  background: #1565C0;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(26, 115, 232, 0.4);
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.dialog {
  background: #FFFFFF;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #E0E0E0;
}

.dialog-title {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
}

.dialog-close {
  font-size: 28px;
  color: #999999;
  cursor: pointer;
  line-height: 1;
}

.dialog-close:hover {
  color: #666666;
}

.dialog-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  font-size: 14px;
  color: #666666;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  height: 44px;
  padding: 0 12px;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  font-size: 15px;
  color: #333333;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #1A73E8;
}

.dialog-footer {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #E0E0E0;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  height: 44px;
  border-radius: 22px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-cancel {
  background: #F2F2F2;
  color: #666666;
}

.btn-cancel:hover {
  background: #E0E0E0;
}

.btn-confirm {
  background: #1A73E8;
  color: #FFFFFF;
}

.btn-confirm:hover {
  background: #1565C0;
}
</style>
