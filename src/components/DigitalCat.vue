<template>
  <div class="digital-cat-container">
    <!-- 标题区 -->
    <div class="header">
      <h1 class="title">数码猫咪世界</h1>
      <p class="subtitle">Digital Cat Universe - 赛博宠物养成</p>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <div class="loader"></div>
      <p>加载数码猫咪中...</p>
    </div>

    <!-- 消息提示 -->
    <transition name="fade">
      <div v-if="message" class="message" :class="messageType">
        {{ message }}
      </div>
    </transition>

    <!-- 猫咪卡片网格 -->
    <div v-if="!loading" class="cats-grid">
      <div
        v-for="cat in cats"
        :key="cat.id"
        class="cat-card"
        :style="{ borderColor: cat.color }"
      >
        <!-- 猫咪头像 -->
        <div class="cat-avatar" :style="{ background: `linear-gradient(135deg, ${cat.color}44, ${cat.color}88)` }">
          <div class="cat-icon" :style="{ color: cat.color }">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <!-- 猫咪耳朵 -->
              <polygon points="20,30 30,10 40,30" fill="currentColor" opacity="0.8"/>
              <polygon points="60,30 70,10 80,30" fill="currentColor" opacity="0.8"/>
              <!-- 猫咪头部 -->
              <circle cx="50" cy="50" r="30" fill="currentColor" opacity="0.6"/>
              <!-- 猫咪眼睛 -->
              <circle cx="40" cy="45" r="5" fill="#000"/>
              <circle cx="60" cy="45" r="5" fill="#000"/>
              <circle cx="42" cy="44" r="2" fill="#fff"/>
              <circle cx="62" cy="44" r="2" fill="#fff"/>
              <!-- 猫咪鼻子 -->
              <polygon points="50,55 47,58 53,58" fill="#ff69b4"/>
            </svg>
          </div>
          <div class="level-badge" :style="{ backgroundColor: cat.color }">
            Lv.{{ cat.level }}
          </div>
        </div>

        <!-- 猫咪信息 -->
        <div class="cat-info">
          <h2 class="cat-name" :style="{ color: cat.color }">{{ cat.name }}</h2>
          <div class="cat-type">[ {{ getTypeLabel(cat.type) }} ]</div>

          <!-- 属性条 -->
          <div class="stats">
            <!-- HP条 -->
            <div class="stat-item">
              <div class="stat-label">
                <span>HP</span>
                <span class="stat-value">{{ cat.hp }} / {{ cat.maxHp }}</span>
              </div>
              <div class="stat-bar">
                <div
                  class="stat-fill hp-fill"
                  :style="{ width: `${(cat.hp / cat.maxHp) * 100}%` }"
                ></div>
              </div>
            </div>

            <!-- 能量条 -->
            <div class="stat-item">
              <div class="stat-label">
                <span>能量</span>
                <span class="stat-value">{{ cat.energy }} / {{ cat.maxEnergy }}</span>
              </div>
              <div class="stat-bar">
                <div
                  class="stat-fill energy-fill"
                  :style="{ width: `${(cat.energy / cat.maxEnergy) * 100}%` }"
                ></div>
              </div>
            </div>

            <!-- 经验条 -->
            <div class="stat-item">
              <div class="stat-label">
                <span>经验</span>
                <span class="stat-value">{{ cat.exp }} / {{ cat.maxExp }}</span>
              </div>
              <div class="stat-bar">
                <div
                  class="stat-fill exp-fill"
                  :style="{ width: `${(cat.exp / cat.maxExp) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>

          <!-- 技能列表 -->
          <div class="skills">
            <div class="skills-title">技能:</div>
            <div class="skills-list">
              <span
                v-for="(skill, index) in cat.skills"
                :key="index"
                class="skill-tag"
                :style="{ borderColor: cat.color, color: cat.color }"
              >
                {{ skill }}
              </span>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="actions">
            <button
              class="action-btn feed-btn"
              @click="feedCat(cat.id)"
              :disabled="actionLoading === cat.id"
            >
              <span class="btn-icon">🍖</span>
              <span>喂食</span>
            </button>
            <button
              class="action-btn play-btn"
              @click="playCat(cat.id)"
              :disabled="actionLoading === cat.id || cat.energy < 20"
            >
              <span class="btn-icon">🎮</span>
              <span>玩耍</span>
            </button>
            <button
              class="action-btn train-btn"
              @click="trainCat(cat.id)"
              :disabled="actionLoading === cat.id || cat.energy < 30"
            >
              <span class="btn-icon">⚡</span>
              <span>训练</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="footer">
      <p>自动能量恢复系统运行中...</p>
      <p class="hint">提示: 与猫咪互动获得经验，升级解锁更多能力</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';

