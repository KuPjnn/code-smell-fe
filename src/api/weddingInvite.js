import request from "@/utils/Axios.js";

export function getInvites(params) {
    return request({
        url: '/api/wedding/invites',
        method: 'GET',
        params: params,
    })
}

export function getInvite(id) {
    return request({
        url: `/api/wedding/invites/${id}`,
        method: 'GET',
    })
}

export function createInvite(data) {
    return request({
        url: '/api/wedding/invites',
        method: 'POST',
        data: data,
    })
}

export function updateInvite(data) {
    return request({
        url: '/api/wedding/invites',
        method: 'PUT',
        data: data,
    })
}