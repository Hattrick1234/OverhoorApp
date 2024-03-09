// vite.config.ts
import { vitePlugin as remix } from "file:///D:/Programmeren/Remix/OverhoorApp/node_modules/@remix-run/dev/dist/index.js";
import { flatRoutes } from "file:///D:/Programmeren/Remix/OverhoorApp/node_modules/remix-flat-routes/dist/index.js";
import { defineConfig } from "file:///D:/Programmeren/Remix/OverhoorApp/node_modules/vite/dist/node/index.js";
var MODE = process.env.NODE_ENV;
var vite_config_default = defineConfig({
  build: {
    cssMinify: MODE === "production",
    rollupOptions: {
      external: [/node:.*/, "stream", "crypto", "fsevents"]
    }
  },
  plugins: [
    remix({
      ignoredRouteFiles: ["**/*"],
      serverModuleFormat: "esm",
      routes: async (defineRoutes) => {
        return flatRoutes("routes", defineRoutes, {
          ignoredRouteFiles: [
            ".*",
            "**/*.css",
            "**/*.test.{js,jsx,ts,tsx}",
            "**/__*.*",
            // This is for server-side utilities you want to colocate next to
            // your routes without making an additional directory.
            // If you need a route that includes "server" or "client" in the
            // filename, use the escape brackets like: my-route.[server].tsx
            "**/*.server.*",
            "**/*.client.*"
          ]
        });
      }
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxQcm9ncmFtbWVyZW5cXFxcUmVtaXhcXFxcT3Zlcmhvb3JBcHBcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXFByb2dyYW1tZXJlblxcXFxSZW1peFxcXFxPdmVyaG9vckFwcFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovUHJvZ3JhbW1lcmVuL1JlbWl4L092ZXJob29yQXBwL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgdml0ZVBsdWdpbiBhcyByZW1peCB9IGZyb20gJ0ByZW1peC1ydW4vZGV2J1xuaW1wb3J0IHsgZmxhdFJvdXRlcyB9IGZyb20gJ3JlbWl4LWZsYXQtcm91dGVzJ1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcblxuY29uc3QgTU9ERSA9IHByb2Nlc3MuZW52Lk5PREVfRU5WXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG5cdGJ1aWxkOiB7XG5cdFx0Y3NzTWluaWZ5OiBNT0RFID09PSAncHJvZHVjdGlvbicsXG5cdFx0cm9sbHVwT3B0aW9uczoge1xuXHRcdFx0ZXh0ZXJuYWw6IFsvbm9kZTouKi8sICdzdHJlYW0nLCAnY3J5cHRvJywgJ2ZzZXZlbnRzJ10sXG5cdFx0fSxcblx0fSxcblx0cGx1Z2luczogW1xuXHRcdHJlbWl4KHtcblx0XHRcdGlnbm9yZWRSb3V0ZUZpbGVzOiBbJyoqLyonXSxcblx0XHRcdHNlcnZlck1vZHVsZUZvcm1hdDogJ2VzbScsXG5cdFx0XHRyb3V0ZXM6IGFzeW5jIGRlZmluZVJvdXRlcyA9PiB7XG5cdFx0XHRcdHJldHVybiBmbGF0Um91dGVzKCdyb3V0ZXMnLCBkZWZpbmVSb3V0ZXMsIHtcblx0XHRcdFx0XHRpZ25vcmVkUm91dGVGaWxlczogW1xuXHRcdFx0XHRcdFx0Jy4qJyxcblx0XHRcdFx0XHRcdCcqKi8qLmNzcycsXG5cdFx0XHRcdFx0XHQnKiovKi50ZXN0Lntqcyxqc3gsdHMsdHN4fScsXG5cdFx0XHRcdFx0XHQnKiovX18qLionLFxuXHRcdFx0XHRcdFx0Ly8gVGhpcyBpcyBmb3Igc2VydmVyLXNpZGUgdXRpbGl0aWVzIHlvdSB3YW50IHRvIGNvbG9jYXRlIG5leHQgdG9cblx0XHRcdFx0XHRcdC8vIHlvdXIgcm91dGVzIHdpdGhvdXQgbWFraW5nIGFuIGFkZGl0aW9uYWwgZGlyZWN0b3J5LlxuXHRcdFx0XHRcdFx0Ly8gSWYgeW91IG5lZWQgYSByb3V0ZSB0aGF0IGluY2x1ZGVzIFwic2VydmVyXCIgb3IgXCJjbGllbnRcIiBpbiB0aGVcblx0XHRcdFx0XHRcdC8vIGZpbGVuYW1lLCB1c2UgdGhlIGVzY2FwZSBicmFja2V0cyBsaWtlOiBteS1yb3V0ZS5bc2VydmVyXS50c3hcblx0XHRcdFx0XHRcdCcqKi8qLnNlcnZlci4qJyxcblx0XHRcdFx0XHRcdCcqKi8qLmNsaWVudC4qJyxcblx0XHRcdFx0XHRdLFxuXHRcdFx0XHR9KVxuXHRcdFx0fSxcblx0XHR9KSxcblx0XSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTZSLFNBQVMsY0FBYyxhQUFhO0FBQ2pVLFNBQVMsa0JBQWtCO0FBQzNCLFNBQVMsb0JBQW9CO0FBRTdCLElBQU0sT0FBTyxRQUFRLElBQUk7QUFFekIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDM0IsT0FBTztBQUFBLElBQ04sV0FBVyxTQUFTO0FBQUEsSUFDcEIsZUFBZTtBQUFBLE1BQ2QsVUFBVSxDQUFDLFdBQVcsVUFBVSxVQUFVLFVBQVU7QUFBQSxJQUNyRDtBQUFBLEVBQ0Q7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNSLE1BQU07QUFBQSxNQUNMLG1CQUFtQixDQUFDLE1BQU07QUFBQSxNQUMxQixvQkFBb0I7QUFBQSxNQUNwQixRQUFRLE9BQU0saUJBQWdCO0FBQzdCLGVBQU8sV0FBVyxVQUFVLGNBQWM7QUFBQSxVQUN6QyxtQkFBbUI7QUFBQSxZQUNsQjtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsWUFLQTtBQUFBLFlBQ0E7QUFBQSxVQUNEO0FBQUEsUUFDRCxDQUFDO0FBQUEsTUFDRjtBQUFBLElBQ0QsQ0FBQztBQUFBLEVBQ0Y7QUFDRCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
