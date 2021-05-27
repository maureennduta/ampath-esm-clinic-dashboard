import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from './dashboard.component';
import { BrowserRouter } from 'react-router-dom';

jest.mock('./dashboard.routes.json', () => [
  {
    name: 'CROSS BORDER REPORT',
    description: 'Cross border intergration Report',
    url: '/home/cross-border-report',
    icon: 'omrs-icon-menu',
  },
  {
    name: 'OVC REPORT',
    description: 'Orphans and Vulnarable Children',
    url: '/home/ovc-report',
    icon: 'omrs-icon-supervised-user-circle',
  },
]);

describe('<Dashboard/>', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>,
    );
  });

  it('should render links correctly', async () => {
    expect(await screen.findByText(/OVC REPORT/i)).toBeInTheDocument();
    expect(await screen.findByText(/CROSS BORDER REPORT/i)).toBeInTheDocument();
  });
});
