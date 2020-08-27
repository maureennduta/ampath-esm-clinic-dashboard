import React from "react";
import styles from "./patient-list.css";
import { colDef } from "../types";

interface PatientListProps {
  columnsDef: Array<colDef>;
  rowData: Array<any>;
  indicator: string;
}

const PatientList: React.FC<PatientListProps> = ({
  columnsDef,
  rowData,
  indicator,
}) => {
  const navigate = (rowData: HTMLTableRowElement) => {
    console.log(rowData);
  };
  return (
    <div className={styles["patient-list-container"]}>
      <div className={styles["indicator-title"]}>
        <span>
          <b>{indicator}</b> patient list
        </span>
      </div>
      <hr />
      <div className={styles["table-container"]}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columnsDef.map((column) => (
                <th key={column.headerName} style={column.cellStyle}>
                  <div>{column.headerName}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowData.map((rowData, index) => (
              <tr key={index} onClick={() => navigate(rowData)}>
                {columnsDef.map((col) => (
                  <td key={col.field}>{rowData[col.field]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles["button-container"]}>
        <button className="omrs-btn omrs-filled-action">
          Export{" "}
          <svg className="omrs-icon">
            <use xlinkHref="#omrs-icon-download"></use>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PatientList;
