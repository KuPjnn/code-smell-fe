import request from "@/utils/Axios.js";

export function getGalleryImages(params) {
    return request({
        url: '/api/wedding/gallery/images',
        method: 'GET',
        params: params,
    })
}

export function getGalleryImage(id) {
    return request({
        url: `/api/wedding/gallery/images/${id}`,
        method: 'GET',
    })
}

export function createGalleryImage(data) {
    return request({
        url: '/api/wedding/gallery/images',
        method: 'POST',
        data: data,
    })
}

export function updateGalleryImage(data) {
    return request({
        url: '/api/wedding/gallery/images',
        method: 'PUT',
        data: data,
    })
}

export function saveAllGalleryImages(data) {
    return request({
        url: '/api/wedding/gallery/images/saveAll',
        method: 'POST',
        data: data,
    })
}

export function deleteGalleryImage(data) {
    return request({
        url: '/api/wedding/gallery/images',
        method: 'DELETE',
        data: data,
    })
}