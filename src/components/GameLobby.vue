<template>
  <div class="game-lobby">
    <!-- 顶部导航 -->
    <LobbyHeader
      :userInfo="userInfo"
      @openSettings="showSettings = true"
    />

    <!-- 在线人数 -->
    <OnlineInfo :count="onlineCount" />

    <!-- 主要内容区 -->
    <main class="lobby-main">
      <!-- AI对战入口 -->
      <AIBattleCard @click="showAISelection = true" />

      <!-- 牌桌列表 -->
      <TableList
        :tables="tables"
        @createTable="createTable"
        @joinTable="joinTable"
      />
    </main>

    <!-- 底部导航 -->
    <LobbyFooter
      @aiClick="showAISelection = true"
      @createRoom="createTable"
      @selfTest="showSelfTest = true"
    />

    <!-- AI选择弹窗 -->
    <AISelectionModal
      v-if="showAISelection"
      :aiOptions="aiOptions"
      :initialLevel="selectedAI"
      @close="showAISelection = false"
      @confirm="startAIGame"
    />

    <!-- 游戏界面 -->
    <GameView
      v-if="showGameView"
      :gameInfo="currentGameInfo"
      :userName="userInfo.name"
      @exit="exitGame"
      @updatePlayerCards="updatePlayerCards"
    />

    <!-- 自测界面 -->
    <SelfTest
      v-if="showSelfTest"
      @close="showSelfTest = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// 导入子组件
import LobbyHeader from './lobby/LobbyHeader.vue'
import OnlineInfo from './lobby/OnlineInfo.vue'
import AIBattleCard from './lobby/AIBattleCard.vue'
import TableList from './lobby/TableList.vue'
import LobbyFooter from './lobby/LobbyFooter.vue'
import AISelectionModal from './lobby/AISelectionModal.vue'
import GameView from './lobby/GameView.vue'
import SelfTest from './SelfTest.vue'

// 用户信息
const userInfo = ref({
  name: '玩家001',
  avatar: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23FFD700"/><circle cx="35" cy="40" r="8" fill="%23333"/><circle cx="65" cy="40" r="8" fill="%23333"/><path d="M 30 65 Q 50 80 70 65" stroke="%23333" stroke-width="4" fill="none"/></svg>',
  coins: 10000,
  diamonds: 100
})

// 在线人数
const onlineCount = ref(1234)

// 牌桌列表
const tables = ref([])

// AI选项
const aiOptions = ref([
  { level: 'easy', name: '新手AI', description: '适合刚接触斗地主的玩家', difficulty: 1, icon: '🌱' },
  { level: 'normal', name: '普通AI', description: '具有基本策略的AI对手', difficulty: 2, icon: '🎯' },
  { level: 'hard', name: '高级AI', description: '经验丰富，善于记牌', difficulty: 4, icon: '🧠' },
  { level: 'expert', name: '专家AI', description: '顶级AI，极难战胜', difficulty: 5, icon: '👑' }
])

// UI状态
const showAISelection = ref(false)
const selectedAI = ref('normal')
const showSettings = ref(false)
const showGameView = ref(false)
const showSelfTest = ref(false)

// 游戏状态
const currentGameInfo = ref({
  title: 'AI对战',
  round: 1,
  players: [
    { name: '我', avatar: '👤', cards: 17, role: '农民' },
    { name: 'AI-1', avatar: '🤖', cards: 17, role: '地主' },
    { name: 'AI-2', avatar: '🤖', cards: 17, role: '农民' }
  ]
})

// 获取牌桌列表
const fetchTables = async () => {
  try {
    const response = await axios.get('/api/tables')
    tables.value = response.data
  } catch (error) {
    console.error('获取牌桌列表失败:', error)
    // 使用默认数据
    tables.value = generateDefaultTables()
  }
}

// 生成默认牌桌
const generateDefaultTables = () => {
  return [
    { id: 101, baseScore: 100, players: 2, maxPlayers: 3, status: 'waiting', hasAI: false },
    { id: 102, baseScore: 200, players: 3, maxPlayers: 3, status: 'playing', hasAI: false },
    { id: 103, baseScore: 50, players: 1, maxPlayers: 3, status: 'waiting', hasAI: true },
    { id: 104, baseScore: 500, players: 0, maxPlayers: 3, status: 'waiting', hasAI: false },
    { id: 105, baseScore: 100, players: 2, maxPlayers: 3, status: 'waiting', hasAI: true },
    { id: 106, baseScore: 1000, players: 1, maxPlayers: 3, status: 'waiting', hasAI: false }
  ]
}

// 创建牌桌
const createTable = async () => {
  try {
    const response = await axios.post('/api/tables', {
      baseScore: 100,
      maxPlayers: 3
    })
    tables.value.unshift(response.data)
    alert('房间创建成功！')
  } catch (error) {
    console.error('创建牌桌失败:', error)
    // 本地创建
    const newTable = {
      id: Date.now() % 10000,
      baseScore: 100,
      players: 1,
      maxPlayers: 3,
      status: 'waiting',
      hasAI: false
    }
    tables.value.unshift(newTable)
    alert('房间创建成功！')
  }
}

// 加入牌桌
const joinTable = (table) => {
  if (table.players >= table.maxPlayers) {
    alert('房间已满！')
    return
  }
  alert(`即将加入房间 #${table.id}`)
  // 这里可以实现实际的加入逻辑
}

// 开始AI对战
const startAIGame = (aiLevel) => {
  selectedAI.value = aiLevel
  showAISelection.value = false
  showGameView.value = true

  // 根据选择的AI难度设置游戏
  const aiLevelInfo = aiOptions.value.find(ai => ai.level === aiLevel)
  currentGameInfo.value.title = `AI对战 - ${aiLevelInfo.name}`

  // 重置游戏状态
  currentGameInfo.value.players[0].cards = 17
  currentGameInfo.value.players[1].cards = 17
  currentGameInfo.value.players[2].cards = 17
}

// 更新玩家手牌数量
const updatePlayerCards = (playerIndex, cardCount) => {
  currentGameInfo.value.players[playerIndex].cards = cardCount
}

// 退出游戏
const exitGame = () => {
  showGameView.value = false
}

onMounted(() => {
  fetchTables()

  // 模拟在线人数变化
  setInterval(() => {
    onlineCount.value += Math.floor(Math.random() * 10) - 5
    if (onlineCount.value < 1000) onlineCount.value = 1000
    if (onlineCount.value > 2000) onlineCount.value = 2000
  }, 5000)
})
</script>

<style scoped>
.game-lobby {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f1729 0%, #1a2744 50%, #0d1421 100%);
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
  overflow-x: hidden;
}

.lobby-main {
  padding: 24px;
  padding-bottom: 100px;
}
</style>
