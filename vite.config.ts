import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    assetsInclude: [`./src/assets/*`],
    envDir: `./env`,
    server: {
        port: 3000,
      },
    plugins: [
        react(),
        svgr(),
        tsconfigPaths()
    ],
});
