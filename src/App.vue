<template>
  <div id="app">
    <ClaudeChat />
  </div>
</template>

<script>
import ClaudeChat from './components/ClaudeChat.vue';

export default {
  name: 'App',
  components: {
    ClaudeChat
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  overflow: hidden;
}

#app {
  height: 100%;
}
</style>
