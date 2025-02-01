import React from 'react'
import FormLogin from "../components/FormLogin";

const Register = () => {
  return (
    <div>
      <FormLogin route="/api/user/register/" method="register" />
    </div>
  );
}

export default Register
