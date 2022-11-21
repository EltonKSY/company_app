import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';

import { diff_years } from '../helpers/validators';
import { useDelete } from '../hooks/useDelete';

import Modal from './Modal';
import UserForm from './UserForm';

import styles from './InfoTile.module.css';

function DeleteUser({ fname, UID, onConfirm }) {
  const { deleteUser, deleted } = useDelete(UID);

  useEffect(() => {
    deleted && onConfirm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleted]);

  return (
    <div className={styles.del_container}>
      <h1>Delete User</h1>
      <br />
      <p>{`Are you sure you would like to permanently delete ${fname}?`} </p>
      <br />
      <div className={styles.del_btns}>
        <button aria-label="delete" className="btn_red" onClick={deleteUser}>
          Delete
        </button>
        <button aria-label="delete" className="btn_blue" onClick={onConfirm}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function InfoTile({ user, setChanged }) {
  //0=> no display, 1=>display edit, 2=> display delete
  const [displayModal, setDisplayModal] = useState(0);
  const UID = user?.UID;
  const fname = user?.f_name;
  const lname = user?.l_name;
  const dob = user?.DOB;
  const age = diff_years(new Date(), new Date(dob));
  const email = user?.email;
  const isActive = user?.is_active;

  const skills = fname ? JSON.parse(user?.skills) : [];
  const levels = fname ? JSON.parse(user?.levels) : [];
  const skillsLevels = skills.map((skill, index) => ({ level: levels[index], name: skill }));

  const closeModal = () => setDisplayModal(0);

  return (
    <>
      {displayModal === 1 && (
        <Modal
          component={
            <UserForm
              user={{ fname, lname, dob, age, email, skillsLevels, UID, isActive }}
              onConfirm={() => {
                closeModal();
                setChanged(changed => !changed);
              }}
            />
          }
          onConfirm={closeModal}
        />
      )}
      {displayModal === 2 && (
        <Modal
          component={
            <DeleteUser
              fname={fname}
              UID={UID}
              onConfirm={() => {
                closeModal();
                setChanged(changed => !changed);
              }}
            />
          }
          onConfirm={() => closeModal}
        />
      )}

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
        <span className={styles.main_span}>{skills?.length ? `${skills[0]},  ${levels[0]}` : <b>Skills</b>}</span>
        <span className={styles.second_span}>{skills?.length > 1 ? `${skills[1]},  ${levels[1]}` : ''}</span>
      </div>
      <span className={styles.col_3}>{<b>{age || 'Age'}</b>}</span>
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
