import React, { useState, useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { FullContext } from '../components/FullContext';
import InfoTile from '../components/InfoTile';
import Modal from '../components/Modal';
import UserForm from '../components/UserForm';

import styles from './ListingPage.module.css';

function ListingPage({ activeEmps, inactiveEmps, currUser }) {
  const ctx = useContext(FullContext);

  const [displayModal, setDisplayModal] = useState(false);
  const [cat, setCat] = useState('ALL');

  const addUser = function () {
    setDisplayModal(true);
    return;
  };

  return (
    <>
      {displayModal && <Modal component={<UserForm />} onConfirm={() => setDisplayModal(false)} />}
      <div className={styles.container}>
        <header className={styles.header}>
          <p>{`Welcome back, ${currUser}!`}</p>
          <button className="btn_red">Logout</button>
        </header>
        <div className={styles.buttons}>
          <button className={`${styles.category} ${cat === 'ALL' && styles.category_current}`} onClick={() => setCat('ALL')}>
            <span>{activeEmps?.length + inactiveEmps?.length || 0}</span>All Employees
          </button>
          <button className={`${styles.category} ${cat === 'ACTIVE' && styles.category_current}`} onClick={() => setCat('ACTIVE')}>
            <span>{activeEmps?.length || 0}</span> Active Employees
          </button>
          <button className={`${styles.category} ${cat === 'INACTIVE' && styles.category_current}`} onClick={() => setCat('INACTIVE')}>
            <span>{inactiveEmps?.length || 0}</span> Inactive Employees
          </button>
        </div>

        <button aria-label="add" className={styles.icon} onClick={addUser}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
        <div className={styles.table}>
          <InfoTile />
          {cat !== 'INACTIVE' &&
            activeEmps?.map(user => (
              <InfoTile
                key={user.id}
                uid={user.id}
                fname={user.fname}
                lname={user.lname}
                dob={user.dob}
                email={user.email}
                skill={user.skill}
                password={user.password}
                age={56}
                isActive={true}
              />
            ))}
          {cat !== 'ACTIVE' &&
            inactiveEmps?.map(user => (
              <InfoTile
                key={user.id}
                uid={user.id}
                fname={user.fname}
                lname={user.lname}
                dob={user.dob}
                email={user.email}
                skill={user.skill}
                age={56}
                isActive={true}
              />
            ))}
        </div>
      </div>
    </>
  );
}

export default ListingPage;
