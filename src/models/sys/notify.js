import { sendCaptcha, matchCaptcha } from '../../services/admin';
import { message } from 'antd';

export default {
  namespace: 'notify',

  state: {},

  effects: {
    *captcha({ payload }, { call }) {
      const response = yield call(sendCaptcha, payload);
      if (response.code === 500) return message.error(response.msg);
    },

    *captchaMatch({ payload, callback }, { call }) {
      const response = yield call(matchCaptcha, payload);
      if (response.code === 500) return message.error(response.msg);
      if (callback) callback();
    },
  },

  reducers: {},
};
