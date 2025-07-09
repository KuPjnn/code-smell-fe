import request from "@/utils/Axios.js";

export function getPosts(params) {
    return request({
        url: '/api/posts',
        method: 'GET',
        params: params,
    })
}

export function getPost(id) {
    return request({
        url: `/api/posts/${id}`,
        method: 'GET',
    })
}

export function createPost(data) {
    return request({
        url: '/api/posts',
        method: 'POST',
        data: data,
    })
}

export function updatePost(data) {
    return request({
        url: '/api/posts',
        method: 'PUT',
        data: data,
    })
}