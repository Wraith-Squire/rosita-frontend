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
}