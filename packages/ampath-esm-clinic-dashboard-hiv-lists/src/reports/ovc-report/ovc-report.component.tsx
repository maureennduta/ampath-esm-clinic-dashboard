import React from "react";
import ReportFilter from "../../ui-components/report-filter.component";
import ReportView from "../../ui-components/report-view.component";
import { EtlReportData } from "../../types/types";
import ReportTitle from "../../ui-components/header-ui/report-title.component";
import { fetchOVCReport } from "./ovc-report.resource";
import { useHistory, useLocation } from "react-router-dom";
import { useCurrentLocation } from "../../custom-hooks/useCurrentLocation";
import styles from "./ovc-report.component.css";
import dayjs from "dayjs";

const OVCReport: React.FC = () => {
  const currentLocation = useCurrentLocation();
  const [ovcReportData, setOvcReportData] = React.useState<EtlReportData>();
  const [endDate, setEndDate] = React.useState<Date>();
  const [loadReport, setLoadReport] = React.useState(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const history = useHistory();
  const location = useLocation<{ endDate: Date; locationUuid: string }>();
  const [showError, setShowError] = React.useState<boolean>();
  const [locationUuid, setLocationUuid] = React.useState(currentLocation);

  React.useEffect(() => {
    const ac = new AbortController();
    if (endDate) {
      setLoading(true);
      setOvcReportData(null);
      fetchOVCReport(ac, locationUuid, endDate).then(
        ({ data }) => {
          setOvcReportData(data);
          setLoading(false);
        },
        (error) => {
          setLoading(false);
          setShowError(true);
        }
      );
    }
  }, [loadReport, locationUuid]);

  React.useEffect(() => {
    if (location?.state) {
      let { endDate, locationUuid } = location.state;
      if (endDate && locationUuid) {
        setEndDate(dayjs(endDate).endOf("month").toDate());
        setLocationUuid(locationUuid);
        setLoadReport(!loadReport);
      }
    }
  }, []);

  const locationChangeHandler = (event: MessageEvent) => {
    event.data?.location_uuid && setLocationUuid(event.data.location_uuid);
  };

  React.useEffect(() => {
    window.addEventListener("message", locationChangeHandler);
    return () => window.removeEventListener("message", locationChangeHandler);
  }, []);

  const storeInURL = (): void => {
    const params = {
      endDate: endDate ?? new Date(),
      locationUuid: locationUuid,
    };
    history.push(`/home/ovc-report`, params);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(dayjs(event.target.value).endOf("month").toDate());
  };

  const generateReport = () => {
    setLoadReport(!loadReport);
    storeInURL();
    endDate ?? setEndDate(dayjs(new Date()).endOf("month").toDate());
  };

  return (
    <>
      {!loading ? (
        <div>
          {showError && (
            <div className={styles.error}>
              <div>
                <svg className="omrs-icon" fill="var(--omrs-color-danger)">
                  <use xlinkHref="#omrs-icon-important-notification"></use>
                </svg>
                <h3>An error occurred while loading the report</h3>
              </div>
              <svg
                className="omrs-icon"
                fill="var(--omrs-color-danger)"
                onClick={() => setShowError(false)}
              >
                <use xlinkHref="#omrs-icon-close"></use>
              </svg>
            </div>
          )}
          <ReportTitle title="OVC Report" />
          <ReportFilter>
            <div className={styles.inputContainer}>
              <label htmlFor="endDate">End Date</label>
              <input
                type="month"
                name="endDate"
                id="endDate"
                onChange={handleChange}
                value={dayjs(endDate).format("YYYY-MM")}
              />
            </div>
          </ReportFilter>
          <div className={styles.reportButton}>
            <button
              className="omrs-btn omrs-filled-action"
              onClick={generateReport}
            >
              Generate Report
            </button>
          </div>

          {ovcReportData && (
            <ReportView
              indicatorDefinitions={ovcReportData.indicatorDefinitions}
              sectionDefinitions={ovcReportData.sectionDefinitions}
              result={ovcReportData.result}
              queriesAndSchemas={ovcReportData.queriesAndSchemas}
              params={{
                patientListUrl: `/home/ovc-patient-list/${
                  endDate ?? new Date()
                }/${locationUuid}`,
              }}
            />
          )}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default OVCReport;
