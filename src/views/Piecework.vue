<template>
  <div class="page-container">
    <div class="header">
      <div class="title">按件计件</div>
      <div class="month-selector">
        <div class="month-text">{{ currentYear }}年{{ String(currentMonth).padStart(2, '0') }}月</div>
      </div>
    </div>

    <div class="summary-card">
      <div class="summary-item">
        <div class="summary-value">{{ totalQuantity }}</div>
        <div class="summary-label">计件总数</div>
      </div>
      <div class="summary-divider"></div>
      <div class="summary-item">
        <div class="summary-value">¥{{ totalAmount.toFixed(0) }}</div>
        <div class="summary-label">计件金额</div>
      </div>
    </div>

    <div class="content">
      <div v-if="groupedRecords.length === 0" class="empty-state">
        <div class="empty-icon">📋</div>
        <div class="empty-text">暂无计件记录</div>
        <div class="empty-hint">点击下方按钮添加记录</div>
      </div>

      <div v-else class="records-list">
        <div v-for="group in groupedRecords" :key="group.date" class="date-group">
          <div class="date-header">
            <span class="date-day">{{ formatDateDay(group.date) }}</span>
            <span class="date-week">{{ formatDateWeek(group.date) }}</span>
            <span class="date-amount">¥{{ group.total.toFixed(0) }}</span>
          </div>
          <div class="record-items">
            <div v-for="record in group.records" :key="record.id" class="record-item">
              <div class="record-info">
                <div class="record-name">{{ record.productName }}</div>
                <div class="record-formula">¥{{ record.unitPrice }} × {{ record.quantity }} = ¥{{ record.totalPrice.toFixed(0) }}</div>
              </div>
              <div class="record-delete" @click="deleteRecord(record.id)">删除</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="action-buttons">
      <button class="btn-export" @click="exportData">导出</button>
      <button class="btn-add" @click="showAddDialog = true">+ 添加记录</button>
    </div>

    <!-- 添加记录弹窗 -->
    <div v-if="showAddDialog" class="dialog-overlay" @click="showAddDialog = false">
      <div class="dialog" @click.stop>
        <div class="dialog-header">
          <div class="dialog-title">添加计件记录</div>
          <div class="dialog-close" @click="showAddDialog = false">×</div>
        </div>
        <div class="dialog-body">
          <div class="form-group">
            <label>工序产品</label>
            <select v-model="formData.productId" @change="onProductChange">
              <option value="">选择产品</option>
              <option v-for="product in products" :key="product.id" :value="product.id">
                {{ product.name }} (¥{{ product.unitPrice }}/件)
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>数量</label>
            <input v-model="formData.quantity" type="number" placeholder="请输入数量" />
          </div>
          <div class="form-group">
            <label>单价</label>
            <input v-model="formData.unitPrice" type="number" step="0.01" placeholder="请输入单价" />
          </div>
          <div class="form-group">
            <label>日期</label>
            <input v-model="formData.date" type="date" />
          </div>
          <div class="total-display">
            总金额: ¥{{ calculateTotal() }}
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn-cancel" @click="showAddDialog = false">取消</button>
          <button class="btn-confirm" @click="addRecord">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { pieceworkAPI, productAPI } from '../api';

const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth() + 1);
const records = ref([]);
const products = ref([]);
const showAddDialog = ref(false);

const formData = ref({
  productId: '',
  quantity: '',
  unitPrice: '',
  date: new Date().toISOString().split('T')[0]
});

const totalQuantity = computed(() => {
  return records.value.reduce((sum, r) => sum + r.quantity, 0);
});

const totalAmount = computed(() => {
  return records.value.reduce((sum, r) => sum + r.totalPrice, 0);
});

const groupedRecords = computed(() => {
  const groups = {};
  records.value.forEach(record => {
    const date = record.date.split('T')[0];
    if (!groups[date]) {
      groups[date] = {
        date,
        records: [],
        total: 0
      };
    }
    groups[date].records.push(record);
    groups[date].total += record.totalPrice;
  });

  return Object.values(groups).sort((a, b) => new Date(b.date) - new Date(a.date));
});

