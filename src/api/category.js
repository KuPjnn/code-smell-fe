import request from "@/utils/Axios.js";

export function getCategories(params) {
    return request({
        url: '/api/categories',
        method: 'GET',
        params: params,
    })
}

export function getCategory(id) {
    return request({
        url: `/api/categories/${id}`,
        method: 'GET',
    })
}

export function createCategory(data) {
    return request({
        url: '/api/categories',
        method: 'POST',
        data: data,
    })
}

export function updateCategory(data) {
    return request({
        url: '/api/categories',
        method: 'PUT',
        data: data,
    })
}