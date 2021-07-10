import React from 'react';
import { delay } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { openmrsObservableFetch, useCurrentPatient } from '@openmrs/esm-framework';
import PatientAlertsComponent from './patient-alerts.component';
import { mockPatient } from '../../../__mocks__/mock-patient';

const mockOpenmrsObservableFetch = openmrsObservableFetch as jest.Mock;
const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const testReminders = [
  {
    message: 'No contact tracing has been done for this index, please fill the  contact tracing form',
    title: 'Contact Tracing Reminder',
    type: 'warning',
    display: {
      banner: true,
      toast: true,
    },
    action: true,
    addContacts: true,
  },
];

jest.mock('@openmrs/esm-framework', () => ({
  ...(jest.requireActual('@openmrs/esm-framework') as any),
  openmrsObservableFetch: jest.fn(),
  useCurrentPatient: jest.fn(),
}));

describe('PatientAlertsComponent', () => {
  test('renders a loading screen when first launched', () => {
    mockUseCurrentPatient.mockReturnValue([, null]);
    renderPatientAlertsComponent();

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders a message if a patient does not have alerts', async () => {
    mockUseCurrentPatient.mockReturnValue([, mockPatient]);
    mockOpenmrsObservableFetch.mockReturnValue(of({ data: { result: { reminders: [] } } }).pipe(delay(10)));

    renderPatientAlertsComponent();

    await waitForLoadingToFinish();

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText(/you currently have no notifications/i)).toBeInTheDocument();
  });

  test("fetches and renders a patient's alerts if available", async () => {
    mockUseCurrentPatient.mockReturnValue([, mockPatient]);
    mockOpenmrsObservableFetch.mockReturnValue(of({ data: { result: { reminders: testReminders } } }).pipe(delay(10)));

    renderPatientAlertsComponent();

    expect(mockOpenmrsObservableFetch).toHaveBeenCalled();
    expect(mockOpenmrsObservableFetch).toHaveBeenCalledWith(
      expect.stringContaining(`/patient/${mockPatient.id}/hiv-clinical-reminder/`),
    );

    await waitForLoadingToFinish();

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByTitle(/warning icon/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /contact tracing reminder/i })).toBeInTheDocument();
    expect(screen.getByText(/No contact tracing has been done for this index/i)).toBeInTheDocument();
  });
});

function renderPatientAlertsComponent() {
  render(<PatientAlertsComponent expanded />);
}

function waitForLoadingToFinish() {
  return waitForElementToBeRemoved(() => [...screen.queryAllByRole(/progressbar/i)], {
    timeout: 4000,
  });
}
