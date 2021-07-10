import React from 'react';
import { render, screen } from '@testing-library/react';
import NotificationsMenuButton from './notifications-menu-button.component';

jest.mock('@openmrs/esm-framework', () => ({
  ...(jest.requireActual('@openmrs/esm-framework') as any),
  openmrsObservableFetch: jest.fn(),
  useCurrentPatient: jest.fn(),
}));

describe('NotificationsMenuButtonComponent', () => {
  test('renders a notification icon in the navbar', () => {
    renderNotificationsMenuButtonComponent();

    expect(screen.getByRole('button', { name: /notifications/i })).toBeInTheDocument();
  });
});

function renderNotificationsMenuButtonComponent() {
  render(<NotificationsMenuButton isActivePanel={() => {}} togglePanel={() => {}} />);
}
