import { FunctionComponent, useState } from "react";

import "./index.scss";

import signin_svg from "src/res/signin.svg";
import signup_svg from "src/res/signup.svg";
import lock_svg from "src/res/icons/lock.svg";
import mail_svg from "src/res/icons/mail.svg";
import person_svg from "src/res/icons/person.svg";

interface LoginProps {

}

const Login: FunctionComponent<LoginProps> = (props: LoginProps) => {
  const [curMode, setCurMode] = useState<'signup' | 'signin'>('signin');

  return (
    <div className={"login-container " + (curMode === 'signup' ? "signup-mode" : "")}>
      <div className="login-form-container">
        <div className="login-signin-signup">
          <div className="login-form login-signin-form">
            <h2 className="login-title">登录</h2>
            <div className="login-input-field">
              <span>
                <img src={person_svg} alt="" />
              </span>
              <input type="text" placeholder="用户名" />
            </div>
            <div className="login-input-field">
              <span>
                <img src={lock_svg} alt="" />
              </span>
              <input type="password" placeholder="密码" />
            </div>
            <div className="login-button-field">
              <button className="login-button">登录</button>
            </div>
          </div>
          <div className="login-form login-signup-form">
            <h2 className="login-title">注册</h2>
            <div className="login-input-field">
              <span></span>
              <input type="text" placeholder="用户名" />
            </div>
            <div className="login-input-field">
              <span></span>
              <input type="password" placeholder="密码" />
            </div>
            <div className="login-button-field">
              <button className="login-button">注册</button>
            </div>
          </div>
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