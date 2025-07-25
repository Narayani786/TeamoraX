// Utility functions to manage auth state

export const setToken = (token) => {
    localStorage.setItem('token', token);
};
export const getToken = () => {
    return localStorage.getItem('token');
};
export const logout = () => {
    localStorage.removeItem('token');
};