export default {
  name: 'DigitalCat',
  setup() {
    const cats = ref([]);
    const loading = ref(true);
    const message = ref('');
    const messageType = ref('success');
    const actionLoading = ref(null);
    let recoveryInterval = null;

    // 获取猫咪类型标签
    const getTypeLabel = (type) => {
      const labels = {
        cyber: '赛博型',
        code: '代码型',
        neon: '霓虹型',
        pixel: '像素型'
      };
      return labels[type] || type;
    };

    // 显示消息
    const showMessage = (msg, type = 'success') => {
      message.value = msg;
      messageType.value = type;
      setTimeout(() => {
        message.value = '';
      }, 3000);
    };

    // 加载所有猫咪
    const loadCats = async () => {
      try {
        loading.value = true;
        const response = await axios.get('/api/cats');
        if (response.data.success) {
          cats.value = response.data.cats;
        }
      } catch (error) {
        console.error('加载猫咪失败:', error);
        showMessage('加载失败，请检查网络连接', 'error');
      } finally {
        loading.value = false;
      }
    };

    // 更新单只猫咪数据
    const updateCat = (catData) => {
      const index = cats.value.findIndex(c => c.id === catData.id);
      if (index !== -1) {
        cats.value[index] = catData;
      }
    };

    // 喂食猫咪
    const feedCat = async (catId) => {
      try {
        actionLoading.value = catId;
        const response = await axios.post(`/api/cats/${catId}/feed`);
        if (response.data.success) {
          updateCat(response.data.cat);
          showMessage(response.data.message, 'success');
        } else {
          showMessage(response.data.message, 'warning');
        }
      } catch (error) {
        console.error('喂食失败:', error);
        showMessage('操作失败', 'error');
      } finally {
        actionLoading.value = null;
      }
    };

    // 与猫咪玩耍
    const playCat = async (catId) => {
      try {
        actionLoading.value = catId;
        const response = await axios.post(`/api/cats/${catId}/play`);
        if (response.data.success) {
          updateCat(response.data.cat);
          if (response.data.levelUp) {
            showMessage(response.data.message, 'success');
          } else {
            showMessage(response.data.message, 'success');
          }
        } else {
          showMessage(response.data.message, 'warning');
        }
      } catch (error) {
        console.error('玩耍失败:', error);
        showMessage('操作失败', 'error');
      } finally {
        actionLoading.value = null;
      }
    };

    // 训练猫咪
    const trainCat = async (catId) => {
      try {
        actionLoading.value = catId;
        const response = await axios.post(`/api/cats/${catId}/train`);
        if (response.data.success) {
          updateCat(response.data.cat);
          if (response.data.levelUp) {
            showMessage(response.data.message, 'success');
          } else {
            showMessage(response.data.message, 'success');
          }
        } else {
          showMessage(response.data.message, 'warning');
        }
      } catch (error) {
        console.error('训练失败:', error);
        showMessage('操作失败', 'error');
      } finally {
        actionLoading.value = null;
      }
    };

    // 自动恢复能量
    const autoRecover = async () => {
      for (const cat of cats.value) {
        if (cat.energy < cat.maxEnergy) {
          try {
            const response = await axios.post(`/api/cats/${cat.id}/recover`);
            if (response.data.success) {
              updateCat(response.data.cat);
            }
          } catch (error) {
            console.error('恢复能量失败:', error);
          }
        }
      }
    };

    // 组件挂载
    onMounted(() => {
      loadCats();
      // 每5秒自动恢复能量
      recoveryInterval = setInterval(autoRecover, 5000);
    });

    // 组件卸载
    onUnmounted(() => {
      if (recoveryInterval) {
        clearInterval(recoveryInterval);
      }
    });

    return {
      cats,
      loading,
      message,
      messageType,
      actionLoading,
      getTypeLabel,
      feedCat,
      playCat,
      trainCat
    };
  }
};
</script>

<style scoped>
.digital-cat-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1a2e 50%, #16213e 100%);
  color: #fff;
  padding: 20px;
  font-family: 'Courier New', monospace;
}

