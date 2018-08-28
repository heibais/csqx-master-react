import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { accountLogin, accountLogout, findEnums } from '../../services/admin';
import { setAuthority } from '../../utils/authority';
import { reloadAuthorized } from '../../utils/Authorized';
import { setLoginUser, setEnums, getEnums } from '../../utils/global';


export default {
  namespace: 'login',

  state: {
    status: true,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);
      if (response.code === 200) {
        // 查询枚举
        if (getEnums() == null) {
          const response2 = yield call(findEnums);
          if (response2.code === 200) {
            setEnums(response2.data);
          }
        }
        
        // 登录成功
        setAuthority("user");
        reloadAuthorized();
        setLoginUser(response.data);
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
