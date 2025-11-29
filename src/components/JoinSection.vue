<template>
  <section id="join" class="join">
    <div class="container">
      <div class="join-content">
        <div class="join-text">
          <h2 class="join-title">Ready to Join?</h2>
          <p class="join-description">
            Becoming part of our Discord community is easy! Click the button below to join thousands of
            automation enthusiasts who are already collaborating, learning, and building together.
          </p>
          <div class="join-steps">
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-text">
                <h4>Click Join Discord</h4>
                <p>Use the invitation link to access our server</p>
              </div>
            </div>
            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-text">
                <h4>Read the Rules</h4>
                <p>Familiarize yourself with our community guidelines</p>
              </div>
            </div>
            <div class="step-item">
              <div class="step-number">3</div>
              <div class="step-text">
                <h4>Introduce Yourself</h4>
                <p>Say hello in the introductions channel</p>
              </div>
            </div>
            <div class="step-item">
              <div class="step-number">4</div>
              <div class="step-text">
                <h4>Start Exploring</h4>
                <p>Browse channels and join conversations</p>
              </div>
            </div>
          </div>
          <a href="https://discord.gg/n8n" target="_blank" class="btn-join">
            <svg class="discord-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Join Our Discord Server
          </a>
        </div>
        <div class="join-visual">
          <div class="discord-mockup">
            <div class="mockup-header">
              <div class="mockup-dot"></div>
              <div class="mockup-dot"></div>
              <div class="mockup-dot"></div>
            </div>
            <div class="mockup-content">
              <div class="channel-item">
                <span class="channel-icon">#</span>
                <span>general</span>
              </div>
              <div class="channel-item">
                <span class="channel-icon">#</span>
                <span>help</span>
              </div>
              <div class="channel-item active">
                <span class="channel-icon">#</span>
                <span>workflows</span>
              </div>
              <div class="channel-item">
                <span class="channel-icon">#</span>
                <span>showcase</span>
              </div>
              <div class="channel-item">
                <span class="channel-icon">#</span>
                <span>announcements</span>
              </div>
            </div>
          </div>
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

.join {
  padding: 120px 0;
  background: #23272A;
}

.join-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.join-title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 24px;
}

.join-description {
  font-size: 18px;
  color: #B9BBBE;
  line-height: 1.6;
  margin-bottom: 48px;
}

.join-steps {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 48px;
}

.step-item {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.step-number {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #5865F2 0%, #3CCF4E 100%);
  border-radius: 50%;
  font-weight: 700;
  flex-shrink: 0;
}

.step-text h4 {
  font-size: 18px;
  margin-bottom: 4px;
}

.step-text p {
  font-size: 14px;
  color: #B9BBBE;
}

.discord-icon {
  flex-shrink: 0;
}

.btn-join {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 32px;
  background: #3CCF4E;
  color: #23272A;
  text-decoration: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-join:hover {
  background: #2EAD3E;
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(60, 207, 78, 0.4);
}

.join-visual {
  display: flex;
  justify-content: center;
}

.discord-mockup {
  width: 100%;
  max-width: 400px;
  background: #2C2F33;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(88, 101, 242, 0.2);
}

.mockup-header {
  display: flex;
  gap: 8px;
  padding: 16px;
  background: #23272A;
  border-bottom: 1px solid rgba(88, 101, 242, 0.1);
}

.mockup-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #5865F2;
}

.mockup-content {
  padding: 24px;
}

.channel-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #B9BBBE;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.channel-item:hover {
  background: rgba(88, 101, 242, 0.1);
  color: #FFFFFF;
}

.channel-item.active {
  background: rgba(88, 101, 242, 0.2);
  color: #FFFFFF;
}

.channel-icon {
  color: #5865F2;
  font-weight: 700;
  font-size: 20px;
}

@media (max-width: 968px) {
  .join-content {
    grid-template-columns: 1fr;
    gap: 48px;
  }
}

@media (max-width: 640px) {
  .join {
    padding: 80px 0;
  }

  .join-title {
    font-size: 36px;
  }
}
</style>
