import React from "react";
import { useState, useEffect } from "react";

import styles from "./AuthForm.module.css";

function AuthForm() {
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [disableButton, setDisableButton] = useState(true);

  //Preliminary check on input/password length in order to enable submit button
  useEffect(() => {
    if (userName.length > 4 && userPassword.length > 4) setDisableButton(false);
    else setDisableButton(true);
  }, [userPassword, userName]);

  const submitHandler = function (e) {
    e.preventDefault();
    //logic for submitting to the backend
    return;
  };

  return (
    <div className={styles.container}>
      {/* <div>Logo</div> */}
      <form className={styles.form} onSubmit={submitHandler}>
        <h1>Sign in</h1>
        <div className={styles.input_container}>
          <input
            type="text"
            id="user_name"
            placeholder="User name"
            onChange={(e) => setUserName(e.target.value)}
          />
          <label htmlFor="user_name">User name</label>
        </div>
        <div className={styles.input_container}>
          <input
            type="password"
            id="password"
            placeholder="Password"
            onChange={(e) => setUserPassword(e.target.value)}
          />
          <label htmlFor="password">Password</label>
        </div>
        <button
          className={disableButton ? "btn_inactive" : "btn"}
          type="submit"
          disabled={disableButton}
        >
          submit
        </button>
      </form>
      {/* <div>Bottom</div> */}
    </div>
  );
}

export default AuthForm;
