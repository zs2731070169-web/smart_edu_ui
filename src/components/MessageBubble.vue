<script setup>
import { computed } from 'vue'
import LoadingDots from './LoadingDots.vue'

const props = defineProps({
  message: { type: Object, required: true },
})

const isUser = computed(() => props.message.role === 'user')

/** 把换行还原成 <br>，<template> 中用 v-html 渲染；Vue 默认对 {{ }} 已转义 */
const htmlText = computed(() => {
  const t = props.message.text ?? ''
  // 简单转义后还原 \n
  const escaped = t
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>')
  return escaped
})
</script>

<template>
  <div class="msg" :class="[isUser ? 'is-user' : 'is-assistant', { 'is-error': message.error }]">
    <div class="avatar" aria-hidden="true">
      <template v-if="isUser">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
             stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </template>
      <template v-else>
        <span class="avatar-glyph">学</span>
      </template>
    </div>

    <div class="body">
      <div class="meta">
        <span class="who">{{ isUser ? '你' : '智能助教' }}</span>
        <span v-if="message.time" class="time">{{ message.time }}</span>
      </div>

      <div class="bubble">
        <LoadingDots v-if="message.loading" />
        <template v-else>
          <span class="content" v-html="htmlText" />
          <span v-if="message.streaming" class="cursor" aria-hidden="true" />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.msg {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  animation: rise-in 0.32s ease both;
  max-width: 86%;
}
.is-user {
  flex-direction: row-reverse;
  align-self: flex-end;
  max-width: 80%;
}
.is-assistant {
  align-self: flex-start;
}

.avatar {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  user-select: none;
  font-family: var(--font-display);
}
.is-user .avatar {
  background: var(--ivy-700);
  color: var(--paper-50);
  box-shadow: var(--shadow-bubble);
  border-radius: 12px 12px 4px 12px;
}
.is-assistant .avatar {
  background: var(--surface-card);
  color: var(--ivy-700);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-bubble);
  border-radius: 12px 12px 12px 4px;
}
.avatar-glyph {
  font-weight: 800;
  font-size: 18px;
}

.body {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
.is-user .body { align-items: flex-end; }

.meta {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 4px;
  font-size: 11px;
  color: var(--text-3);
  font-family: var(--font-mono);
  letter-spacing: 0.5px;
}
.who {
  text-transform: uppercase;
  color: var(--ivy-600);
  font-weight: 600;
}
.is-user .who { color: var(--honey-600); }

.bubble {
  position: relative;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 15px;
  line-height: 1.7;
  word-break: break-word;
  white-space: normal;
  box-shadow: var(--shadow-bubble);
}
.is-user .bubble {
  background: var(--ivy-700);
  color: var(--text-on-dark);
  border-bottom-right-radius: 6px;
}
.is-user .bubble::after {
  content: '';
  position: absolute;
  right: -1px;
  bottom: 0;
  width: 14px;
  height: 14px;
  background: var(--ivy-700);
  clip-path: polygon(0 0, 100% 100%, 100% 0);
  transform: translate(50%, 0);
}
.is-assistant .bubble {
  background: var(--surface-card);
  color: var(--text-1);
  border: 1px solid var(--line);
  border-bottom-left-radius: 6px;
}
.is-assistant .bubble::after {
  content: '';
  position: absolute;
  left: -1px;
  bottom: 0;
  width: 14px;
  height: 14px;
  background: var(--surface-card);
  border-left: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  clip-path: polygon(0 0, 100% 100%, 0 100%);
  transform: translate(-50%, 0);
}

.is-error .bubble {
  background: var(--rose-100);
  border-color: rgba(185, 74, 62, 0.3);
  color: var(--rose-600);
}
.is-error .bubble::after {
  background: var(--rose-100);
  border-color: rgba(185, 74, 62, 0.3);
}

.cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  margin-left: 3px;
  vertical-align: -2px;
  background: var(--honey-600);
  animation: blink 0.7s step-end infinite;
}
.is-user .cursor { background: var(--honey-300); }

@media (max-width: 600px) {
  .msg, .is-user { max-width: 94%; }
  .bubble { font-size: 14.5px; }
}
</style>
