<script setup>
import { onMounted, ref } from 'vue'
import ChatHeader from '@/components/ChatHeader.vue'
import ChatMessages from '@/components/ChatMessages.vue'
import ChatInput from '@/components/ChatInput.vue'

const inputRef = ref(null)
onMounted(() => inputRef.value?.focus())
</script>

<template>
  <main class="page">
    <article class="card">
      <ChatHeader />
      <ChatMessages />
      <ChatInput ref="inputRef" />
    </article>
  </main>
</template>

<style scoped>
.page {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 1;
}

.card {
  position: relative;
  width: 100%;
  max-width: 880px;
  height: 100%;
  max-height: min(960px, 100%);
  display: flex;
  flex-direction: column;
  background: var(--surface-soft);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-card);
  border: 1px solid var(--line);
}

/* 卡片角落装饰：左下「印章」+ 右上「书签丝带」 */
.card::before {
  content: '智';
  position: absolute;
  left: 14px;
  bottom: 110px;
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 20px;
  color: var(--honey-700);
  background: rgba(255, 250, 240, 0.6);
  border: 2px solid var(--honey-600);
  border-radius: 6px;
  letter-spacing: -1px;
  transform: rotate(-8deg);
  pointer-events: none;
  z-index: 4;
  opacity: 0.85;
  text-shadow: 0 0 1px rgba(196, 122, 42, 0.3);
}

@media (max-width: 760px) {
  .page { padding: 0; }
  .card {
    max-height: 100%;
    height: 100dvh;
    border-radius: 0;
    border: none;
  }
  .card::before { display: none; }
}
</style>
