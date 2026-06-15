import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const contactTarget =
    env.CONTACT_API_PROXY_TARGET || "http://127.0.0.1:5175";

  const contactProxy = {
    "/api/contact": {
      target: contactTarget,
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/contact/, "/contact"),
    },
  };

  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true,
      proxy: contactProxy,
    },
    preview: {
      proxy: contactProxy,
    },
    build: {
      outDir: "dist",
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules/three") || id.includes("node_modules\\three")) {
              return "three";
            }
            if (id.includes("@react-three")) {
              return "r3f";
            }
            if (id.includes("framer-motion")) {
              return "motion";
            }
          },
        },
      },
      chunkSizeWarningLimit: 900,
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "framer-motion",
        "@react-three/fiber",
        "@react-three/drei",
      ],
    },
  };
});
