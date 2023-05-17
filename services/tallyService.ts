import { useAPIFetch } from "~/composables/useAPIFetch";

export class TallyService {
    static list(payload?: Record<string, any>): Promise<any> {
        return useAPIFetch('api/tally/list/', {
            method: "GET",
            key: "tally:list",
            body: payload
        });
    }
}