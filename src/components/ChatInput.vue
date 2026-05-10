<script setup>
import { ref, nextTick, watch } from 'vue'
import { useChatStore } from '@/stores/chat'

const chat = useChatStore()
const text = ref('')
const taRef = ref(null)

const autoresize = async () => {
  await nextTick()
  const el = taRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 140) + 'px'
}

const focus = () => taRef.value?.focus()

defineExpose({ focus })

const handleSubmit = async () => {
  const q = text.value.trim()
  if (!q || chat.isLoading) return
  text.value = ''
  await autoresize()
  await chat.sendMessage(q)
  focus()
}

const handleKeydown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
    e.preventDefault()
    handleSubmit()
  }
}

watch(() => chat.isLoading, async (v) => {
  if (!v) {
    await nextTick()
    focus()
  }
})
</script>

<template>
  <div class="input-area">
    <div class="bar" :class="{ 'is-focused': false, 'is-disabled': chat.isLoading }">
      <div class="hint" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none"
             stroke="currentColor" stroke-width="1.8"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      </div>

      <textarea
        ref="taRef"
        v-model="text"
        class="ta"
        rows="1"
        autocomplete="off"
        :disabled="chat.isLoading"
        @input="autoresize"
        @keydown="handleKeydown"
      />

      <button
        class="send"
        type="button"
        :disabled="!text.trim() || chat.isLoading"
        :title="chat.isLoading ? '正在回答中…' : '发送 (Enter)'"
        @click="handleSubmit"
      >
        <svg v-if="!chat.isLoading" viewBox="0 0 24 24" width="20" height="20"
             fill="none" stroke="currentColor" stroke-width="2.2"
             stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
        <span v-else class="spinner" aria-hidden="true" />
      </button>
    </div>

    <div class="legal">
      <span>智慧学堂 · 由知识图谱驱动</span>
      <span class="sep">·</span>
      <span>回答仅供参考，关键信息请向任课老师确认</span>
    </div>
  </div>
</template>

<style scoped>
.input-area {
  padding: 14px 20px calc(18px + env(safe-area-inset-bottom));
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.92) 30%, var(--surface-card) 100%);
  border-top: 1px solid var(--line);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.bar {
  width: 100%;
  max-width: 760px;
  display: flex;
  align-items: flex-end;
  gap: 10px;
  padding: 8px 8px 8px 12px;
  background: var(--surface-card);
  border: 1.5px solid var(--line-strong);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.bar:focus-within {
  border-color: var(--ivy-600);
  box-shadow: 0 0 0 4px rgba(31, 85, 68, 0.10), var(--shadow-soft);
}
.bar.is-disabled { opacity: 0.85; }

.hint {
  color: var(--ivy-600);
  padding: 8px 4px 8px 2px;
  align-self: flex-end;
  display: flex;
}

.ta {
  flex: 1;
  border: none;
  background: transparent;
  font-family: var(--font-body);
  font-size: 15px;
  line-height: 1.6;
  resize: none;
  outline: none;
  max-height: 140px;
  min-height: 26px;
  color: var(--text-1);
  padding: 8px 4px;
}
.ta::placeholder { color: var(--text-3); }
.ta:disabled { color: var(--text-2); cursor: not-allowed; }

.send {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(160deg, var(--ivy-600), var(--ivy-700) 60%, var(--ivy-800));
  color: var(--paper-50);
  cursor: pointer;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.2s ease;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    0 4px 12px -4px rgba(15, 42, 35, 0.5);
}
.send:hover:not(:disabled) {
  transform: translateY(-1px);
  filter: brightness(1.05);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    0 8px 20px -6px rgba(15, 42, 35, 0.55);
}
.send:active:not(:disabled) {
  transform: translateY(0) scale(0.97);
}
.send:disabled {
  background: var(--slate-200);
  color: var(--slate-400);
  cursor: not-allowed;
  box-shadow: none;
}

.spinner {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid rgba(245, 236, 211, 0.35);
  border-top-color: var(--paper-50);
  animation: spin 0.9s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.legal {
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.5px;
  color: var(--text-3);
  display: flex;
  align-items: center;
  gap: 8px;
}
.legal .sep { opacity: 0.5; }

@media (max-width: 600px) {
  .input-area { padding-left: 14px; padding-right: 14px; }
  .legal { font-size: 10px; }
  .legal .sep, .legal :last-child { display: none; }
}
</style>
