import request from "@/utils/Axios.js";

export function getComponentImages(params) {
    return request({
        url: '/api/wedding/component/images',
        method: 'GET',
        params: params,
    })
}

export function getComponentImage(id) {
    return request({
        url: `/api/wedding/component/images/${id}`,
        method: 'GET',
    })
}

export function createComponentImage(data) {
    return request({
        url: '/api/wedding/component/images',
        method: 'POST',
        data: data,
    })
}

export function updateComponentImage(data) {
    return request({
        url: '/api/wedding/component/images',
        method: 'PUT',
        data: data,
    })
}