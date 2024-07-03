// src/Login.js

import { loginUrl } from "./auth";

function Login() {
  return (
    <div className="login">
      <img src="/public/melodic.png" alt="" />
      <a href={loginUrl}>LOGIN WITH MELODIC</a>
    </div>
  );
}

export default Login;
