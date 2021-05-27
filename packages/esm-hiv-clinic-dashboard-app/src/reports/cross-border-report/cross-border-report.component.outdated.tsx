import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CrossBorderReport from './cross-border-report.component';
import { BrowserRouter } from 'react-router-dom';
import { mockCrossBorderReportData } from '../../../../../__mocks__/cross-border-data.mock';
import { amrsFetch } from '../../amrs-fetch/amrsFetch';

const mockUseHistoryPush = jest.fn();
const mockAmrsFetch = amrsFetch as jest.Mock;

jest.mock('react-router-dom', () => ({
  // ...jest.requireActual('react-router-dom'),
  useHistory: () => ({ push: mockUseHistoryPush }),
  useLocation: jest.fn(),
}));

jest.mock('../../amrs-fetch/amrsFetch', () => ({
  amrsFetch: jest.fn(),
}));

describe('<CrossBorderReport/>', () => {
  beforeEach(() => {
    mockAmrsFetch.mockReset();
  });

  beforeEach(() => {
    render(
      <BrowserRouter>
        <CrossBorderReport />
      </BrowserRouter>,
    );
  });

  it('should render cross border report', async () => {
    expect(await screen.findByText(/Cross Border Report/i)).toBeInTheDocument();
    expect(await screen.findByText(/Month/i)).toBeInTheDocument();
  });

  it('should fetch and display report data when generate button is clicked', async () => {
    mockAmrsFetch.mockReturnValue(Promise.resolve({ data: mockCrossBorderReportData }));
    const monthInput = await screen.findByLabelText(/Month/i);
    fireEvent.change(monthInput, { target: { value: '2020-08' } });
    const generateButton = await screen.findByRole('button', {
      name: /Generate Report/i,
    });
    fireEvent.click(generateButton);
    expect(mockUseHistoryPush).toHaveBeenCalled();
    expect(await screen.findByText(/Back/i)).toBeInTheDocument();
    expect(await screen.findByText(/EnrolledMale25/i)).toBeInTheDocument();
  });

  it('should navigate to dashboard when back button is clicked', async () => {
    mockAmrsFetch.mockReturnValue(Promise.resolve({ data: mockCrossBorderReportData }));
    const backButton = await screen.findByRole('button', { name: /Back/i });
    fireEvent.click(backButton);
    expect(mockUseHistoryPush).toHaveBeenCalled();
  });

  it('should show error message when api request fails', async () => {
    mockAmrsFetch.mockImplementation(() => {
      return Promise.reject({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: () =>
          Promise.resolve(
            JSON.stringify({
              error: 'The server is dead',
            }),
          ),
      });
    });
    const monthInput = await screen.findByLabelText(/Month/i);
    fireEvent.change(monthInput, { target: { value: '2020-08' } });
    const generateButton = await screen.findByRole('button', {
      name: /Generate Report/i,
    });
    fireEvent.click(generateButton);
    expect(mockUseHistoryPush).toHaveBeenCalled();
    expect(await screen.findByText(/An error occurred while loading the report/i)).toBeInTheDocument();
    const closeErrorSVG = await screen.findByTestId('close');
    userEvent.click(closeErrorSVG);
    expect(closeErrorSVG).not.toBeInTheDocument();
  });
});
