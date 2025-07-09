import request from "@/utils/Axios.js";

export function getTags(params) {
    return request({
        url: '/api/tags',
        method: 'GET',
        params: params,
    })
}

export function getTag(id) {
    return request({
        url: `/api/tags/${id}`,
        method: 'GET',
    })
}

export function createTag(data) {
    return request({
        url: '/api/tags',
        method: 'POST',
        data: data,
    })
}

export function updateTag(data) {
    return request({
        url: '/api/tags',
        method: 'PUT',
        data: data,
    })
}