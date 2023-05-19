import {$http} from "~/composables/http";

export class InitService {
    static init() {
        return $http('api/tally/list/', {
            method: "GET"
        });
    }
}