<template>
  <router-view />
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}

/* 隐藏chat相关元素 */
.chat-button,
#chat-button,
[class*="chat-button"] {
  visibility: hidden !important;
  z-index: -199 !important;
}

.chat-dialog,
#chat-dialog,
[class*="chat-dialog"] {
  visibility: hidden !important;
  z-index: -199 !important;
}
</style>
