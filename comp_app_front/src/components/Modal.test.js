import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import Modal from './Modal';

describe('Overlay mounts on Modal', () => {
  beforeEach(() => render(<Modal component={<h1>I am a test</h1>} />));

  test('if component is on the page', () => expect(screen.getByText(/I am a test/i)).toBeInTheDocument());
});
