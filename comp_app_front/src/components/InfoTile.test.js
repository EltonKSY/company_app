/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-render-in-setup */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import InfoTile from './InfoTile';

// mock user Data
const testUser = {
  DOB: '1975-12-12T05:00:00.000Z',
  EID: 'ed560a98-1a37-462c-aeee-cea5c914ty52',
  UID: 'd1007d9a-2294-4e64-ace5-e1107e644937',
  email: 'niko@email.com',
  f_name: 'Niko',
  is_active: 1,
  l_name: 'Bellic',
  levels: '["II","III"]',
  skills: '["Product Manager","Product Owner"]',
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

  describe('Edit and Delete components unmount on modal click', () => {
    test('When user clicks on modal, edit prompt unmounts', () => unmountedCheck('edit'));
    test('When user clicks on modal, delete prompt unmounts', () => unmountedCheck('delete'));
  });
});
