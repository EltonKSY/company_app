/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-render-in-setup */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import InfoTile from './InfoTile';

// mock user Data
const testUser = {
  fname: 'User6',
  id: 'User3',
  lname: 'Lucien',
  dob: '2020-12-31',
  email: 'user1@gmail.com',
  skill: ['Front-End Developer'],
  password: 'Password',
  UID: 66,
  isActive: true,
};

//Callbacks for test cases
const mountedCheck = (btnName, reg) => {
  const buttonElement = screen.getByLabelText(btnName, { selector: 'button' });
  user.click(buttonElement);

  const element = screen.getByText(new RegExp(reg, 'i'));
  expect(element).toBeInTheDocument();
};

const unmountedCheck = btnName => {
  const buttonElement = screen.getByLabelText(btnName, { selector: 'button' });
  user.click(buttonElement);

  const modalElement = document.querySelector('#modal');
  user.click(modalElement);

  expect(modalElement).not.toBeInTheDocument();
};

describe('Table and form mounting and unmounting', () => {
  beforeEach(() => {
    render(<InfoTile user={testUser} />);
  });

  describe('Edit and Delete components mount', () => {
    test('When user clicks on edit employee button, form displays', () => mountedCheck('edit', 'Employee Form'));
    test('When user clicks on delete employee button, form displays', () => mountedCheck('delete', 'Are you sure you would like to permanently delete'));
  });

  describe('Edit and Delete components unmount', () => {
    test('When user clicks on modal, edit prompt unmounts', () => unmountedCheck('edit'));
    test('When user clicks on modal, delete prompt unmounts', () => unmountedCheck('delete'));
  });
});
