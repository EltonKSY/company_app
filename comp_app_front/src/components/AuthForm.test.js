/* eslint-disable testing-library/no-render-in-setup */
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';

import AuthPage from '../pages/AuthPage';

//Callbacks
const inputsChecker = (userValue, pwValue, pwEl, userEl, btnEl) => {
  fireEvent.change(pwEl, { target: { value: pwValue } });
  fireEvent.change(userEl, { target: { value: userValue } });

  if (userValue?.length > 4 && pwValue?.length > 4) expect(btnEl).not.toBeDisabled();
  else expect(btnEl).toBeDisabled();
};

//Tests
describe('Button is enabled or disabled based on both inputs lengths', () => {
  let elements;

  beforeEach(() => {
    render(<AuthPage />);

    const userNameInputElement = screen.getByPlaceholderText(/User name/i);
    const passwordInputElement = screen.getByPlaceholderText(/Password/i);
    const buttonElement = screen.getByRole('button', { name: new RegExp('submit', 'i') });

    elements = [passwordInputElement, userNameInputElement, buttonElement];
  });

  test('If submit button is enabled with long inputs', () => inputsChecker('userName', 'Password', ...elements));
  test('If submit button is not enabled with short inputs', () => inputsChecker('User', 'Pass', ...elements));
  test('If submit button is not enabled with short userName and Long password', () => inputsChecker('User', 'Password', ...elements));
  test('If submit button is not enabled with long userName and short password', () => inputsChecker('Username', 'Pass', ...elements));
  test('If submit button is not enabled with empty', () => inputsChecker('', '', ...elements));
});
