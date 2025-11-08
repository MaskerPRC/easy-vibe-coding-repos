<template>
  <div class="rating-container">
    <div class="rating-header">
      <h2>内容评分系统</h2>
      <p class="subtitle">为内容打分并查看评分结果</p>
    </div>

    <div class="rating-content">
      <!-- 当前评分统计 -->
      <div class="rating-stats">
        <div class="average-score">
          <div class="score-number">{{ averageScore }}</div>
          <div class="score-label">平均分</div>
          <div class="total-ratings">共 {{ totalRatings }} 人评分</div>
        </div>

        <div class="stars-display">
          <div class="stars">
            <span
              v-for="star in 5"
              :key="'display-' + star"
              class="star"
              :class="{ filled: star <= Math.round(averageScore) }"
            >
              ★
            </span>
          </div>
        </div>
      </div>

      <!-- 用户评分区域 -->
      <div class="user-rating-section">
        <div v-if="userRating" class="user-has-rated">
          <div class="rating-status">
            <span class="status-icon">✓</span>
            <span class="status-text">您已评分</span>
          </div>
          <div class="user-score">
            您的评分: <span class="score-value">{{ userRating }} 分</span>
          </div>
          <button @click="resetRating" class="btn-secondary">重新评分</button>
        </div>

        <div v-else class="rating-input">
          <h3>为此内容打分</h3>
          <div class="stars-input">
            <span
              v-for="star in 5"
              :key="'input-' + star"
              class="star interactive"
              :class="{ filled: star <= hoverStar || star <= selectedStar }"
              @mouseenter="hoverStar = star"
              @mouseleave="hoverStar = 0"
              @click="selectRating(star)"
            >
              ★
            </span>
          </div>
          <div class="rating-label" v-if="selectedStar">
            {{ getRatingLabel(selectedStar) }}
          </div>
        </div>
      </div>

      <!-- 评分分布 -->
      <div class="rating-distribution">
        <h3>评分分布</h3>
        <div class="distribution-bars">
          <div
            v-for="score in [5, 4, 3, 2, 1]"
            :key="'dist-' + score"
            class="distribution-row"
          >
            <span class="score-label">{{ score }} 星</span>
            <div class="bar-container">
              <div
                class="bar"
                :style="{ width: getDistributionWidth(score) + '%' }"
              ></div>
            </div>
            <span class="count">{{ getScoreCount(score) }}</span>
          </div>
        </div>
      </div>

      <!-- 状态消息 -->
      <div v-if="message" class="message" :class="messageType">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'RatingScore',
  setup() {
    const ratings = ref([])
    const userRating = ref(null)
    const selectedStar = ref(0)
    const hoverStar = ref(0)
    const isSubmitting = ref(false)
    const message = ref('')
    const messageType = ref('info')

    const averageScore = computed(() => {
      if (ratings.value.length === 0) return 0
      const sum = ratings.value.reduce((acc, r) => acc + r.score, 0)
      return (sum / ratings.value.length).toFixed(1)
    })

    const totalRatings = computed(() => ratings.value.length)

    const getRatingLabel = (score) => {
      const labels = {
        1: '非常差',
        2: '较差',
        3: '一般',
        4: '良好',
        5: '非常好'
      }
      return labels[score]
    }

    const getScoreCount = (score) => {
      return ratings.value.filter(r => r.score === score).length
    }

    const getDistributionWidth = (score) => {
      if (ratings.value.length === 0) return 0
      const count = getScoreCount(score)
      return (count / ratings.value.length) * 100
    }

    const selectRating = (star) => {
      selectedStar.value = star
    }

    const loadRatings = async () => {
      try {
        const response = await fetch('/api/ratings')
        const data = await response.json()
        ratings.value = data.ratings || []
        userRating.value = data.userRating || null
      } catch (error) {
        console.error('加载评分失败:', error)
        showMessage('加载评分数据失败', 'error')
      }
    }

    const submitRating = async () => {
      if (!selectedStar.value) return

      isSubmitting.value = true
      try {
        const response = await fetch('/api/ratings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            score: selectedStar.value
          })
        })

        const data = await response.json()
        if (data.success) {
          userRating.value = selectedStar.value
          selectedStar.value = 0
          await loadRatings()
          showMessage('评分提交成功！', 'success')
        } else {
          showMessage(data.message || '评分提交失败', 'error')
        }
      } catch (error) {
        console.error('提交评分失败:', error)
        showMessage('提交评分失败，请稍后重试', 'error')
      } finally {
        isSubmitting.value = false
      }
    }

    const resetRating = () => {
      userRating.value = null
      selectedStar.value = 0
    }

    const showMessage = (msg, type = 'info') => {
      message.value = msg
      messageType.value = type
      setTimeout(() => {
        message.value = ''
      }, 3000)
    }

    onMounted(() => {
      loadRatings()
    })

    return {
      ratings,
      userRating,
      selectedStar,
      hoverStar,
      isSubmitting,
      message,
      messageType,
      averageScore,
      totalRatings,
      getRatingLabel,
      getScoreCount,
      getDistributionWidth,
      selectRating,
      submitRating,
      resetRating
    }
  }
}
</script>

