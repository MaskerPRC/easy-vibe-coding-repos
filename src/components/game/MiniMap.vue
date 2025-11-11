<template>
  <div class="mini-map top-left">
    <div class="map-container">
      <div class="map-grid"></div>
      <div
        v-for="player in allPlayers"
        :key="player.id"
        class="map-player"
        :class="player.team"
        :style="{
          left: (player.x / mapWidth * 100) + '%',
          top: (player.z / mapHeight * 100) + '%'
        }"
      ></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  allPlayers: {
    type: Array,
    required: true
  },
  mapWidth: {
    type: Number,
    default: 100
  },
  mapHeight: {
    type: Number,
    default: 100
  }
})
</script>

<style scoped>
.mini-map {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 150px;
  height: 150px;
  background: rgba(26, 35, 50, 0.9);
  border: 2px solid rgba(170, 170, 170, 0.3);
  border-radius: 4px;
  overflow: hidden;
}

.map-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.map-grid {
  position: absolute;
  width: 100%;
  height: 100%;
  background:
    repeating-linear-gradient(0deg, rgba(170, 170, 170, 0.1) 0px, transparent 1px, transparent 19px, rgba(170, 170, 170, 0.1) 20px),
    repeating-linear-gradient(90deg, rgba(170, 170, 170, 0.1) 0px, transparent 1px, transparent 19px, rgba(170, 170, 170, 0.1) 20px);
}

.map-player {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.map-player.ct {
  background: #4499ff;
  box-shadow: 0 0 5px #4499ff;
}

.map-player.t {
  background: #ff8c00;
  box-shadow: 0 0 5px #ff8c00;
}
</style>
