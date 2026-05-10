<script setup>
import { ref, nextTick, watch } from 'vue'
import { useChatStore } from '@/stores/chat'
import MessageBubble from './MessageBubble.vue'
import WelcomeBlock from './WelcomeBlock.vue'

const chat = useChatStore()
const scrollerRef = ref(null)

const scrollToBottom = () => {
  const el = scrollerRef.value
  if (!el) return
  el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
}

// 监听消息条数 & 每条文本变化，自动滚到底部
watch(
  () => [
    chat.messages.length,
    chat.messages[chat.messages.length - 1]?.text,
    chat.errors.length,
  ],
  async () => {
    await nextTick()
    scrollToBottom()
  },
)
</script>

<template>
  <div ref="scrollerRef" class="scroller">
    <WelcomeBlock v-if="chat.isEmpty" />

    <div v-else class="thread">
      <MessageBubble
        v-for="m in chat.messages"
        :key="m.id"
        :message="m"
      />
    </div>

    <transition-group name="err" tag="div" class="errors">
      <div v-for="e in chat.errors" :key="e.id" class="error-bar" role="alert">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
             stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 9v4M12 17h.01" />
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        </svg>
        <span>{{ e.text }}</span>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.scroller {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 24px 20px 16px;
  scroll-behavior: smooth;
}

.thread {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 760px;
  margin: 0 auto;
}

.errors {
  position: sticky;
  bottom: 4px;
  z-index: 5;
  max-width: 760px;
  margin: 12px auto 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.error-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: var(--rose-100);
  color: var(--rose-600);
  border: 1px solid rgba(185, 74, 62, 0.28);
  border-left: 3px solid var(--rose-600);
  border-radius: var(--radius-sm);
  font-size: 13px;
  box-shadow: var(--shadow-soft);
}

.err-enter-from { opacity: 0; transform: translateY(-6px); }
.err-enter-active, .err-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.err-leave-to { opacity: 0; transform: translateY(-6px); }

@media (max-width: 600px) {
  .scroller { padding: 16px 14px; }
}
</style>
