<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-brand">
          <div class="footer-logo">
            <span class="logo-n8n">n8n</span>
            <span class="logo-separator">×</span>
            <span class="logo-discord">Discord</span>
          </div>
          <p class="footer-description">
            Join our vibrant community of automation enthusiasts and take your workflows to the next level.
          </p>
        </div>
        <div class="footer-links">
          <div class="footer-column">
            <h5>Community</h5>
            <a href="https://discord.gg/n8n" target="_blank">Discord Server</a>
            <a href="https://community.n8n.io" target="_blank">Forum</a>
            <a href="https://n8n.io" target="_blank">Official Website</a>
          </div>
          <div class="footer-column">
            <h5>Resources</h5>
            <a href="https://docs.n8n.io" target="_blank">Documentation</a>
            <a href="https://n8n.io/workflows" target="_blank">Workflows</a>
            <a href="https://n8n.io/integrations" target="_blank">Integrations</a>
          </div>
          <div class="footer-column">
            <h5>Connect</h5>
            <a href="https://twitter.com/n8n_io" target="_blank">Twitter</a>
            <a href="https://github.com/n8n-io/n8n" target="_blank">GitHub</a>
            <a href="https://www.youtube.com/c/n8n-io" target="_blank">YouTube</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2025 n8n Community. This is an unofficial community website.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.footer {
  padding: 80px 0 40px;
  background: #23272A;
  border-top: 1px solid rgba(88, 101, 242, 0.1);
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 80px;
  margin-bottom: 48px;
}

.footer-brand {
  max-width: 400px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
}

.logo-n8n {
  color: #3CCF4E;
}

.logo-separator {
  color: #5865F2;
}

.logo-discord {
  color: #5865F2;
}

.footer-description {
  color: #B9BBBE;
  line-height: 1.6;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.footer-column h5 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #FFFFFF;
}

.footer-column a {
  display: block;
  color: #B9BBBE;
  text-decoration: none;
  margin-bottom: 12px;
  transition: color 0.3s ease;
}

.footer-column a:hover {
  color: #5865F2;
}

.footer-bottom {
  text-align: center;
  padding-top: 32px;
  border-top: 1px solid rgba(88, 101, 242, 0.1);
}

.footer-bottom p {
  color: #B9BBBE;
  font-size: 14px;
}

@media (max-width: 968px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 48px;
  }

  .footer-links {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}
</style>
