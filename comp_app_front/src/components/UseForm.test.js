import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';

import { validateEmail, diff_years } from '../helpers/validators';

import { emptyInputChecker, disabledSubmitChecker, nonEmptyInputChecker, enabledSubmitChecker } from '../helpers/tests';
import UserForm from './UserForm';

const inputsChecker = (fnameVal, lNameVal, pwVal, emailVal, dobVal, fNameEl, lNameEl, pwEl, emailEl, dobEl, btnEl) => {
  fireEvent.change(fNameEl, { target: { value: fnameVal } });
  fireEvent.change(lNameEl, { target: { value: lNameVal } });
  fireEvent.change(pwEl, { target: { value: pwVal } });
  fireEvent.change(emailEl, { target: { value: emailVal } });
  fireEvent.change(dobEl, { target: { value: dobVal } });

  if (fNameEl.value && lNameEl.value && pwEl.value?.length > 4 && validateEmail(emailEl.value) && diff_years(new Date(), new Date(dobEl.value)) < 110)
    expect(btnEl).not.toBeDisabled();
  else expect(btnEl).toBeDisabled();
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
  beforeEach(() => render(<UserForm user={{ fname: 'fname', lname: 'lname', dob: '2000-05-12', email: 'email@email.com', password: 'password' }} />));

  test('If first name is  empty', () => nonEmptyInputChecker(/First Name/i));
  test('If last name is  empty', () => nonEmptyInputChecker(/Last Name/i));
  test('If email is  empty', () => nonEmptyInputChecker(/Email/i));
  test('If password is  empty', () => nonEmptyInputChecker(/Password/i));
  test('If date is  empty', () => nonEmptyInputChecker(/Date of birth/i));
  test('If Submit button  is disabled', enabledSubmitChecker);
});

describe('Button is enabled or disabled based on valid/invalid inputs', () => {
  let elements;

  beforeEach(() => {
    render(<UserForm />);

    const fNameElement = screen.getByPlaceholderText(/First Name/i);
    const lNameElement = screen.getByPlaceholderText(/Last Name/i);
    const passwordElement = screen.getByPlaceholderText(/Password/i);
    const emailElement = screen.getByPlaceholderText(/email/i);
    const dobElement = screen.getByPlaceholderText(/Date of birth/i);
    const buttonElement = screen.getByRole('button', { name: new RegExp('submit', 'i') });

    elements = [fNameElement, lNameElement, passwordElement, emailElement, dobElement, buttonElement];
  });

  test('If submit button is enabled with all valid inputs', () => inputsChecker('Fname', 'Lname', 'Password', 'email@email.com', '1979-05-12', ...elements));
  test('If submit button is disabled with invalid Fname', () => inputsChecker('', 'Lname', 'Password', 'email@email.com', '1989-05-12', ...elements));
  test('If submit button is disabled with invalid Lname', () => inputsChecker('Fname', '', 'Password', 'email@email.com', '1999-05-12', ...elements));
  test('If submit button is disabled with invalid Password', () => inputsChecker('Fname', 'Lname', '', 'email@email.com', '2009-05-12', ...elements));
  test('If submit button is disabled with invalid email', () => inputsChecker('Fname', 'Lname', 'Password', '', '2019-05-12', ...elements));
  test('If submit button is disabled with invalid date', () => inputsChecker('Fname', 'Lname', 'Password', 'email@email.com', '', ...elements));
  test('If submit button is disabled with all empty inputs', () => inputsChecker('', '', '', '', '', ...elements));
});
