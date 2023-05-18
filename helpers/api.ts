export const $api = $fetch.create({
    baseURL: process?.env?.BASE_URL as string
});