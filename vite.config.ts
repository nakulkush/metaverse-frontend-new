import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// export default defineConfig({
//   plugins: [
//     react(),
//     nodePolyfills({
//       globals: { global: true }, // Polyfill `global`
//       // crypto: true, // Removed as it is not a valid property in PolyfillOptions
//     }),
//   ],
// });

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      globals: { global: true }, // Polyfill `global`
      // crypto: true, // Removed as it is not a valid property in PolyfillOptions
    }),
  ],
  build: {
    outDir: "dist",
  },
});