/* 标题区 */
.header {
  text-align: center;
  margin-bottom: 40px;
  padding: 20px;
}

.title {
  font-size: 3em;
  margin: 0;
  background: linear-gradient(90deg, #00ffff, #ff00ff, #ffff00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    filter: drop-shadow(0 0 10px rgba(0, 255, 255, 0.5));
  }
  to {
    filter: drop-shadow(0 0 20px rgba(255, 0, 255, 0.8));
  }
}

.subtitle {
  font-size: 1.2em;
  color: #00ffff;
  margin-top: 10px;
  opacity: 0.8;
}

/* 加载状态 */
.loading {
  text-align: center;
  padding: 100px 20px;
}

.loader {
  border: 4px solid rgba(0, 255, 255, 0.2);
  border-top: 4px solid #00ffff;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 消息提示 */
.message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 15px 30px;
  border-radius: 8px;
  font-weight: bold;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.message.success {
  background: rgba(0, 255, 0, 0.2);
  border: 2px solid #00ff00;
  color: #00ff00;
}

.message.warning {
  background: rgba(255, 255, 0, 0.2);
  border: 2px solid #ffff00;
  color: #ffff00;
}

.message.error {
  background: rgba(255, 0, 0, 0.2);
  border: 2px solid #ff0000;
  color: #ff0000;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* 猫咪卡片网格 */
.cats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.cat-card {
  background: rgba(20, 20, 40, 0.8);
  border: 2px solid;
  border-radius: 15px;
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.cat-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.03),
    transparent
  );
  transform: rotate(45deg);
  transition: all 0.5s;
}

.cat-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 40px rgba(0, 255, 255, 0.3);
}

.cat-card:hover::before {
  left: 100%;
}

/* 猫咪头像 */
.cat-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin: 0 auto 20px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid rgba(255, 255, 255, 0.2);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.cat-icon {
  width: 80px;
  height: 80px;
}

.level-badge {
  position: absolute;
  bottom: -5px;
  right: -5px;
  padding: 5px 12px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9em;
  color: #000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

/* 猫咪信息 */
.cat-info {
  text-align: center;
}

.cat-name {
  font-size: 1.8em;
  margin: 10px 0;
  text-shadow: 0 0 10px currentColor;
}

.cat-type {
  font-size: 0.9em;
  color: #888;
  margin-bottom: 20px;
}

/* 属性条 */
.stats {
  margin: 20px 0;
}

.stat-item {
  margin-bottom: 12px;
}

.stat-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.9em;
  margin-bottom: 5px;
  color: #aaa;
}

.stat-value {
  color: #fff;
  font-weight: bold;
}

.stat-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.stat-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.5s ease;
  position: relative;
  overflow: hidden;
}

.stat-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.hp-fill {
  background: linear-gradient(90deg, #ff4444, #ff6666);
}

.energy-fill {
  background: linear-gradient(90deg, #44aaff, #66bbff);
}

.exp-fill {
  background: linear-gradient(90deg, #ffaa44, #ffcc66);
}

/* 技能列表 */
.skills {
  margin: 20px 0;
  text-align: left;
}

.skills-title {
  font-size: 0.9em;
  color: #aaa;
  margin-bottom: 8px;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  padding: 5px 12px;
  border: 1px solid;
  border-radius: 15px;
  font-size: 0.85em;
  background: rgba(0, 0, 0, 0.3);
}

/* 操作按钮 */
.actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.action-btn {
  flex: 1;
  padding: 12px;
  border: 2px solid;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.btn-icon {
  font-size: 1.5em;
}

.action-btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px currentColor;
}

.action-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.feed-btn {
  border-color: #ff4444;
  color: #ff4444;
}

.play-btn {
  border-color: #44ff44;
  color: #44ff44;
}

.train-btn {
  border-color: #ffaa44;
  color: #ffaa44;
}

/* 底部信息 */
.footer {
  text-align: center;
  margin-top: 50px;
  padding: 30px;
  color: #666;
  font-size: 0.9em;
}

.hint {
  margin-top: 10px;
  color: #888;
  font-style: italic;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cats-grid {
    grid-template-columns: 1fr;
  }

  .title {
    font-size: 2em;
  }

  .action-btn {
    padding: 10px;
    font-size: 0.9em;
  }
}
</style>
