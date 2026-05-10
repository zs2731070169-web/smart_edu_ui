<script setup>
import { useChatStore } from '@/stores/chat'

const chat = useChatStore()

const quickQuestions = [
  { q: '有哪些课程可以学习？', icon: '📘', label: '课程' },
  { q: '有哪些任课老师？',     icon: '🧑‍🏫', label: '老师' },
]

const handlePick = (q) => {
  if (chat.isLoading) return
  chat.sendMessage(q)
}
</script>

<template>
  <section class="welcome" aria-label="欢迎区">
    <div class="badge">
      <span class="badge-dot" />
      <span>智能助教</span>
    </div>

    <h2 class="title">
      你好，<span class="accent">我来帮你学</span>
    </h2>

    <p class="lede">
      课程、知识点、老师、作业、考试…<br />
      尽管开口提问，我会按知识图谱与你解释清楚。
    </p>

    <div class="quick" role="list">
      <button
        v-for="item in quickQuestions"
        :key="item.q"
        class="quick-item"
        type="button"
        role="listitem"
        :disabled="chat.isLoading"
        @click="handlePick(item.q)"
      >
        <span class="quick-icon" aria-hidden="true">{{ item.icon }}</span>
        <span class="quick-text">
          <span class="quick-label">{{ item.label }}</span>
          <span class="quick-q">{{ item.q }}</span>
        </span>
        <svg class="quick-arrow" viewBox="0 0 24 24" width="16" height="16"
             fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <div class="footnote">
      <span class="rule" />
      <span>按 <kbd>Enter</kbd> 发送 · <kbd>Shift</kbd>+<kbd>Enter</kbd> 换行</span>
      <span class="rule" />
    </div>
  </section>
</template>

<style scoped>
.welcome {
  text-align: center;
  padding: 56px 24px 24px;
  animation: rise-in 0.55s ease both;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px 5px 10px;
  border-radius: 999px;
  background: var(--ivy-100);
  color: var(--ivy-700);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 1px;
  border: 1px solid var(--ivy-200);
}
.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--ivy-600);
  box-shadow: 0 0 0 3px rgba(31, 85, 68, 0.18);
}

.title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 38px;
  line-height: 1.15;
  letter-spacing: -0.5px;
  color: var(--ivy-900);
  margin: 18px 0 14px;
}
.accent {
  position: relative;
  color: var(--ivy-700);
  white-space: nowrap;
}
.accent::after {
  content: '';
  position: absolute;
  left: -2%;
  right: -2%;
  bottom: 6px;
  height: 10px;
  background: var(--honey-300);
  z-index: -1;
  border-radius: 3px;
  transform: skewX(-8deg);
  opacity: 0.7;
}

.lede {
  font-size: 14.5px;
  color: var(--text-2);
  line-height: 1.85;
  max-width: 420px;
  margin: 0 auto;
}

.quick {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  max-width: 480px;
  margin: 28px auto 0;
}
.quick-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 14px;
  background: var(--surface-card);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  cursor: pointer;
  text-align: left;
  color: var(--text-1);
  font-family: inherit;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
  box-shadow: var(--shadow-soft);
}
.quick-item:hover:not(:disabled) {
  transform: translateY(-2px);
  border-color: var(--ivy-400);
  box-shadow: var(--shadow-card);
}
.quick-item:hover:not(:disabled) .quick-arrow { transform: translateX(3px); color: var(--ivy-700); }
.quick-item:active:not(:disabled) { transform: translateY(0); }
.quick-item:disabled { opacity: 0.55; cursor: not-allowed; }

.quick-icon {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  font-size: 18px;
  background: var(--ivy-100);
  border-radius: 10px;
  flex-shrink: 0;
}
.quick-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1; }
.quick-label {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--ivy-600);
}
.quick-q {
  font-size: 13.5px;
  color: var(--text-1);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.quick-arrow {
  color: var(--text-3);
  flex-shrink: 0;
  transition: transform 0.18s ease, color 0.18s ease;
}

.footnote {
  margin-top: 36px;
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
  color: var(--text-3);
  font-size: 11.5px;
  letter-spacing: 0.5px;
}
.rule { flex: 0 0 40px; height: 1px; background: var(--line); }
kbd {
  font-family: var(--font-mono);
  font-size: 10.5px;
  padding: 1px 6px;
  border: 1px solid var(--line-strong);
  border-bottom-width: 2px;
  border-radius: 4px;
  background: var(--surface-card);
  color: var(--text-2);
  margin: 0 1px;
}

@media (max-width: 560px) {
  .welcome { padding-top: 32px; }
  .title { font-size: 28px; }
  .quick { grid-template-columns: 1fr; }
}
</style>
