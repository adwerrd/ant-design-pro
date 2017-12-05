import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router';
import { fakeAccountLogin, fakeMobileLogin } from '../services/api';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *accountSubmit({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      yield put({
        type: 'changeSubmitting',
        payload: false,
      });
    },
    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
        },
      });
      yield put(routerRedux.push('/user/login'));
    },
    *checkLoginStatus(_, { put, select }) {
      const loginStatus = yield select(state => state.login.status)
      if (loginStatus !== 'ok') {
        yield put(routerRedux.push('/user/login'))
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
    changeSubmitting(state, { payload }) {
      return {
        ...state,
        submitting: payload,
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname }) => {
        const match = pathToRegexp('/user/:router').exec(pathname)
        if (!match) {
          dispatch({
            type: 'checkLoginStatus',
          })
        }
      })
    },
  },
};
