import {$http} from "~/composables/http";

export class InitService {
    static init() {
        return $http('api/init/', {
            method: "GET"
        });
    }
}