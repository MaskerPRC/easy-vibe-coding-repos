<template>
  <nav class="google-nav">
    <div class="nav-content">
      <div class="nav-logo">
        <span class="logo-text">Google</span>
      </div>
      <ul class="nav-links">
        <li><a href="#phones">Phones</a></li>
        <li><a href="#watches">Watches</a></li>
        <li><a href="#earbuds">Earbuds</a></li>
        <li><a href="#nest">Nest</a></li>
        <li><a href="#services">Services</a></li>
      </ul>
      <div class="nav-actions">
        <button class="search-btn">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M12.5 11h-.79l-.28-.27A6.471 6.471 0 0 0 13 6.5 6.5 6.5 0 1 0 6.5 13c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L17.49 16l-4.99-5zm-6 0C4.01 11 2 8.99 2 6.5S4.01 2 6.5 2 11 4.01 11 6.5 8.99 11 6.5 11z" fill="currentColor"/>
          </svg>
        </button>
        <button class="cart-btn">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M6 15a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM14 15a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" fill="currentColor"/>
            <path d="M0 1.5A.5.5 0 0 1 .5 1h1.67a.5.5 0 0 1 .49.4l1.2 6a.5.5 0 0 0 .49.4h8.3a.5.5 0 0 0 .49-.4l1.2-6a.5.5 0 0 0-.49-.6H3.2" stroke="currentColor" stroke-width="1" fill="none"/>
          </svg>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
</script>

<style scoped>
.google-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: saturate(180%) blur(20px);
  z-index: 1000;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  font-size: 20px;
  font-weight: 500;
  color: #5f6368;
}

.logo-text {
  font-family: 'Product Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  letter-spacing: -0.5px;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 32px;
  margin: 0;
  padding: 0;
}

.nav-links a {
  text-decoration: none;
  color: #5f6368;
  font-size: 14px;
  font-weight: 400;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: #1a73e8;
}

.nav-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.search-btn,
.cart-btn {
  background: none;
  border: none;
  color: #5f6368;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}

.search-btn:hover,
.cart-btn:hover {
  opacity: 0.7;
}

@media (max-width: 768px) {
  .nav-links {
    gap: 16px;
  }

  .nav-links a {
    font-size: 12px;
  }

  .nav-content {
    padding: 0 12px;
  }
}

@media (max-width: 600px) {
  .nav-links {
    display: none;
  }

  .nav-logo {
    font-size: 18px;
  }
}
</style>
