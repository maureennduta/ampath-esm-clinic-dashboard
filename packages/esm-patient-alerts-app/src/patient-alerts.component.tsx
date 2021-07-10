import React from 'react';
import { useTranslation } from 'react-i18next';
import { patientAlertsStore, setHasAlert } from './store';
import { fetchAlerts } from './patient-alerts.resource';
import InlineLoading from 'carbon-components-react/es/components/InlineLoading';
import { ToastNotification } from 'carbon-components-react/lib/components/Notification/Notification';
import { showNotification, useCurrentPatient, useStore } from '@openmrs/esm-framework';
import styles from './patient-alerts.scss';

enum ActionTypes {
  idle = 'idle',
  loading = 'loading',
  resolved = 'resolved',
  rejected = 'rejected',
}

interface Idle {
  type: ActionTypes.idle;
}

interface Loading {
  type: ActionTypes.loading;
}

interface Resolved {
  type: ActionTypes.resolved;
}

interface Rejected {
  type: ActionTypes.rejected;
}

interface ViewState {
  status: string;
}

type Action = Idle | Loading | Resolved | Rejected;

function viewStateReducer(state: ViewState, action: Action): ViewState {
  switch (action.type) {
    case ActionTypes.idle:
      return {
        status: 'idle',
      };
    case ActionTypes.loading:
      return {
        ...state,
        status: 'loading',
      };
    case ActionTypes.resolved:
      return {
        ...state,
        status: 'resolved',
      };
    case ActionTypes.rejected:
      return {
        ...state,
        status: 'rejected',
      };
    default:
      throw new Error(`Unhandled action type: ${action}`);
  }
}

interface PatientAlertsComponentProps {
  expanded: boolean;
}

export default function PatientAlertsComponent({ expanded }: PatientAlertsComponentProps) {
  const { t } = useTranslation();
  const [, patient] = useCurrentPatient();
  const { hasAlert, alerts, patientId } = useStore(patientAlertsStore);
  const state = React.useMemo(() => ({ patient }), [patient]);

  const initialViewState: ViewState = {
    status: hasAlert ? 'resolved' : 'idle',
  };

  const [viewState, dispatch] = React.useReducer(viewStateReducer, initialViewState);

  React.useEffect(() => {
    const { patient } = state;
    if (patient) {
      if (patientId !== patient.id) {
        dispatch({
          type: ActionTypes.loading,
        });
      }
      const sub = fetchAlerts(patient.id).subscribe(
        (alerts) => {
          if (alerts) {
            setHasAlert(alerts.length ? true : false, alerts, patient.id);
            dispatch({
              type: ActionTypes.resolved,
            });
          }
        },
        (err) => {
          dispatch({
            type: ActionTypes.rejected,
          });

          showNotification({
            title: t('patientReminderError', 'Error fetching reminders'),
            kind: 'error',
            description: err?.message,
          });
        },
      );
      return () => {
        sub.unsubscribe();
      };
    }
  }, [hasAlert, patient, patientId, state, t]);

  return (
    <>
      {expanded && (
        <div className={styles.notificationsPanel}>
          {viewState.status === 'loading' || viewState.status === 'idle' ? (
            <InlineLoading
              role="progressbar"
              className={styles.loading}
              description={`${t('loading', 'Loading')} ...`}
            />
          ) : null}
          {viewState.status === 'resolved' ? (
            <>
              {alerts?.length ? (
                <div>
                  {alerts.map((alert, index) => (
                    <ToastNotification
                      key={index}
                      kind={alert.type === 'danger' ? 'warning' : alert.type}
                      subtitle={<span>{alert.message}</span>}
                      title={alert.title}
                    />
                  ))}
                </div>
              ) : (
                <div>
                  <p className={styles.emptyNotifications}>
                    {t('noNotifications', 'You currently have no notifications')}
                  </p>
                </div>
              )}
            </>
          ) : null}
        </div>
      )}
    </>
  );
}
