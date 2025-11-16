<template>
  <div class="self-test-container">
    <div class="test-header">
      <h1>🧪 系统自测中心</h1>
      <p class="subtitle">全面检测游戏大厅各项功能是否正常工作</p>
    </div>

    <div class="test-controls">
      <button
        @click="runAllTests"
        :disabled="isRunning"
        class="run-all-btn"
      >
        {{ isRunning ? '测试中...' : '运行全部测试' }}
      </button>
      <button @click="clearResults" class="clear-btn">清除结果</button>
      <button @click="$emit('close')" class="back-btn">返回大厅</button>
    </div>

    <TestSummary
      :passed="passedCount"
      :failed="failedCount"
      :total="testResults.length"
    />

    <div class="test-categories">
      <!-- API测试 -->
      <TestCategory
        title="API接口测试"
        icon="🌐"
        button-text="运行API测试"
        :results="apiTests.results.value"
        :expanded="expandedCategories.api"
        :disabled="isRunning"
        @toggle="toggleCategory('api')"
        @run="apiTests.runTests"
      />

      <!-- 象棋逻辑测试 -->
      <TestCategory
        title="象棋游戏逻辑测试"
        icon="♟️"
        button-text="运行象棋测试"
        :results="chessTests.results.value"
        :expanded="expandedCategories.chess"
        :disabled="isRunning"
        @toggle="toggleCategory('chess')"
        @run="chessTests.runTests"
      />

      <!-- 斗地主逻辑测试 -->
      <TestCategory
        title="斗地主游戏逻辑测试"
        icon="🃏"
        button-text="运行斗地主测试"
        :results="doudizhuTests.results.value"
        :expanded="expandedCategories.doudizhu"
        :disabled="isRunning"
        @toggle="toggleCategory('doudizhu')"
        @run="doudizhuTests.runTests"
      />

      <!-- 前端组件测试 -->
      <TestCategory
        title="前端组件测试"
        icon="🧩"
        button-text="运行组件测试"
        :results="componentTests.results.value"
        :expanded="expandedCategories.components"
        :disabled="isRunning"
        @toggle="toggleCategory('components')"
        @run="componentTests.runTests"
      />
    </div>

    <TestLog :logs="logger.logs.value" />
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import TestCategory from './selftest/TestCategory.vue'
import TestSummary from './selftest/TestSummary.vue'
import TestLog from './selftest/TestLog.vue'
import { useTestLogger } from '../composables/useTestLogger'
import { useAPITests } from '../composables/useAPITests'
import { useChessTests } from '../composables/useChessTests'
import { useDoudizhuTests } from '../composables/useDoudizhuTests'
import { useComponentTests } from '../composables/useComponentTests'

export default {
  name: 'SelfTest',
  components: {
    TestCategory,
    TestSummary,
    TestLog
  },
  emits: ['close'],
  setup() {
    const isRunning = ref(false)

    // 初始化日志管理器
    const logger = useTestLogger()

    // 初始化各测试模块
    const apiTests = useAPITests(logger.addLog)
    const chessTests = useChessTests(logger.addLog)
    const doudizhuTests = useDoudizhuTests(logger.addLog)
    const componentTests = useComponentTests(logger.addLog)

    // 展开状态管理
    const expandedCategories = ref({
      api: true,
      chess: true,
      doudizhu: true,
      components: true
    })

    // 计算总测试结果
    const testResults = computed(() => [
      ...apiTests.results.value,
      ...chessTests.results.value,
      ...doudizhuTests.results.value,
      ...componentTests.results.value
    ])

    const passedCount = computed(() =>
      testResults.value.filter(r => r.passed).length
    )

    const failedCount = computed(() =>
      testResults.value.filter(r => !r.passed).length
    )

    // 切换类别展开状态
    const toggleCategory = (category) => {
      expandedCategories.value[category] = !expandedCategories.value[category]
    }

    // 清除所有结果
    const clearResults = () => {
      apiTests.clearResults()
      chessTests.clearResults()
      doudizhuTests.clearResults()
      componentTests.clearResults()
      logger.clearLogs()
    }

    // 运行所有测试
    const runAllTests = async () => {
      isRunning.value = true
      clearResults()
      logger.addLog('=== 开始运行全部自测 ===', 'info')

      await apiTests.runTests()
      chessTests.runTests()
      doudizhuTests.runTests()
      componentTests.runTests()

      logger.addLog('=== 全部自测完成 ===', 'info')
      logger.addLog(
        `测试结果: ${passedCount.value}通过 / ${failedCount.value}失败`,
        failedCount.value === 0 ? 'success' : 'warning'
      )
      isRunning.value = false
    }

    return {
      isRunning,
      logger,
      apiTests,
      chessTests,
      doudizhuTests,
      componentTests,
      expandedCategories,
      testResults,
      passedCount,
      failedCount,
      toggleCategory,
      clearResults,
      runAllTests
    }
  }
}
</script>

<style scoped>
.self-test-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #ffffff;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
}

.test-header {
  text-align: center;
  margin-bottom: 30px;
}

.test-header h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
  background: linear-gradient(45deg, #00d2ff, #3a7bd5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: #a0a0a0;
  font-size: 1.1em;
}

.test-controls {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.run-all-btn {
  background: linear-gradient(45deg, #00b894, #00cec9);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.run-all-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 184, 148, 0.4);
}

.run-all-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.clear-btn {
  background: linear-gradient(45deg, #636e72, #2d3436);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(99, 110, 114, 0.4);
}

.back-btn {
  background: linear-gradient(45deg, #e17055, #d63031);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(214, 48, 49, 0.4);
}

.test-categories {
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .test-header h1 {
    font-size: 1.8em;
  }
}
</style>
