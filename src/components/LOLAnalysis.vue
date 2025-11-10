<template>
  <div class="lol-analysis">
    <div class="header">
      <h1 class="title">英雄联盟全球总决赛战况分析</h1>
      <div class="refresh-btn" @click="fetchData">
        <span :class="{ spinning: loading }">⟳</span> 刷新数据
      </div>
    </div>

    <div class="content-wrapper">
      <!-- 当前对战卡片 -->
      <div class="match-card">
        <h2 class="section-title">决赛对战</h2>
        <div class="teams-vs">
          <div class="team team-blue">
            <img :src="currentMatch.teamA.logo" :alt="currentMatch.teamA.name" class="team-logo" />
            <div class="team-info">
              <h3>{{ currentMatch.teamA.name }}</h3>
              <p class="team-region">{{ currentMatch.teamA.region }}</p>
            </div>
            <div class="team-score">{{ currentMatch.scoreA }}</div>
          </div>

          <div class="vs-divider">
            <span class="vs-text">VS</span>
            <div class="match-status" :class="currentMatch.status">
              {{ currentMatch.status === 'live' ? '进行中' : '已结束' }}
            </div>
          </div>

          <div class="team team-red">
            <div class="team-score">{{ currentMatch.scoreB }}</div>
            <div class="team-info">
              <h3>{{ currentMatch.teamB.name }}</h3>
              <p class="team-region">{{ currentMatch.teamB.region }}</p>
            </div>
            <img :src="currentMatch.teamB.logo" :alt="currentMatch.teamB.name" class="team-logo" />
          </div>
        </div>
      </div>

      <!-- 统计数据 -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">⚔️</div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalKills }}</div>
            <div class="stat-label">总击杀数</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🏆</div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalGames }}</div>
            <div class="stat-label">总场次</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">⏱️</div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.avgGameTime }}</div>
            <div class="stat-label">平均时长</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🎯</div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.firstBloodRate }}%</div>
            <div class="stat-label">一血胜率</div>
          </div>
        </div>
      </div>

      <!-- 队伍详细数据对比 -->
      <div class="comparison-section">
        <h2 class="section-title">队伍数据对比</h2>
        <div class="comparison-grid">
          <div
            v-for="metric in metrics"
            :key="metric.name"
            class="metric-row"
          >
            <div class="metric-label">{{ metric.label }}</div>
            <div class="metric-bars">
              <div class="bar-container left">
                <div
                  class="bar bar-blue"
                  :style="{ width: getBarWidth(metric.teamA, metric.teamB, true) }"
                >
                  <span class="bar-value">{{ metric.teamA }}</span>
                </div>
              </div>
              <div class="bar-container right">
                <div
                  class="bar bar-red"
                  :style="{ width: getBarWidth(metric.teamA, metric.teamB, false) }"
                >
                  <span class="bar-value">{{ metric.teamB }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 选手MVP排行 -->
      <div class="players-section">
        <h2 class="section-title">选手MVP排行</h2>
        <div class="players-grid">
          <div
            v-for="(player, index) in players"
            :key="player.id"
            class="player-card"
          >
            <div class="player-rank" :class="'rank-' + (index + 1)">
              {{ index + 1 }}
            </div>
            <img :src="player.avatar" :alt="player.name" class="player-avatar" />
            <div class="player-details">
              <h4>{{ player.name }}</h4>
              <p class="player-team">{{ player.team }}</p>
              <div class="player-stats">
                <span class="player-kda">{{ player.kda }} KDA</span>
                <span class="player-role">{{ player.role }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 历史战绩 -->
      <div class="history-section">
        <h2 class="section-title">历史战绩</h2>
        <div class="history-timeline">
          <div
            v-for="match in matchHistory"
            :key="match.id"
            class="history-item"
          >
            <div class="history-date">{{ match.date }}</div>
            <div class="history-match">
              <span class="history-team">{{ match.teamA }}</span>
              <span class="history-score" :class="{ highlight: match.winner === 'A' }">
                {{ match.scoreA }}
              </span>
              <span class="history-vs">-</span>
              <span class="history-score" :class="{ highlight: match.winner === 'B' }">
                {{ match.scoreB }}
              </span>
              <span class="history-team">{{ match.teamB }}</span>
            </div>
            <div class="history-stage">{{ match.stage }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const loading = ref(false);

// 当前比赛数据
const currentMatch = ref({
  teamA: {
    name: 'T1',
    region: 'LCK',
    logo: 'https://via.placeholder.com/80/003057/FFFFFF?text=T1'
  },
  teamB: {
    name: 'BLG',
    region: 'LPL',
    logo: 'https://via.placeholder.com/80/C8102E/FFFFFF?text=BLG'
  },
  scoreA: 3,
  scoreB: 2,
  status: 'finished'
});

// 统计数据
const stats = ref({
  totalKills: 1247,
  totalGames: 73,
  avgGameTime: '32:15',
  firstBloodRate: 68
});

// 对比指标
const metrics = ref([
  { label: '场均击杀', teamA: 15.2, teamB: 14.8, name: 'kills' },
  { label: '场均死亡', teamA: 12.3, teamB: 13.1, name: 'deaths' },
  { label: '场均助攻', teamA: 34.5, teamB: 32.8, name: 'assists' },
  { label: '场均推塔', teamA: 7.2, teamB: 6.9, name: 'towers' },
  { label: '场均经济', teamA: 58.2, teamB: 56.7, name: 'gold' },
  { label: '场均大龙', teamA: 1.8, teamB: 1.5, name: 'baron' }
]);

// 选手数据
const players = ref([
  {
    id: 1,
    name: 'Faker',
    team: 'T1',
    role: '中单',
    kda: '8.5',
    avatar: 'https://via.placeholder.com/60/4169E1/FFFFFF?text=FK'
  },
  {
    id: 2,
    name: 'Elk',
    team: 'BLG',
    role: 'ADC',
    kda: '7.8',
    avatar: 'https://via.placeholder.com/60/DC143C/FFFFFF?text=EK'
  },
  {
    id: 3,
    name: 'Zeus',
    team: 'T1',
    role: '上单',
    kda: '6.9',
    avatar: 'https://via.placeholder.com/60/4169E1/FFFFFF?text=ZS'
  },
  {
    id: 4,
    name: 'Knight',
    team: 'BLG',
    role: '中单',
    kda: '6.5',
    avatar: 'https://via.placeholder.com/60/DC143C/FFFFFF?text=KT'
  },
  {
    id: 5,
    name: 'Gumayusi',
    team: 'T1',
    role: 'ADC',
    kda: '6.2',
    avatar: 'https://via.placeholder.com/60/4169E1/FFFFFF?text=GM'
  }
]);

// 历史战绩
const matchHistory = ref([
  { id: 1, date: '11-02', teamA: 'T1', teamB: 'BLG', scoreA: 3, scoreB: 2, winner: 'A', stage: '决赛' },
  { id: 2, date: '10-30', teamA: 'T1', teamB: 'GEN', scoreA: 3, scoreB: 1, winner: 'A', stage: '半决赛' },
  { id: 3, date: '10-27', teamA: 'BLG', teamB: 'WBG', scoreA: 3, scoreB: 1, winner: 'A', stage: '半决赛' },
  { id: 4, date: '10-24', teamA: 'T1', teamB: 'DK', scoreA: 3, scoreB: 0, winner: 'A', stage: '8强赛' },
  { id: 5, date: '10-23', teamA: 'BLG', teamB: 'HLE', scoreA: 3, scoreB: 2, winner: 'A', stage: '8强赛' }
]);

// 计算柱状图宽度
const getBarWidth = (valueA, valueB, isLeft) => {
  const total = Math.max(valueA, valueB);
  const value = isLeft ? valueA : valueB;
  return `${(value / total) * 100}%`;
};

// 获取数据
const fetchData = async () => {
  loading.value = true;
  try {
    const response = await axios.get('/api/lol/match-data');
    if (response.data.success) {
      // 更新数据
      if (response.data.currentMatch) currentMatch.value = response.data.currentMatch;
      if (response.data.stats) stats.value = response.data.stats;
      if (response.data.metrics) metrics.value = response.data.metrics;
      if (response.data.players) players.value = response.data.players;
      if (response.data.matchHistory) matchHistory.value = response.data.matchHistory;
    }
  } catch (error) {
    console.log('使用本地数据', error);
    // 使用本地数据，已经在 ref 中定义
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.lol-analysis {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1a2e 50%, #16213e 100%);
  color: #fff;
  overflow-y: auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
}

.title {
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(135deg, #00d4ff 0%, #0085ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(0, 212, 255, 0.3);
}

.refresh-btn {
  background: linear-gradient(135deg, #0085ff 0%, #0066cc 100%);
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  border: 1px solid rgba(0, 133, 255, 0.3);
}

.refresh-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 133, 255, 0.4);
}

.spinning {
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

/* 对战卡片 */
.match-card {
  background: rgba(30, 30, 60, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 30px;
  border: 1px solid rgba(0, 212, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #00d4ff;
  text-align: center;
}

.teams-vs {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.team {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
  min-width: 250px;
}

.team-blue {
  justify-content: flex-start;
}

.team-red {
  justify-content: flex-end;
}

.team-logo {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  border: 2px solid rgba(0, 212, 255, 0.4);
  object-fit: cover;
}

.team-info h3 {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.team-region {
  font-size: 14px;
  color: #888;
  margin: 5px 0 0;
}

.team-score {
  font-size: 48px;
  font-weight: 700;
  color: #00d4ff;
  text-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
}

.vs-divider {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.vs-text {
  font-size: 28px;
  font-weight: 700;
  color: #666;
}

.match-status {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.match-status.live {
  background: linear-gradient(135deg, #ff3333 0%, #cc0000 100%);
  animation: pulse 2s ease-in-out infinite;
}

.match-status.finished {
  background: rgba(100, 100, 100, 0.3);
  color: #999;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background: rgba(30, 30, 60, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  border: 1px solid rgba(0, 212, 255, 0.2);
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  border-color: rgba(0, 212, 255, 0.5);
  box-shadow: 0 8px 24px rgba(0, 212, 255, 0.2);
}

.stat-icon {
  font-size: 36px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #00d4ff;
}

.stat-label {
  font-size: 14px;
  color: #888;
  margin-top: 5px;
}

/* 对比数据 */
.comparison-section {
  background: rgba(30, 30, 60, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 30px;
  border: 1px solid rgba(0, 212, 255, 0.2);
}

.comparison-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.metric-row {
  display: grid;
  grid-template-columns: 150px 1fr;
  align-items: center;
  gap: 20px;
}

.metric-label {
  font-size: 15px;
  font-weight: 500;
  color: #aaa;
}

.metric-bars {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.bar-container {
  height: 32px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}

.bar-container.left {
  display: flex;
  justify-content: flex-end;
}

.bar {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 10px;
  transition: width 0.6s ease;
  position: relative;
}

.bar-blue {
  background: linear-gradient(90deg, transparent 0%, #0085ff 100%);
  justify-content: flex-end;
}

.bar-red {
  background: linear-gradient(90deg, #ff3366 0%, transparent 100%);
  justify-content: flex-start;
}

.bar-value {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

/* 选手卡片 */
.players-section {
  background: rgba(30, 30, 60, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 30px;
  border: 1px solid rgba(0, 212, 255, 0.2);
}

.players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.player-card {
  background: rgba(20, 20, 40, 0.6);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  border: 1px solid rgba(0, 212, 255, 0.2);
  transition: all 0.3s;
  position: relative;
}

.player-card:hover {
  transform: translateY(-5px);
  border-color: rgba(0, 212, 255, 0.5);
  box-shadow: 0 8px 24px rgba(0, 212, 255, 0.2);
}

.player-rank {
  position: absolute;
  top: -10px;
  left: -10px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  border: 2px solid;
}

.rank-1 {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  border-color: #ffd700;
  color: #000;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
}

.rank-2 {
  background: linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%);
  border-color: #c0c0c0;
  color: #000;
}

.rank-3 {
  background: linear-gradient(135deg, #cd7f32 0%, #e8a87c 100%);
  border-color: #cd7f32;
  color: #000;
}

.rank-4, .rank-5 {
  background: rgba(100, 100, 100, 0.5);
  border-color: #666;
  color: #fff;
}

.player-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid rgba(0, 212, 255, 0.4);
  object-fit: cover;
}

.player-details {
  flex: 1;
}

.player-details h4 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 5px;
}

.player-team {
  font-size: 13px;
  color: #888;
  margin: 0 0 10px;
}

.player-stats {
  display: flex;
  gap: 12px;
  font-size: 13px;
}

.player-kda {
  color: #00d4ff;
  font-weight: 600;
}

.player-role {
  color: #888;
}

/* 历史战绩 */
.history-section {
  background: rgba(30, 30, 60, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 30px;
  border: 1px solid rgba(0, 212, 255, 0.2);
}

.history-timeline {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.history-item {
  background: rgba(20, 20, 40, 0.6);
  border-radius: 10px;
  padding: 15px 20px;
  display: grid;
  grid-template-columns: 80px 1fr 100px;
  align-items: center;
  gap: 20px;
  border: 1px solid rgba(0, 212, 255, 0.15);
  transition: all 0.3s;
}

.history-item:hover {
  border-color: rgba(0, 212, 255, 0.4);
  background: rgba(30, 30, 50, 0.8);
}

.history-date {
  font-size: 13px;
  color: #888;
  font-weight: 500;
}

.history-match {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 15px;
}

.history-team {
  font-weight: 600;
  min-width: 60px;
}

.history-score {
  color: #888;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}

.history-score.highlight {
  color: #00d4ff;
  font-size: 18px;
}

.history-vs {
  color: #555;
}

.history-stage {
  font-size: 13px;
  color: #888;
  text-align: right;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .title {
    font-size: 24px;
  }

  .teams-vs {
    flex-direction: column;
  }

  .team {
    width: 100%;
    justify-content: center !important;
  }

  .vs-divider {
    order: 2;
  }

  .metric-row {
    grid-template-columns: 100px 1fr;
    gap: 10px;
  }

  .history-item {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .history-stage {
    text-align: center;
  }
}
</style>
