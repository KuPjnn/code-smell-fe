export function generateRandomString(length = 64) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let result = '';
    const randomValues = crypto.getRandomValues(new Uint8Array(length));
    randomValues.forEach(v => (result += charset[v % charset.length]));
    return result;
}

export async function sha256(input) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    return window.crypto.subtle.digest("SHA-256", data);
}

export function base64UrlEncode(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

export async function generateCodeChallenge(codeVerifier) {
    const hashed = await sha256(codeVerifier);
    return base64UrlEncode(hashed);
}
