<template>
  <section id="faq" class="faq">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Frequently Asked Questions</h2>
        <p class="section-subtitle">
          Everything you need to know about our community
        </p>
      </div>
      <div class="faq-grid">
        <div class="faq-item" v-for="(item, index) in faqs" :key="index" @click="toggleFaq(index)">
          <div class="faq-question">
            <h4>{{ item.question }}</h4>
            <svg class="faq-icon" :class="{ active: item.open }" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          <div class="faq-answer" :class="{ open: item.open }">
            <p>{{ item.answer }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const faqs = ref([
  {
    question: 'What is n8n?',
    answer: 'n8n is a powerful workflow automation tool that allows you to connect different services and automate tasks. It\'s open-source, self-hostable, and supports hundreds of integrations.',
    open: false
  },
  {
    question: 'Is the Discord community official?',
    answer: 'Yes! The n8n Discord server is the official community platform where users, contributors, and the n8n team collaborate and support each other.',
    open: false
  },
  {
    question: 'Do I need to pay to join the Discord?',
    answer: 'No, joining the n8n Discord community is completely free. Everyone is welcome, whether you\'re using the free version or the paid version of n8n.',
    open: false
  },
  {
    question: 'What can I do in the Discord community?',
    answer: 'You can ask questions, get help with workflows, share your automations, discuss best practices, stay updated with announcements, and connect with other automation enthusiasts.',
    open: false
  },
  {
    question: 'Are there any rules I should know about?',
    answer: 'Yes, we have community guidelines to ensure a positive experience for everyone. Be respectful, helpful, and constructive. Detailed rules are available in the server.',
    open: false
  },
  {
    question: 'Can I get help with my workflows?',
    answer: 'Absolutely! The community is very supportive. Share your workflow questions in the help channels, and experienced users will assist you. Remember to provide details for better help.',
    open: false
  }
]);

const toggleFaq = (index) => {
  faqs.value[index].open = !faqs.value[index].open;
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.faq {
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

.faq-grid {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.faq-item {
  background: rgba(35, 39, 42, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(88, 101, 242, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.faq-item:hover {
  border-color: rgba(88, 101, 242, 0.3);
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
}

.faq-question h4 {
  font-size: 18px;
  font-weight: 600;
}

.faq-icon {
  color: #5865F2;
  transition: transform 0.3s ease;
}

.faq-icon.active {
  transform: rotate(180deg);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.faq-answer.open {
  max-height: 300px;
}

.faq-answer p {
  padding: 0 32px 24px;
  color: #B9BBBE;
  line-height: 1.6;
}

@media (max-width: 640px) {
  .faq {
    padding: 80px 0;
  }

  .section-title {
    font-size: 36px;
  }

  .faq-question {
    padding: 20px;
  }

  .faq-answer p {
    padding: 0 20px 20px;
  }
}
</style>
