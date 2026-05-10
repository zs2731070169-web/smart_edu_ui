import http from './http'

const CHAT_URL = (import.meta.env.VITE_API_BASE || '') + '/chat'
const NEW_CHAT_URL = '/new-chat'

/**
 * 重置会话
 * 后端在下次 /chat 时会自动生成新 session_id
 */
export const newChatApi = () => http.post(NEW_CHAT_URL)

/**
 * 流式聊天
 * 浏览器端 axios 对 ReadableStream 支持有限；这里沿用原前端的 fetch 流式读取
 *
 * @param {string} question
 * @param {(chunk: string, accumulated: string) => void} onChunk
 * @param {AbortSignal} [signal]
 * @returns {Promise<string>} 累计完整文本
 */
export const sendChatStream = async (question, onChunk, signal) => {
  const response = await fetch(CHAT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify({ question }),
    signal,
  })

  if (!response.ok) {
    let detail = `HTTP ${response.status}`
    try {
      const data = await response.json()
      detail = data?.detail || detail
    } catch {
      /* ignore */
    }
    throw new Error(detail)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder('utf-8')
  let accumulated = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value, { stream: true })
    accumulated += chunk
    onChunk?.(chunk, accumulated)
  }

  return accumulated
}
