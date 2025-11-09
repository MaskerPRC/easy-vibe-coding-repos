<template>
  <div class="ziwei-container">
    <nav class="top-nav">
      <router-link to="/" class="nav-link">返回主页</router-link>
    </nav>

    <div class="header">
      <h1>紫微斗数排盘</h1>
      <p class="subtitle">中国传统命理学 - 紫微斗数在线排盘系统</p>
    </div>

    <div class="input-section">
      <div class="form-group">
        <label>性别：</label>
        <div class="radio-group">
          <label>
            <input type="radio" v-model="form.gender" value="male" /> 男
          </label>
          <label>
            <input type="radio" v-model="form.gender" value="female" /> 女
          </label>
        </div>
      </div>

      <div class="form-group">
        <label>出生日期：</label>
        <input type="date" v-model="form.birthDate" class="date-input" />
      </div>

      <div class="form-group">
        <label>出生时辰：</label>
        <select v-model="form.birthHour" class="select-input">
          <option value="">请选择时辰</option>
          <option value="0">子时 (23:00-01:00)</option>
          <option value="1">丑时 (01:00-03:00)</option>
          <option value="2">寅时 (03:00-05:00)</option>
          <option value="3">卯时 (05:00-07:00)</option>
          <option value="4">辰时 (07:00-09:00)</option>
          <option value="5">巳时 (09:00-11:00)</option>
          <option value="6">午时 (11:00-13:00)</option>
          <option value="7">未时 (13:00-15:00)</option>
          <option value="8">申时 (15:00-17:00)</option>
          <option value="9">酉时 (17:00-19:00)</option>
          <option value="10">戌时 (19:00-21:00)</option>
          <option value="11">亥时 (21:00-23:00)</option>
        </select>
      </div>

      <button @click="calculateChart" class="calculate-btn">开始排盘</button>
    </div>

    <div v-if="chartData" class="result-section">
      <h2>命盘结果</h2>

      <div class="info-panel">
        <div class="info-item">
          <strong>命主：</strong>{{ chartData.mingzhu }}
        </div>
        <div class="info-item">
          <strong>身主：</strong>{{ chartData.shenzhu }}
        </div>
        <div class="info-item">
          <strong>命宫：</strong>{{ chartData.minggong }}
        </div>
        <div class="info-item">
          <strong>身宫：</strong>{{ chartData.shengong }}
        </div>
      </div>

      <div class="chart-grid">
        <div
          v-for="(palace, index) in chartData.palaces"
          :key="index"
          class="palace"
          :class="getPalaceClass(index)"
        >
          <div class="palace-name">{{ palace.name }}</div>
          <div class="palace-earthly">{{ palace.earthlyBranch }}</div>
          <div class="stars-list">
            <div
              v-for="(star, starIndex) in palace.stars"
              :key="starIndex"
              class="star"
              :class="star.type"
            >
              {{ star.name }}
            </div>
          </div>
        </div>
      </div>

      <div class="description">
        <h3>基本解析</h3>
        <p>{{ chartData.description }}</p>
      </div>
    </div>

    <div v-if="!chartData" class="placeholder">
      <p>请输入出生信息后点击"开始排盘"查看命盘</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { calculateZiWeiChart } from '../utils/ziwei-calculator.js';

export default {
  name: 'ZiWei',
  setup() {
    const form = ref({
      gender: 'male',
      birthDate: '',
      birthHour: ''
    });

    const chartData = ref(null);

    const calculateChart = () => {
      if (!form.value.birthDate || !form.value.birthHour) {
        alert('请填写完整的出生信息');
        return;
      }

      const birthInfo = {
        gender: form.value.gender,
        date: form.value.birthDate,
        hour: parseInt(form.value.birthHour)
      };

      chartData.value = calculateZiWeiChart(birthInfo);
    };

    const getPalaceClass = (index) => {
      const positions = [
        'pos-1', 'pos-2', 'pos-3', 'pos-4',
        'pos-5', 'pos-6', 'pos-7', 'pos-8',
        'pos-9', 'pos-10', 'pos-11', 'pos-12'
      ];
      return positions[index];
    };

    return {
      form,
      chartData,
      calculateChart,
      getPalaceClass
    };
  }
};
</script>

<style scoped>
.ziwei-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Microsoft YaHei', sans-serif;
  position: relative;
}

