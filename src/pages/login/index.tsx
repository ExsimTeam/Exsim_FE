import { FunctionComponent, useRef, useState } from "react";

import "./index.scss";

import React from "react";
import lock_svg from "src/res/icons/lock.svg";
import mail_svg from "src/res/icons/mail.svg";
import person_svg from "src/res/icons/person.svg";
import signin_svg from "src/res/signin.svg";
import signup_svg from "src/res/signup.svg";

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

const Input = React.forwardRef<HTMLInputElement, {
  image: string,
  type: React.HTMLInputTypeAttribute,
  placeholder: string
}>((props, ref) => {
  const { image, type, placeholder } = props
  return (
    <div className="login-input-field">
      <span>
        <img src={image} alt="" />
      </span>
      <input type={type} placeholder={placeholder} ref={ref} />
    </div>
  )
})

const Signin = () => {
  const usernameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  return (
    <div className="login-form login-signin-form">
      <h2 className="login-title">登录</h2>
      <Input
        image={person_svg}
        type="text"
        placeholder="用户名"
        ref={usernameRef}
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
          onClick={() => console.log(usernameRef.current?.value)}
        >登录</button>
      </div>
    </div>
  )
}

const Signup = () => {
  const usernameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const verifyRef = useRef<HTMLInputElement>(null)

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
        <button className="login-button">注册</button>
      </div>
    </div>
  )
}