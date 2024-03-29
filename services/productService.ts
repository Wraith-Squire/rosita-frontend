import {$http} from "~/composables/http";

export class ProductService {
    static list(payload?: Record<string, any>) {
        return $http('api/product/list/', {
            method: "GET",
            params: payload,
        });
    }

    static details(id: number) {
        return $http('api/product/details/', {
            method: "GET",
            params: {id: id},
        });
    }

    static create(payload: Record<string, any>) {
        return $http('api/product/create/', {
            method: "POST",
            body: payload,
        });
    }

    static update(id: number, payload: Record<string, any>) {
        payload.id = id;

        return $http('api/product/update/', {
            method: "PUT",
            body: payload,
        });
    }

    static delete(id: number) {
        return $http('api/product/delete/', {
            method: "DELETE",
            body: {id: id},
        });
    }
}