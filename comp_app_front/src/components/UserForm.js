import React, { useState } from 'react';

import styles from './Forms.module.css';

function UserForm({ user }) {
  const [disableButton, setDisableButton] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const date = new Date();

  const padTo2Digits = num => num.toString().padStart(2, '0');

  const year = date.getFullYear();
  const month = padTo2Digits(date.getMonth() + 1);
  const day = padTo2Digits(date.getDate());

  const formattedDate = [year, month, day].join('-');

  const submitHandler = function (e) {
    e.preventDefault();
    //logic for submitting to the backend
    return;
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={submitHandler}>
        <h1>Employee Form</h1>
        <div className={styles.input_container}>
          <input
            type="text"
            id="f_name"
            placeholder="First name"
            minLength="2"
            required
            defaultValue={user?.fname}
            onChange={e => console.log(e.target.value)}
          />
          <label htmlFor="f_name">First name</label>
        </div>
        <div className={styles.input_container}>
          <input type="text" id="l_name" placeholder="Last name" minLength="2" defaultValue={user?.lname} onChange={e => console.log(e.target.value)} />
          <label htmlFor="l_name">Last name</label>
        </div>
        <div className={styles.input_container}>
          <input type="email" id="email" placeholder="Email" required defaultValue={user?.email} onChange={e => console.log(e.target.value)} />
          <label htmlFor="email">Email</label>
        </div>
        <div className={styles.input_container}>
          <input type="password" id="password" placeholder="Password" minLength="5" required onChange={e => console.log(e.target.value)} />
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
            defaultValue={user?.dob}
            onChange={e => console.log(e.target.value)}
          />
          <label htmlFor="date">Date of birth</label>
        </div>

        <div className={styles.input_container}>
          <input type="checkbox" className={styles.checkbox_input} id="check" defaultChecked={user?.isActive} />
          <div className={styles.checkbox_label}>
            <label htmlFor="check" className={styles.checkbox} />
          </div>
          <br />
          <span className={styles.mini_label}>Active Employee</span>
        </div>
        {errMsg && <p className="errors">{errMsg}</p>}
        <button className={disableButton ? 'btn_inactive' : 'btn_blue'} type="submit" disabled={disableButton}>
          submit
        </button>
      </form>
    </div>
  );
}

export default UserForm;
