import moment from 'moment'

export const formatDate = (date) => {
    return moment(date).format('YYYY-MM-DD HH:mm:ss')
}

export const formatFromNow = (date) => {
    return moment(date).fromNow()
}

export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}