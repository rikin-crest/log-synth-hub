import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import compression from "vite-plugin-compression";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // Local dev server config
  const serverConfig: Record<string, unknown> = {
    host: env.VITE_SERVER_HOST || "localhost",
    port: parseInt(env.VITE_SERVER_PORT || "5173"),
  };

  // Detect if building for GitHub Pages
  const isGithubPages = process.env.GITHUB_PAGES === "true";

  // Detect PR preview number if available (set by GitHub Actions)
  const prNumber = process.env.VITE_PR_NUMBER;

  const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] || "";

  /**
   * ✅ Compute the correct base URL:
   *  - For PR preview builds: `/pr-123/`
   *  - For main branch (production): `/<repo-name>/`
   *  - For local dev: `/`
   */
  const baseUrl = isGithubPages
    ? prNumber
      ? `/${repoName}/pr-${prNumber}/` // ✅ For PR previews
      : `/${repoName}/` // ✅ For main branch production
    : "/";

  return {
    base: baseUrl,
    server: serverConfig,
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      // Gzip compression
      compression({ algorithm: "gzip", ext: ".gz" }),
      // Brotli compression (better compression ratio)
      compression({ algorithm: "brotliCompress", ext: ".br" }),
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
            if (id.includes("@mui/x-data-grid")) return "mui-data-grid";
            if (id.includes("@tanstack/react-query")) return "query-vendor";
            if (id.includes("react-router-dom")) return "router-vendor";
            if (id.includes("lucide-react")) return "icons-vendor";
            return undefined;
          },
        },
      },
      chunkSizeWarningLimit: 1000,
      outDir: "dist",
      sourcemap: true,
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
        mangle: { safari10: true },
      },
      cssCodeSplit: true,
      assetsInlineLimit: 4096,
      modulePreload: { polyfill: false },
      target: ["es2020", "chrome80", "firefox78", "safari14"],
    },
  };
});
