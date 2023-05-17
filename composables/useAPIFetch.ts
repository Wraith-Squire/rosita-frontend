import { useFetch } from "nuxt/app";

export const useAPIFetch: typeof useFetch = (path, options = {}) => {
    const config = useRuntimeConfig();

    options.baseURL = config.public.baseUrl;
    options.server = false;
    console.log(options.baseURL);
    return useFetch(path, options);
}