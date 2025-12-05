import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  define: {
    'process.env.GAME_SERVER': JSON.stringify(process.env.GAME_SERVER),
    'process.env.GAME_ADDRESS': JSON.stringify(process.env.GAME_ADDRESS),
    'process.env.LOCATION_SERVER': JSON.stringify(process.env.LOCATION_SERVER),
    'process.env.LOCATION_SERVER_PATH': JSON.stringify(process.env.LOCATION_SERVER_PATH),
  },
  server: {
    port: 1234,
    host: true,
    allowedHosts: true
  },
  publicDir: '../static',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../"),
      "@data": path.resolve(__dirname, "../data"),
      "@src": path.resolve(__dirname, "../src"),
      "@scripts": path.resolve(__dirname, "../scripts"),
      "@styles": path.resolve(__dirname, "../src/styles"),
      "@match": path.resolve(__dirname, "../src/match"),
      "@server": path.resolve(__dirname, "../server"),
    },
  },
  plugins: [
    react(),
        {
      name: "markdown-loader",
      transform(code, id) {
        if (id.slice(-3) === ".md") {
          // For .md files, get the raw content
          return `export default ${JSON.stringify(code)};`;
        }
      }
    }
  ],
});