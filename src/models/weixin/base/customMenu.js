import { findWxMpMenuList, saveWxMpMenu, removeWxMpMenu, asyncWxMpMenu } from '../../../services/admin';
import { message } from 'antd';

export default {
  namespace: 'customMenu',

  state: {
    data: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(findWxMpMenuList, payload);
      if (response.code === 500) return message.error(response.msg);
      yield put({
        type: 'queryList',
        payload: response.data,
      });
    },
    *save({ payload, callback }, { call }) {
      const response = yield call(saveWxMpMenu, payload);
      if (response.code === 500) return message.error(response.msg);
      message.success(response.msg);
      if (callback) callback();
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(removeWxMpMenu, payload);
      if (response.code === 500) return message.error(response.msg);
      message.success(response.msg);
      if (callback) callback();
    },
    *async2wx({ payload }, { call }) {
      const response = yield call(asyncWxMpMenu, payload);
      if (response.code === 500) return message.error(response.msg);
      message.success(response.msg);
    },
  },

  reducers: {
    queryList(state, action) {
      const data = action.payload;
      return {
        ...state,
        data,
      };
    },
  },
};
