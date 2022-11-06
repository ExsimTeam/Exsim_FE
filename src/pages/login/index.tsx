import { FormEventHandler, FunctionComponent, useCallback, useImperativeHandle, useRef, useState } from "react";

import "./index.scss";

import { message } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useLogin, useRegister, useSendVerify } from "src/api/auth";
import lock_svg from "src/res/icons/lock.svg";
import mail_svg from "src/res/icons/mail.svg";
import person_svg from "src/res/icons/person.svg";
import signin_svg from "src/res/signin.svg";
import signup_svg from "src/res/signup.svg";
import { setData } from "src/utils/storageUtils";

interface LoginProps {

}

const Login: FunctionComponent<LoginProps> = (props: LoginProps) => {
  const [curMode, setCurMode] = useState<'signup' | 'signin'>('signin');

  return (
    <div className={"login-container " + (curMode === 'signup' ? "signup-mode" : "")}>
      <div className="login-form-container">
        <div className="login-signin-signup">
          <Signin />
          <Signup />
        </div>
      </div>

      <div className="login-panel-container">
        <div className="login-panel-left">
          <div className="login-panel-content">
            <h3>没有账号？</h3>
            <p>
              加入Exsim大家庭，轻松与他人合作。
            </p>
            <button
              className="login-panel-button"
              onClick={() => setCurMode('signup')}
            >
              去注册
            </button>
          </div>
          <img src={signin_svg} className="login-panel-image" alt="left panel" />
        </div>
        <div className="login-panel-right">
          <div className="login-panel-content">
            <h3>已有帐号？</h3>
            <p>
              赶快登录Exsim吧，更多精彩在等你。
            </p>
            <button
              className="login-panel-button"
              onClick={() => setCurMode('signin')}
            >
              去登陆
            </button>
          </div>
          <img src={signup_svg} className="login-panel-image" alt="right panel" />
        </div>
      </div>
    </div>
  );
}

export default Login;


interface InputHandle {
  getValue: () => string,
  validate: (v: boolean) => void
}

/**
 * The Input component for page Login
 */
const Input = React.forwardRef<InputHandle, {
  image: string,
  type: string,
  placeholder: string,
  onInput?: FormEventHandler<HTMLInputElement>
}>((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [valid, setValid] = useState(true)

  useImperativeHandle(ref, () => ({
    getValue: () => inputRef.current!.value,
    validate: (v: boolean) => {
      setValid(v)
    }
  }), [inputRef])

  const { image, type, placeholder, onInput } = props
  return (
    <div
      className="login-input-field"
      style={{
        backgroundColor: valid ? undefined : "#ffccc7"
      }}
    >
      <span>
        <img src={image} alt="" />
      </span>
      <input type={type} placeholder={placeholder} onInput={onInput} ref={inputRef} />
    </div>
  )
})

/**
 * Sign In
 */
const Signin = () => {
  const emailRef = useRef<InputHandle>(null)
  const passwordRef = useRef<InputHandle>(null)

  const {
    execute: loginExec,
    status: loginStatus
  } = useLogin()

  const validate = useCallback((item: string) => {
    switch (item) {
      case 'email': {
        const current = emailRef.current!
        const value = current.getValue()
        if (value === '') {
          current.validate(false)
          return false
        }
        let reg = new RegExp(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)
        if (!reg.test(value)) {
          message.error('邮箱格式不正确')
          current.validate(false)
          return false
        }
        // success
        current.validate(true)
        return true
      }
      case 'password': {
        const current = passwordRef.current!
        const value = current.getValue()
        if (value === '') {
          current.validate(false)
          return false
        }
        let reg = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,18}$/)
        if (!reg.test(value)) {
          message.error('密码为6-18位，须包含字母、数字与特殊字符')
          current.validate(false)
          return false
        }
        // success
        current.validate(true)
        return true
      }
    }
  }, [emailRef, passwordRef])

  const navigate = useNavigate()

  return (
    <div className="login-form login-signin-form">
      <h2 className="login-title">登录</h2>
      <Input
        image={person_svg}
        type="text"
        placeholder="邮箱"
        ref={emailRef}
      />
      <Input
        image={lock_svg}
        type="password"
        placeholder="密码"
        ref={passwordRef}
      />

      <div className="login-button-field">
        <button
          className="login-button"
          onClick={() => {
            let valid = validate('email')
              && validate('password')

            if (valid && loginStatus !== 'pending') {
              loginExec({
                email: emailRef.current!.getValue(),
                password: passwordRef.current!.getValue()
              })
                .then(response => {
                  if (response.code === 1) {
                    setData('token', response.data.token)
                    setData('username', response.data.username)
                    message.success('登录成功')
                    setTimeout(() => {
                      navigate('/')
                    }, 500)
                  } else if (response.code === 100) {
                    message.error('邮箱或密码错误')
                  } else {
                    message.error(response.code + ": " + response.msg)
                  }
                })
            }
          }}
        >{loginStatus === 'pending' ? '登录中...' : '登录'}</button>
      </div>
    </div>
  )
}

