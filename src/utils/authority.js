// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  return localStorage.getItem('csqx-authority') || 'admin';
}

export function setAuthority(authority) {
  return localStorage.setItem('csqx-authority', authority);
}
