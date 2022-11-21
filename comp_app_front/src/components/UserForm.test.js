/* eslint-disable testing-library/no-render-in-setup */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import { emptyInputChecker, disabledSubmitChecker, nonEmptyInputChecker, enabledSubmitChecker } from '../helpers/tests';
import UserForm from './UserForm';

const userData = {
  DOB: '1975-12-12T05:00:00.000Z',
  email: 'niko@email.com',
  f_name: 'Niko',
  is_active: 1,
  l_name: 'Bellic',
  skillsLevels: [{ level: 'Intern', name: 'Software Engineer' }],
};

//TESTS
describe('Form loads with no user data when there are no props', () => {
  beforeEach(() => render(<UserForm />));

  test('If first name is  empty', () => emptyInputChecker(/First Name/i));
  test('If last name is  empty', () => emptyInputChecker(/Last Name/i));
  test('If email is  empty', () => emptyInputChecker(/Email/i));
  test('If password is  empty', () => emptyInputChecker(/Password/i));
  test('If date is  empty', () => emptyInputChecker(/Date of birth/i));
  test('If Submit button  is disabled', disabledSubmitChecker);
});

describe('Form loads with all user data when there are props', () => {
  beforeEach(() =>
    render(
      <UserForm user={{ fname: userData.f_name, lname: userData.l_name, dob: userData.DOB, email: userData.email, skillsLevels: userData.skillsLevels }} />,
    ),
  );

  test('If first name is not empty', () => nonEmptyInputChecker(/First Name/i));
  test('If last name is not empty', () => nonEmptyInputChecker(/Last Name/i));
  test('If email is not empty', () => nonEmptyInputChecker(/Email/i));
  test('If date is not empty', () => nonEmptyInputChecker(/Date of birth/i));
  test('If skills and levels passed as prop render', () => {
    const buttonElementNext = screen.getByLabelText('next', { selector: 'button' });
    user.click(buttonElementNext);

    const skillElement = screen.getByTestId('skill-disabled');
    expect(skillElement).toBeInTheDocument();
    expect(skillElement.value).toBe(userData.skillsLevels[0].name);

    const levelElement = screen.getByTestId('level-disabled');
    expect(levelElement).toBeInTheDocument();
    expect(levelElement.value).toBe(userData.skillsLevels[0].level);
  });
  test('If Submit button  is enabled', enabledSubmitChecker);
});
