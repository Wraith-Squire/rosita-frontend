// export const $http = $fetch.create({
//     baseURL: process.env.NUXT_PUBLIC_API_BASE_URL
// })

export function $http(url: string, options: Record<string, any>) {
    const config = useRuntimeConfig();

    let $http = $fetch.create({
        baseURL: config.public.baseUrl
    });

    return $http(url, options);
}