import { defineConfig } from 'vite'
import WindiCSS from 'vite-plugin-windicss'
import vue from '@vitejs/plugin-vue'
import { join } from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    WindiCSS(),
  ],
  resolve: {
    // @ 符路径别名
    alias: {
      '@': join(__dirname, 'src')
    }
  },
  server: {			
    // open: true,
    host: '0.0.0.0',	// 本机的局域网IP
    port: 8080,  // 端口号，一般情况下为8080
    proxy: { 
      // 要梯子
      "/api/netease": { 
        target: "https://netease-cloud-music-api-nu-mocha.vercel.app", 
        changeOrigin: true, 
        rewrite: (path) => path.replace(/^\/api\/netease/, "")
      },
      // "/api": {
      //   target: "http://localhost:5000",
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, "")
      // }
    }
  },
})
