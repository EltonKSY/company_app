import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FullContext } from '../components/FullContext';

import styles from './Forms.module.css';

function AuthForm() {
  const ctx = useContext(FullContext);

  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [disableButton, setDisableButton] = useState(true);
  const navigate = useNavigate();

  //Preliminary check on input/password length in order to enable submit button
  useEffect(() => {
    if (userName.length > 4 && userPassword.length > 4) setDisableButton(false);
    else setDisableButton(true);
  }, [userPassword, userName]);

  const submitHandler = async function (e) {
    e.preventDefault();
    //1) Send request with username & PW
    const req = await fetch('http://localhost:3001/Authenticate', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_name: userName,
        password: userPassword,
      }),
    });

    const res = await req.json();
    //2a) If PW or Username is invalid, display errmessage
    if (!req.ok) setErrMsg(res.message);
    //2b) Set JWT in cookie for future request
    else {
      document.cookie = `comp_app_JWT=Bearer ${res.token}; expires=${new Date('December 17, 2025 03:24:00').toUTCString()}`;
      setErrMsg('');
      ctx.dispatch({ type: 'USER_READY', payload: res.result.uid });

      navigate('/listing');
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={submitHandler}>
        <h1>Sign in</h1>
        <div className={styles.input_container}>
          <input type="text" id="user_name" placeholder="User name" onChange={e => setUserName(e.target.value)} />
          <label htmlFor="user_name">User name</label>
        </div>
        <div className={styles.input_container}>
          <input type="password" id="password" placeholder="Password" onChange={e => setUserPassword(e.target.value)} />
          <label htmlFor="password">Password</label>
        </div>

        {/* Note:className "errors" tied to unit test */}
        {errMsg && <p className="errors">{errMsg}</p>}

        <button className={disableButton ? 'btn_inactive' : 'btn_blue'} type="submit" disabled={disableButton}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default AuthForm;

//If login, verify token, dont access page.

//If not, lead to login

//cookies with fetch can be passed with credentials true
