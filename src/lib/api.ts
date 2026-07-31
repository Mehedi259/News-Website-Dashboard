const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://46.225.103.236:8000/api';

export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('adminToken');
  }
  return null;
};

export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('adminToken', token);
  }
};

export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminToken');
  }
};

interface FetchOptions extends RequestInit {
  data?: any;
}

export const fetchAPI = async (endpoint: string, options: FetchOptions = {}) => {
  const { data, headers, ...customConfig } = options;
  const token = getAuthToken();

  const config: RequestInit = {
    method: data ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...customConfig,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Something went wrong');
  }

  return result;
};
