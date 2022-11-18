/* eslint-disable testing-library/no-render-in-setup */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import ListingPage from './ListingPage';

describe('Table and form display', () => {
  beforeEach(() => render(<ListingPage />));

  test('If table head renders', () => {
    const nameElement = screen.getByText(/full name/i);
    expect(nameElement).toBeInTheDocument();
  });

  test('When user clicks on add employee button, form displays', () => {
    const buttonElement = screen.getByLabelText('add', { selector: 'button' });
    user.click(buttonElement);

    const formElement = screen.getByText(/Employee Form/i);
    expect(formElement).toBeInTheDocument();
  });
});