.top-nav {
  position: absolute;
  top: 20px;
  right: 20px;
}

.nav-link {
  color: #8b4513;
  text-decoration: none;
  font-size: 14px;
  padding: 8px 15px;
  border: 1px solid #8b4513;
  border-radius: 4px;
  transition: all 0.3s;
}

.nav-link:hover {
  background-color: #8b4513;
  color: white;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 2.5em;
  color: #8b4513;
  margin-bottom: 10px;
}

.subtitle {
  color: #666;
  font-size: 1.1em;
}

.input-section {
  background: #f9f9f9;
  padding: 30px;
  border-radius: 10px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: inline-block;
  width: 120px;
  font-weight: bold;
  color: #333;
}

.radio-group {
  display: inline-block;
}

.radio-group label {
  width: auto;
  margin-right: 20px;
  font-weight: normal;
}

.date-input,
.select-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1em;
  width: 250px;
}

.calculate-btn {
  display: block;
  width: 200px;
  margin: 30px auto 0;
  padding: 12px 24px;
  background: linear-gradient(135deg, #8b4513, #cd853f);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1.1em;
  cursor: pointer;
  transition: all 0.3s;
}

.calculate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(139, 69, 19, 0.3);
}

.result-section {
  margin-top: 40px;
}

.result-section h2 {
  text-align: center;
  color: #8b4513;
  font-size: 2em;
  margin-bottom: 30px;
}

.info-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
  padding: 20px;
  background: #fff8dc;
  border-radius: 10px;
}

.info-item {
  padding: 10px;
  background: white;
  border-radius: 5px;
  text-align: center;
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 2px;
  background: #8b4513;
  border: 3px solid #8b4513;
  margin-bottom: 30px;
  min-height: 600px;
}

.palace {
  background: white;
  padding: 15px;
  position: relative;
  min-height: 180px;
  display: flex;
  flex-direction: column;
}

.palace-name {
  font-weight: bold;
  font-size: 1.1em;
  color: #8b4513;
  margin-bottom: 5px;
  text-align: center;
}

.palace-earthly {
  font-size: 0.9em;
  color: #666;
  text-align: center;
  margin-bottom: 10px;
}

.stars-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.star {
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 0.9em;
  text-align: center;
}

.star.main {
  background: #ffebcd;
  color: #8b4513;
  font-weight: bold;
  border: 1px solid #daa520;
}

.star.minor {
  background: #f0f0f0;
  color: #555;
}

.star.lucky {
  background: #ffe4e1;
  color: #dc143c;
}

/* 宫位位置布局 */
.pos-1 { grid-column: 4; grid-row: 1; }
.pos-2 { grid-column: 4; grid-row: 2; }
.pos-3 { grid-column: 4; grid-row: 3; }
.pos-4 { grid-column: 3; grid-row: 3; }
.pos-5 { grid-column: 2; grid-row: 3; }
.pos-6 { grid-column: 1; grid-row: 3; }
.pos-7 { grid-column: 1; grid-row: 2; }
.pos-8 { grid-column: 1; grid-row: 1; }
.pos-9 { grid-column: 2; grid-row: 1; }
.pos-10 { grid-column: 3; grid-row: 1; }
.pos-11 { grid-column: 3; grid-row: 2; }
.pos-12 { grid-column: 2; grid-row: 2; }

.description {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
}

.description h3 {
  color: #8b4513;
  margin-bottom: 15px;
}

.description p {
  line-height: 1.8;
  color: #333;
}

.placeholder {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 1.2em;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chart-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(6, 1fr);
  }

  .pos-1 { grid-column: 2; grid-row: 1; }
  .pos-2 { grid-column: 2; grid-row: 2; }
  .pos-3 { grid-column: 2; grid-row: 3; }
  .pos-4 { grid-column: 2; grid-row: 4; }
  .pos-5 { grid-column: 2; grid-row: 5; }
  .pos-6 { grid-column: 2; grid-row: 6; }
  .pos-7 { grid-column: 1; grid-row: 6; }
  .pos-8 { grid-column: 1; grid-row: 5; }
  .pos-9 { grid-column: 1; grid-row: 4; }
  .pos-10 { grid-column: 1; grid-row: 3; }
  .pos-11 { grid-column: 1; grid-row: 2; }
  .pos-12 { grid-column: 1; grid-row: 1; }
}
</style>
