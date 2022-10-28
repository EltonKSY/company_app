import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';

import Modal from './Modal';

import styles from './InfoTile.module.css';

function DeleteUser({ fname, closeModal }) {
  return (
    <div className={styles.del_container}>
      <p>{`Are you sure you would like to permanently delete ${fname}?`} </p>
      <br />
      <div className={styles.del_btns}>
        <button className="btn_red">Delete</button>
        <button className="btn_blue" onClick={closeModal}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function InfoTile({ fname, lname, dob, email, skill, age, uid, isActive, editUser }) {
  const [displayModal, setDisplayModal] = useState(false);

  function editInfo() {
    editUser({ fname, lname, dob, email, skill, age, uid, isActive });
  }

  function deleteInfo() {
    setDisplayModal(true);
    return;
  }
  return (
    <>
      {displayModal && <Modal component={<DeleteUser fname={fname} closeModal={() => setDisplayModal(false)} />} onConfirm={() => setDisplayModal(false)} />}

      <div className={styles.main_info}>
        <span className={styles.main_span}>
          <b>{fname ? fname + ' ' + lname : 'Full Name'}</b>
        </span>
        <span className={styles.second_span}>{dob || ''}</span>
      </div>
      <a href="mailto:email@email.com" target="_blank" rel="noreferrer" className={styles.mid}>
        <p className="mid_text">{email || <b>Email</b>}</p>
      </a>
      <div className={styles.spans}>
        <span className={styles.main_span}>{skill?.length ? skill[0] : <b>Skills</b>}</span>
        <span className={styles.second_span}>{skill?.length ? skill[1] : ''}</span>
      </div>
      <span className={styles.col_3}>
        <b>{age || 'Age'}</b>
      </span>
      {fname ? (
        <div className={styles.icons}>
          <button onClick={editInfo}>
            <FontAwesomeIcon icon={faPencil} />
          </button>
          <button>
            <FontAwesomeIcon icon={faTrash} onClick={deleteInfo} />
          </button>
        </div>
      ) : (
        <div>&nbsp;</div>
      )}
    </>
  );
}

export default InfoTile;
