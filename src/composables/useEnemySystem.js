import { ref, computed } from 'vue'
import { clamp } from '@/utils/gameUtils'

/**
 * 敌人系统管理
 */
export function useEnemySystem() {
  const enemies = ref([])
  const mapWidth = ref(100)
  const mapHeight = ref(100)

  // 生成敌人
  const spawnEnemies = (count = 5) => {
    enemies.value = []
    for (let i = 0; i < count; i++) {
      enemies.value.push({
        id: i,
        x: Math.random() * 90 + 5,
        y: 1.6,
        z: Math.random() * 90 + 5,
        health: 100,
        team: 't',
        rotation: Math.random() * Math.PI * 2
      })
    }
  }

  // 更新敌人AI
  const updateEnemies = () => {
    enemies.value.forEach(enemy => {
      if (enemy.health <= 0) return

      // 简单AI：随机移动
      if (Math.random() < 0.02) {
        enemy.rotation = Math.random() * Math.PI * 2
      }

      const moveSpeed = 0.1
      enemy.x += Math.sin(enemy.rotation) * moveSpeed
      enemy.z += Math.cos(enemy.rotation) * moveSpeed
      enemy.x = clamp(enemy.x, 5, 95)
      enemy.z = clamp(enemy.z, 5, 95)
    })
  }

  // 检查射击命中
  const checkHit = (playerX, playerZ, playerRotation, weaponDamage) => {
    let hitEnemy = null
    let minDistance = Infinity

    enemies.value.forEach(enemy => {
      if (enemy.health <= 0) return

      const dx = enemy.x - playerX
      const dz = enemy.z - playerZ
      const distance = Math.sqrt(dx * dx + dz * dz)
      const angle = Math.atan2(dx, dz) - playerRotation

      if (Math.abs(angle) < 0.1 && distance < minDistance) {
        minDistance = distance
        hitEnemy = enemy
      }
    })

    if (hitEnemy) {
      hitEnemy.health -= weaponDamage
      return {
        hit: true,
        killed: hitEnemy.health <= 0,
        enemyId: hitEnemy.id
      }
    }

    return { hit: false, killed: false, enemyId: null }
  }

  // 获取存活的敌人
  const getAliveEnemies = computed(() => {
    return enemies.value.filter(e => e.health > 0)
  })

  // 获取所有敌人数量
  const getEnemyCount = computed(() => {
    return enemies.value.length
  })

  // 获取存活敌人数量
  const getAliveEnemyCount = computed(() => {
    return getAliveEnemies.value.length
  })

  return {
    // 状态
    enemies,
    mapWidth,
    mapHeight,

    // 计算属性
    getAliveEnemies,
    getEnemyCount,
    getAliveEnemyCount,

    // 方法
    spawnEnemies,
    updateEnemies,
    checkHit
  }
}
