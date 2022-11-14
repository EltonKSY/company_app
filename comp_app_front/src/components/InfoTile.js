import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';

import Modal from './Modal';
import UserForm from './UserForm';

import styles from './InfoTile.module.css';

function DeleteUser({ fname, closeModal }) {
  return (
    <div className={styles.del_container}>
      <h1>Delete User</h1>
      <br />
      <p>{`Are you sure you would like to permanently delete ${fname}?`} </p>
      <br />
      <div className={styles.del_btns}>
        <button aria-label="delete" className="btn_red">
          Delete
        </button>
        <button aria-label="delete" className="btn_blue" onClick={closeModal}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function InfoTile({ fname, lname, dob, email, password, skill, age, uid, isActive }) {
  //0=> no display, 1=>display edit, 2=> display delete
  const [displayModal, setDisplayModal] = useState(0);

  return (
    <>
      {displayModal === 1 && (
        <Modal component={<UserForm user={{ fname, lname, dob, email, password, skill, age, uid, isActive }} />} onConfirm={() => setDisplayModal(0)} />
      )}
      {displayModal === 2 && <Modal component={<DeleteUser fname={fname} closeModal={() => setDisplayModal(0)} />} onConfirm={() => setDisplayModal(0)} />}

      <div className={styles.main_info}>
        <span className={styles.main_span}>
          <b>{fname ? fname + ' ' + lname : 'Full Name'}</b>
        </span>
        <span className={styles.second_span}>{dob ? new Date(dob).toLocaleDateString('en-US').replaceAll('/', '-') : ''}</span>
      </div>
      {email ? (
        <a href="mailto:email@email.com" target="_blank" rel="noreferrer" className={styles.mid}>
          <p className={styles.mid_text}>{email}</p>
        </a>
      ) : (
        <b>Email</b>
      )}
      <div className={styles.spans}>
        <span className={styles.main_span}>{skill?.length ? skill[0] : <b>Skills</b>}</span>
        <span className={styles.second_span}>{skill?.length ? skill[1] : ''}</span>
      </div>
      <span className={styles.col_3}>
        <b>{age || 'Age'}</b>
      </span>
      {fname ? (
        <div className={styles.icons}>
          <button aria-label="edit" onClick={() => setDisplayModal(1)}>
            <FontAwesomeIcon icon={faPencil} />
          </button>
          <button aria-label="delete" onClick={() => setDisplayModal(2)}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      ) : (
        <div>&nbsp;</div>
      )}
    </>
  );
}

export default InfoTile;
