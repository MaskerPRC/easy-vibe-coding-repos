<template>
  <div class="pause-menu">
    <div class="pause-content">
      <h2>PAUSED</h2>
      <button class="menu-btn primary" @click="$emit('resume')">RESUME</button>
      <button class="menu-btn" @click="$emit('settings')">SETTINGS</button>
      <button class="menu-btn" @click="$emit('main-menu')">MAIN MENU</button>
    </div>
  </div>
</template>

<script setup>
defineEmits(['resume', 'settings', 'main-menu'])
</script>

<style scoped>
.pause-menu {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  pointer-events: auto;
}

.pause-content {
  text-align: center;
  background: rgba(26, 35, 50, 0.95);
  padding: 40px 60px;
  border: 2px solid #ff8c00;
  border-radius: 4px;
}

.pause-content h2 {
  font-size: 48px;
  color: #ffffff;
  margin-bottom: 30px;
  text-transform: uppercase;
  letter-spacing: 8px;
}

.menu-btn {
  display: block;
  width: 100%;
  padding: 15px 30px;
  margin: 10px 0;
  background: rgba(85, 85, 85, 0.3);
  border: 2px solid rgba(170, 170, 170, 0.3);
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  pointer-events: auto;
}

.menu-btn:hover {
  background: rgba(85, 85, 85, 0.5);
  border-color: #ff8c00;
  box-shadow: 0 0 20px rgba(255, 140, 0, 0.3);
}

.menu-btn.primary {
  background: rgba(255, 140, 0, 0.3);
  border-color: #ff8c00;
}

.menu-btn.primary:hover {
  background: rgba(255, 140, 0, 0.5);
  box-shadow: 0 0 30px rgba(255, 140, 0, 0.5);
}
</style>
