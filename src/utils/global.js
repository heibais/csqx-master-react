
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

export function setEnums(enums) {
  const result = {};
  enums.forEach((item, index) => {
    result[item["enumType"]] = item.enums;
  });
  localStorage.setItem('csqx-enums', JSON.stringify(result));
}

export function getEnums() {
  const enums = localStorage.getItem('csqx-enums');
  if (enums) {
    return JSON.parse(enums);
  }
  return null;
}
