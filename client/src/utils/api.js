const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const apiRequest = async (endpoint, options = {}) => {
    const url = `${BASE_URL}${endpoint}`;
    
    const headers = {
        "Content-Type": "application/json",
        ...options.headers
    };

    const config = {
        ...options,
        headers,
        credentials: "include"
    };

    if (options.body && typeof options.body === "object" && !(options.body instanceof FormData)) {
        config.body = JSON.stringify(options.body);
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || "Something went wrong!");
        }
        
        return data;
    } catch (error) {
        console.error(`API Request Error [${endpoint}]:`, error);
        throw error;
    }
};
