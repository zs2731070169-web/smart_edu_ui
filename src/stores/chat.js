import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { sendChatStream, newChatApi } from '@/api/chat'

const nowHm = () => {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

let _mid = 0
const uid = () => `m_${Date.now()}_${++_mid}`

/**
 * 会话状态
 * messages: 消息列表（用户/助手）
 * errors: 错误条（自动 4s 消失）
 * isLoading: 是否在等待 AI 回复
 */
export const useChatStore = defineStore('chat', () => {
  const messages = ref([])
  const errors = ref([])
  const isLoading = ref(false)

  const isEmpty = computed(() => messages.value.length === 0)

  const _pushError = (msg) => {
    const id = uid()
    errors.value.push({ id, text: msg })
    setTimeout(() => {
      errors.value = errors.value.filter((e) => e.id !== id)
    }, 4000)
  }

  const sendMessage = async (raw) => {
    const question = (raw ?? '').trim()
    if (!question || isLoading.value) return

    isLoading.value = true

    // 1) 推入用户气泡
    messages.value.push({
      id: uid(),
      role: 'user',
      text: question,
      time: nowHm(),
    })

    // 2) 占位助手气泡（loading 状态）
    const assistantId = uid()
    messages.value.push({
      id: assistantId,
      role: 'assistant',
      text: '',
      time: '',
      loading: true,
      error: false,
    })
    const findAssistant = () => messages.value.find((m) => m.id === assistantId)

    try {
      let firstChunk = true
      await sendChatStream(question, (_chunk, accumulated) => {
        const m = findAssistant()
        if (!m) return
        if (firstChunk) {
          m.loading = false
          firstChunk = false
        }
        m.text = accumulated
        m.streaming = true
      })

      const m = findAssistant()
      if (m) {
        m.streaming = false
        m.time = nowHm()
        if (!m.text) m.text = '（无内容）'
      }
    } catch (err) {
      console.error('[SmartEdu] 请求失败:', err)
      const m = findAssistant()
      if (m) {
        m.loading = false
        m.streaming = false
        if (!m.text) {
          m.error = true
          m.text = '抱歉，请求失败，请稍后重试'
        }
      }
      _pushError('网络请求失败：' + (err?.message || '未知错误'))
    } finally {
      isLoading.value = false
    }
  }

  const newChat = async () => {
    if (isLoading.value) return
    try {
      await newChatApi()
    } catch {
      /* 后端在下次 /chat 时会自动生成新 session_id，这里不阻塞 UI */
    }
    messages.value = []
    errors.value = []
  }

  return {
    messages,
    errors,
    isLoading,
    isEmpty,
    sendMessage,
    newChat,
  }
})
