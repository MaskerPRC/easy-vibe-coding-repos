<template>
  <section class="hero">
    <div class="container">
      <div class="hero-content">
        <div class="hero-badge">Community Powered Automation</div>
        <h1 class="hero-title">
          Join the <span class="gradient-text">n8n Discord</span> Community
        </h1>
        <p class="hero-description">
          Connect with thousands of automation enthusiasts, get expert help, share workflows,
          and stay updated with the latest n8n developments. All in one vibrant Discord community.
        </p>
        <div class="hero-actions">
          <a href="https://discord.gg/n8n" target="_blank" class="btn-hero-primary">
            <svg class="discord-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Join Now
          </a>
          <a href="#features" class="btn-hero-secondary">Learn More</a>
        </div>
        <div class="hero-stats">
          <div class="stat-item">
            <div class="stat-number">10K+</div>
            <div class="stat-label">Members</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-number">500+</div>
            <div class="stat-label">Daily Active Users</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-number">24/7</div>
            <div class="stat-label">Community Support</div>
          </div>
        </div>
      </div>
    </div>
    <div class="hero-gradient"></div>
  </section>
</template>

<script setup>
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.hero {
  position: relative;
  padding: 160px 0 120px;
  overflow: hidden;
}

.hero-content {
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-block;
  padding: 8px 16px;
  background: rgba(60, 207, 78, 0.1);
  color: #3CCF4E;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 24px;
  border: 1px solid rgba(60, 207, 78, 0.3);
}

.hero-title {
  font-size: 64px;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 24px;
}

.gradient-text {
  background: linear-gradient(135deg, #5865F2 0%, #3CCF4E 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 20px;
  color: #B9BBBE;
  line-height: 1.6;
  margin-bottom: 40px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 80px;
}

.discord-icon {
  flex-shrink: 0;
}

.btn-hero-primary {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 32px;
  background: #5865F2;
  color: #FFFFFF;
  text-decoration: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-hero-primary:hover {
  background: #4752C4;
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(88, 101, 242, 0.4);
}

.btn-hero-secondary {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 32px;
  background: rgba(255, 255, 255, 0.05);
  color: #FFFFFF;
  text-decoration: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  border: 2px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.btn-hero-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.hero-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 48px;
  padding: 32px;
  background: rgba(44, 47, 51, 0.6);
  border-radius: 16px;
  border: 1px solid rgba(88, 101, 242, 0.2);
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 32px;
  font-weight: 800;
  color: #3CCF4E;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #B9BBBE;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(185, 187, 190, 0.2);
}

.hero-gradient {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(88, 101, 242, 0.15) 0%, transparent 70%);
  pointer-events: none;
}

@media (max-width: 968px) {
  .hero-title {
    font-size: 48px;
  }

  .hero-description {
    font-size: 18px;
  }

  .hero-stats {
    flex-direction: column;
    gap: 24px;
  }

  .stat-divider {
    width: 100%;
    height: 1px;
  }
}

@media (max-width: 640px) {
  .hero {
    padding: 120px 0 80px;
  }

  .hero-title {
    font-size: 36px;
  }

  .hero-description {
    font-size: 16px;
  }

  .hero-actions {
    flex-direction: column;
    width: 100%;
  }

  .btn-hero-primary,
  .btn-hero-secondary {
    width: 100%;
    justify-content: center;
  }
}
</style>
