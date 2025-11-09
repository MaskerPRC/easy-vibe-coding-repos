<template>
  <div class="clock-out-container">
    <div class="clock-out-card">
      <h1 class="title">⏰ 下班打卡提醒</h1>

      <div class="time-display">
        <div class="current-time">
          <label>当前时间</label>
          <div class="time">{{ currentTime }}</div>
        </div>

        <div class="clock-out-time">
          <label>下班时间</label>
          <input
            type="time"
            v-model="clockOutTime"
            class="time-input"
          />
        </div>
      </div>

      <div class="reminder-status">
        <div class="status-item">
          <span class="label">提醒频率：</span>
          <span class="value">每小时一次</span>
        </div>
        <div class="status-item">
          <span class="label">下次提醒：</span>
          <span class="value">{{ nextReminderTime }}</span>
        </div>
        <div class="status-item">
          <span class="label">今日已提醒：</span>
          <span class="value">{{ reminderCount }} 次</span>
        </div>
      </div>

      <div class="controls">
        <button
          @click="toggleReminder"
          :class="['btn', isReminderActive ? 'btn-stop' : 'btn-start']"
        >
          {{ isReminderActive ? '⏸ 停止提醒' : '▶ 开启提醒' }}
        </button>
        <button @click="testReminder" class="btn btn-test">
          🔔 测试提醒
        </button>
      </div>

      <div v-if="lastReminderText" class="last-reminder">
        {{ lastReminderText }}
      </div>

      <div class="reminder-history">
        <h3>今日提醒记录</h3>
        <div v-if="reminderHistory.length === 0" class="empty-history">
          暂无提醒记录
        </div>
        <div v-else class="history-list">
          <div
            v-for="(record, index) in reminderHistory"
            :key="index"
            class="history-item"
          >
            <span class="history-time">{{ record.time }}</span>
            <span class="history-message">{{ record.message }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue'

export default {
  name: 'ClockOutReminder',
  setup() {
    const currentTime = ref('')
    const clockOutTime = ref('18:00')
    const isReminderActive = ref(false)
    const reminderCount = ref(0)
    const nextReminderTime = ref('--:--')
    const lastReminderText = ref('')
    const reminderHistory = ref([])

    let clockInterval = null
    let reminderInterval = null
    let lastReminderHour = -1

    // 更新当前时间
    const updateCurrentTime = () => {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      currentTime.value = `${hours}:${minutes}:${seconds}`

      // 计算下次提醒时间
      if (isReminderActive.value) {
        const nextHour = now.getHours() + 1
        nextReminderTime.value = `${String(nextHour).padStart(2, '0')}:00:00`
      }
    }

    // 显示提醒
    const showReminder = () => {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const timeStr = `${hours}:${minutes}`

      const message = `⏰ 打卡提醒：别忘记打卡哦！\n\n当前时间：${timeStr}\n下班时间：${clockOutTime.value}\n\n记得准时下班打卡！`

      alert(message)

      reminderCount.value++
      lastReminderText.value = `✅ 最近提醒时间：${timeStr}`

      // 添加到历史记录
      reminderHistory.value.unshift({
        time: timeStr,
        message: '下班打卡提醒'
      })

      // 限制历史记录最多10条
      if (reminderHistory.value.length > 10) {
        reminderHistory.value = reminderHistory.value.slice(0, 10)
      }
    }

    // 检查是否需要提醒（每小时一次）
    const checkHourlyReminder = () => {
      if (!isReminderActive.value) return

      const now = new Date()
      const currentHour = now.getHours()
      const currentMinute = now.getMinutes()

      // 每个整点（0分）提醒一次
      if (currentMinute === 0 && currentHour !== lastReminderHour) {
        showReminder()
        lastReminderHour = currentHour
      }
    }

    // 开启/停止提醒
    const toggleReminder = () => {
      isReminderActive.value = !isReminderActive.value

      if (isReminderActive.value) {
        lastReminderText.value = '✅ 提醒已开启，每小时整点提醒一次'
        // 立即显示一次提醒
        showReminder()
        lastReminderHour = new Date().getHours()
      } else {
        lastReminderText.value = '⏸ 提醒已暂停'
        nextReminderTime.value = '--:--'
      }
    }

    // 测试提醒
    const testReminder = () => {
      showReminder()
    }

    // 初始化
    onMounted(() => {
      // 更新时间，每秒一次
      updateCurrentTime()
      clockInterval = setInterval(updateCurrentTime, 1000)

      // 检查提醒，每分钟一次
      reminderInterval = setInterval(checkHourlyReminder, 60000)

      // 从localStorage恢复状态
      const savedClockOutTime = localStorage.getItem('clockOutTime')
      if (savedClockOutTime) {
        clockOutTime.value = savedClockOutTime
      }

      const savedHistory = localStorage.getItem('reminderHistory')
      if (savedHistory) {
        try {
          const parsed = JSON.parse(savedHistory)
          const today = new Date().toDateString()
          // 只恢复今天的记录
          reminderHistory.value = parsed.filter(record => {
            return record.date === today
          })
        } catch (e) {
          console.error('Failed to parse reminder history', e)
        }
      }
    })

    // 清理
    onUnmounted(() => {
      if (clockInterval) clearInterval(clockInterval)
      if (reminderInterval) clearInterval(reminderInterval)

      // 保存状态
      localStorage.setItem('clockOutTime', clockOutTime.value)

      const today = new Date().toDateString()
      const historyWithDate = reminderHistory.value.map(record => ({
        ...record,
        date: today
      }))
      localStorage.setItem('reminderHistory', JSON.stringify(historyWithDate))
    })

    return {
      currentTime,
      clockOutTime,
      isReminderActive,
      reminderCount,
      nextReminderTime,
      lastReminderText,
      reminderHistory,
      toggleReminder,
      testReminder
    }
  }
}
</script>

<style scoped>
.clock-out-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.clock-out-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.title {
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 30px;
}

.time-display {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.current-time,
.clock-out-time {
  text-align: center;
}

.time-display label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
  font-weight: 500;
}

.time {
  font-size: 36px;
  font-weight: bold;
  color: #667eea;
  font-family: 'Courier New', monospace;
}

.time-input {
  font-size: 28px;
  font-weight: bold;
  color: #764ba2;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  padding: 10px 20px;
  text-align: center;
  font-family: 'Courier New', monospace;
  width: 100%;
  max-width: 200px;
}

.time-input:focus {
  outline: none;
  border-color: #764ba2;
  box-shadow: 0 0 0 3px rgba(118, 75, 162, 0.1);
}

.reminder-status {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 30px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
}

.status-item:last-child {
  border-bottom: none;
}

.status-item .label {
  font-weight: 500;
  color: #555;
}

.status-item .value {
  font-weight: bold;
  color: #667eea;
  font-family: 'Courier New', monospace;
}

.controls {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.btn {
  flex: 1;
  padding: 15px 30px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.btn-start {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
}

.btn-start:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(67, 233, 123, 0.4);
}

.btn-stop {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.btn-stop:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(245, 87, 108, 0.4);
}

.btn-test {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.btn-test:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
}

.btn:active {
  transform: translateY(0);
}

.last-reminder {
  text-align: center;
  padding: 15px;
  background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
  border-radius: 10px;
  margin-bottom: 20px;
  font-weight: 500;
  color: #2d3436;
}

.reminder-history {
  margin-top: 30px;
}

.reminder-history h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e0e0e0;
}

.empty-history {
  text-align: center;
  color: #999;
  padding: 20px;
  font-style: italic;
}

.history-list {
  max-height: 250px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 10px;
  transition: all 0.2s ease;
}

.history-item:hover {
  background: #e9ecef;
  transform: translateX(5px);
}

.history-time {
  font-weight: bold;
  color: #667eea;
  font-family: 'Courier New', monospace;
  min-width: 60px;
}

.history-message {
  color: #555;
  flex: 1;
  margin-left: 15px;
}

@media (max-width: 768px) {
  .clock-out-card {
    padding: 30px 20px;
  }

  .time-display {
    grid-template-columns: 1fr;
  }

  .title {
    font-size: 24px;
  }

  .time {
    font-size: 28px;
  }

  .controls {
    flex-direction: column;
  }
}

/* 自定义滚动条 */
.history-list::-webkit-scrollbar {
  width: 8px;
}

.history-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.history-list::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
}

.history-list::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}
</style>
