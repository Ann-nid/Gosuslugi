import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Жестко прописываем серверу использовать порт и локальный IP-адрес
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173
  }
})