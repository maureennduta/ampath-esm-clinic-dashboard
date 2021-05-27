import React from 'react';
import { render, screen } from '@testing-library/react';
import CrossBorderPatientList from './cross-border-patient-list.component';
import { match } from 'react-router';
import { mockCrossBorderPatientListResponse } from '../../../../../__mocks__/cross-border-data.mock';
import { BrowserRouter } from 'react-router-dom';
import useEvent from '@testing-library/user-event';

let mockUseHistoryGoBack = jest.fn();

jest.mock('./cross-border.resource.tsx', () => ({
  fetchCrossBorderPatientList: jest.fn(() => Promise.resolve({ data: { result: mockCrossBorderPatientListResponse } })),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({ goBack: mockUseHistoryGoBack }),
}));

describe('<CrossBorderPatientList>', () => {
  const params: match<{
    month: string;
    indicators: string;
    locationUuids: string;
    indicatorName: string;
  }> = {
    isExact: true,
    path: '/',
    url: '/',
    params: {
      month: '2020-09-01',
      indicatorName: 'Uganda',
      locationUuids: '08fec60a-1352-11df-a1f1-0026b9348838',
      indicators: 'is_cross_border_this_month_uganda',
    },
  };

  it('should render cross border patient list', async () => {
    render(
      <BrowserRouter>
        <CrossBorderPatientList match={params} />
      </BrowserRouter>,
    );
    expect(await screen.findByRole('button', { name: /Back/i })).toBeInTheDocument();
    expect(await screen.findByText(/TEST PATIENT/i)).toBeInTheDocument();
  });

  it('should navigate to cross-border-report when back button is clicked', async () => {
    render(
      <BrowserRouter>
        <CrossBorderPatientList match={params} />
      </BrowserRouter>,
    );
    const backButton = await screen.findByRole('button', { name: /Back/i });
    useEvent.click(backButton);
    expect(mockUseHistoryGoBack).toHaveBeenCalled();
  });
});
