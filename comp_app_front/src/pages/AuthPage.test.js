import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import AuthPage from './AuthPage';
//CALLBACKS
const authFormChecker = () => {
  const loginFormElement = screen.getByText(/sign in/i);
  expect(loginFormElement).toBeInTheDocument();
};

const emptyInputChecker = placeHolder => {
  const inputUserElement = screen.getByPlaceholderText(new RegExp(placeHolder, 'i'));
  expect(inputUserElement.value).toBe('');
};

const disabledButtonChecker = () => {
  const buttonElement = screen.getByRole('button', { name: new RegExp('submit', 'i') });
  expect(buttonElement).toBeDisabled();
};

//TESTS
describe('When the AuthPage loads', () => {
  beforeEach(() => render(<AuthPage />));

  test('If sign in form displays', authFormChecker);
  test('If username is  empty', () => emptyInputChecker('User name'));
  test('If Password is empty', () => emptyInputChecker('Password'));
  test('If Submit button  is disabled', disabledButtonChecker);
});
