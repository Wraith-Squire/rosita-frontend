export function $http(url: string, options: Record<string, any>) {
    const config = useRuntimeConfig();

    let $http = $fetch.create({
        baseURL: config.public.baseUrl
    });

    return $http(url, options);
}