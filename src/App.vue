<template>
  <div class="app">
    <NavBar />
    <HeroSection />
    <FeaturesSection />
    <JoinSection />
    <FaqSection />
    <FooterSection />
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue';
import HeroSection from './components/HeroSection.vue';
import FeaturesSection from './components/FeaturesSection.vue';
import JoinSection from './components/JoinSection.vue';
import FaqSection from './components/FaqSection.vue';
import FooterSection from './components/FooterSection.vue';
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: #23272A;
  color: #FFFFFF;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
}
</style>
