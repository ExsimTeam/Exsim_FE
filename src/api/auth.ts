import { useAxios } from "src/utils/hooks/useAxios"

/**
 * 登录API
 * @param payload 
 * @param immediate 
 * @returns [status, response, error, execute, abort]
 */
export const useLogin = () => {

  return useAxios<{
    email: string,
    password: string
  }, {
    token: string,
    username: string
  }>({
    method: 'POST',
    url: 'auth/login'
  })
}

/**
 * 注册API
 * @param payload 
 * @param immediate 
 * @returns [status, response, error, execute, abort]
 */
export const useRegister = () => {

  return useAxios<{
    username: string,
    email: string,
    password: string,
    verify: string
  }, {
    token: string,
    username: string
  }>({
    method: 'POST',
    url: 'auth/register',
  })
}

/**
 * 发送验证码API
 * @param payload 
 * @param immediate 
 * @returns [status, response, error, execute, abort]
 */
export const useSendVerify = () => {

  return useAxios<{ email: string }, {}>({
    method: 'POST',
    url: 'auth/sendVerify'
  })
}

/**
 * 重置密码API
 * @param payload 
 * @param immediate 
 * @returns [status, response, error, execute, abort]
 */
export const useResetPassword = () => {

  return useAxios<{
    email: string,
    verify: string,
    newPassword: string
  }, {}>({
    method: 'POST',
    url: 'auth/resetPassword'
  })
}

/**
 * 登出API
 * @param immediate 
 * @returns [status, response, error, execute, abort]
 */
export const useLogout = () => {
  return useAxios<{}, {}>({
    method: 'GET',
    url: 'auth/logout'
  })
}