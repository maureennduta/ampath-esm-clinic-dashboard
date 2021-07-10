import { Store } from 'unistore';
import { createGlobalStore } from '@openmrs/esm-framework';
import { Reminder } from './patient-alerts.resource';

export interface PatientAlertsStore {
  hasAlert: boolean;
  alerts: Array<Reminder>;
  patientId: string;
}

export const patientAlertsStore: Store<PatientAlertsStore> = createGlobalStore('patient-alerts', {
  hasAlert: false,
  alerts: null,
  patientId: null,
});

export const setHasAlert = patientAlertsStore.action(
  (state, value: boolean, alerts: Array<Reminder>, patientId: string) => ({
    ...state,
    hasAlert: value,
    alerts: alerts,
    patientId: patientId,
  }),
);
