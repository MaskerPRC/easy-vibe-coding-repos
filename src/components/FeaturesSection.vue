<template>
  <section id="features" class="features">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Why Join Our Community?</h2>
        <p class="section-subtitle">
          Discover the benefits of being part of the n8n Discord community
        </p>
      </div>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <h3 class="feature-title">Expert Community</h3>
          <p class="feature-description">
            Connect with experienced n8n users, automation experts, and the core development team. Get answers to your questions quickly.
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon feature-icon-green">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
          <h3 class="feature-title">Live Support</h3>
          <p class="feature-description">
            Get real-time help from community members around the globe. Someone is always online to assist you with your workflows.
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v20M2 12h20"></path>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
          </div>
          <h3 class="feature-title">Workflow Sharing</h3>
          <p class="feature-description">
            Share your workflows, discover new automation ideas, and learn from community-created templates and use cases.
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon feature-icon-green">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <h3 class="feature-title">Latest Updates</h3>
          <p class="feature-description">
            Stay informed about new features, updates, and improvements. Be the first to know about n8n's latest developments.
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <h3 class="feature-title">Active Discussions</h3>
          <p class="feature-description">
            Participate in engaging discussions about automation, integrations, best practices, and innovative solutions.
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon feature-icon-green">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>
          <h3 class="feature-title">Exclusive Events</h3>
          <p class="feature-description">
            Join community events, workshops, and Q&A sessions. Learn directly from n8n experts and power users.
          </p>
        </div>
      </div>
    </div>
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

.features {
  padding: 120px 0;
  background: #2C2F33;
}

.section-header {
  text-align: center;
  margin-bottom: 80px;
}

.section-title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
}

.section-subtitle {
  font-size: 18px;
  color: #B9BBBE;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;
}

.feature-card {
  padding: 40px 32px;
  background: rgba(35, 39, 42, 0.6);
  border-radius: 16px;
  border: 1px solid rgba(88, 101, 242, 0.1);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
  border-color: rgba(88, 101, 242, 0.4);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
}

.feature-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(88, 101, 242, 0.1);
  border-radius: 12px;
  color: #5865F2;
  margin-bottom: 24px;
}

.feature-icon-green {
  background: rgba(60, 207, 78, 0.1);
  color: #3CCF4E;
}

.feature-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 12px;
}

.feature-description {
  font-size: 16px;
  color: #B9BBBE;
  line-height: 1.6;
}

@media (max-width: 968px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .features {
    padding: 80px 0;
  }

  .section-title {
    font-size: 36px;
  }
}
</style>
