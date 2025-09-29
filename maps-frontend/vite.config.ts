import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    build: { sourcemap: false },
    server: {
      port: 6543,
      strictPort: true,
      proxy: {
        "/api": {
          target: env.VITE_API_BASE || "http://localhost:7000",
          changeOrigin: true,
        },
      },
    },
  };
});

