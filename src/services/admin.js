import { stringify } from 'qs';
import request from '../utils/request';

const prefix = '/csqx/v1';

/** 用户 > 账户 */
export async function findAccountList(param) {
  return request(`${prefix}/user/account?${stringify(param)}`);
}
export async function findAccountCurrent() {
  return request(`${prefix}/user/account/current`);
}
export async function removeAccount(param) {
  return request(`${prefix}/user/account/${param.id}`, { method: 'DELETE' });
}
export async function saveAccount(param) {
  return request(`${prefix}/user/account`, { method: 'POST', body: param });
}
export async function changeAccountStatus(param) {
  return request(`${prefix}/user/account/${param.id}/change-status`);
}
export async function changeAccountPwd(param) {
  return request(`${prefix}/user/account/${param.id}/change-pwd`, { method: 'POST', body: param });
}

/** 用户 > 登录与注册 */
export async function accountLogin(param) {
  return request(`${prefix}/user/s/login`, { method: 'POST', body: param });
}
export async function accountLogout() {
  return request(`${prefix}/user/s/logout`);
}

/** 系统 > 信息发送 */
export async function sendCaptcha(param) {
  return request(`${prefix}/sys/msg/captcha?msgType=${param.type}&recipient=${param.recipient}`);
}
export async function matchCaptcha(param) {
  return request(
    `${prefix}/sys/msg/captcha-match?recipient=${param.recipient}&captcha=${param.captcha}`
  );
}
/** 系统 > 枚举 */
export async function findEnums() {
  return request(`${prefix}/sys/enums`);
}


/** 微信 > 公众号 > 账户 */
export async function findWxMpAccountList(param) {
  return request(`${prefix}/${param.userId}/wxmp/account?${stringify(param)}`);
}
export async function removeWxMpAccount(param) {
  return request(`${prefix}/${param.userId}/wxmp/account/${param.id}`, { method: 'DELETE' });
}
export async function saveWxMpAccount(param) {
  return request(`${prefix}/${param.userId}/wxmp/account`, { method: 'POST', body: param });
}
/** 微信 > 公众号 > 菜单 */
export async function findWxMpMenuList(param) {
  return request(`${prefix}/${param.userId}/wxmp/menu?${stringify(param)}`);
}
export async function removeWxMpMenu(param) {
  return request(`${prefix}/${param.userId}/wxmp/menu/${param.id}`, { method: 'DELETE' });
}
export async function saveWxMpMenu(param) {
  return request(`${prefix}/${param.userId}/wxmp/menu`, {method: 'POST', body: param});
}
export async function asyncWxMpMenu(param) {
  return request(`${prefix}/${param.userId}/wxmp/async`);
}

