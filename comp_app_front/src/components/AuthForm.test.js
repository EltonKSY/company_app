import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import AuthPage from '../pages/AuthPage';

const authFormChecker = () => {
  render(<AuthPage />);

  const loginFormElement = screen.getByText(/sign in/i);
  expect(loginFormElement).toBeInTheDocument();
};

const emptyInputChecker = placeHolder => {
  render(<AuthPage />);

  const inputUserElement = screen.getByPlaceholderText(new RegExp(placeHolder, 'i'));
  expect(inputUserElement.value).toBe('');
};

const disabledButtonChecker = () => {
  render(<AuthPage />);

  const buttonElement = screen.getByRole('button', { name: new RegExp('submit', 'i') });
  expect(buttonElement).toBeDisabled();
};

const inputsChecker = (userValue, pwValue) => {
  const { container } = render(<AuthPage />);

  const userNameInputElement = screen.getByPlaceholderText(/User name/i);
  const passwordInputElement = screen.getByPlaceholderText(/Password/i);
  const buttonElement = screen.getByRole('button', { name: new RegExp('submit', 'i') });
  const paragraphElement = container.querySelector('.errors');

  fireEvent.change(passwordInputElement, { target: { value: pwValue } });
  fireEvent.change(userNameInputElement, { target: { value: userValue } });

  if (userValue.length > 4 && pwValue.length > 4 && !paragraphElement) expect(buttonElement).not.toBeDisabled();
  else expect(buttonElement).toBeDisabled();
};

const errorMsgChecker = () => {
  const { container } = render(<AuthPage />);

  //Adding Valid inputs for username and password to prevent false positives
  //when button is disabled only because the inputs were too short
  const userNameInputElement = screen.getByPlaceholderText(/User name/i);
  const passwordInputElement = screen.getByPlaceholderText(/Password/i);
  const buttonElement = screen.getByRole('button', { name: new RegExp('submit', 'i') });
  const paragraphElement = container.querySelector('.errors');

  fireEvent.change(passwordInputElement, { target: { value: 'Password' } });
  fireEvent.change(userNameInputElement, { target: { value: 'UserName' } });

  if (paragraphElement) expect(buttonElement).toBeDisabled();
};

describe('AuthForm component on initial render', () => {
  test('Sign in form displays when the Authpage is rendered', authFormChecker);
  test('username is  empty', () => emptyInputChecker('User name'));
  test('Password is empty', () => emptyInputChecker('Password'));
  test('Submit button  is disabled', disabledButtonChecker);
});

describe('Button is enabled or disabled based on both inputs lengths', () => {
  test('Submit button is enabled with long inputs', () => inputsChecker('UserName123', 'Password123'));
  test('Submit button is not enabled with short inputs', () => inputsChecker('User', 'Pass'));
  test('Submit button is not enabled with short userName and Long password', () => inputsChecker('User', 'Password'));
  test('Submit button is not enabled with long userName and short password', () => inputsChecker('Username', 'Pass'));
  test('Submit button is not enabled with empty', () => inputsChecker('', ''));
});

test('Submit Button is enabled or disabled whether there is an error message ', errorMsgChecker);
