import React from "react";
import { Table } from "antd";
import { ColumnType } from "antd/lib/table";

import ProcurementRecordPreviewModal from "./ProcurementRecordPreview";
import { ProcurementRecord } from "../types";

type Props = {
  records: ProcurementRecord[];
};
const RecordsTable: React.FC<Props> = ({
    records,
}) => {
  const [previewedRecord, setPreviewedRecord] = React.useState<ProcurementRecord>();

  const columns = React.useMemo<ColumnType<ProcurementRecord>[]>(() => {
    return [
      {
        title: "Published",
        render: (record: ProcurementRecord) =>
          new Date(record.publishDate).toLocaleDateString(),
      },
      {
        title: "Stage",
        render: (record: ProcurementRecord) => {
            switch (record.stage) {
              case 'TENDER':
                return record.closeDate && new Date(record.closeDate) <= new Date() 
                  ? `Closed` 
                  : `Open until ${record.closeDate}`;
              case 'CONTRACT':
                return `Awarded on ${record.awardDate}`;
              default:
                return null;
            }
        }
      },
      {
        title: "Title",
        render: (record: ProcurementRecord) => {
          const handleClick = (e: React.MouseEvent) => {
            e.preventDefault();
            setPreviewedRecord(record);
          };
          return (
            <a href="#" onClick={handleClick}>
              {record.title}
            </a>
          );
        },
      },
      {
        title: "Buyer name",
        render: (record: ProcurementRecord) => record.buyer.name,
      },
      {
        title: "Value",
        render: (record: ProcurementRecord) => {
            if (!record.value) return null;
            return `${record.value.toLocaleString()} (${record.currency || ''})`; // , currency: record.currency
          }
      },
    ];
  }, []);
  return (
    <>
      <Table columns={columns} dataSource={records} pagination={false} />
      <ProcurementRecordPreviewModal
        record={previewedRecord}
        onClose={() => setPreviewedRecord(undefined)}
      />
    </>
  );
}

export default RecordsTable;
