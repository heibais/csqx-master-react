import {
  findAccountList,
  saveAccount,
  removeAccount,
  changeAccountStatus,
} from '../../services/admin';
import { message } from 'antd';

export default {
  namespace: 'account',

  state: {
    data: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(findAccountList, payload);
      if (response.code === 500) return message.error(response.msg);
      yield put({
        type: 'queryList',
        payload: response.data,
      });
    },
    *save({ payload, callback }, { call }) {
      const response = yield call(saveAccount, payload);
      if (response.code === 500) return message.error(response.msg);
      message.success(response.msg);
      if (callback) callback();
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(removeAccount, payload);
      if (response.code === 500) return message.error(response.msg);
      message.success(response.msg);
      if (callback) callback();
    },
    *changeStatus({ payload, callback }, { call }) {
      const response = yield call(changeAccountStatus, payload);
      if (response.code === 500) return message.error(response.msg);
      if (callback) callback();
    },
  },

  reducers: {
    queryList(state, action) {
      const result = action.payload;
      const data = {
        list: result.records,
        pagination: {
          total: result.total,
          pageSize: result.size,
          current: result.current,
        },
      };
      return {
        ...state,
        data,
      };
    },
  },
};
