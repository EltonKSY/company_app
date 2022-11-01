import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import AuthPage from '../pages/AuthPage';

//Callbacks
const inputsChecker = (userValue, pwValue, pwEl, userEl, pEl, btnEl) => {
  fireEvent.change(pwEl, { target: { value: pwValue } });
  fireEvent.change(userEl, { target: { value: userValue } });

  //ensure error message is not causing a disabbled !pEl
  if (userValue?.length > 4 && pwValue?.length > 4 && !pEl) expect(btnEl).not.toBeDisabled();
  else expect(btnEl).toBeDisabled();
};

const errorMsgChecker = (pwEl, userEl, pEl, btnEl) => {
  //ensure disabled is not coming from inputs that are too short
  fireEvent.change(pwEl, { target: { value: 'Password' } });
  fireEvent.change(userEl, { target: { value: 'UserName' } });

  if (pEl) expect(btnEl).toBeDisabled();
};

describe('Button is enabled or disabled based on both inputs lengths', () => {
  let container, elements;

  beforeEach(() => {
    ({ container } = render(<AuthPage />));

    const userNameInputElement = screen.getByPlaceholderText(/User name/i);
    const passwordInputElement = screen.getByPlaceholderText(/Password/i);
    const buttonElement = screen.getByRole('button', { name: new RegExp('submit', 'i') });
    const paragraphElement = container.querySelector('.errors');

    elements = [passwordInputElement, userNameInputElement, paragraphElement, buttonElement];
  });

  test('If submit button is enabled with long inputs', () => inputsChecker('userName', 'Password', ...elements));
  test('If submit button is not enabled with short inputs', () => inputsChecker('User', 'Pass', ...elements));
  test('If submit button is not enabled with short userName and Long password', () => inputsChecker('User', 'Password', ...elements));
  test('If submit button is not enabled with long userName and short password', () => inputsChecker('Username', 'Pass', ...elements));
  test('If submit button is not enabled with empty', () => inputsChecker('', '', ...elements));
  test('If submit Button is enabled or disabled whether there is an error message ', () => errorMsgChecker(...elements));
});
