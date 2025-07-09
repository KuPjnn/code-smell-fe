import {ElLoading} from 'element-plus';

let loadingInstance = null;

export function showLoading(message = 'Loading...') {
    if (!loadingInstance) {
        loadingInstance = ElLoading.service({
            lock: true,
            text: message,
            background: 'rgba(0, 0, 0, 0.7)',
        });
    }
}

export function hideLoading() {
    if (loadingInstance) {
        loadingInstance.close();
        loadingInstance = null;
    }
}