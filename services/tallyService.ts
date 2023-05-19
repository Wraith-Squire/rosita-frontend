import {$http} from "~/composables/http";

export class TallyService {
    static list(payload?: Record<string, any>) {
        return $http('api/tally/list/', {
            method: "GET",
            params: payload,
        });
    }

    static details(id: number) {
        return $http('api/tally/details/', {
            method: "GET",
            params: {id: id},
        })
    }


    static create(payload: Record<string, any>) {
        return $http('api/tally/create/', {
            method: "POST",
            body: payload,
        });
    }

    static update(id: number, payload: Record<string, any>) {
        payload.id = id;
        console.log(payload);

        return $http('api/tally/update/', {
            method: "PUT",
            body: payload,
        });
    }

    static delete(id: number) {
        return $http('api/tally/delete/', {
            method: "DELETE",
            body: {id: id},
        });
    }

    static validateTallyProduct(payload?: Record<string, any>) {
        return $http('api/tallyProduct/validate/', {
            method: "POST",
            body: payload,
        });
    }

    static exportToExcel(payload?: Record<string, any>) {
        return $http('api/tally/export/', {
            method: "GET",
            params: payload,
        });
    }
}