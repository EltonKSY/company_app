import React, { useState, useEffect } from 'react';
import { padTo2Digits, validateEmail } from '../helpers/validators';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faChevronCircleLeft, faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';
import { useCreate } from '../hooks/useCreate';
import { useUpdate } from '../hooks/useUpdate';

import styles from './Forms.module.css';
import classes from './UserForm.module.css';

function UserForm({ user, closeModal }) {
  const { createUser, createError, isPendingCreate } = useCreate();
  const { updateUser, updateError, isPendingUpdate } = useUpdate();
  const [fname, setFName] = useState(user?.fname);
  const [lname, setLName] = useState(user?.lname);
  const [email, setEmail] = useState(user?.email);
  const [PW, setPW] = useState('');
  const [DOB, setDOB] = useState(user?.dob);
  const [isActive, setIsActive] = useState(user?.isActive);
  const [errMsg, setErrMsg] = useState('');
  const [disableButton, setDisableButton] = useState(true);
  const [skills, setSkills] = useState(user?.skillsLevels || []);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('');
  const [view, setView] = useState(0);
  //Min & Max Date for date input, assuming the oldest employee to be 110
  const currDate = new Date();
  const year = currDate.getFullYear();
  const month = padTo2Digits(currDate.getMonth() + 1);
  const day = padTo2Digits(currDate.getDate());
  const maxDate = [year, month, day].join('-');
  const minDate = [year - 110, month, day].join('-');

  const submitHandler = async function (e) {
    e.preventDefault();
    const userFields = {
      fname,
      lname,
      email,
      DOB,
      isActive,
      skills,
    };

    if (user) {
      userFields.UID = user.UID;
      userFields.EID = user.EID;
    }

    !user ? await createUser(userFields) : await updateUser(userFields);
    !updateError && !createError ? closeModal() : setErrMsg(updateError || createError);

    return;
  };

  //Preliminary check on inputs validation in order to enable submit button
  useEffect(() => {
    console.log(DOB);
    if (fname && lname && (PW?.length > 4 || user) && validateEmail(email) && DOB && skills.length) setDisableButton(false);
    else setDisableButton(true);
  }, [fname, lname, email, PW, DOB, isActive, skills]);
  return (
    <div className={styles.container}>
      <form className={`${styles.form} ${classes.form_modal}`} onSubmit={submitHandler}>
        {view === 0 ? (
          <div className={classes.view_1}>
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
            {/* Users should not be able to updatable other's passwords*/}
            {!user && (
              <div className={styles.input_container}>
                <input type="password" id="password" defaultValue={PW} placeholder="Password" minLength="5" required onChange={e => setPW(e.target.value)} />
                <label htmlFor="password">Password</label>
              </div>
            )}
            <div className={styles.input_container}>
              <input
                type="date"
                id="date"
                min={minDate}
                max={maxDate}
                required
                placeholder="Date of birth"
                defaultValue={DOB ? new Date(DOB)?.toISOString().slice(0, 10) : ''}
                onChange={e => setDOB(e.target.value)}
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
          </div>
        ) : (
          <div className={classes.view_2}>
            {/* <h2>Skills</h2> */}
            <br />
            <div className={classes.skills_container}>
              <h4 style={{ marginLeft: '1rem' }}>Skill</h4>
              <h4 style={{ marginLeft: '1rem' }}>Level</h4>
              <div>&nbsp;</div>

              {skills.map((skill, index) => (
                <React.Fragment key={index}>
                  <select disabled={skill?.name && skill?.level} id="skill" name="cars">
                    <option value=""></option>
                    <option selected={skill.name === 'Back-End Developer'} value="Back-End Developer">
                      Back-End Developer
                    </option>
                    <option selected={skill.name === 'Front-End Developer'} value="Front-End Developer">
                      Front-End Developer
                    </option>
                    <option selected={skill.name === 'Product Manager'} value="Product Manager">
                      Product Manager
                    </option>
                    <option selected={skill.name === 'Product Owner'} value="Product Owner">
                      Product Owner
                    </option>
                    <option selected={skill.name === 'Software Engineer'} value="Software Engineer">
                      Software Engineer
                    </option>
                  </select>
                  <select disabled={skill?.name && skill?.level} id="skill" name="cars">
                    <option value=""></option>
                    <option selected={skill.level === 'Lead'} value="Lead">
                      Lead
                    </option>
                    <option selected={skill.level === 'I'} value="I">
                      I
                    </option>
                    <option selected={skill.level === 'II'} value="II">
                      II
                    </option>
                    <option selected={skill.level === 'III'} value="III">
                      III
                    </option>
                    <option selected={skill.level === 'Intern'} value="Intern">
                      Intern
                    </option>
                  </select>
                  <FontAwesomeIcon
                    icon={faTrash}
                    onClick={() => {
                      const arr = [...skills];
                      arr.splice(index, 1);
                      setSkills(arr);
                    }}
                    className={classes.trash}
                  />
                </React.Fragment>
              ))}
              <select
                id="skill"
                name="skill"
                value={newSkillName}
                onChange={e => {
                  setNewSkillName(e.target.value);
                }}
              >
                <option value=""></option>
                <option value="Back-End Developer">Back-End Developer</option>
                <option value="Front-End Developer">Front-End Developer</option>
                <option value="Product Manager">Product Manager</option>
                <option value="Product Owner">Product Owner</option>
                <option value="Software Engineer">Software Engineer</option>
              </select>
              <select id="level" name="level" value={newSkillLevel} onChange={e => setNewSkillLevel(e.target.value)}>
                <option value=""></option>
                <option value="Lead">Lead</option>
                <option value="I">I</option>
                <option value="II">II</option>
                <option value="III">III</option>
                <option value="Intern">Intern</option>
              </select>
            </div>
            <br />
            <div className={classes.button_add_container}>
              <button
                type="button"
                className={classes.button_add}
                onClick={() => {
                  if (!newSkillName || !newSkillLevel) {
                    setErrMsg('Skills: Please add a valid skill first before adding more.');
                    return;
                  }
                  setSkills([...skills, { name: newSkillName, level: newSkillLevel }]);
                  setNewSkillLevel('');
                  setNewSkillName('');
                  errMsg?.includes('Skills') && setErrMsg('');
                }}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          </div>
        )}
        <div className={classes.bottom}>
          <div className={classes.buttons}>
            {view === 1 && (
              <button type="button" className={classes.button_prev} onClick={() => setView(0)}>
                <FontAwesomeIcon icon={faChevronCircleLeft} />
              </button>
            )}
            <button className={disableButton ? 'btn_inactive' : 'btn_blue'} type="submit" disabled={disableButton} onClick={submitHandler}>
              Submit
            </button>

            {view === 0 && (
              <button type="button" className={classes.button_next} onClick={() => setView(1)}>
                <FontAwesomeIcon icon={faChevronCircleRight} />
              </button>
            )}
          </div>
          {errMsg && <p className="errors">{errMsg}</p>}
        </div>
      </form>
    </div>
  );
}

export default UserForm;
