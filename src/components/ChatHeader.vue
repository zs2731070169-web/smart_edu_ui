<script setup>
import { ElMessage } from 'element-plus'
import { useChatStore } from '@/stores/chat'

const chat = useChatStore()

const handleNewChat = async () => {
  await chat.newChat()
  ElMessage({
    message: '新对话已开启',
    type: 'success',
    duration: 2200,
    showClose: false,
    grouping: true,
  })
}
</script>

<template>
  <header class="header">
    <div class="header-left">
      <div class="logo">
        <span class="logo-glyph">学</span>
        <span class="logo-ring" aria-hidden="true"></span>
      </div>
      <div class="meta">
        <div class="eyebrow">智慧学堂 · AI 教学助理</div>
        <h1 class="title">智能教育客服</h1>
        <div class="status">
          <span class="dot" />
          <span>助教在线 · 课程 / 知识点 / 老师 都可以问</span>
        </div>
      </div>
    </div>

    <el-button
      class="new-chat-btn"
      :disabled="chat.isLoading"
      @click="handleNewChat"
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
           stroke="currentColor" stroke-width="2.2"
           stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 5v14M5 12h14" />
      </svg>
      <span class="new-chat-text">新建对话</span>
    </el-button>
  </header>
</template>

<style scoped>
.header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: calc(18px + env(safe-area-inset-top)) 24px 18px;
  background: linear-gradient(155deg, var(--ivy-800) 0%, var(--ivy-700) 50%, var(--ivy-600) 100%);
  color: var(--text-on-dark);
  flex-shrink: 0;
  user-select: none;
  overflow: hidden;
  border-bottom: 1px solid rgba(0, 0, 0, 0.18);
}

/* 顶部装饰：金色细线 + 角落徽记 */
.header::before {
  content: '';
  position: absolute;
  left: 0; right: 0; bottom: 0;
  height: 2px;
  background: linear-gradient(90deg,
    transparent 0%,
    var(--honey-500) 18%,
    var(--honey-300) 50%,
    var(--honey-500) 82%,
    transparent 100%);
  opacity: 0.85;
}
.header::after {
  content: '';
  position: absolute;
  right: -60px;
  top: -60px;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(224, 164, 88, 0.20), transparent 60%);
  pointer-events: none;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
}

/* 印章风格 logo */
.logo {
  position: relative;
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  background: var(--paper-50);
  color: var(--ivy-800);
  border-radius: 14px;
  flex-shrink: 0;
  box-shadow:
    inset 0 0 0 1.5px var(--ivy-800),
    0 2px 0 rgba(0, 0, 0, 0.2),
    0 8px 16px -8px rgba(0, 0, 0, 0.45);
  transform: rotate(-3deg);
}
.logo-glyph {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: 24px;
  letter-spacing: -1px;
}
.logo-ring {
  position: absolute;
  inset: 4px;
  border: 1px dashed rgba(15, 42, 35, 0.30);
  border-radius: 10px;
  pointer-events: none;
}

.meta { min-width: 0; }
.eyebrow {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--honey-300);
  margin-bottom: 2px;
}
.title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 22px;
  letter-spacing: 0.5px;
  line-height: 1.1;
}
.status {
  margin-top: 6px;
  font-size: 12.5px;
  display: flex;
  align-items: center;
  gap: 7px;
  color: rgba(245, 236, 211, 0.85);
}
.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--leaf-500);
  box-shadow: 0 0 0 3px rgba(95, 168, 115, 0.22);
  animation: pulse-dot 2s ease-in-out infinite;
}

/* 新建对话按钮（覆盖 EP 默认外观，融入主题） */
.new-chat-btn {
  --el-button-bg-color: rgba(255, 255, 255, 0.14);
  --el-button-border-color: rgba(255, 255, 255, 0.35);
  --el-button-hover-bg-color: rgba(255, 255, 255, 0.24);
  --el-button-hover-border-color: rgba(255, 255, 255, 0.55);
  --el-button-active-bg-color: rgba(255, 255, 255, 0.10);
  --el-button-text-color: var(--text-on-dark);
  --el-button-hover-text-color: #ffffff;
  --el-button-active-text-color: var(--text-on-dark);
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.5px;
  height: 38px;
  padding: 0 14px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  backdrop-filter: blur(4px);
}
.new-chat-btn :deep(svg) { margin-right: 0; }

@media (max-width: 600px) {
  .header { padding-left: 16px; padding-right: 16px; }
  .title { font-size: 18px; }
  .eyebrow { display: none; }
  .new-chat-text { display: none; }
  .new-chat-btn { padding: 0 10px; height: 36px; }
}
</style>
