const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8081').replace(/\/$/, '');
const STORAGE_KEY = 'taskManagerLoggedUser';

export class ApiError extends Error {
    constructor(message, status, data = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

function getStoredUser() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function saveStoredUser(user) {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
}

async function parseResponse(response) {
    const contentType = response.headers.get('content-type') || '';
    if (response.status === 204) return null;
    if (contentType.includes('application/json')) {
        try { return await response.json(); } catch { return null; }
    }
    const text = await response.text();
    return text || null;
}

async function refreshAccessToken(user) {
    if (!user?.refreshToken) return null;

    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user.refreshToken),
    });

    const data = await parseResponse(response);
    if (!response.ok || !data?.accessToken) return null;

    const updatedUser = {
        ...user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken || user.refreshToken,
    };
    saveStoredUser(updatedUser);
    return updatedUser;
}

export async function apiFetch(path, options = {}, retryOnUnauthorized = true) {
    const user = getStoredUser();
    const headers = new Headers(options.headers || {});

    if (options.body !== undefined && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    if (user?.accessToken && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${user.accessToken}`);
    }

    const response = await fetch(`${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`, {
        ...options,
        headers,
    });

    if (response.status === 401 && retryOnUnauthorized && user?.refreshToken && path !== '/api/auth/refresh') {
        const refreshedUser = await refreshAccessToken(user);
        if (refreshedUser) {
            return apiFetch(path, options, false);
        }
    }

    const data = await parseResponse(response);

    if (!response.ok) {
        const message = typeof data === 'object' && data?.message
            ? data.message
            : typeof data === 'string' && data
                ? data
                : `Request failed with status ${response.status}`;
        throw new ApiError(message, response.status, data);
    }

    return data;
}

export const api = {
    get: (path, options = {}) => apiFetch(path, { ...options, method: 'GET' }),
    post: (path, body, options = {}) => apiFetch(path, {
        ...options,
        method: 'POST',
        body: body instanceof FormData ? body : JSON.stringify(body),
    }),
    patch: (path, body, options = {}) => apiFetch(path, {
        ...options,
        method: 'PATCH',
        body: body instanceof FormData ? body : JSON.stringify(body),
    }),
    put: (path, body, options = {}) => apiFetch(path, {
        ...options,
        method: 'PUT',
        body: body instanceof FormData ? body : JSON.stringify(body),
    }),
    delete: (path, options = {}) => apiFetch(path, { ...options, method: 'DELETE' }),
};

export { API_BASE_URL };
