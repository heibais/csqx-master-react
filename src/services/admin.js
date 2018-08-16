import { stringify } from 'qs';
import request from '../utils/request';

const prefix = '/csqx/v1';

/** 账户 */
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

/** 登录与注册 */
export async function accountLogin(param) {
  return request(`${prefix}/user/s/login`, { method: 'POST', body: param });
}
export async function accountLogout() {
  return request(`${prefix}/user/s/logout`);
}

/** 信息发送 */
export async function sendCaptcha(param) {
  return request(`${prefix}/sys/msg/captcha?msgType=${param.type}&recipient=${param.recipient}`);
}
export async function matchCaptcha(param) {
  return request(
    `${prefix}/sys/msg/captcha-match?recipient=${param.recipient}&captcha=${param.captcha}`
  );
}

/** 微信 公众号 */
export async function findWxMpAccountList(param) {
  return request(`${prefix}/${param.userId}/wxmp/account?${stringify(param)}`);
}
export async function removeWxMpAccount(param) {
  return request(`${prefix}/${param.userId}/wxmp/account/${param.id}`, { method: 'DELETE' });
}
export async function saveWxMpAccount(param) {
  return request(`${prefix}/${param.userId}/wxmp/account`, { method: 'POST', body: param });
}
