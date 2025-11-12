<template>
  <!-- 页脚 -->
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-links">
        <a href="#terms" class="footer-link">Terms</a>
        <a href="#privacy" class="footer-link">Privacy</a>
        <a href="#contact" class="footer-link">Contact</a>
        <a href="#about" class="footer-link">About</a>
      </div>
      <div class="footer-social">
        <a href="#twitter" class="social-icon" aria-label="Twitter">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6.29 18.25c7.55 0 11.67-6.25 11.67-11.67v-.53c.8-.59 1.49-1.3 2.04-2.13-.75.33-1.54.55-2.36.65a4.12 4.12 0 0 0 1.8-2.27c-.8.48-1.68.81-2.6 1a4.1 4.1 0 0 0-7 3.74 11.65 11.65 0 0 1-8.45-4.3 4.1 4.1 0 0 0 1.27 5.49C2.01 8.2 1.37 8.03.8 7.7v.05a4.1 4.1 0 0 0 3.3 4.03 4.1 4.1 0 0 1-1.86.07 4.1 4.1 0 0 0 3.83 2.85A8.23 8.23 0 0 1 0 16.4a11.62 11.62 0 0 0 6.29 1.84"/>
          </svg>
        </a>
        <a href="#github" class="social-icon" aria-label="GitHub">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 10 4.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.138 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z"/>
          </svg>
        </a>
        <a href="#linkedin" class="social-icon" aria-label="LinkedIn">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M18.5 0h-17A1.5 1.5 0 0 0 0 1.5v17A1.5 1.5 0 0 0 1.5 20h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 18.5 0zM6 17H3V8h3v9zM4.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM17 17h-3v-4.5c0-1.12-.02-2.56-1.56-2.56-1.56 0-1.8 1.22-1.8 2.48V17h-3V8h2.88v1.23h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59V17z"/>
          </svg>
        </a>
      </div>
      <div class="footer-copyright">
        <p>&copy; 2024 AIverse. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// 页脚组件 - 无需额外逻辑
</script>

<style scoped>
/* 页脚 */
.footer {
  background: #F8F8F8;
  border-top: 1px solid #E0E0E0;
  padding: 48px 24px 32px;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
}

.footer-links {
  display: flex;
  gap: 32px;
}

.footer-link {
  font-size: 14px;
  color: #666666;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #4A90E2;
}

.footer-social {
  display: flex;
  gap: 16px;
}

.social-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFFFFF;
  border: 1px solid #E0E0E0;
  border-radius: 50%;
  color: #666666;
  text-decoration: none;
  transition: all 0.2s;
}

.social-icon:hover {
  background: #4A90E2;
  color: #FFFFFF;
  border-color: #4A90E2;
}

.footer-copyright {
  text-align: center;
  color: #666666;
  font-size: 13px;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .footer-links {
    flex-wrap: wrap;
    justify-content: center;
    gap: 16px;
  }
}
</style>
