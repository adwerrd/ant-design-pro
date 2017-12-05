import axios from 'axios'
import fetch from 'dva/fetch';
import { notification } from 'antd';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: response.statusText,
  });
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  return axios[(options && options.method.toLowerCase()) || 'get' ]('http://172.18.28.53:16666' + url, options && options.body)
  .then(checkStatus)
  .then(function(response) {
    return { status: 'ok' , ...response.data }
  })
  .catch((error) => {
    console.log('error', error)
    if (error.code) {
      notification.error({
        message: error.name,
        description: error.message,
      })
    };
    if ('stack' in error && 'message' in error) {
      notification.error({
        message: `请求错误: ${url}`,
        description: error.message,
      })
    }
    return error
  })
}
