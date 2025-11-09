<template>
  <nav class="navigation">
    <div class="nav-container">
      <div class="nav-brand">
        <span class="nav-icon">🌍</span>
        <span class="nav-title">World App</span>
      </div>
      <div class="nav-links">
        <router-link to="/" class="nav-link" exact-active-class="active">
          <span class="link-icon">🏠</span>
          <span class="link-text">首页</span>
        </router-link>
        <router-link to="/admin" class="nav-link" active-class="active">
          <span class="link-icon">⚙️</span>
          <span class="link-text">管理面板</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navigation'
}
</script>

<style scoped>
.navigation {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
}

.nav-icon {
  font-size: 2rem;
}

.nav-title {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  color: #666;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
}

.nav-link.active {
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.link-icon {
  font-size: 1.25rem;
}

.link-text {
  font-size: 1rem;
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0.75rem 1rem;
    flex-direction: column;
    gap: 1rem;
  }

  .nav-links {
    width: 100%;
    justify-content: center;
  }

  .nav-link {
    flex: 1;
    justify-content: center;
    padding: 0.6rem 1rem;
  }

  .link-text {
    font-size: 0.9rem;
  }
}
</style>
