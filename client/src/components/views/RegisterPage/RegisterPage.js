import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../../_actions/user_action';

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onEmailHandler = (e) => {
    setEmail(e.currentTarget.value);
  }

  const onNameHandler = (e) => {
    setName(e.currentTarget.value);
  }

  const onPasswordHandler = (e) => {
    setPassword(e.currentTarget.value);
  }

  const onConfirmPasswordHandler = (e) => {
    setConfirmPassword(e.currentTarget.value);
  }

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return alert("비밀번호가 다릅니다.")
    }

    let body = {
      email: email,
      name: name,
      password: password
    }
    
    dispatch(registerUser(body))
      .then(response => {
        if(response.payload.success) {
          navigate('/login');
        } else {
          alert('Failed to sign up')
        }
      })
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', 
                  width: '100%', height: '100vh' }}>
      <form style={{ display: 'flex', flexDirection: 'column' }}
            onSubmit={ onSubmitHandler }
      >
        <label>Email</label>
        <input type="email" value={ email } onChange={ onEmailHandler } />
        <label>Name</label>
        <input type="text" value={ name } onChange={ onNameHandler } />
        <label>Pasword</label>
        <input type="password" value={ password } onChange={ onPasswordHandler } />
        <label>Confirm Pasword</label>
        <input type="password" value={ confirmPassword } onChange={ onConfirmPasswordHandler } />
        <br />
        <button type="submit">
          Register
        </button>
      </form>
    </div>
  )
}

export default RegisterPage