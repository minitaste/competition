import React from 'react'
import FormLogin from "../components/FormLogin";

const Login = () => {
  return (
    <div>
      <FormLogin route="/api/token/" method="login"/>
    </div>
  )
}

export default Login
