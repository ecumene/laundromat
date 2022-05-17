import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
      "/app": {
        target: "http://127.0.0.1:3117",
      },
      "/spin": {
        target: "http://127.0.0.1:3117",
      },
      "/proxy": {
        target: "http://127.0.0.1:3117",
      },
    },
  },
});
