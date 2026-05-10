import axios from 'axios'

/**
 * axios 实例
 * - 携带同源 Cookie（Starlette SessionMiddleware 写入的加密 session）
 * - baseURL 来自 .env 的 VITE_API_BASE；开发态留空，由 vite 代理 /chat /new-chat
 */
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '',
  timeout: 30_000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

http.interceptors.response.use(
  (resp) => resp,
  (err) => Promise.reject(err),
)

export default http
