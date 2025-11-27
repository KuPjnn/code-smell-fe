import axios from 'axios';
import {generateRandomString, generateCodeChallenge} from "./pkce";
import {useAuthStore} from "@/store/index.js";

const casdoorConfig = {
    serverUrl: import.meta.env.VITE_CASDOOR_URL,
    client_id: import.meta.env.VITE_CASDOOR_CLIENT_ID,
    redirect_uri: `${window.location.origin}/callback`,
    scope: "openid profile email",
    response_type: "code",
    grant_type: "authorization_code",
};

const storage = {
    idToken: 'id_token',
    accessToken: 'access_token',
    refreshToken: 'refresh_token',
    redirectUrl: 'redirect_url',
    pkceVerifier: 'pkce_verifier',
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

export async function getAuthenticationUrl() {
    localStorage.removeItem(storage.accessToken);
    localStorage.removeItem(storage.refreshToken);

    const codeVerifier = generateRandomString(64);
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    localStorage.setItem(storage.pkceVerifier, codeVerifier);

    const params = new URLSearchParams({
        client_id: casdoorConfig.client_id,
        response_type: casdoorConfig.response_type,
        redirect_uri: casdoorConfig.redirect_uri,
        scope: casdoorConfig.scope,
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
        state: 'STATE'
    });

    return `${casdoorConfig.serverUrl}/login/oauth/authorize?${params.toString()}`;
}

// Function to exchange the authorization code for tokens
export async function exchangeCodeForToken(authorizationCode) {
    const tokenUrl = `${casdoorConfig.serverUrl}/api/login/oauth/access_token`;

    const codeVerifier = localStorage.getItem(storage.pkceVerifier);

    const response = await axios.post(tokenUrl, new URLSearchParams({
        grant_type: casdoorConfig.grant_type,
        client_id: casdoorConfig.client_id,
        code: authorizationCode,
        code_verifier: codeVerifier,
    }));

    const tokens = response.data;

    localStorage.setItem(storage.idToken, tokens.id_token);
    localStorage.setItem(storage.accessToken, tokens.access_token);
    if (tokens.refresh_token) {
        localStorage.setItem(storage.refreshToken, tokens.refresh_token);
    }
    localStorage.removeItem(storage.pkceVerifier);

    const user = await getUserInfo();
    useAuthStore().setUserInfo(user);

    return tokens;
}

// Function to renew access token using the refresh token
export async function refreshToken() {
    const tokenUrl = `${casdoorConfig.serverUrl}/api/login/oauth/access_token`;

    const response = await axios.post(tokenUrl, new URLSearchParams({
        grant_type: "refresh_token",
        client_id: casdoorConfig.client_id,
        refresh_token: localStorage.getItem(storage.refreshToken),
    }));

    const tokens = response.data;

    localStorage.setItem(storage.accessToken, tokens.access_token);

    if (tokens.refresh_token) {
        localStorage.setItem(storage.refreshToken, tokens.refresh_token);
    }

    return tokens;
}

// Function to log out the user
export async function logout() {
    const logoutUrl = `${casdoorConfig.serverUrl}/api/logout`;
    const idToken = localStorage.getItem(storage.idToken);

    const params = new URLSearchParams({
        id_token_hint: idToken,
        post_logout_redirect_uri: window.location.origin,
        state: 'STATE',
    });

    localStorage.clear();
    sessionStorage.clear();
    window.location.href = `${logoutUrl}?${params.toString()}`;
}

export async function isAuthenticated() {
    const accessToken = localStorage.getItem(storage.accessToken);

    if (accessToken) {
        const tokenPayload = JSON.parse(atob(accessToken.split(".")[1]));
        const isExpired = tokenPayload.exp * 1000 < Date.now();

        if (isExpired) {
            try {
                await refreshToken();
                return true;
            } catch (error) {
                console.error("Error refreshing token: ", error);
                localStorage.clear();
                return false;
            }
        }
        return true;
    }
    return false;
}

export async function getUserInfo() {
    if (!await isAuthenticated()) {
        return null;
    }

    const accessToken = localStorage.getItem(storage.accessToken);
    const response = await axios.get(
        `${casdoorConfig.serverUrl}/api/userinfo`,
        {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        }
    );
    return response.data;
}