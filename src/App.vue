<template>
  <div class="github-homepage">
    <!-- Top Navigation -->
    <header class="top-header">
      <div class="header-content">
        <div class="header-left">
          <div class="github-logo">
            <svg height="32" viewBox="0 0 16 16" width="32" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
          </div>
          <nav class="nav-links">
            <a href="#" class="nav-link">Product</a>
            <a href="#" class="nav-link">Solutions</a>
            <a href="#" class="nav-link">Open Source</a>
            <a href="#" class="nav-link">Pricing</a>
          </nav>
        </div>
        <div class="header-right">
          <div class="search-box">
            <svg class="search-icon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
              <path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.5 4.5 0 1 0-8.997.004A4.5 4.5 0 0 0 11.5 7Z"/>
            </svg>
            <input type="text" placeholder="Search GitHub" />
          </div>
          <a href="#" class="header-link">Sign in</a>
          <button class="signup-btn">Sign up</button>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <h1 class="hero-title">
            Let's build from here
          </h1>
          <p class="hero-description">
            The world's leading AI-powered developer platform.
          </p>
          <div class="hero-signup">
            <input type="email" placeholder="Email address" class="email-input" />
            <button class="cta-button">Sign up for GitHub</button>
          </div>
          <p class="hero-subtext">
            Trusted by the world's leading organizations ↘︎
          </p>
        </div>
        <div class="hero-visual">
          <div class="code-window">
            <div class="window-header">
              <div class="window-dots">
                <span class="dot red"></span>
                <span class="dot yellow"></span>
                <span class="dot green"></span>
              </div>
              <div class="window-title">index.html</div>
            </div>
            <div class="code-content">
              <pre><code><span class="line"><span class="tag">&lt;!DOCTYPE</span> <span class="attr">html</span><span class="tag">&gt;</span></span>
<span class="line"><span class="tag">&lt;html</span> <span class="attr">lang</span>=<span class="string">"en"</span><span class="tag">&gt;</span></span>
<span class="line">  <span class="tag">&lt;head&gt;</span></span>
<span class="line">    <span class="tag">&lt;meta</span> <span class="attr">charset</span>=<span class="string">"UTF-8"</span><span class="tag">&gt;</span></span>
<span class="line">    <span class="tag">&lt;title&gt;</span>Hello World<span class="tag">&lt;/title&gt;</span></span>
<span class="line">  <span class="tag">&lt;/head&gt;</span></span>
<span class="line">  <span class="tag">&lt;body&gt;</span></span>
<span class="line">    <span class="tag">&lt;h1&gt;</span>Welcome to GitHub<span class="tag">&lt;/h1&gt;</span></span>
<span class="line">  <span class="tag">&lt;/body&gt;</span></span>
<span class="line"><span class="tag">&lt;/html&gt;</span></span></code></pre>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <div class="feature-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3 class="feature-title">Collaborative Coding</h3>
            <p class="feature-description">
              Work together from anywhere with tools for real-time collaboration.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
              </svg>
            </div>
            <h3 class="feature-title">Automation & CI/CD</h3>
            <p class="feature-description">
              Automate your workflow from idea to production with GitHub Actions.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
            </div>
            <h3 class="feature-title">Security</h3>
            <p class="feature-description">
              Keep your code secure with automated security updates and code scanning.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l-5.5 9h11z"/>
                <circle cx="17.5" cy="17.5" r="4.5"/>
                <path d="M3 13.5h8v8H3z"/>
              </svg>
            </div>
            <h3 class="feature-title">Open Source</h3>
            <p class="feature-description">
              Join millions of developers building and scaling open source projects.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">100M+</div>
            <div class="stat-label">Developers</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">420M+</div>
            <div class="stat-label">Repositories</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">90%</div>
            <div class="stat-label">Fortune 100</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">330M+</div>
            <div class="stat-label">Pull Requests</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-left">
            <div class="github-logo-footer">
              <svg height="24" viewBox="0 0 16 16" width="24" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
            </div>
            <span class="footer-copyright">© 2024 GitHub, Inc.</span>
          </div>
          <div class="footer-links">
            <a href="#" class="footer-link">Terms</a>
            <a href="#" class="footer-link">Privacy</a>
            <a href="#" class="footer-link">Security</a>
            <a href="#" class="footer-link">Status</a>
            <a href="#" class="footer-link">Docs</a>
            <a href="#" class="footer-link">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

