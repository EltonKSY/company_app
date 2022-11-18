import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import styles from './Forms.module.css';

function AuthForm() {
  const { login, error } = useAuth();

  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [disableButton, setDisableButton] = useState(true);

  const submitHandler = async e => {
    e.preventDefault();
    login(userName, userPassword);
  };

  //Preliminary check on input/password length in order to enable submit button
  useEffect(() => {
    if (userName.length > 4 && userPassword.length > 4) setDisableButton(false);
    else setDisableButton(true);
    error && setErrMsg(error);
  }, [userPassword, userName, error]);

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
        <div className={styles.bottom}>
          {/* Note:className "errors" tied to unit test */}

          {errMsg && <p className="errors">{errMsg}</p>}

          <button className={disableButton ? 'btn_inactive' : 'btn_blue'} type="submit" disabled={disableButton}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default AuthForm;
