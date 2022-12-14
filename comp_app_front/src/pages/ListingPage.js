import React, { useState, useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useGetRows } from '../hooks/useGetRows';

import { FullContext } from '../components/FullContext';
import InfoTile from '../components/InfoTile';
import Modal from '../components/Modal';
import UserForm from '../components/UserForm';

import styles from './ListingPage.module.css';

function ListingPage() {
  const ctx = useContext(FullContext);
  const [changed, setChanged] = useState(false);
  const { rows: employees, error, isLoading } = useGetRows('', changed);

  const [displayModal, setDisplayModal] = useState(false);
  const [cat, setCat] = useState('ALL');

  const [activeEmps, setActiveEmps] = useState([]);
  const [inactiveEmps, setInactiveEmps] = useState([]);

  useEffect(() => {
    const active = [];
    const inactive = [];
    employees?.forEach(employee => (employee.is_active ? active.push(employee) : inactive.push(employee)));

    setActiveEmps(active);
    setInactiveEmps(inactive);
  }, [employees, changed]);

  const addUser = () => setDisplayModal(true);

  const logout = async () => {
    await fetch('http://localhost:3001/Logout', { method: 'POST', credentials: 'include' });
    ctx.dispatch({ type: 'LOGOUT' });
  };
  return (
    <>
      <>
        {displayModal && (
          <Modal
            component={
              <UserForm
                onConfirm={() => {
                  setChanged(changed => !changed);
                  setDisplayModal(false);
                }}
              />
            }
            onConfirm={() => setDisplayModal(false)}
          />
        )}
        <div className={styles.container}>
          <header className={styles.header}>
            <p>
              Welcome back, <b>{`${ctx?.user?.f_name}`}</b>!
            </p>
            <button className="btn_red" onClick={logout}>
              Logout
            </button>
          </header>
          <div className={styles.buttons}>
            <button className={`${styles.category} ${cat === 'ALL' && styles.category_current}`} onClick={() => setCat('ALL')}>
              <span>{activeEmps?.length + inactiveEmps?.length || 0}</span>All Employees
            </button>
            <button className={`${styles.category} ${cat === 'ACTIVE' && styles.category_current}`} onClick={() => setCat('ACTIVE')}>
              <span>{employees?.length ? activeEmps.length : 0}</span> Active Employees
            </button>
            <button className={`${styles.category} ${cat === 'INACTIVE' && styles.category_current}`} onClick={() => setCat('INACTIVE')}>
              <span>{inactiveEmps?.length || 0}</span> Inactive Employees
            </button>
          </div>

          <button aria-label="add" className={styles.icon} onClick={addUser}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
          {!isLoading && !error && (
            <div className={styles.table}>
              <InfoTile key="title-tile" />
              {cat !== 'INACTIVE' && activeEmps?.map(user => <InfoTile setChanged={setChanged} changed={changed} key={`${user.UID}-INACTIVE`} user={user} />)}
              {cat !== 'ACTIVE' && inactiveEmps?.map(user => <InfoTile setChanged={setChanged} changed={changed} key={`${user.UID}-ACTIVE`} user={user} />)}
            </div>
          )}
        </div>
      </>
    </>
  );
}

export default ListingPage;
