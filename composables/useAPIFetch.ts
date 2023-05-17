import { useFetch } from "nuxt/app";

export const useAPIFetch: typeof useFetch<Record<string, any>> = (path, options = {}) => {
    const config = useRuntimeConfig();

    options.baseURL = config.public.baseUrl;
    options.server = true;

    return useFetch(path, options);
}