const formatDateDay = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getDate()}日`;
};

const formatDateWeek = (dateStr) => {
  const date = new Date(dateStr);
  const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return weeks[date.getDay()];
};

const onProductChange = () => {
  const product = products.value.find(p => p.id === parseInt(formData.value.productId));
  if (product) {
    formData.value.unitPrice = product.unitPrice;
  }
};

const calculateTotal = () => {
  const quantity = parseFloat(formData.value.quantity) || 0;
  const unitPrice = parseFloat(formData.value.unitPrice) || 0;
  return (quantity * unitPrice).toFixed(2);
};

const loadRecords = async () => {
  try {
    const response = await pieceworkAPI.getRecords(currentYear.value, currentMonth.value);
    records.value = response.data.records || [];
  } catch (error) {
    console.error('加载记录失败:', error);
    alert('加载记录失败');
  }
};

const loadProducts = async () => {
  try {
    const response = await productAPI.getAll();
    products.value = response.data.data || [];
  } catch (error) {
    console.error('加载产品失败:', error);
  }
};

const addRecord = async () => {
  if (!formData.value.productId || !formData.value.quantity || !formData.value.unitPrice) {
    alert('请填写完整信息');
    return;
  }

  try {
    const product = products.value.find(p => p.id === parseInt(formData.value.productId));
    await pieceworkAPI.addRecord({
      productId: formData.value.productId,
      productName: product.name,
      quantity: formData.value.quantity,
      unitPrice: formData.value.unitPrice,
      date: new Date(formData.value.date).toISOString()
    });

    showAddDialog.value = false;
    formData.value = {
      productId: '',
      quantity: '',
      unitPrice: '',
      date: new Date().toISOString().split('T')[0]
    };
    loadRecords();
  } catch (error) {
    console.error('添加记录失败:', error);
    alert('添加记录失败');
  }
};

const deleteRecord = async (id) => {
  if (!confirm('确定要删除这条记录吗?')) return;

  try {
    await pieceworkAPI.deleteRecord(id);
    loadRecords();
  } catch (error) {
    console.error('删除记录失败:', error);
    alert('删除记录失败');
  }
};

const exportData = () => {
  alert('导出功能');
};

onMounted(() => {
  loadRecords();
  loadProducts();
});
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: #F8F8F8;
  padding-bottom: 120px;
}

.header {
  background: #FFFFFF;
  padding: 16px 20px;
  border-bottom: 1px solid #E0E0E0;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 12px;
}

.month-selector {
  display: flex;
  align-items: center;
  justify-content: center;
}

.month-text {
  font-size: 16px;
  color: #1A73E8;
  font-weight: 500;
}

.summary-card {
  background: #FFFFFF;
  margin: 12px 16px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.summary-item {
  text-align: center;
}

.summary-value {
  font-size: 28px;
  font-weight: 700;
  color: #1A73E8;
  margin-bottom: 4px;
}

.summary-label {
  font-size: 13px;
  color: #666666;
}

.summary-divider {
  width: 1px;
  height: 40px;
  background: #E0E0E0;
}

.content {
  padding: 0 16px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  color: #666666;
  margin-bottom: 8px;
}

.empty-hint {
  font-size: 13px;
  color: #999999;
}

.records-list {
  padding-bottom: 20px;
}

.date-group {
  margin-bottom: 16px;
}

.date-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #FFFFFF;
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid #F2F2F2;
}

.date-day {
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  margin-right: 8px;
}

.date-week {
  font-size: 13px;
  color: #999999;
}

.date-amount {
  margin-left: auto;
  font-size: 16px;
  font-weight: 600;
  color: #FF9800;
}

.record-items {
  background: #FFFFFF;
  border-radius: 0 0 8px 8px;
}

.record-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #F2F2F2;
}

.record-item:last-child {
  border-bottom: none;
}

.record-info {
  flex: 1;
}

.record-name {
  font-size: 15px;
  color: #333333;
  margin-bottom: 6px;
  font-weight: 500;
}

.record-formula {
  font-size: 13px;
  color: #999999;
}

.record-delete {
  font-size: 13px;
  color: #FF5252;
  cursor: pointer;
  padding: 6px 12px;
}

.record-delete:hover {
  opacity: 0.7;
}

.action-buttons {
  position: fixed;
  bottom: 72px;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(to top, rgba(248, 248, 248, 1) 70%, rgba(248, 248, 248, 0));
  display: flex;
  gap: 12px;
}

.btn-export {
  flex: 1;
  height: 48px;
  border-radius: 24px;
  border: 2px solid #1A73E8;
  background: #FFFFFF;
  color: #1A73E8;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-export:hover {
  background: #F0F7FF;
}

.btn-add {
  flex: 2;
  height: 48px;
  border-radius: 24px;
  border: none;
  background: #1A73E8;
  color: #FFFFFF;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(26, 115, 232, 0.3);
}

.btn-add:hover {
  background: #1565C0;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(26, 115, 232, 0.4);
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
  max-height: 80vh;
  overflow: auto;
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

.form-group label {
  display: block;
  font-size: 14px;
  color: #666666;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input,
.form-group select {
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

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #1A73E8;
}

.total-display {
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: #1A73E8;
  padding: 16px;
  background: #F0F7FF;
  border-radius: 8px;
  margin-top: 12px;
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
}

.btn-cancel {
  background: #F2F2F2;
  border: none;
  color: #666666;
}

.btn-cancel:hover {
  background: #E0E0E0;
}

.btn-confirm {
  background: #1A73E8;
  border: none;
  color: #FFFFFF;
}

.btn-confirm:hover {
  background: #1565C0;
}
</style>
