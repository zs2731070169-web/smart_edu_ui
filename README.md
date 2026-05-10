# smart_edu_ui

「智慧学堂 · AI 教学助理」前端重构版。基于 **Vue 3 + Vite + Pinia + Element Plus + 组合式 API + axios** 重写自 `smart_edu/src/front/`，保留与原前端**完全一致**的功能与交互。

## 技术栈

- Vue 3.5 · `<script setup>` 组合式 API
- Vite 6
- Pinia 2（会话状态）
- Element Plus（按需自动注册，中文本地化；Toast 用 ElMessage）
- axios（非流式接口）+ fetch ReadableStream（流式 `/chat`）

## 快速开始

```bash
cd F:\projects\smart_edu_ui
npm install   # 或 pnpm i / yarn
npm run dev   # http://localhost:5173
```

后端默认运行在 `http://127.0.0.1:8000`。Vite 已配置代理：

| 前端请求       | 实际转发                              |
| -------------- | ------------------------------------- |
| `/chat`        | `http://127.0.0.1:8000/smart/edu/chat` |
| `/new-chat`    | `http://127.0.0.1:8000/smart/edu/new-chat` |

cookies 以同源方式自动携带（`withCredentials: true` + `credentials: 'same-origin'`），与后端 `SessionMiddleware` 完全兼容。

生产部署：`npm run build` 产出到 `dist/`，把 `dist/` 部署在与后端 API 同源路径（如 Nginx `/smart/edu/static/`）即可；如需独立部署，按需修改 `.env` 中的 `VITE_API_BASE`。

## 与原前端的功能映射

| 原 (`src/front/`)            | 新 (`smart_edu_ui/`)                          |
| ---------------------------- | --------------------------------------------- |
| `index.html` 顶部标题栏       | `components/ChatHeader.vue`                   |
| 欢迎区 + 快捷问题             | `components/WelcomeBlock.vue`                 |
| 消息列表 + 用户/AI 气泡       | `components/ChatMessages.vue` + `MessageBubble.vue` |
| 加载动画三点                  | `components/LoadingDots.vue`                  |
| 流式打字光标                  | `MessageBubble.vue` 内 `.cursor`              |
| 错误条 (`.error-bar`)         | `ChatMessages.vue` 内的 `transition-group`    |
| Toast（`showToast`）          | Element Plus `ElMessage`                      |
| `sendMessage()` 流式解码      | `api/chat.js` `sendChatStream`（fetch + ReadableStream） |
| `startNewChat()`              | `api/chat.js` `newChatApi`（axios POST）      |
| 全局状态 `isLoading` 等       | `stores/chat.js` Pinia store                  |
| Enter 发送 / Shift+Enter 换行 | `ChatInput.vue` `handleKeydown`               |
| textarea 自适应高度（max 120px） | `ChatInput.vue` `autoresize`（max 140px）  |
| 输入禁用 / 焦点恢复           | `chat.isLoading` watch + `defineExpose({ focus })` |

## 设计语言：「现代学堂」

- 主色：学府墨绿 `--ivy-700: #1f5544`，承载知识与可信感
- 点缀：蜂蜜琥珀 `--honey-500: #e0a458`，温暖与高亮（光标、下划线高亮、强调字）
- 底色：暖米纸 `--surface-page: #f5ecd3` + 网点底纹，呼应笔记本的学习氛围
- 字体：标题 `Fraunces` + `Noto Serif SC`（衬线 · 学术感），正文 `Noto Sans SC`，等宽 `JetBrains Mono`（标签 / kbd）
- 细节：标题栏底部金线、印章风格 logo（「学」「智」）、消息气泡尖角、`focus-within` 主色光晕、入场 `rise-in` 动画、打字光标用琥珀色

## 目录结构

```
smart_edu_ui/
├── index.html
├── package.json
├── vite.config.js
├── .env.example
└── src/
    ├── main.js
    ├── App.vue
    ├── api/
    │   ├── http.js          # axios 实例（withCredentials）
    │   └── chat.js          # newChatApi / sendChatStream
    ├── stores/
    │   └── chat.js          # Pinia chat store
    ├── components/
    │   ├── ChatHeader.vue
    │   ├── WelcomeBlock.vue
    │   ├── ChatMessages.vue
    │   ├── MessageBubble.vue
    │   ├── ChatInput.vue
    │   └── LoadingDots.vue
    ├── views/
    │   └── ChatView.vue
    └── styles/
        ├── tokens.css       # 设计令牌 + EP 主题对齐
        └── main.css         # 全局样式 + 背景纹理
```

## 关于流式响应为何用 fetch 而非 axios

浏览器端 axios 不支持以增量方式读取 `ReadableStream`（`onDownloadProgress` 在 SSE/分块文本场景不稳定，且需把完整响应缓存在内存）。原项目正是用原生 `fetch` + `response.body.getReader()` 实现的逐 token 流式 UI，为保持完全一致的交互（首块清空 loading dots → 追加 → 末尾打字光标），流式接口继续使用 fetch；非流式接口（`/new-chat`）使用 axios。
