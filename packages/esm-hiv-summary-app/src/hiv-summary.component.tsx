import React, { useMemo, useState } from 'react';
import styles from './hiv-summary.component.scss';
import { useTranslation } from 'react-i18next';
import ContentSwitcher from 'carbon-components-react/es/components/ContentSwitcher';
import Switch from 'carbon-components-react/es/components/Switch';
import HivLatestSummary from './widgets/hiv-latest-summary/hiv-latest-summary.component';
import HivSummaryHistorical from './widgets/hiv-summary-historical/hiv-summary-historical.component';
import { createErrorHandler } from '@openmrs/esm-framework';
import { fetchHivSummary } from './hiv-summary.resource';
import { HIVSummary } from './types';
import StructuredListSkeleton from 'carbon-components-react/lib/components/StructuredList/StructuredList.Skeleton';

interface HivSummaryProps {
  patientUuid: string;
  patient: fhir.Patient;
}

enum StateTypes {
  PENDING = 'pending',
  RESOLVED = 'resolved',
  ERROR = 'error',
}

type ViewState = StateTypes.PENDING | StateTypes.RESOLVED | StateTypes.ERROR;

const HivSummary: React.FC<HivSummaryProps> = ({ patient, patientUuid }) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<ViewState>(StateTypes.PENDING);
  const [hivSummaryData, setHivSummaryData] = React.useState<Array<HIVSummary>>([]);
  const headerTitle = t('hivSummary', 'HIV Summary');
  const [selectedSwitchIndex, setSelectedSwitchIndex] = useState<number>(0);

  React.useEffect(() => {
    const sub = fetchHivSummary(patientUuid).subscribe(
      (hivSummary) => {
        setHivSummaryData(hivSummary);
        setStatus(StateTypes.RESOLVED);
      },
      (error) => createErrorHandler(),
    );
    return () => sub.unsubscribe();
  }, [patientUuid]);

  const hivSummaryTabs = useMemo(
    () => [
      { label: t('hivSummary', 'HIV Summary') },
      { label: t('historicalHIVSummary', 'Historical HIV Summary') },
      { label: t('medicationChangeHistory', 'Medication Change History') },
      { label: t('hivClinicalSummary', 'HIV Clinical Summary') },
      { label: t('previousVisitSummary', 'Previous Visit Summary') },
    ],
    [t],
  );

  return (
    <>
      {status === StateTypes.PENDING && <StructuredListSkeleton />}
      {status === StateTypes.RESOLVED && (
        <div className={styles.hivSummaryContainer}>
          <div className={styles.hivSummaryHeader}>
            <h4 className={`${styles.productiveHeading03} ${styles.text02}`}>{headerTitle}</h4>
          </div>
          <div className={styles.contentSwitcherContainer}>
            <ContentSwitcher onChange={({ index }) => setSelectedSwitchIndex(index)} size="lg">
              {hivSummaryTabs.map((hivSummaryTab, index) => (
                <Switch key={index} name={hivSummaryTab.label} text={hivSummaryTab.label} />
              ))}
            </ContentSwitcher>
            <div>
              {selectedSwitchIndex === 0 && <HivLatestSummary hivSummaryData={hivSummaryData} patient={patient} />}
            </div>
            <div>{selectedSwitchIndex === 1 && <HivSummaryHistorical hivSummary={hivSummaryData} />}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default HivSummary;
