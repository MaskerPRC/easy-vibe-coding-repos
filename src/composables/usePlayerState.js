import { ref, computed } from 'vue'
import { calculateKDRatio, calculateAccuracy } from '@/utils/gameUtils'

/**
 * 玩家状态管理
 */
export function usePlayerState() {
  // 玩家基础状态
  const playerHealth = ref(100)
  const playerArmor = ref(100)
  const playerKills = ref(0)
  const playerDeaths = ref(0)
  const shotsFired = ref(0)
  const shotsHit = ref(0)

  // 玩家位置和旋转
  const playerPosition = ref({
    x: 50,
    y: 1.6, // 眼睛高度
    z: 50
  })

  const playerRotation = ref(0)
  const playerPitch = ref(0)

  // 计算属性
  const kdRatio = computed(() =>
    calculateKDRatio(playerKills.value, playerDeaths.value)
  )

  const accuracy = computed(() =>
    calculateAccuracy(shotsHit.value, shotsFired.value)
  )

  // 重置玩家状态
  const resetPlayerState = () => {
    playerHealth.value = 100
    playerArmor.value = 100
    playerKills.value = 0
    playerDeaths.value = 0
    shotsFired.value = 0
    shotsHit.value = 0
    playerPosition.value = { x: 50, y: 1.6, z: 50 }
    playerRotation.value = 0
    playerPitch.value = 0
  }

  // 更新玩家位置
  const updatePlayerPosition = (x, z) => {
    playerPosition.value.x = x
    playerPosition.value.z = z
  }

  // 更新玩家旋转
  const updatePlayerRotation = (rotation, pitch) => {
    playerRotation.value = rotation
    playerPitch.value = pitch
  }

  // 记录射击
  const recordShot = (hit = false) => {
    shotsFired.value++
    if (hit) {
      shotsHit.value++
    }
  }

  // 记录击杀
  const recordKill = () => {
    playerKills.value++
  }

  // 记录死亡
  const recordDeath = () => {
    playerDeaths.value++
  }

  return {
    // 状态
    playerHealth,
    playerArmor,
    playerKills,
    playerDeaths,
    shotsFired,
    shotsHit,
    playerPosition,
    playerRotation,
    playerPitch,

    // 计算属性
    kdRatio,
    accuracy,

    // 方法
    resetPlayerState,
    updatePlayerPosition,
    updatePlayerRotation,
    recordShot,
    recordKill,
    recordDeath
  }
}
