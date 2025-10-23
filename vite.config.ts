import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import compression from "vite-plugin-compression";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 8080,
    https: {
      key: fs.readFileSync("/opt/certs/cert.key"),
      cert: fs.readFileSync("/opt/certs/cert.crt"),
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    // Gzip compression
    compression({
      algorithm: "gzip",
      ext: ".gz",
    }),
    // Brotli compression (better compression ratio)
    compression({
      algorithm: "brotliCompress",
      ext: ".br",
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Only chunk libraries that are safe and independent
          
          // Large DataGrid component - safe to separate
          if (id.includes("@mui/x-data-grid")) {
            return "mui-data-grid";
          }
          
          // TanStack Query - independent library
          if (id.includes("@tanstack/react-query")) {
            return "query-vendor";
          }
          
          // React Router - can be separated from React core
          if (id.includes("react-router-dom")) {
            return "router-vendor";
          }
          
          // Lucide icons - independent
          if (id.includes("lucide-react")) {
            return "icons-vendor";
          }
          
          // Leave MUI core + Emotion together in main bundle to prevent circular deps
          // Leave React + ReactDOM together for stability
          return undefined;
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 600,
    // Enable minification
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: mode === "production",
        drop_debugger: mode === "production",
        pure_funcs:
          mode === "production"
            ? ["console.log", "console.info", "console.debug", "console.warn"]
            : [],
      },
      mangle: {
        safari10: true,
      },
    },
    // Additional optimizations
    cssCodeSplit: true,
    sourcemap: false,
    assetsInlineLimit: 4096,
    // Optimize module preloading
    modulePreload: {
      polyfill: false, // Don't include polyfill if not needed
    },
    // Target modern browsers for better optimization
    target: ["es2020", "chrome80", "firefox78", "safari14"],
  },
}));
