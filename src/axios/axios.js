import axios from 'axios'
import {
  Message
} from 'element-ui';
import global_ from '../components/Global'
// import Cookies from 'js-cookie'

//axios.defaults.baseURL = 'http://127.0.0.1:8090/club';

export const requestLogin = params => {
  return axios.post('/tablePlayer/login', params).then(res => res.data)
}

//let token = sessionStorage.getItem("token");
let http = axios.create({
  baseURL: global_.httpRequestUrl,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  },
  transformRequest: [function(data) {
    let newData = '';
    for (let k in data) {
      if (data.hasOwnProperty(k) === true) {
        newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
      }
    }
    return newData;
  }]
});


// http request 拦截器
http.interceptors.request.use(
  config => {
    console.log(config.url);
    if(config.url.indexOf('login') >= 0){
      return config;
    }else{
      let token = sessionStorage.getItem("token");
      if (token) {
        config.headers.token = token;
      }
      return config;
    }
  },
  err => {
    return Promise.reject(err);
  });

function apiAxios(method, url, params, response) {
  http({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null,
  }).then(function(res) {
    response(res);
  }).catch(function(err) {
    response(err);
  })
}

export default {
  get: function(url, params, response) {
    return apiAxios('GET', url, params, response)
  },
  post: function(url, params, response) {
    return apiAxios('POST', url, params, response)
  },
  put: function(url, params, response) {
    return apiAxios('PUT', url, params, response)
  },
  delete: function(url, params, response) {
    return apiAxios('DELETE', url, params, response)
  }
}
