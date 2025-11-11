<template>
  <div class="game-hud">
    <!-- Crosshair -->
    <div class="crosshair">
      <div class="crosshair-line horizontal"></div>
      <div class="crosshair-line vertical"></div>
      <div class="crosshair-center"></div>
    </div>

    <!-- Health and Armor -->
    <div class="status-bar bottom-left">
      <div class="health-display">
        <div class="icon">❤</div>
        <div class="value">{{ playerHealth }}</div>
        <div class="bar">
          <div class="fill health-fill" :style="{ width: playerHealth + '%' }"></div>
        </div>
      </div>
      <div class="armor-display">
        <div class="icon">🛡</div>
        <div class="value">{{ playerArmor }}</div>
        <div class="bar">
          <div class="fill armor-fill" :style="{ width: playerArmor + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- Ammo Display -->
    <div class="ammo-display bottom-right">
      <div class="weapon-name">{{ currentWeapon.name }}</div>
      <div class="ammo-count">
        <span class="current-ammo">{{ currentAmmo }}</span>
        <span class="separator">/</span>
        <span class="reserve-ammo">{{ reserveAmmo }}</span>
      </div>
      <div class="reload-hint" v-if="isReloading">RELOADING...</div>
    </div>

    <!-- Weapon Selector -->
    <div class="weapon-selector bottom-center">
      <div
        v-for="(weapon, index) in weapons"
        :key="index"
        class="weapon-slot"
        :class="{ active: currentWeaponIndex === index }"
      >
        <span class="slot-number">{{ index + 1 }}</span>
        <span class="weapon-icon">{{ weapon.icon }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  playerHealth: {
    type: Number,
    required: true
  },
  playerArmor: {
    type: Number,
    required: true
  },
  currentWeapon: {
    type: Object,
    required: true
  },
  currentAmmo: {
    type: Number,
    required: true
  },
  reserveAmmo: {
    type: Number,
    required: true
  },
  isReloading: {
    type: Boolean,
    default: false
  },
  weapons: {
    type: Array,
    required: true
  },
  currentWeaponIndex: {
    type: Number,
    required: true
  }
})
</script>

<style scoped>
.game-hud {
  position: relative;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* Crosshair */
.crosshair {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.crosshair-line {
  position: absolute;
  background: #00ff00;
  box-shadow: 0 0 5px #00ff00;
}

.crosshair-line.horizontal {
  width: 20px;
  height: 2px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.crosshair-line.vertical {
  width: 2px;
  height: 20px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.crosshair-center {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(0, 255, 0, 0.3);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Status Bar */
.status-bar {
  position: absolute;
  display: flex;
  gap: 20px;
}

.bottom-left {
  bottom: 30px;
  left: 30px;
}

.health-display, .armor-display {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(26, 35, 50, 0.9);
  padding: 10px 20px;
  border: 2px solid rgba(170, 170, 170, 0.3);
  border-radius: 4px;
}

.icon {
  font-size: 24px;
}

.value {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  min-width: 50px;
}

.bar {
  width: 100px;
  height: 10px;
  background: rgba(85, 85, 85, 0.5);
  border: 1px solid rgba(170, 170, 170, 0.3);
  border-radius: 2px;
  overflow: hidden;
}

.fill {
  height: 100%;
  transition: width 0.3s ease;
}

.health-fill {
  background: linear-gradient(90deg, #cc0000, #ff4444);
}

.armor-fill {
  background: linear-gradient(90deg, #0066cc, #4499ff);
}

/* Ammo Display */
.ammo-display {
  position: absolute;
  bottom: 30px;
  right: 30px;
  text-align: right;
  background: rgba(26, 35, 50, 0.9);
  padding: 15px 25px;
  border: 2px solid rgba(170, 170, 170, 0.3);
  border-radius: 4px;
}

.weapon-name {
  font-size: 14px;
  color: #ff8c00;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 5px;
}

.ammo-count {
  font-size: 36px;
  font-weight: 700;
  color: #ffffff;
}

.current-ammo {
  color: #ff8c00;
}

.separator {
  color: #aaaaaa;
  margin: 0 8px;
}

.reserve-ammo {
  color: #cccccc;
  font-size: 24px;
}

.reload-hint {
  font-size: 12px;
  color: #ff8c00;
  margin-top: 5px;
  animation: blink 0.5s infinite;
}

@keyframes blink {
  0%, 50%, 100% { opacity: 1; }
  25%, 75% { opacity: 0; }
}

/* Weapon Selector */
.weapon-selector {
  position: absolute;
  bottom: 120px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
}

.weapon-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 10px 15px;
  background: rgba(26, 35, 50, 0.7);
  border: 2px solid rgba(170, 170, 170, 0.3);
  border-radius: 4px;
  transition: all 0.3s ease;
}

.weapon-slot.active {
  background: rgba(255, 140, 0, 0.3);
  border-color: #ff8c00;
  box-shadow: 0 0 15px rgba(255, 140, 0, 0.5);
}

.slot-number {
  font-size: 12px;
  color: #aaaaaa;
}

.weapon-icon {
  font-size: 24px;
}
</style>
