import { ref, computed } from 'vue'

/**
 * 武器系统管理
 */
export function useWeaponSystem() {
  // 武器配置
  const weapons = ref([
    { name: 'AK-47', icon: '🔫', damage: 36, ammo: 30, reserve: 90, fireRate: 100 },
    { name: 'AWP', icon: '🎯', damage: 115, ammo: 10, reserve: 30, fireRate: 1500 },
    { name: 'Desert Eagle', icon: '🔫', damage: 53, ammo: 7, reserve: 35, fireRate: 300 }
  ])

  // 当前武器状态
  const currentWeaponIndex = ref(0)
  const currentAmmo = ref(30)
  const reserveAmmo = ref(90)
  const isReloading = ref(false)

  // 计算当前武器
  const currentWeapon = computed(() => weapons.value[currentWeaponIndex.value])

  // 切换武器
  const switchWeapon = (index) => {
    if (index >= 0 && index < weapons.value.length && !isReloading.value) {
      currentWeaponIndex.value = index
      currentAmmo.value = weapons.value[index].ammo
      reserveAmmo.value = weapons.value[index].reserve
    }
  }

  // 装弹
  const reload = () => {
    if (isReloading.value || reserveAmmo.value === 0 || currentAmmo.value === currentWeapon.value.ammo) {
      return false
    }

    isReloading.value = true

    setTimeout(() => {
      const needed = currentWeapon.value.ammo - currentAmmo.value
      const toReload = Math.min(needed, reserveAmmo.value)
      currentAmmo.value += toReload
      reserveAmmo.value -= toReload
      isReloading.value = false
    }, 2000)

    return true
  }

  // 射击
  const shoot = () => {
    if (isReloading.value || currentAmmo.value <= 0) {
      return false
    }

    currentAmmo.value--

    // 如果弹药为空，自动装弹
    if (currentAmmo.value === 0) {
      reload()
    }

    return true
  }

  // 重置武器状态
  const resetWeaponState = () => {
    currentWeaponIndex.value = 0
    currentAmmo.value = weapons.value[0].ammo
    reserveAmmo.value = weapons.value[0].reserve
    isReloading.value = false
  }

  return {
    // 状态
    weapons,
    currentWeaponIndex,
    currentAmmo,
    reserveAmmo,
    isReloading,
    currentWeapon,

    // 方法
    switchWeapon,
    reload,
    shoot,
    resetWeaponState
  }
}
