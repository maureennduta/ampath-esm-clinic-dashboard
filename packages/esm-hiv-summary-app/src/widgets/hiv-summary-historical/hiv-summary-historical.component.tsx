import React from 'react';
import DataTable, {
  DataTableRow,
  DataTableHeader,
  TableContainer,
  Table,
  TableRow,
  TableHead,
  TableHeader,
  TableBody,
  TableCell,
} from 'carbon-components-react/es/components/DataTable';
import styles from './hiv-summary-historical.component.scss';
import { useTranslation } from 'react-i18next';
import { HIVSummary } from '../../types';
import { formatDate } from '../helper';

interface HivSummaryHistoricalProps {
  hivSummary: Array<HIVSummary>;
}

const HivSummaryHistorical: React.FC<HivSummaryHistoricalProps> = ({ hivSummary }) => {
  const { t } = useTranslation();
  const tableHeaders: Array<DataTableHeader> = React.useMemo(
    () => [
      {
        key: 'encounterDate',
        header: t('encounterDate', 'Encounter Date'),
      },
      { key: 'encounterType', header: t('encounterType', 'Encounter Type') },
      { key: 'rtcDate', header: t('rtcDate', 'RTC Date') },
      { key: 'medicatePickUpDate', header: t('medicatePickUpDate', 'Medication Pick up Date') },
      { key: 'tbTreatmentStartDate', header: t('tbTreatmentStartDate', 'TB Treatment Start Date') },
      { key: 'tbTreatmentEndDate', header: t('tbTreatmentEndDate', 'TB Treatment End Date') },
      { key: 'arvMeds', header: t('arvMeds', 'ARV Meds') },
      { key: 'cd4Count', header: t('cd4Count', 'CD4 Count') },
      { key: 'viralLoad', header: t('vitalLoad', 'Viral Load') },
      { key: 'whoStage', header: t('whoStage', 'WHO Stage') },
      { key: 'mdtSessionNumber', header: t('mdtSessionNumber', 'EAC') },
    ],
    [t],
  );

  const tableRows: Array<DataTableRow> = React.useMemo(
    () =>
      hivSummary?.map((hivSum, index) => {
        return {
          id: index,
          encounterDate: formatDate(hivSum.encounter_datetime),
          encounterType: hivSum.encounter_type_name,
          rtcDate: formatDate(hivSum.rtc_date),
          medicatePickUpDate: formatDate(hivSum.med_pickup_rtc_date),
          tbTreatmentStartDate: formatDate(hivSum.tb_tx_start_date),
          tbTreatmentEndDate: formatDate(hivSum.tb_tx_stop_date),
          arvMeds: hivSum.cur_arv_meds,
          cd4Count: `${hivSum?.cd4_1 ?? '-'} ${formatDate(hivSum.cd4_1_date)}`,
          viralLoad: `${hivSum?.vl_1 ?? '-'} ${formatDate(hivSum.vl_1_date)}`,
          whoStage: hivSum.cur_who_stage,
          mdtSessionNumber: `${hivSum.mdt_session_number ?? '-'}`,
        };
      }),
    [hivSummary],
  );

  return (
    <TableContainer className={styles.tableContainer}>
      <DataTable rows={tableRows} headers={tableHeaders} isSortable={true} size="short">
        {({ rows, headers, getHeaderProps, getTableProps }) => (
          <Table {...getTableProps()}>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableHeader
                    className={`${styles.productiveHeading01} ${styles.text02}`}
                    {...getHeaderProps({
                      header,
                      isSortable: header.isSortable,
                    })}>
                    {header.header?.content ?? header.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  {row.cells.map((cell) => {
                    return <TableCell key={cell.id}>{cell.value?.content ?? cell.value}</TableCell>;
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DataTable>
    </TableContainer>
  );
};

export default HivSummaryHistorical;