<style scoped>
.rating-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.rating-header {
  text-align: center;
  margin-bottom: 40px;
}

.rating-header h2 {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
}

.subtitle {
  color: #666;
  font-size: 16px;
}

.rating-content {
  background: #ffffff;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.rating-stats {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 30px;
  background: #f8f9fa;
  border-radius: 12px;
  color: #333;
  margin-bottom: 30px;
  border: 1px solid #e0e0e0;
}

.average-score {
  text-align: center;
}

.score-number {
  font-size: 64px;
  font-weight: 700;
  line-height: 1;
}

.score-label {
  font-size: 18px;
  margin-top: 5px;
  opacity: 0.9;
}

.total-ratings {
  font-size: 14px;
  margin-top: 5px;
  opacity: 0.8;
}

.stars-display .stars {
  font-size: 48px;
}

.star {
  color: rgba(255, 255, 255, 0.3);
  transition: color 0.2s;
}

.star.filled {
  color: #ffd700;
}

.user-rating-section {
  margin: 30px 0;
  padding: 25px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
}

.user-has-rated {
  text-align: center;
}

.rating-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 15px;
}

.status-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #10b981;
  color: white;
  border-radius: 50%;
  font-weight: bold;
}

.status-text {
  font-size: 18px;
  font-weight: 600;
  color: #10b981;
}

.user-score {
  font-size: 20px;
  margin-bottom: 20px;
  color: #333;
}

.score-value {
  font-weight: 700;
  color: #ffd700;
}

.rating-input {
  text-align: center;
}

.rating-input h3 {
  margin-bottom: 20px;
  color: #333;
  font-size: 20px;
}

.stars-input {
  font-size: 56px;
  margin: 20px 0;
  user-select: none;
}

.star.interactive {
  cursor: pointer;
  margin: 0 5px;
  color: #ddd;
  transition: all 0.2s;
}

.star.interactive:hover,
.star.interactive.filled {
  color: #ffd700;
  transform: scale(1.1);
}

.rating-label {
  font-size: 18px;
  color: #ffd700;
  font-weight: 600;
  margin: 15px 0;
  min-height: 24px;
}

.btn-primary,
.btn-secondary {
  padding: 12px 32px;
  border: 1px solid #667eea;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 15px;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  background: #5568d3;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f8f9fa;
  color: #333;
}

.btn-secondary:hover {
  background: #e9ecef;
}

.rating-distribution {
  margin-top: 30px;
}

.rating-distribution h3 {
  margin-bottom: 20px;
  color: #333;
  font-size: 20px;
}

.distribution-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 12px;
}

.distribution-row .score-label {
  width: 50px;
  font-size: 14px;
  color: #666;
}

.bar-container {
  flex: 1;
  height: 24px;
  background: #e9ecef;
  border-radius: 12px;
  overflow: hidden;
}

.bar {
  height: 100%;
  background: #667eea;
  transition: width 0.3s;
  border-radius: 12px;
}

.distribution-row .count {
  width: 40px;
  text-align: right;
  font-size: 14px;
  color: #666;
  font-weight: 600;
}

.message {
  margin-top: 20px;
  padding: 12px 20px;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
}

.message.success {
  background: #d1fae5;
  color: #065f46;
}

.message.error {
  background: #fee2e2;
  color: #991b1b;
}

.message.info {
  background: #dbeafe;
  color: #1e40af;
}

@media (max-width: 768px) {
  .rating-stats {
    flex-direction: column;
    gap: 20px;
  }

  .stars-display .stars {
    font-size: 36px;
  }

  .score-number {
    font-size: 48px;
  }

  .stars-input {
    font-size: 40px;
  }
}
</style>
