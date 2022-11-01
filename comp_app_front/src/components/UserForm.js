import React, { useState, useEffect } from 'react';

import styles from './Forms.module.css';

function UserForm({ user }) {
  const [fname, setFName] = useState(user?.fname);
  const [lname, setLName] = useState(user?.lname);
  const [email, setEmail] = useState(user?.email);
  const [password, setPassword] = useState(user?.password);
  const [date1, setDate1] = useState(user?.dob);
  const [isActive, setIsActive] = useState(user?.isActive);
  const [errMsg, setErrMsg] = useState('');
  const [disableButton, setDisableButton] = useState(true);

  const currDate = new Date();

  const padTo2Digits = num => num.toString().padStart(2, '0');

  const year = currDate.getFullYear();
  const month = padTo2Digits(currDate.getMonth() + 1);
  const day = padTo2Digits(currDate.getDate());

  const formattedDate = [year, month, day].join('-');

  const submitHandler = function (e) {
    e.preventDefault();
    //logic for submitting to the backend
    return;
  };

  const validateEmail = email => /\S+@\S+\.\S+/.test(email);

  //Preliminary check on inputs validation in order to enable submit button
  useEffect(() => {
    if (fname && lname && password?.length > 4 && validateEmail(email)) setDisableButton(false);
    else setDisableButton(true);
  }, [fname, lname, email, password, date1, isActive]);

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={submitHandler}>
        <h1>Employee Form</h1>
        <div className={styles.input_container}>
          <input type="text" id="f_name" placeholder="First name" minLength="2" required defaultValue={fname} onChange={e => setFName(e.target.value)} />
          <label htmlFor="f_name">First name</label>
        </div>
        <div className={styles.input_container}>
          <input type="text" id="l_name" placeholder="Last name" minLength="2" defaultValue={lname} onChange={e => setLName(e.target.value)} />
          <label htmlFor="l_name">Last name</label>
        </div>
        <div className={styles.input_container}>
          <input type="email" id="email" placeholder="Email" required defaultValue={email} onChange={e => setEmail(e.target.value)} />
          <label htmlFor="email">Email</label>
        </div>
        <div className={styles.input_container}>
          <input
            type="password"
            id="password"
            defaultValue={password}
            placeholder="Password"
            minLength="5"
            required
            onChange={e => setPassword(e.target.value)}
          />
          <label htmlFor="password">Password</label>
        </div>
        <div className={styles.input_container}>
          <input
            type="date"
            id="date"
            min="2018-01-01"
            max={formattedDate}
            required
            placeholder="Date of birth"
            defaultValue={date1}
            onChange={e => setDate1(e.target.value)}
          />
          <label htmlFor="date">Date of birth</label>
        </div>

        <div className={styles.input_container}>
          <input type="checkbox" id="check" defaultChecked={isActive} onChange={e => setIsActive(e.target.checked)} />
          <div className={styles.checkbox_label}>
            <label htmlFor="check" className={styles.checkbox} />
          </div>
          <br />
          <span className={styles.mini_label}>Active Employee</span>
        </div>
        {errMsg && <p className="errors">{errMsg}</p>}
        <button className={disableButton ? 'btn_inactive' : 'btn_blue'} type="submit" disabled={disableButton}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default UserForm;
