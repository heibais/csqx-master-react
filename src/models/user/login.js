import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { accountLogin, accountLogout } from '../../services/admin';
import { setAuthority } from '../../utils/authority';
import { reloadAuthorized } from '../../utils/Authorized';
import { setLoginUser } from '../../utils/global';


export default {
  namespace: 'login',

  state: {
    status: true,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);
      if (response.code === 200) {
        // 登录成功
        setAuthority("user");
        reloadAuthorized();
        setLoginUser(JSON.stringify(response.data));
        yield put(routerRedux.push('/'))
      } else {
        return message.error(response.msg);
      }
    },

    *logout(_, {call, put }) {
      const response = yield call(accountLogout);
      if (response.code === 200) {
        setAuthority('guest');
        reloadAuthorized();
        yield put(routerRedux.push('/user/s/login'));
      } else {
        return message.error(response.msg);
      }
    },
  },
};
