import { ref } from 'vue'
import axios from 'axios'

/**
 * 游戏状态管理
 */
export function useGameState() {
  // 游戏状态
  const isPaused = ref(false)
  const gameOver = ref(false)
  const showInstructions = ref(true)
  const gameStarted = ref(false)
  const gameOverMessage = ref('')

  // 分数
  const ctScore = ref(0)
  const tScore = ref(0)
  const roundTime = ref(115)

  // 击杀记录
  const killFeed = ref([])

  // 回合计时器
  let roundTimerInterval = null

  // 添加击杀记录
  const addKillToFeed = (killer, weapon, victim) => {
    killFeed.value.unshift({
      killer,
      weapon,
      victim
    })

    if (killFeed.value.length > 5) {
      killFeed.value.pop()
    }
  }

  // 开始回合计时器
  const startRoundTimer = (onTimeUp) => {
    if (roundTimerInterval) clearInterval(roundTimerInterval)

    roundTimerInterval = setInterval(() => {
      if (!isPaused.value && !gameOver.value) {
        roundTime.value--

        if (roundTime.value <= 0 && onTimeUp) {
          onTimeUp()
        }
      }
    }, 1000)
  }

  // 停止回合计时器
  const stopRoundTimer = () => {
    if (roundTimerInterval) {
      clearInterval(roundTimerInterval)
      roundTimerInterval = null
    }
  }

  // 开始游戏
  const startGame = () => {
    showInstructions.value = false
    gameStarted.value = true
  }

  // 暂停游戏
  const pauseGame = () => {
    isPaused.value = true
  }

  // 恢复游戏
  const resumeGame = () => {
    isPaused.value = false
  }

  // 切换暂停
  const togglePause = () => {
    isPaused.value = !isPaused.value
  }

  // 结束游戏
  const endGame = (message) => {
    gameOver.value = true
    gameOverMessage.value = message
  }

  // 保存游戏统计
  const saveGameStats = async (kills, deaths, accuracy, won) => {
    try {
      await axios.post('/api/player/stats', {
        kills,
        deaths,
        accuracy,
        won
      })
    } catch (error) {
      console.log('Could not save stats')
    }
  }

  // 重置游戏
  const resetGame = () => {
    ctScore.value = 0
    tScore.value = 0
    roundTime.value = 115
    gameOver.value = false
    gameOverMessage.value = ''
    killFeed.value = []
  }

  // 增加 CT 分数
  const incrementCTScore = () => {
    ctScore.value++
  }

  // 增加 T 分数
  const incrementTScore = () => {
    tScore.value++
  }

  // 清理
  const cleanup = () => {
    stopRoundTimer()
  }

  return {
    // 状态
    isPaused,
    gameOver,
    showInstructions,
    gameStarted,
    gameOverMessage,
    ctScore,
    tScore,
    roundTime,
    killFeed,

    // 方法
    addKillToFeed,
    startRoundTimer,
    stopRoundTimer,
    startGame,
    pauseGame,
    resumeGame,
    togglePause,
    endGame,
    saveGameStats,
    resetGame,
    incrementCTScore,
    incrementTScore,
    cleanup
  }
}
