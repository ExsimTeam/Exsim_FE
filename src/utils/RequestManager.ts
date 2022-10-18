import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { clearData, getData } from "./storageUtils";

class RequestManager {
  public service: AxiosInstance
  private pending: Map<string, AbortController> = new Map()

  constructor(baseURL: string, timeout: number) {
    this.service = axios.create({
      baseURL: baseURL,
      timeout: timeout
    })

    this.service.interceptors.request.use(
      config => {
        // Cancel duplicate request
        let reqKey = '';
        if (config.method === 'get' || config.method === 'GET') {
          reqKey = config.url + config.method + JSON.stringify(config.params)
        } else {
          reqKey = config.url! + config.method + JSON.stringify(config.data)
        }
        this.cancelPending(reqKey, true)

        // Add AbortController signal
        if (!config.signal) {
          let controller = new AbortController()
          config.signal = controller.signal
          this.pending.set(reqKey, controller)
        }

        // Add token
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
        Promise.reject(error)
      }
    )

    this.service.interceptors.response.use(
      response => {
        if (response.status >= 400) {
          if (response.status === 401) {
            window.location.href = '/login'
            return Promise.reject()
          }
          return Promise.reject(response)
        }

        return response;
      },
      error => {
        if (axios.isCancel(error)) {
          return new Promise(() => { })
        }
        if (error.response) {
          if (error.response.status === 401) {
            clearData()
            window.location.href = '/login'
            return;
          } else if (error.response.status === 403) {
            // No permission
          } else if (error.response.status === 511) {
          } else {
          }
        }
        return Promise.reject(error);
      }
    )
  }

  /**
   * Cancel a pending request
   * @param key 
   * @param isRequest 
   */
  private cancelPending = (key: string, isRequest = false) => {
    if (this.pending.has(key)) {
      if (isRequest) this.pending.get(key)?.abort()
      this.pending.delete(key)
    }
  }

  /**
   * Cancel all pending requests
   */
  cancelAllRequests = () => {
    this.pending.forEach((value, _) => {
      value.abort()
    })
    this.pending.clear()
  }

  get = (config: AxiosRequestConfig) => {
    return this.service({
      method: 'GET',
      ...config
    })
  }

  post = (config: AxiosRequestConfig) => {
    return this.service({
      method: 'POST',
      ...config
    })
  }

  delete = (config: AxiosRequestConfig) => {
    return this.service({
      method: 'DELETE',
      ...config
    })
  }
}

export default RequestManager