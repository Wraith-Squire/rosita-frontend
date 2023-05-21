// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@element-plus/nuxt',
        '@nuxtjs/device'
    ],
    elementPlus: { icon: 'ElIcon' },
    device: { defaultUserAgent: 'Device' },
    runtimeConfig: {
        public: {
            baseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
            textColor: 'rgb(100, 56, 67)'
        }
    },
    ssr: true,
    components: true
})
