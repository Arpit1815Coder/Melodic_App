// src/Login.js

import { loginUrl } from "./auth";

function Login() {
  return (
    <div className="login">
      <img src="melodic.png" alt="Melodic Logo"/>
      <a href={loginUrl}>LOGIN WITH MELODIC</a>
    </div>
  );
}

export default Login;
