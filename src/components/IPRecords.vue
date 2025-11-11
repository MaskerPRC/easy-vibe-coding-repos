<template>
  <div class="ip-records-container">
    <!-- Header -->
    <div class="records-header">
      <h2 class="records-title">访问者 IP 记录</h2>
      <div class="header-actions">
        <button class="refresh-btn" @click="refreshRecords" :disabled="isLoading">
          <span class="btn-icon">🔄</span>
          <span>刷新</span>
        </button>
        <div class="record-count">
          <span class="count-label">记录数:</span>
          <span class="count-value">{{ records.length }}/200</span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && records.length === 0" class="loading-state">
      <div class="loader"></div>
      <p>正在加载记录...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <span class="error-icon">⚠️</span>
      <p>{{ error }}</p>
      <button class="retry-btn" @click="refreshRecords">重试</button>
    </div>

    <!-- Records List -->
    <div v-else-if="records.length > 0" class="records-list">
      <div
        v-for="(record, index) in records"
        :key="record.uniqueKey"
        class="record-item"
        :class="{ 'new-record': isNewRecord(index) }"
      >
        <div class="record-index">{{ index + 1 }}</div>
        <div class="record-content">
          <div class="ip-group">
            <div class="ip-item">
              <span class="ip-label">外网 IP:</span>
              <span class="ip-value public-ip">{{ record.publicIp }}</span>
            </div>
            <div class="ip-item">
              <span class="ip-label">内网 IP:</span>
              <span class="ip-value local-ip">{{ record.localIp }}</span>
            </div>
          </div>
          <div class="record-meta">
            <span class="timestamp">{{ formatTimestamp(record.timestamp) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <span class="empty-icon">📭</span>
      <p>暂无访问记录</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

const records = ref([])
const isLoading = ref(false)
const error = ref(null)
const newRecordIndices = ref(new Set())
let refreshInterval = null

// 使用 WebRTC 获取 IP 地址
const getIPAddresses = async () => {
  return new Promise((resolve) => {
    const ips = {
      publicIp: null,
      localIp: null
    }

    try {
      // 创建 RTCPeerConnection
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      })

      // 创建数据通道
      pc.createDataChannel('')

      // 创建 offer
      pc.createOffer()
        .then(offer => pc.setLocalDescription(offer))
        .catch(err => console.error('Error creating offer:', err))

      // 监听 ICE 候选
      pc.onicecandidate = (event) => {
        if (!event || !event.candidate) {
          // ICE 收集完成
          if (!ips.localIp && !ips.publicIp) {
            ips.localIp = 'Unable to detect'
            ips.publicIp = 'Unable to detect'
          }
          pc.close()
          resolve(ips)
          return
        }

        const candidateStr = event.candidate.candidate
        if (!candidateStr) return

        // 解析 IP 地址
        const ipRegex = /([0-9]{1,3}\.){3}[0-9]{1,3}/
        const ipMatch = candidateStr.match(ipRegex)

        if (ipMatch) {
          const ip = ipMatch[0]

          // 判断是内网还是外网 IP
          if (
            ip.startsWith('192.168.') ||
            ip.startsWith('10.') ||
            ip.startsWith('172.16.') ||
            ip.startsWith('172.17.') ||
            ip.startsWith('172.18.') ||
            ip.startsWith('172.19.') ||
            ip.startsWith('172.20.') ||
            ip.startsWith('172.21.') ||
            ip.startsWith('172.22.') ||
            ip.startsWith('172.23.') ||
            ip.startsWith('172.24.') ||
            ip.startsWith('172.25.') ||
            ip.startsWith('172.26.') ||
            ip.startsWith('172.27.') ||
            ip.startsWith('172.28.') ||
            ip.startsWith('172.29.') ||
            ip.startsWith('172.30.') ||
            ip.startsWith('172.31.')
          ) {
            if (!ips.localIp) {
              ips.localIp = ip
            }
          } else if (!ip.startsWith('127.')) {
            if (!ips.publicIp) {
              ips.publicIp = ip
            }
          }
        }
      }

      // 设置超时
      setTimeout(() => {
        if (!ips.localIp && !ips.publicIp) {
          ips.localIp = 'Timeout'
          ips.publicIp = 'Timeout'
        }
        pc.close()
        resolve(ips)
      }, 5000)
    } catch (err) {
      console.error('Error getting IP addresses:', err)
      resolve({
        publicIp: 'Error',
        localIp: 'Error'
      })
    }
  })
}

// 提交 IP 记录到服务器
const submitIPRecord = async () => {
  try {
    const ips = await getIPAddresses()
    const userAgent = navigator.userAgent

    await axios.post('/api/ip-records', {
      publicIp: ips.publicIp,
      localIp: ips.localIp,
      userAgent
    })

    // 提交成功后刷新列表
    await fetchRecords()
  } catch (err) {
    console.error('Error submitting IP record:', err)
  }
}

