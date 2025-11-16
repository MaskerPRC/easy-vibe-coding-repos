<template>
  <div class="game-view-overlay">
    <div class="game-view">
      <div class="game-header">
        <button class="back-btn" @click="handleExit">← 返回大厅</button>
        <div class="game-title">{{ gameInfo.title }}</div>
        <div class="game-round">第 {{ gameInfo.round }} 局</div>
      </div>
      <div class="game-content">
        <div class="game-table">
          <div class="player-position top">
            <div class="player-info">
              <div class="player-avatar">{{ gameInfo.players[1].avatar }}</div>
              <div class="player-name">{{ gameInfo.players[1].name }}</div>
              <div class="player-cards">剩余: {{ gameInfo.players[1].cards }} 张</div>
            </div>
          </div>
          <div class="player-position left">
            <div class="player-info">
              <div class="player-avatar">{{ gameInfo.players[2].avatar }}</div>
              <div class="player-name">{{ gameInfo.players[2].name }}</div>
              <div class="player-cards">剩余: {{ gameInfo.players[2].cards }} 张</div>
            </div>
          </div>
          <div class="table-center">
            <div class="landlord-cards">
              <div class="card" v-for="card in landlordCards" :key="card">{{ card }}</div>
            </div>
            <div class="current-play">
              {{ currentPlay }}
            </div>
          </div>
          <div class="player-position bottom">
            <div class="player-info current-player">
              <div class="player-avatar">👤</div>
              <div class="player-name">{{ userName }}</div>
              <div class="player-role">{{ gameInfo.players[0].role }}</div>
            </div>
            <div class="my-cards">
              <div
                class="card"
                v-for="(card, index) in myCards"
                :key="index"
                :class="{ 'selected': selectedCards.includes(index) }"
                @click="toggleCard(index)"
              >
                {{ card }}
              </div>
            </div>
          </div>
        </div>
        <div class="game-controls">
          <button class="game-btn pass-btn" @click="passPlay">不出</button>
          <button class="game-btn hint-btn" @click="getHint">提示</button>
          <button class="game-btn play-btn" @click="playCards" :disabled="selectedCards.length === 0">出牌</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  gameInfo: {
    type: Object,
    required: true
  },
  userName: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['exit', 'updatePlayerCards'])

const landlordCards = ref(['🂡', '🂢', '🂣'])
const myCards = ref([])
const selectedCards = ref([])
const currentPlay = ref('等待出牌...')

// 初始化牌
const initializeCards = () => {
  const suits = ['♠', '♥', '♣', '♦']
  const values = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2']
  const cards = []

  // 生成随机手牌
  for (let i = 0; i < 17; i++) {
    const suit = suits[Math.floor(Math.random() * suits.length)]
    const value = values[Math.floor(Math.random() * values.length)]
    cards.push(suit + value)
  }

  // 按大小排序
  myCards.value = cards.sort((a, b) => {
    const order = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2']
    const aVal = order.indexOf(a.substring(1))
    const bVal = order.indexOf(b.substring(1))
    return aVal - bVal
  })

  selectedCards.value = []
}

// 选择/取消选择卡牌
const toggleCard = (index) => {
  const pos = selectedCards.value.indexOf(index)
  if (pos === -1) {
    selectedCards.value.push(index)
  } else {
    selectedCards.value.splice(pos, 1)
  }
}

// 出牌
const playCards = () => {
  if (selectedCards.value.length === 0) return

  const playedCards = selectedCards.value
    .sort((a, b) => b - a)
    .map(i => myCards.value[i])

  currentPlay.value = `你出: ${playedCards.join(' ')}`

  // 移除已出的牌
  selectedCards.value.sort((a, b) => b - a).forEach(i => {
    myCards.value.splice(i, 1)
  })

  selectedCards.value = []
  emit('updatePlayerCards', 0, myCards.value.length)

  // 模拟AI出牌
  setTimeout(() => {
    simulateAIPlay()
  }, 1000)
}

// 模拟AI出牌
const simulateAIPlay = () => {
  const aiPlays = ['AI-1 出: ♠5', 'AI-2 出: 不出', 'AI-1 出: ♥7 ♦7', 'AI-2 出: ♣10']
  currentPlay.value = aiPlays[Math.floor(Math.random() * aiPlays.length)]

  // 随机减少AI手牌
  if (Math.random() > 0.3) {
    const newCards = Math.max(0, props.gameInfo.players[1].cards - Math.floor(Math.random() * 3 + 1))
    emit('updatePlayerCards', 1, newCards)
  }
}

// 不出
const passPlay = () => {
  currentPlay.value = '你选择不出'
  setTimeout(() => {
    simulateAIPlay()
  }, 500)
}

// 提示
const getHint = () => {
  if (myCards.value.length > 0) {
    selectedCards.value = [0]
    alert('提示: 试试出最小的牌')
  }
}

// 退出游戏
const handleExit = () => {
  if (confirm('确定要退出游戏吗？')) {
    emit('exit')
  }
}

onMounted(() => {
  initializeCards()
})
</script>

<style scoped>
.game-view-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #0f1729 0%, #1a2744 50%, #0d1421 100%);
  z-index: 2000;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.game-view {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 2px solid rgba(255, 215, 0, 0.3);
}

.back-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #f0f0f0;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(255, 215, 0, 0.2);
  border-color: rgba(255, 215, 0, 0.4);
}

.game-title {
  font-size: 20px;
  font-weight: 600;
  color: #FFD700;
}

.game-round {
  color: #94a3b8;
}

.game-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
}

.game-table {
  flex: 1;
  position: relative;
  background: radial-gradient(circle at center, #1e3a2f 0%, #0f1f17 100%);
  border-radius: 50%;
  max-width: 600px;
  max-height: 400px;
  margin: 0 auto;
  width: 100%;
  border: 4px solid rgba(255, 215, 0, 0.3);
}

.player-position {
  position: absolute;
}

.player-position.top {
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
}

.player-position.left {
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.player-position.bottom {
  bottom: -120px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
}

.player-info {
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  padding: 8px 16px;
  border-radius: 8px;
}

.player-info.current-player {
  border: 2px solid #FFD700;
}

.player-avatar {
  font-size: 24px;
  margin-bottom: 4px;
}

.player-name {
  font-size: 14px;
  font-weight: 500;
}

.player-cards {
  font-size: 12px;
  color: #94a3b8;
}

.player-role {
  font-size: 12px;
  color: #FFD700;
  margin-top: 4px;
}

.table-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.landlord-cards {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.current-play {
  color: #4ade80;
  font-size: 14px;
}

.my-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
  margin-top: 16px;
  max-width: 100%;
}

.card {
  background: white;
  color: #1a1a1a;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #ddd;
  user-select: none;
}

.card:hover {
  transform: translateY(-8px);
}

.card.selected {
  transform: translateY(-16px);
  border-color: #FFD700;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
}

.game-controls {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 20px;
  margin-top: auto;
}

.game-btn {
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.pass-btn {
  background: #4a5568;
  color: white;
}

.pass-btn:hover {
  background: #718096;
}

.hint-btn {
  background: #60a5fa;
  color: white;
}

.hint-btn:hover {
  background: #3b82f6;
}

.play-btn {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: white;
}

.play-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(74, 222, 128, 0.4);
}

.play-btn:disabled {
  background: #4a5568;
  cursor: not-allowed;
}
</style>
