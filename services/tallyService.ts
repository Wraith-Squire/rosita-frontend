import { useAPIFetch } from "~/composables/useAPIFetch";

export class TallyService {
    static list(payload?: Record<string, any>) {
        return useAPIFetch('api/tally/list/', {
            method: "GET",
            key: "tally:list",
            params: payload,
            immediate: true
        });
    }

    static details(id: number) {
        return useAPIFetch('api/tally/details/', {
            method: "GET",
            key: "tally:details",
            params: {id: id},
            immediate: true
        })
    }
}