import {$http} from "~/composables/http";

export class ProductService {
    static list(payload?: Record<string, any>) {
        return $http('api/product/list/', {
            method: "GET",
            body: payload,
        });
    }

    static details(id: number) {
        return $http('api/product/details/', {
            method: "GET",
            params: {id: id},
        });
    }

    static create(payload: Record<string, any>) {
        const config = useRuntimeConfig();

        return $fetch('api/product/details/', {
            method: "POST",
            baseURL: config.public.baseURL,
            body: payload,
        });
    }
}