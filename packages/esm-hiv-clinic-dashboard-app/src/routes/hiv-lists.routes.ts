import { FunctionComponent } from 'react';
import CrossBorderPatientList from '../reports/cross-border-report/cross-border-patient-list.component';
import CrossBorderReport from '../reports/cross-border-report/cross-border-report.component';
import Dashboard from '../dashboard/dashboard.component';
import OVCPatientList from '../reports/ovc-report/ovc-patient-list.component';
import OVCReport from '../reports/ovc-report/ovc-report.component';

interface Routes {
  name: string;
  path: string;
  component: FunctionComponent | any;
}
export const HIVListsRoutes: Array<Routes> = [
  { name: 'hiv-clinic-dashboard', path: '/hiv-clinic-dashboard', component: Dashboard },
  { name: 'ovc-report', path: '/hiv-clinic-dashboard/ovc-report', component: OVCReport },
  {
    name: 'ovc-patient-list',
    path: '/hiv-clinic-dashboard/ovc-patient-list/:endDate?/:locationUuids?/:indicators?/:indicatorName?/:totalRecords?',
    component: OVCPatientList,
  },
  {
    name: 'cross-border-report',
    path: '/hiv-clinic-dashboard/cross-border-report',
    component: CrossBorderReport,
  },
  {
    name: 'cross-border-patient-list',
    path: '/hiv-clinic-dashboard/cross-border-patient-list/:locationUuids?/:month?/:indicators?/:indicatorName?/:totalRecords?',
    component: CrossBorderPatientList,
  },
];
