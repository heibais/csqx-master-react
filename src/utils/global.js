
export function getLoginUser() {
  const userPrincipalStr = localStorage.getItem('csqx-user');
  if (userPrincipalStr) {
    return JSON.parse(userPrincipalStr);
  }
  return null;
}

export function setLoginUser(user) {
  localStorage.setItem('csqx-user', JSON.stringify(user));
}

export function getUserId() {
  return getLoginUser() ? getLoginUser().id : 0;
}