/**
 * Sign Up
 */
const Signup = () => {
  const usernameRef = useRef<InputHandle>(null)
  const emailRef = useRef<InputHandle>(null)
  const passwordRef = useRef<InputHandle>(null)
  const verifyRef = useRef<InputHandle>(null)

  const validate = useCallback((item: string) => {
    switch (item) {
      case 'username': {
        const current = usernameRef.current!
        const value = current.getValue()
        if (value === '') {
          current.validate(false)
          return false
        }
        let reg = new RegExp(/^[\u4E00-\u9FA5A-Za-z0-9_]+$/)
        if (!reg.test(value)) {
          message.error('用户名格式不正确')
          current.validate(false)
          return false
        }
        // success
        current.validate(true)
        return true
      }
      case 'email': {
        const current = emailRef.current!
        const value = current.getValue()
        if (value === '') {
          current.validate(false)
          return false
        }
        let reg = new RegExp(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)
        if (!reg.test(value)) {
          message.error('邮箱格式不正确')
          current.validate(false)
          return false
        }
        // success
        current.validate(true)
        return true
      }
      case 'password': {
        const current = passwordRef.current!
        const value = current.getValue()
        if (value === '') {
          current.validate(false)
          return false
        }
        let reg = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,18}$/)
        if (!reg.test(value)) {
          message.error('密码为6-18位，须包含字母、数字与特殊字符')
          current.validate(false)
          return false
        }
        // success
        current.validate(true)
        return true
      }
      case 'verify': {
        const current = verifyRef.current!
        const value = current.getValue()
        if (value === '') {
          current.validate(false)
          return false
        }
        let reg = new RegExp(/^\d{6}$/)
        if (!reg.test(value)) {
          message.error('验证码格式不正确')
          current.validate(false)
          return false
        }
        // success
        current.validate(true)
        return true
      }
    }
  }, [usernameRef, emailRef, passwordRef, verifyRef])

  const {
    execute: registerExec,
    status: registerStatus
  } = useRegister()

  const {
    execute: verifyExec,
    status: verifyStatus
  } = useSendVerify()

  const [timer, setTimer] = useState(60)
  const [isVerifySent, setIsVerifySent] = useState(false)

  const navigate = useNavigate()

  return (
    <div className="login-form login-signup-form">
      <h2 className="login-title">注册</h2>
      <Input
        image={person_svg}
        type="text"
        placeholder="用户名"
        ref={usernameRef}
      />
      <Input
        image={mail_svg}
        type="text"
        placeholder="邮箱"
        ref={emailRef}
      />
      <Input
        image={mail_svg}
        type="text"
        placeholder="验证码"
        ref={verifyRef}
      />
      <Input
        image={lock_svg}
        type="password"
        placeholder="密码"
        ref={passwordRef}
      />

      <div className="login-button-field">
        <button
          className="login-button"
          style={{ marginRight: 10 }}
          onClick={() => {
            if (isVerifySent) return
            if (!validate('email')) return

            verifyExec({
              email: emailRef.current!.getValue()
            })
              .then(response => {
                if (response.code === 1) {
                  message.success('验证码发送成功')

                  // The count down
                  setIsVerifySent(true)
                  let count = 60
                  let timerId = setInterval(() => {
                    if (count === 0) {
                      setIsVerifySent(false)
                      setTimer(60)
                      clearInterval(timerId)
                    } else {
                      count--
                      setTimer(count)
                    }
                  }, 1000)
                }
              })
          }}
        >{isVerifySent ? `${timer}秒后重试` : (verifyStatus === 'pending' ? '发送中' : '发送验证码')}</button>

        <button
          className="login-button"
          onClick={() => {
            let valid = validate('username')
              && validate('email')
              && validate('verify')
              && validate('password')

            if (valid && registerStatus !== 'pending') {
              registerExec({
                username: usernameRef.current!.getValue(),
                email: emailRef.current!.getValue(),
                verify: verifyRef.current!.getValue(),
                password: passwordRef.current!.getValue(),
              }).then(response => {
                const code = response.code
                if (code === 1) {
                  setData('token', response.data.token)
                  setData('username', response.data.username)
                  message.success('注册成功，即将跳转')
                  setTimeout(() => {
                    navigate('/')
                  }, 500)
                } else if (code === 100) {
                  message.error('你已经注册过了！')
                } else if (code === 101) {
                  message.error('验证码错误')
                } else {
                  message.error(code + ': ' + response.msg)
                }
              })
            }
          }}
        >{registerStatus === 'pending' ? '注册中...' : '注册'}</button>
      </div>
    </div>
  )
}