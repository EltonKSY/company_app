import { screen } from '@testing-library/react';

//CALLBACKS FOR TESTS
const emptyInputChecker = placeHolder => {
  const inputUserElement = screen.getByPlaceholderText(new RegExp(placeHolder, 'i'));
  expect(inputUserElement.value).toBe('');
};

const nonEmptyInputChecker = placeHolder => {
  const inputUserElement = screen.getByPlaceholderText(new RegExp(placeHolder, 'i'));
  expect(inputUserElement.value).not.toBe('');
};

const disabledSubmitChecker = () => {
  const buttonElement = screen.getByRole('button', { name: new RegExp('Submit', 'i') });
  expect(buttonElement).toBeDisabled();
};

const enabledSubmitChecker = () => {
  const buttonElement = screen.getByRole('button', { name: new RegExp('Submit', 'i') });
  expect(buttonElement).not.toBeDisabled();
};

export { emptyInputChecker, disabledSubmitChecker, nonEmptyInputChecker, enabledSubmitChecker };
