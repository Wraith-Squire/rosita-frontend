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
        console.log(payload);

        return $http('api/product/update/', {
            method: "PUT",
            body: payload,
        });
    }
}