// 获取记录列表
const fetchRecords = async () => {
  try {
    isLoading.value = true
    error.value = null

    const response = await axios.get('/api/ip-records')
    if (response.data.success) {
      const oldLength = records.value.length
      records.value = response.data.records

      // 标记新记录（用于高亮显示）
      if (oldLength < records.value.length) {
        for (let i = 0; i < records.value.length - oldLength; i++) {
          newRecordIndices.value.add(i)
        }
        // 2秒后移除高亮
        setTimeout(() => {
          newRecordIndices.value.clear()
        }, 2000)
      }
    }
  } catch (err) {
    console.error('Error fetching IP records:', err)
    error.value = '获取记录失败，请稍后重试'
  } finally {
    isLoading.value = false
  }
}

// 刷新记录
const refreshRecords = async () => {
  await fetchRecords()
}

// 检查是否是新记录
const isNewRecord = (index) => {
  return newRecordIndices.value.has(index)
}

// 格式化时间戳
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return '刚刚'
  if (diffMins < 60) return `${diffMins} 分钟前`
  if (diffHours < 24) return `${diffHours} 小时前`
  if (diffDays < 7) return `${diffDays} 天前`

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// 生命周期钩子
onMounted(async () => {
  // 首次加载记录
  await fetchRecords()

  // 提交当前访问者的 IP
  await submitIPRecord()

  // 设置定时刷新（每30秒）
  refreshInterval = setInterval(() => {
    fetchRecords()
  }, 30000)
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>

<style scoped>
.ip-records-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background: #ECF0F1;
  border-radius: 4px;
  font-family: 'Roboto', 'Open Sans', sans-serif;
}

/* Header */
.records-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #3498DB;
}

.records-title {
  font-size: 24px;
  font-weight: 600;
  color: #2C3E50;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #3498DB;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.refresh-btn:hover:not(:disabled) {
  background: #2980B9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 16px;
}

.record-count {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.count-label {
  font-size: 12px;
  color: #7F8C8D;
}

.count-value {
  font-size: 14px;
  font-weight: 600;
  color: #2C3E50;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 60px 20px;
}

.loader {
  width: 40px;
  height: 40px;
  border: 4px solid #ECF0F1;
  border-top-color: #3498DB;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: #7F8C8D;
  font-size: 14px;
}

/* Error State */
.error-state {
  text-align: center;
  padding: 60px 20px;
  background: #ffffff;
  border-radius: 4px;
  border-left: 4px solid #E74C3C;
}

.error-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 15px;
}

.error-state p {
  color: #E74C3C;
  font-size: 16px;
  margin-bottom: 20px;
}

.retry-btn {
  padding: 10px 24px;
  background: #E74C3C;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: #C0392B;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: #ffffff;
  border-radius: 4px;
}

.empty-icon {
  font-size: 64px;
  display: block;
  margin-bottom: 20px;
}

.empty-state p {
  color: #7F8C8D;
  font-size: 16px;
}

/* Records List */
.records-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 600px;
  overflow-y: auto;
  padding-right: 5px;
}

/* Custom Scrollbar */
.records-list::-webkit-scrollbar {
  width: 8px;
}

.records-list::-webkit-scrollbar-track {
  background: #ffffff;
  border-radius: 4px;
}

.records-list::-webkit-scrollbar-thumb {
  background: #3498DB;
  border-radius: 4px;
}

.records-list::-webkit-scrollbar-thumb:hover {
  background: #2980B9;
}

/* Record Item */
.record-item {
  display: flex;
  align-items: stretch;
  background: #ffffff;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.record-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.record-item.new-record {
  animation: highlight 2s ease;
}

@keyframes highlight {
  0%, 100% {
    background: #ffffff;
  }
  50% {
    background: #D5F4E6;
  }
}

.record-index {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;
  background: #3498DB;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
}

.record-content {
  flex: 1;
  padding: 15px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ip-group {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}

.ip-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ip-label {
  font-size: 12px;
  color: #7F8C8D;
  font-weight: 500;
}

.ip-value {
  font-size: 16px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
}

.public-ip {
  color: #2C3E50;
  background: #D6EAF8;
}

.local-ip {
  color: #2C3E50;
  background: #D5F4E6;
}

.record-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.timestamp {
  font-size: 12px;
  color: #7F8C8D;
}

/* Responsive */
@media (max-width: 768px) {
  .ip-records-container {
    padding: 15px;
  }

  .records-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .records-title {
    font-size: 20px;
  }

  .ip-group {
    flex-direction: column;
    gap: 10px;
  }

  .record-content {
    padding: 12px 15px;
  }
}

@media (max-width: 480px) {
  .records-list {
    max-height: 500px;
  }

  .record-index {
    min-width: 40px;
    font-size: 14px;
  }

  .ip-value {
    font-size: 14px;
  }
}
</style>
