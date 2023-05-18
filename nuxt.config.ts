// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@element-plus/nuxt'
    ],
    elementPlus: { icon: 'ElIcon' },
    runtimeConfig: {
        public: {
            baseUrl: process.env.NUXT_PUBLIC_API_BASE_URL
        }
    },
    ssr: true,
    components: true
})
