<template>
  <nav class="apple-nav">
    <div class="nav-content">
      <div class="nav-logo">
        <svg viewBox="0 0 24 24" class="google-logo">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
      </div>
      <ul class="nav-menu">
        <li><a href="#pixel">Pixel 手机</a></li>
        <li><a href="#watch">Pixel Watch</a></li>
        <li><a href="#buds">Pixel Buds</a></li>
        <li><a href="#tablet">Pixel Tablet</a></li>
        <li><a href="#accessories">配件</a></li>
        <li><a href="#support">支持</a></li>
      </ul>
      <div class="nav-icons">
        <button class="nav-icon-btn" aria-label="搜索">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"/>
          </svg>
        </button>
        <button class="nav-icon-btn" aria-label="购物车">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0 0 20 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
</script>

<style scoped>
.apple-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 1000;
  height: 44px;
}

.nav-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 22px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  display: flex;
  align-items: center;
}

.google-logo {
  width: 74px;
  height: 24px;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 32px;
  margin: 0;
  padding: 0;
}

.nav-menu li {
  display: flex;
  align-items: center;
}

.nav-menu a {
  color: #1d1d1f;
  text-decoration: none;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: -0.01em;
  transition: opacity 0.3s;
  white-space: nowrap;
}

.nav-menu a:hover {
  opacity: 0.7;
}

.nav-icons {
  display: flex;
  gap: 16px;
  align-items: center;
}

.nav-icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1d1d1f;
  transition: opacity 0.3s;
}

.nav-icon-btn:hover {
  opacity: 0.7;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }

  .nav-content {
    padding: 0 16px;
  }

  .google-logo {
    width: 60px;
    height: 20px;
  }
}
</style>
