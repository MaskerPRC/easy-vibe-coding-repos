<template>
  <div class="lol-worlds-container">
    <!-- 冠军队伍信息 -->
    <div class="champion-section">
      <div class="champion-header">
        <div class="trophy-icon">🏆</div>
        <h1 class="champion-title">2025年英雄联盟全球总决赛</h1>
      </div>

      <div class="champion-info" v-if="championTeam">
        <div class="champion-banner">
          <div class="champion-name">{{ championTeam.name }}</div>
          <div class="champion-region">{{ championTeam.region }}</div>
        </div>

        <div class="team-members">
          <h3>冠军队伍成员</h3>
          <div class="members-grid">
            <div
              v-for="member in championTeam.members"
              :key="member.name"
              class="member-card"
            >
              <div class="member-role">{{ member.role }}</div>
              <div class="member-name">{{ member.name }}</div>
              <div class="member-realname">{{ member.realName }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 赛程日历 -->
    <div class="schedule-section">
      <h2 class="schedule-title">赛程安排</h2>

      <div class="calendar-container">
        <div
          v-for="match in schedule"
          :key="match.id"
          class="match-card"
          :class="{ 'finals': match.stage === '决赛', 'semi-finals': match.stage === '半决赛' }"
        >
          <div class="match-header">
            <div class="match-date">{{ match.date }}</div>
            <div class="match-stage">{{ match.stage }}</div>
          </div>

          <div class="match-body">
            <div class="team team-left">
              <div class="team-name">{{ match.team1 }}</div>
              <div class="team-score" v-if="match.score1 !== null">{{ match.score1 }}</div>
            </div>

            <div class="match-vs">VS</div>

            <div class="team team-right">
              <div class="team-score" v-if="match.score2 !== null">{{ match.score2 }}</div>
              <div class="team-name">{{ match.team2 }}</div>
            </div>
          </div>

          <div class="match-footer">
            <div class="match-time">{{ match.time }}</div>
            <div class="match-location">{{ match.location }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const championTeam = ref(null);
const schedule = ref([]);
const loading = ref(true);
const error = ref('');

// 获取赛程数据
const fetchScheduleData = async () => {
  try {
    loading.value = true;
    const response = await axios.get('/api/lol/worlds-2025');

    if (response.data.success) {
      championTeam.value = response.data.champion;
      schedule.value = response.data.schedule;
    } else {
      error.value = response.data.message || '获取数据失败';
    }
  } catch (err) {
    console.error('获取赛程数据失败:', err);
    error.value = '无法连接到服务器';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchScheduleData();
});
</script>

<style scoped>
.lol-worlds-container {
  min-height: 100vh;
  background: #0000AA;
  padding: 30px;
  color: #FFFFFF;
  font-family: 'Courier New', 'Fixedsys', monospace;
}

/* 冠军区域 */
.champion-section {
  background: #000088;
  border: 3px solid #FFFFFF;
  padding: 30px;
  margin-bottom: 40px;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.champion-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #AAAAAA;
}

.trophy-icon {
  font-size: 4em;
  animation: rotate 3s ease-in-out infinite;
}

@keyframes rotate {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-10deg); }
  75% { transform: rotate(10deg); }
}

.champion-title {
  font-size: 2.5em;
  color: #FFFF00;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 3px;
  text-align: center;
}

.champion-info {
  margin-top: 30px;
}

.champion-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #0000CC;
  border: 2px solid #FFFF00;
  padding: 20px 40px;
  margin-bottom: 30px;
}

.champion-name {
  font-size: 3em;
  font-weight: bold;
  color: #FFFF00;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.7);
  letter-spacing: 4px;
}

.champion-region {
  font-size: 1.5em;
  color: #FFFFFF;
  background: #AA0000;
  padding: 10px 20px;
  border: 2px solid #FFFFFF;
}

/* 队伍成员 */
.team-members {
  margin-top: 30px;
}

.team-members h3 {
  font-size: 1.8em;
  color: #FFFFFF;
  margin-bottom: 20px;
  text-align: center;
  letter-spacing: 2px;
  border-bottom: 2px solid #AAAAAA;
  padding-bottom: 10px;
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.member-card {
  background: #0000CC;
  border: 2px solid #AAAAAA;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
}

.member-card:hover {
  border-color: #FFFF00;
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(255, 255, 0, 0.3);
}

.member-role {
  font-size: 0.9em;
  color: #AAAAAA;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.member-name {
  font-size: 1.5em;
  font-weight: bold;
  color: #FFFF00;
  margin-bottom: 5px;
  letter-spacing: 2px;
}

.member-realname {
  font-size: 0.9em;
  color: #CCCCCC;
  font-style: italic;
}

/* 赛程区域 */
.schedule-section {
  background: #000088;
  border: 3px solid #FFFFFF;
  padding: 30px;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.schedule-title {
  font-size: 2.2em;
  color: #FFFF00;
  text-align: center;
  margin-bottom: 30px;
  letter-spacing: 3px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  border-bottom: 2px solid #AAAAAA;
  padding-bottom: 15px;
}

.calendar-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 25px;
}

/* 比赛卡片 */
.match-card {
  background: #0000CC;
  border: 2px solid #AAAAAA;
  padding: 20px;
  transition: all 0.3s ease;
}

.match-card:hover {
  border-color: #FFFFFF;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(255, 255, 255, 0.2);
}

.match-card.finals {
  border-color: #FFFF00;
  border-width: 3px;
  background: linear-gradient(135deg, #0000CC 0%, #0000AA 100%);
}

.match-card.semi-finals {
  border-color: #FFFFFF;
  border-width: 3px;
}

.match-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #AAAAAA;
}

.match-date {
  font-size: 1.1em;
  color: #FFFFFF;
  font-weight: bold;
  letter-spacing: 1px;
}

.match-stage {
  font-size: 1em;
  color: #FFFF00;
  background: #AA0000;
  padding: 5px 15px;
  border: 1px solid #FFFFFF;
  font-weight: bold;
}

.match-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
  gap: 15px;
}

.team {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.team-left {
  justify-content: flex-start;
}

.team-right {
  justify-content: flex-end;
}

.team-name {
  font-size: 1.3em;
  font-weight: bold;
  color: #FFFFFF;
  letter-spacing: 1px;
}

.team-score {
  font-size: 2em;
  font-weight: bold;
  color: #FFFF00;
  min-width: 40px;
  text-align: center;
}

.match-vs {
  font-size: 1.5em;
  font-weight: bold;
  color: #AAAAAA;
  padding: 0 10px;
}

.match-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid #AAAAAA;
  font-size: 0.9em;
  color: #CCCCCC;
}

.match-time {
  color: #FFFFFF;
}

.match-location {
  color: #AAAAAA;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .lol-worlds-container {
    padding: 15px;
  }

  .champion-title {
    font-size: 1.8em;
  }

  .trophy-icon {
    font-size: 2.5em;
  }

  .champion-banner {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .champion-name {
    font-size: 2em;
  }

  .champion-region {
    font-size: 1.2em;
  }

  .members-grid {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 15px;
  }

  .calendar-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .match-body {
    flex-direction: column;
    gap: 10px;
  }

  .team {
    width: 100%;
    justify-content: center !important;
  }

  .match-vs {
    transform: rotate(90deg);
  }
}
</style>
