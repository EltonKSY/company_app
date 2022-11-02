import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { emptyInputChecker, disabledSubmitChecker } from '../helpers/tests';

import AuthPage from './AuthPage';

//CALLBACKS
const authFormChecker = () => {
  const loginFormElement = screen.getByText(/sign in/i);
  expect(loginFormElement).toBeInTheDocument();
};

//TESTS
describe('When the AuthPage loads', () => {
  beforeEach(() => render(<AuthPage />));

  test('If sign in form displays', authFormChecker);
  test('If username is  empty', () => emptyInputChecker('User name'));
  test('If Password is empty', () => emptyInputChecker('Password'));
  test('If Submit button  is disabled', disabledSubmitChecker);
});
