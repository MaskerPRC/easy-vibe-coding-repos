<template>
  <div class="chrome-404">
    <div class="error-container">
      <!-- Chrome Dino -->
      <div class="dino-container">
        <svg class="dino" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
          <!-- Dino body -->
          <rect x="80" y="40" width="40" height="35" fill="#535353"/>
          <!-- Dino head -->
          <rect x="105" y="30" width="30" height="25" fill="#535353"/>
          <!-- Dino eye -->
          <circle cx="125" cy="40" r="3" fill="white"/>
          <!-- Dino legs -->
          <rect x="85" y="75" width="8" height="15" fill="#535353"/>
          <rect x="107" y="75" width="8" height="15" fill="#535353"/>
          <!-- Dino tail -->
          <polygon points="80,60 70,55 75,65" fill="#535353"/>
          <!-- Dino arm -->
          <rect x="115" y="55" width="6" height="12" fill="#535353"/>
        </svg>
      </div>

      <!-- Error Text -->
      <div class="error-content">
        <h1 class="error-code">404</h1>
        <h2 class="error-title">找不到网页</h2>
        <p class="error-message">网页可能已被删除，或者网址有误</p>

        <div class="suggestions">
          <p class="suggestion-title">请尝试以下操作：</p>
          <ul class="suggestion-list">
            <li>检查网址是否正确</li>
            <li>返回上一页</li>
            <li>访问首页</li>
          </ul>
        </div>

        <div class="error-code-detail">
          <span class="code-label">错误代码：</span>
          <span class="code-value">ERR_PAGE_NOT_FOUND</span>
        </div>
      </div>
    </div>

    <!-- Ground line (decorative) -->
    <div class="ground"></div>
  </div>
</template>

<script setup>
// Chrome 404 page - no interactive functionality needed for basic version
</script>

<style scoped>
/* Chrome 404 Page Styles */
.chrome-404 {
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  position: relative;
  overflow: hidden;
}

.error-container {
  display: flex;
  align-items: center;
  gap: 60px;
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
}

/* Dino Styles */
.dino-container {
  flex-shrink: 0;
}

.dino {
  width: 200px;
  height: 100px;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.1));
}

/* Error Content */
.error-content {
  flex: 1;
  max-width: 450px;
}

.error-code {
  font-size: 72px;
  font-weight: 500;
  color: #5f6368;
  margin: 0 0 16px 0;
  line-height: 1;
}

.error-title {
  font-size: 28px;
  font-weight: 400;
  color: #202124;
  margin: 0 0 12px 0;
}

.error-message {
  font-size: 16px;
  color: #5f6368;
  margin: 0 0 24px 0;
  line-height: 1.5;
}

/* Suggestions */
.suggestions {
  margin: 24px 0;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.suggestion-title {
  font-size: 14px;
  font-weight: 500;
  color: #202124;
  margin: 0 0 12px 0;
}

.suggestion-list {
  margin: 0;
  padding-left: 20px;
  list-style-type: disc;
}

.suggestion-list li {
  font-size: 14px;
  color: #5f6368;
  margin: 8px 0;
  line-height: 1.6;
}

/* Error Code Detail */
.error-code-detail {
  margin-top: 24px;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
}

.code-label {
  color: #5f6368;
  font-weight: 500;
}

.code-value {
  color: #d93025;
  margin-left: 8px;
}

/* Ground Line */
.ground {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #dadce0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .error-container {
    flex-direction: column;
    gap: 30px;
    padding: 20px;
    text-align: center;
  }

  .dino {
    width: 160px;
    height: 80px;
  }

  .error-code {
    font-size: 56px;
  }

  .error-title {
    font-size: 24px;
  }

  .error-message {
    font-size: 14px;
  }

  .suggestions {
    text-align: left;
  }
}

@media (max-width: 480px) {
  .error-code {
    font-size: 48px;
  }

  .error-title {
    font-size: 20px;
  }

  .dino {
    width: 120px;
    height: 60px;
  }

  .error-container {
    gap: 20px;
  }
}
</style>
