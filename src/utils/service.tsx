import { message } from "antd";
import axios from "axios";
import { clearData, getData } from "./storageUtils";

const service = axios.create({
  baseURL: '/api/',
  timeout: 6000
})

service.interceptors.request.use(
  config => {
    // Add token for request
    let token = getData('token')
    if (token) {
      if (config.headers)
        config.headers['token'] = token
      else
        config.headers = { 'token': token }
    }

    return config
  },
  error => {
    message.error('网络请求出错')
    message.error(error.toJSON())
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401: {
          clearData()
          window.location.href = '/login'
          break
        }
        case 403: {
          message.error('ERROR 403: 没有权限')
          break
        }
        case 404: {
          message.error('404 Not Found')
          break
        }
        default: {
          message.error('网络请求出错')
          message.error(error.toJSON())
          break
        }
      }
    } else {
      message.error('网络请求出错')
      message.error(error.toJSON())
    }

    return Promise.reject(error)
  }
)

export default service