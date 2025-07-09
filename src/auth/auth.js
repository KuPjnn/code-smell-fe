import axios from 'axios';

const keycloakConfig = {
    serverUrl: `${import.meta.env.VITE_OIDC_URL}`,
    realm: `${import.meta.env.VITE_OIDC_REALM_ID}`,
    client_id: `${import.meta.env.VITE_OIDC_CLIENT_ID}`,
    grant_type: 'authorization_code',
    scope: 'openid profile',
    response_type: 'code',
    redirect_uri: `${window.location.origin}/callback`,
    logout_redirect_uri: `${window.location.origin}`,
};

const storage = {
    accessToken: 'access_token',
    refreshToken: 'refresh_token',
    redirectUrl: 'redirect_url',
}

export function saveRedirectUrl() {
    const currentURL = window.location.pathname + window.location.search;
    localStorage.setItem(storage.redirectUrl, currentURL);
}

export function getRedirectUrl() {
    const redirectURL = localStorage.getItem(storage.redirectUrl) || '/';
    localStorage.removeItem(storage.redirectUrl);
    return redirectURL;
}

export function getKeycloakAuthUrl() {
    localStorage.removeItem(storage.accessToken);
    localStorage.removeItem(storage.refreshToken);
    return `${keycloakConfig.serverUrl}/realms/${keycloakConfig.realm}/protocol/openid-connect/auth?` +
        `client_id=${keycloakConfig.client_id}` +
        `&redirect_uri=${encodeURIComponent(keycloakConfig.redirect_uri)}` +
        `&response_type=${keycloakConfig.response_type}` +
        `&scope=${keycloakConfig.scope}`;
}

// Function to exchange the authorization code for tokens
export async function exchangeCodeForToken(authorizationCode) {
    const tokenUrl = `${keycloakConfig.serverUrl}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`;

    const response = await axios.post(tokenUrl, new URLSearchParams({
        client_id: keycloakConfig.client_id,
        grant_type: keycloakConfig.grant_type,
        redirect_uri: keycloakConfig.redirect_uri,
        code: authorizationCode,
    }));

    const tokens = response.data;
    localStorage.setItem(storage.accessToken, tokens.access_token);
    localStorage.setItem(storage.refreshToken, tokens.refresh_token);
    return tokens;
}

// Function to renew access token using the refresh token
export async function refreshToken() {
    const tokenUrl = `${keycloakConfig.serverUrl}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`;

    const response = await axios.post(tokenUrl, new URLSearchParams({
        client_id: keycloakConfig.client_id,
        grant_type: storage.refreshToken,
        refresh_token: localStorage.getItem(storage.refreshToken),
    }));
    const tokens = response.data;
    localStorage.setItem(storage.accessToken, tokens.access_token);
    // localStorage.setItem(storage.refreshToken, tokens.refresh_token);
    return tokens;
}

// Function to log out the user
export function logout() {
    const logoutUrl = `${keycloakConfig.serverUrl}/realms/${keycloakConfig.realm}/protocol/openid-connect/logout`;

    const params = new URLSearchParams({
        client_id: keycloakConfig.client_id,
        post_logout_redirect_uri: keycloakConfig.logout_redirect_uri,
    });

    localStorage.removeItem(storage.accessToken);
    localStorage.removeItem(storage.refreshToken);
    window.location.href = `${logoutUrl}?${params.toString()}`;
}

export async function isAuthenticated() {
    const accessToken = localStorage.getItem(storage.accessToken);
    if (accessToken) {
        // Check if the token is expired
        const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
        const isExpired = tokenPayload.exp * 1000 < Date.now();

        if (isExpired) {
            try {
                await refreshToken();
                return true;
            } catch (error) {
                console.error('Error refreshing token: ', error);
                localStorage.removeItem(storage.accessToken);
                localStorage.removeItem(storage.refreshToken);
                return false;
            }
        }
        return true;
    }
    return false;
}