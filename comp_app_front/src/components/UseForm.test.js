import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import UserForm from './UserForm';

const emptyInputChecker = placeHolder => {
  const inputUserElement = screen.getByPlaceholderText(new RegExp(placeHolder, 'i'));
  expect(inputUserElement.value).toBe('');
};

const disabledButtonChecker = () => {
  const buttonElement = screen.getByRole('button', { name: new RegExp('Submit', 'i') });
  expect(buttonElement).toBeDisabled();
};

const validateEmail = email => /\S+@\S+\.\S+/.test(email);

const inputsChecker = (fnameVal, lNameVal, pwVal, emailVal, dobVal, fNameEl, lNameEl, pwEl, emailEl, dobEl, btnEl) => {
  fireEvent.change(fNameEl, { target: { value: fnameVal } });
  fireEvent.change(lNameEl, { target: { value: lNameVal } });
  fireEvent.change(pwEl, { target: { value: pwVal } });
  fireEvent.change(emailEl, { target: { value: emailVal } });
  fireEvent.change(dobEl, { target: { value: dobVal } });

  //ensure error message is not causing a disabbled !pEl
  if (fnameVal && lNameVal && pwVal?.length > 4 && validateEmail(emailVal) && dobVal) expect(btnEl).not.toBeDisabled();
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
  test('If Submit button  is disabled', disabledButtonChecker);
});

describe('Button is enabled or disabled based on valid/invalid inputs', () => {
  let container, elements;

  beforeEach(() => {
    ({ container } = render(<UserForm />));

    const fNameElement = screen.getByPlaceholderText(/First Name/i);
    const lNameElement = screen.getByPlaceholderText(/Last Name/i);
    const passwordElement = screen.getByPlaceholderText(/Password/i);
    const emailElement = screen.getByPlaceholderText(/email/i);
    const dobElement = screen.getByPlaceholderText(/Date of birth/i);
    const buttonElement = screen.getByRole('button', { name: new RegExp('submit', 'i') });
    //   const paragraphElement = container.querySelector('.errors');

    elements = [fNameElement, lNameElement, passwordElement, emailElement, dobElement, buttonElement];
  });

  test('If submit button is enabled with all valid inputs', () => inputsChecker('Fname', 'Lname', 'Password', 'email@email.com', '12-31-2020', ...elements));
  test('If submit button is enabled with invalid Fname', () => inputsChecker('', 'Lname', 'Password', 'email@email.com', '12-31-2020', ...elements));
  test('If submit button is enabled with invalid Lname', () => inputsChecker('Fname', '', 'Password', 'email@email.com', '12-31-2020', ...elements));
  test('If submit button is enabled with invalid Password', () => inputsChecker('Fname', 'Lname', '', 'email@email.com', '12-31-2020', ...elements));
  test('If submit button is enabled with invalid email', () => inputsChecker('Fname', 'Lname', 'Password', '', '12-31-2020', ...elements));
  //   test('If submit button is enabled with invalid date', () => inputsChecker('Fname', 'Lname', 'Password', 'email@email.com', '', ...elements));
  test('If submit button is enabled with all empty inputs', () => inputsChecker('', '', '', '', '', ...elements));
});
