import request from '../utils/request';
import { stringify } from 'qs';

const prefix = '/csqx/v1';

/** 账户 */
export async function findAccountList(param) {
  return request(`${prefix}/user/account?${stringify(param)}`);
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
