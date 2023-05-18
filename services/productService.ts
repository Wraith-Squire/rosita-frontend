import { useAPIFetch } from "~/composables/useAPIFetch";

export class ProductService {
    static list(payload?: Record<string, any>) {
        return useAPIFetch('api/product/list/', {
            method: "GET",
            key: "product:list",
            params: payload,
            immediate: true
        });
    }

    static details(id: number) {
        return useAPIFetch('api/product/details/', {
            method: "GET",
            key: "product:details",
            params: {id: id},
            immediate: true
        })
    }
}