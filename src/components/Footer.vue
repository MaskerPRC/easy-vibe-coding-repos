<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>关于本站</h3>
          <p>探索生命的真谛，发现存在的意义</p>
        </div>
        <div class="footer-section">
          <h3>快速链接</h3>
          <ul>
            <li><router-link to="/">首页</router-link></li>
            <li><router-link to="/meaning">生命的意义</router-link></li>
            <li><router-link to="/wisdom">生命的智慧</router-link></li>
            <li><router-link to="/philosophy">生命哲学</router-link></li>
          </ul>
        </div>
        <div class="footer-section">
          <h3>联系方式</h3>
          <p>与我们一起探讨生命的奥秘</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2025 生命的真谛. 用心感悟，智慧生活</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// 页脚组件
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
  color: #e2e8f0;
  padding: 3rem 0 1rem;
  margin-top: 4rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3 {
  color: #fff;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.footer-section p {
  line-height: 1.6;
  color: #cbd5e0;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 0.5rem;
}

.footer-section ul li a {
  color: #cbd5e0;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-section ul li a:hover {
  color: #fff;
}

.footer-bottom {
  border-top: 1px solid #4a5568;
  padding-top: 1rem;
  text-align: center;
  color: #a0aec0;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
</style>
