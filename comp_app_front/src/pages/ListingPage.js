import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import InfoTile from '../components/InfoTile';
import Modal from '../components/Modal';
import UserForm from '../components/UserForm';

import styles from './ListingPage.module.css';

const mockData = [
  // {
  //   fname: 'User1',
  //   id: 'User1',
  //   lname: 'Lucien',
  //   dob: '2020-12-31',
  //   email: 'user1@gmail.com',
  //   skill: ['Front-End Developer'],
  //   uid: 66,
  //   isActive: true,
  // },
  // {
  //   fname: 'User2',
  //   id: 'User2',
  //   lname: 'Lucien',
  //   dob: '2020-12-31',
  //   email: 'user1@gmail.com',
  //   skill: ['Front-End Developer'],
  //   uid: 66,
  //   isActive: true,
  // },
  // {
  //   fname: 'User3',
  //   id: 'User3',
  //   lname: 'Lucien',
  //   dob: '2020-12-31',
  //   email: 'user1@gmail.com',
  //   skill: ['Front-End Developer'],
  //   uid: 66,
  //   isActive: true,
  // },
];

function ListingPage() {
  const [displayModal, setDisplayModal] = useState(false);
  const [editableUser, setEditableUser] = useState(null);
  const [cat, setCat] = useState('ALL');

  const addUser = function () {
    setDisplayModal(true);
    return;
  };

  const editUser = function (user) {
    setDisplayModal(true);
    setEditableUser(user);
  };

  const closeModal = () => {
    setDisplayModal(false);
    setEditableUser(null);
  };

  return (
    <>
      {displayModal && <Modal component={<UserForm user={editableUser} />} onConfirm={closeModal} />}
      <div className={styles.container}>
        <header className={styles.header}>
          <p>{`Welcome back, ${'User'}!`}</p>
          <button className="btn_red">Logout</button>
        </header>
        <div className={styles.buttons}>
          <button className={`${styles.category} ${cat === 'ALL' && styles.category_current}`} onClick={() => setCat('ALL')}>
            <span>100</span>All Employees
          </button>
          <button className={`${styles.category} ${cat === 'ACTIVE' && styles.category_current}`} onClick={() => setCat('ACTIVE')}>
            <span>100</span> Active Employees
          </button>
          <button className={`${styles.category} ${cat === 'INACTIVE' && styles.category_current}`} onClick={() => setCat('INACTIVE')}>
            <span>100</span> Inactive Employees
          </button>
        </div>
        <button className={styles.icon} onClick={addUser}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
        <div className={styles.table}>
          <InfoTile />
          {mockData.map(user => (
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
              editUser={editUser}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default ListingPage;
