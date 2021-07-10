import React from 'react';
import { useStore } from '@openmrs/esm-framework';
import Close20 from '@carbon/icons-react/lib/close/20';
import Notification20 from '@carbon/icons-react/es/notification/20';
import NotificationNew20 from '@carbon/icons-react/es/notification--new/20';
import { HeaderGlobalAction } from 'carbon-components-react/es/components/UIShell';
import { patientAlertsStore } from './store';

interface NotificationsMenuButtonProps {
  isActivePanel: Function;
  togglePanel: Function;
}

const NotificationsMenuButton: React.FC<NotificationsMenuButtonProps> = ({ isActivePanel, togglePanel }) => {
  const { hasAlert } = useStore(patientAlertsStore);

  return (
    <HeaderGlobalAction
      aria-label="Notifications"
      aria-labelledby="Notifications Icon"
      name="Notifications"
      isActive={isActivePanel('notificationsMenu')}
      onClick={() => togglePanel('notificationsMenu')}>
      {isActivePanel('notificationsMenu') ? <Close20 /> : hasAlert ? <NotificationNew20 /> : <Notification20 />}
    </HeaderGlobalAction>
  );
};

export default NotificationsMenuButton;
