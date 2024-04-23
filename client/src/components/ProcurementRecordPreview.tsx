import React from "react";
import { Modal } from "antd";

import { ProcurementRecord } from "../types";

type Props = {
  record?: ProcurementRecord;
  onClose: () => void;
};
const ProcurementRecordPreviewModal: React.FC<Props> = ({
    record, onClose,
}) => {
  if (!record) return null;

  return (
    <Modal
      title={record.title}
      visible={!!record}
      onOk={onClose}
      onCancel={onClose}
      cancelButtonProps={{ style: { display: "none" } }}
      maskClosable
      width="30vw"
    >
      <p>
        <strong>{record.buyer.name}</strong>
      </p>
      <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
        {record.description}
      </pre>
    </Modal>
  );
}

export default ProcurementRecordPreviewModal;
