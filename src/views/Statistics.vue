<template>
  <Layout>
    <div class="statistics-page">
      <div class="page-header">
        <h2>统计分析</h2>
        <el-button @click="loadData" :loading="loading">
          <el-icon><Refresh /></el-icon>
          刷新数据
        </el-button>
      </div>

      <el-row :gutter="20">
        <!-- 系统总览 -->
        <el-col :xs="24" :md="12">
          <el-card header="系统总览">
            <div ref="systemChartRef" style="height: 300px"></div>
          </el-card>
        </el-col>

        <!-- 任务统计 -->
        <el-col :xs="24" :md="12">
          <el-card header="任务统计">
            <div ref="taskChartRef" style="height: 300px"></div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 20px">
        <!-- 项目分布 -->
        <el-col :xs="24" :md="12">
          <el-card header="项目消息分布">
            <div ref="projectChartRef" style="height: 300px"></div>
          </el-card>
        </el-col>

        <!-- 信息源类型 -->
        <el-col :xs="24" :md="12">
          <el-card header="信息源类型分布">
            <div ref="sourceChartRef" style="height: 300px"></div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 20px">
        <!-- 详细统计表 -->
        <el-col :span="24">
          <el-card header="详细统计">
            <el-descriptions :column="3" border>
              <el-descriptions-item label="用户总数">
                {{ systemStore.stats.users || 0 }}
              </el-descriptions-item>
              <el-descriptions-item label="项目总数">
                {{ systemStore.stats.projects || 0 }}
              </el-descriptions-item>
              <el-descriptions-item label="信息源总数">
                {{ systemStore.stats.sources || 0 }}
              </el-descriptions-item>
              <el-descriptions-item label="消息总数">
                {{ systemStore.stats.messages || 0 }}
              </el-descriptions-item>
              <el-descriptions-item label="任务运行次数">
                {{ taskStatus?.stats?.totalRuns || 0 }}
              </el-descriptions-item>
              <el-descriptions-item label="成功次数">
                {{ taskStatus?.stats?.successfulRuns || 0 }}
              </el-descriptions-item>
              <el-descriptions-item label="失败次数">
                {{ taskStatus?.stats?.failedRuns || 0 }}
              </el-descriptions-item>
              <el-descriptions-item label="已处理消息">
                {{ taskStatus?.stats?.messagesProcessed || 0 }}
              </el-descriptions-item>
              <el-descriptions-item label="已创建消息">
                {{ taskStatus?.stats?.messagesCreated || 0 }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import { useProjectStore, useSourceStore, useSystemStore } from '../stores';
import * as echarts from 'echarts';
import Layout from '../components/Layout.vue';

const projectStore = useProjectStore();
const sourceStore = useSourceStore();
const systemStore = useSystemStore();

const loading = ref(false);
const systemChartRef = ref(null);
const taskChartRef = ref(null);
const projectChartRef = ref(null);
const sourceChartRef = ref(null);

const projects = computed(() => projectStore.projects);
const sources = computed(() => sourceStore.sources);
const taskStatus = computed(() => systemStore.taskStatus);

const initSystemChart = () => {
  if (!systemChartRef.value) return;

  const chart = echarts.init(systemChartRef.value);

  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '系统数据',
        type: 'pie',
        radius: '50%',
        data: [
          { value: systemStore.stats.users || 0, name: '用户' },
          { value: systemStore.stats.projects || 0, name: '项目' },
          { value: systemStore.stats.sources || 0, name: '信息源' },
          { value: systemStore.stats.messages || 0, name: '消息' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  chart.setOption(option);
};

const initTaskChart = () => {
  if (!taskChartRef.value) return;

  const chart = echarts.init(taskChartRef.value);

  const stats = taskStatus.value?.stats || {};

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['总运行次数', '成功次数', '失败次数']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '次数',
        type: 'bar',
        data: [
          stats.totalRuns || 0,
          stats.successfulRuns || 0,
          stats.failedRuns || 0
        ],
        itemStyle: {
          color: function(params) {
            const colors = ['#5470c6', '#91cc75', '#ee6666'];
            return colors[params.dataIndex];
          }
        }
      }
    ]
  };

  chart.setOption(option);
};

const initProjectChart = () => {
  if (!projectChartRef.value) return;

  const chart = echarts.init(projectChartRef.value);

  const data = projects.value.map(p => ({
    name: p.name,
    value: 0 // 实际应该从消息统计中获取
  }));

  const option = {
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: '消息数',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: data.length > 0 ? data : [{ value: 1, name: '暂无数据' }]
      }
    ]
  };

  chart.setOption(option);
};

const initSourceChart = () => {
  if (!sourceChartRef.value) return;

  const chart = echarts.init(sourceChartRef.value);

  const typeCount = {};
  sources.value.forEach(s => {
    typeCount[s.type] = (typeCount[s.type] || 0) + 1;
  });

  const data = Object.entries(typeCount).map(([name, value]) => ({
    name: name.toUpperCase(),
    value
  }));

  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: '信息源类型',
        type: 'pie',
        radius: ['40%', '70%'],
        data: data.length > 0 ? data : [{ value: 1, name: '暂无数据' }],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  chart.setOption(option);
};

const loadData = async () => {
  loading.value = true;

  try {
    await Promise.all([
      projectStore.fetchProjects(),
      sourceStore.fetchSources(),
      systemStore.fetchSystemStats()
    ]);

    await nextTick();

    initSystemChart();
    initTaskChart();
    initProjectChart();
    initSourceChart();
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();

  // 响应式调整图表大小
  window.addEventListener('resize', () => {
    [systemChartRef, taskChartRef, projectChartRef, sourceChartRef].forEach(ref => {
      if (ref.value) {
        const chart = echarts.getInstanceByDom(ref.value);
        if (chart) chart.resize();
      }
    });
  });
});
</script>

<style scoped>
.statistics-page {
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
</style>
