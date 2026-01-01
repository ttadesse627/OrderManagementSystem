import {jwtDecode} from 'jwt-decode';

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
};

export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
};


// from token
export const decodeToken = (token: string) => {
  try {
    return jwtDecode(token) as any;
  } catch {
    return null;
  }
};

export const getUserRole = (decodedToken: any) => {
  if (!decodedToken) return null;
  return decodedToken.role || decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
};

export const isTokenExpired = (decodedToken: any) => {
  if (!decodedToken?.exp) return true;
  return decodedToken.exp * 1000 < Date.now();
};
