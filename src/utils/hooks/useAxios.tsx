import { AxiosRequestConfig } from "axios"
import { useCallback, useState } from "react"
import service from "../service"

export const useAxios = <D, R, E = string>(
  config: AxiosRequestConfig
) => {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [response, setResponse] = useState<{
    code: number,
    msg: string,
    result: R
  } | null>(null)
  const [error, setError] = useState<E | null>(null)
  const [controller] = useState(new AbortController());

  // Execute the request, with a payload
  const execute = useCallback((payload: D) => {
    setStatus('pending')

    return service(config.method === 'GET' ? {
      ...config,
      signal: controller.signal,
      params: payload
    } : {
      ...config,
      signal: controller.signal,
      data: payload
    })
      .then(response => {
        setResponse(response as any)
        setStatus('success')
        return response as unknown as {
          code: number,
          msg: string,
          result: R
        }
      })
      .catch(error => {
        setError(error.toJSON())
        setStatus('error')

        return Promise.reject(error)
      })
  }, [config, controller])

  // Method to abort current request
  const abort = useCallback(() => {
    controller.abort()
  }, [controller])

  return { status, response, error, execute, abort }
}