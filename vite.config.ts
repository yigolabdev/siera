import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 청크 크기 경고 기준 (KB)
    chunkSizeWarningLimit: 1000,
    // 빌드 결과물 최적화
    rollupOptions: {
      output: {
        // 수동 청크 분할
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          'ui': ['lucide-react'],
        },
      },
    },
    // 소스맵 생성 (프로덕션)
    sourcemap: false,
    // 최소화 활성화
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 프로덕션에서 console.log 제거
        drop_debugger: true,
      },
    } as any, // Vite 타입 이슈 우회
  },
  // 개발 서버 설정
  server: {
    port: 3000,
    open: true,
  },
  // 프리뷰 서버 설정
  preview: {
    port: 4173,
  },
})
