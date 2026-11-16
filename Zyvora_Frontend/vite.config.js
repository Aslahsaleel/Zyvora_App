
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const backendProxy = {
    target: "http://localhost:9090",
    changeOrigin: true,
    secure: false,

    // Remove the backend cookie domain.
    // Browser will store it for localhost.
    cookieDomainRewrite: "",

    // Make the backend cookie compatible with
    // local development over HTTP.
    configure(proxy) {
        proxy.on("proxyRes", (proxyRes) => {
            const cookies = proxyRes.headers["set-cookie"];

            if (cookies) {
                proxyRes.headers["set-cookie"] = cookies.map(
                    (cookie) =>
                        cookie.replace(
                            /;\s*SameSite=None/gi,
                            "; SameSite=Lax"
                        )
                );
            }
        });
    }
};

export default defineConfig({
    plugins: [react()],

    server: {
        port: 5174,
        strictPort: true,

        proxy: {
            "/api": backendProxy,
            "/admin": backendProxy
        }
    }
});
