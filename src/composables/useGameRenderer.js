/**
 * 游戏渲染系统
 */
export function useGameRenderer(canvasRef) {
  let ctx = null

  // 初始化渲染器
  const initRenderer = () => {
    if (!canvasRef.value) return false

    const canvas = canvasRef.value
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    ctx = canvas.getContext('2d')

    return true
  }

  // 清空画布
  const clearCanvas = () => {
    if (!ctx || !canvasRef.value) return

    ctx.fillStyle = '#1a2332'
    ctx.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  }

  // 渲染世界（地面和天花板）
  const renderWorld = (playerX) => {
    if (!ctx || !canvasRef.value) return

    const canvas = canvasRef.value
    const centerY = canvas.height / 2

    // 绘制地面
    ctx.fillStyle = '#2a3a4a'
    ctx.fillRect(0, centerY, canvas.width, canvas.height / 2)

    // 绘制天花板
    ctx.fillStyle = '#0d1421'
    ctx.fillRect(0, 0, canvas.width, centerY)

    // 绘制网格线
    ctx.strokeStyle = 'rgba(255, 140, 0, 0.1)'
    ctx.lineWidth = 2

    for (let i = -10; i <= 10; i++) {
      const screenX = canvas.width / 2 + i * 50 - (playerX % 10) * 5
      ctx.beginPath()
      ctx.moveTo(screenX, centerY)
      ctx.lineTo(screenX, canvas.height)
      ctx.stroke()
    }
  }

  // 渲染敌人
  const renderEnemies = (enemies, playerX, playerZ, playerRotation) => {
    if (!ctx || !canvasRef.value) return

    const canvas = canvasRef.value

    enemies.forEach(enemy => {
      if (enemy.health <= 0) return

      // 计算相对位置
      const dx = enemy.x - playerX
      const dz = enemy.z - playerZ
      const distance = Math.sqrt(dx * dx + dz * dz)

      // 计算角度
      const angle = Math.atan2(dx, dz) - playerRotation

      // 检查敌人是否在玩家前方
      if (Math.abs(angle) < Math.PI / 2) {
        const screenX = canvas.width / 2 + Math.tan(angle) * canvas.width
        const size = Math.max(20, 2000 / distance)
        const screenY = canvas.height / 2 - size / 2

        // 绘制敌人
        ctx.fillStyle = '#cc0000'
        ctx.fillRect(screenX - size / 2, screenY, size, size * 2)

        // 绘制血条
        const healthBarWidth = size
        const healthBarHeight = 5
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
        ctx.fillRect(screenX - healthBarWidth / 2, screenY - 15, healthBarWidth, healthBarHeight)
        ctx.fillStyle = '#00cc00'
        ctx.fillRect(
          screenX - healthBarWidth / 2,
          screenY - 15,
          healthBarWidth * (enemy.health / 100),
          healthBarHeight
        )
      }
    })
  }

  // 渲染完整帧
  const render = (playerX, playerZ, playerRotation, enemies) => {
    clearCanvas()
    renderWorld(playerX)
    renderEnemies(enemies, playerX, playerZ, playerRotation)
  }

  return {
    initRenderer,
    clearCanvas,
    renderWorld,
    renderEnemies,
    render
  }
}
