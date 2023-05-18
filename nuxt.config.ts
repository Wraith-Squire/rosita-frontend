// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@element-plus/nuxt'
    ],
    elementPlus: { /** Options */ },
    runtimeConfig: {
        public: {
            baseUrl: process.env.BASE_URL||"http://localhost:3100/"
        }
    },
    ssr: true,
    components: true
})
