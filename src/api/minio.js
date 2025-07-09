import request from "@/utils/Axios.js";

export function getFiles(path) {
    return request({
        url: '/api/minio/files',
        method: 'GET',
        params: {
            path: path,
        }
    })
}

export function getFile(path) {
    return request({
        url: '/api/minio/file',
        method: 'GET',
        params: {
            path: path,
        }
    })
}

export function downloadFile(path) {
    return request({
        url: `/api/minio/download`,
        method: 'GET',
        params: {
            path: path,
        },
    })
}

export function uploadFile(formData, path) {
    return request({
        url: '/api/minio/upload',
        method: 'POST',
        data: formData,
        params: {
            path: path,
        },
    })
}

export function deleteFile(objectName) {
    return request({
        url: '/api/minio/delete',
        method: 'DELETE',
        params: {
            objectName: objectName,
        },
    })
}