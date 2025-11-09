<template>
  <div class="app">
    <nav class="navbar">
      <center>
        <table width="100%" border="0" cellpadding="5" cellspacing="0" bgcolor="#808080">
          <tr>
            <td align="center">
              <font color="#FFFF00" size="+1"><b>[ 网络导航中心 ]</b></font>
              <br>
              <font size="-1">
                <a href="/">首页</a> |
                <a href="/home">Home</a> |
                <a href="/whv">WHV素材库</a> |
                <a href="/translator">简繁翻译</a> |
                <a href="/todo">待办事项</a> |
                <a href="/medicine">吃药提醒</a> |
                <a href="/clock-out">下班打卡</a> |
                <a href="/timer">计时器</a> |
                <a href="/digital-nomad">数字游民</a> |
                <a href="/about">关于</a>
              </font>
            </td>
          </tr>
        </table>
      </center>
    </nav>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Times New Roman', Times, serif;
  background-color: #C0C0C0;
}

.app {
  min-height: 100vh;
  background: #C0C0C0;
}

.navbar {
  background: #808080;
  border-bottom: 3px solid #000000;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 3px 5px #666666;
}

.navbar a {
  color: #0000EE;
  text-decoration: underline;
  font-weight: bold;
  padding: 2px 5px;
}

.navbar a:visited {
  color: #551A8B;
}

.navbar a:hover {
  color: #FF0000;
  background-color: #FFFF00;
}

.content {
  min-height: calc(100vh - 60px);
  background-color: #C0C0C0;
}

/* 支持center标签 */
center {
  display: block;
  text-align: center;
}

/* 1997年风格的表格 */
table {
  font-family: 'Times New Roman', Times, serif;
}

@media (max-width: 768px) {
  .navbar font {
    font-size: 0.9rem !important;
  }
}
</style>