onMounted(() => {
  console.log('GitHub Homepage loaded');
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.github-homepage {
  min-height: 100vh;
  background: #0d1117;
  color: #c9d1d9;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
}

/* Header Styles */
.top-header {
  background: rgba(13, 17, 23, 0.95);
  border-bottom: 1px solid #30363d;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.header-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 16px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.github-logo {
  color: #f0f6fc;
  display: flex;
  align-items: center;
}

.nav-links {
  display: flex;
  gap: 20px;
  align-items: center;
}

.nav-link {
  color: #f0f6fc;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #58a6ff;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #8b949e;
}

.search-box input {
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 6px;
  padding: 8px 12px 8px 36px;
  color: #c9d1d9;
  font-size: 14px;
  width: 280px;
  transition: all 0.2s;
}

.search-box input:focus {
  outline: none;
  border-color: #58a6ff;
  box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.1);
}

.search-box input::placeholder {
  color: #8b949e;
}

.header-link {
  color: #f0f6fc;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s;
}

.header-link:hover {
  color: #58a6ff;
}

.signup-btn {
  background: linear-gradient(180deg, #1f6feb 0%, #1158c7 100%);
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.signup-btn:hover {
  background: linear-gradient(180deg, #2672f3 0%, #1a6ff0 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(31, 111, 235, 0.3);
}

/* Hero Section */
.hero-section {
  padding: 80px 32px;
  background: linear-gradient(135deg, #0d1117 0%, #1c2128 50%, #0d1117 100%);
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 30%, rgba(88, 166, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(163, 113, 247, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.hero-container {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-content {
  max-width: 600px;
}

.hero-title {
  font-size: 64px;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #f0f6fc 0%, #58a6ff 50%, #a371f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 24px;
  color: #8b949e;
  margin-bottom: 32px;
  line-height: 1.5;
}

.hero-signup {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.email-input {
  flex: 1;
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 6px;
  padding: 12px 16px;
  color: #c9d1d9;
  font-size: 16px;
  transition: all 0.2s;
}

.email-input:focus {
  outline: none;
  border-color: #58a6ff;
  box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.1);
}

.email-input::placeholder {
  color: #6e7681;
}

.cta-button {
  background: linear-gradient(180deg, #2ea043 0%, #238636 100%);
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.cta-button:hover {
  background: linear-gradient(180deg, #3fb950 0%, #2ea043 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(46, 160, 67, 0.4);
}

.hero-subtext {
  color: #6e7681;
  font-size: 14px;
}

/* Code Window */
.hero-visual {
  position: relative;
}

.code-window {
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.window-header {
  background: #1c2128;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #30363d;
}

.window-dots {
  display: flex;
  gap: 6px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot.red {
  background: #ff5f56;
}

.dot.yellow {
  background: #ffbd2e;
}

.dot.green {
  background: #27c93f;
}

.window-title {
  color: #8b949e;
  font-size: 12px;
  font-weight: 500;
}

.code-content {
  padding: 24px;
  font-family: 'SF Mono', Monaco, Menlo, Consolas, monospace;
  font-size: 14px;
  line-height: 1.8;
  overflow-x: auto;
}

.code-content pre {
  margin: 0;
}

.code-content code {
  display: block;
}

.line {
  display: block;
}

.tag {
  color: #7ee787;
}

.attr {
  color: #79c0ff;
}

.string {
  color: #ffa657;
}

/* Features Section */
.features-section {
  padding: 80px 32px;
  background: #0d1117;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
}

.feature-card {
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 12px;
  padding: 32px;
  transition: all 0.3s;
}

.feature-card:hover {
  border-color: #58a6ff;
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(88, 166, 255, 0.2);
}

.feature-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 20px;
  color: #58a6ff;
}

.feature-icon svg {
  width: 100%;
  height: 100%;
}

.feature-title {
  font-size: 20px;
  font-weight: 600;
  color: #f0f6fc;
  margin-bottom: 12px;
}

.feature-description {
  color: #8b949e;
  line-height: 1.6;
  font-size: 14px;
}

/* Stats Section */
.stats-section {
  padding: 80px 32px;
  background: #161b22;
  border-top: 1px solid #30363d;
  border-bottom: 1px solid #30363d;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 48px;
  text-align: center;
}

.stat-number {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #58a6ff 0%, #a371f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.stat-label {
  color: #8b949e;
  font-size: 16px;
  font-weight: 500;
}

/* Footer */
.footer {
  padding: 48px 32px;
  background: #0d1117;
}

.footer-content {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.github-logo-footer {
  color: #8b949e;
  display: flex;
  align-items: center;
}

.footer-copyright {
  color: #6e7681;
  font-size: 14px;
}

.footer-links {
  display: flex;
  gap: 24px;
}

.footer-link {
  color: #58a6ff;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #79c0ff;
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 48px;
  }

  .hero-title {
    font-size: 48px;
  }

  .hero-description {
    font-size: 20px;
  }
}

@media (max-width: 768px) {
  .header-content {
    padding: 12px 16px;
  }

  .nav-links {
    display: none;
  }

  .search-box {
    display: none;
  }

  .hero-section {
    padding: 48px 16px;
  }

  .hero-title {
    font-size: 36px;
  }

  .hero-description {
    font-size: 18px;
  }

  .hero-signup {
    flex-direction: column;
  }

  .features-section {
    padding: 48px 16px;
  }

  .stats-section {
    padding: 48px 16px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
  }

  .stat-number {
    font-size: 36px;
  }

  .footer {
    padding: 32px 16px;
  }

  .footer-content {
    flex-direction: column;
    gap: 24px;
    text-align: center;
  }

  .footer-links {
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 28px;
  }

  .hero-description {
    font-size: 16px;
  }

  .code-window {
    font-size: 12px;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
