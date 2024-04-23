import React, { useEffect, useCallback, useState } from "react";
import { Row, Col, Input, Select } from "antd";

import Api from "../Api";
import { SearchFilters, BuyerRecord } from "../types";

type Props = {
  filters: SearchFilters;
  onChange: (newFilters: SearchFilters) => void;
};
const RecordSearchFilters: React.FC<Props> = ({
    filters, onChange,
}) => {
  const [availableBuyerRecords, setBuyerRecords] = useState<BuyerRecord[]>([]);

  useEffect(() => {
    const fetchBuyerRecords = async () => {
      try {
        const api = new Api();
        // TODO Add ability to filter buyers by search query as well for better UX
        const response = await api.getBuyers();
        setBuyerRecords(response.buyers);
      } catch (err) {
        // TODO Add in error message to user
        console.error("Failed to fetch buyer records", err);
      }
    };
    fetchBuyerRecords();
  }, []);

  const handleQueryChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      onChange({
        ...filters,
        query: e.currentTarget.value,
      });
    },
    [onChange, filters]
  );

  const handleFilterChange = useCallback(
    (filterString: string) => {
      onChange({
        ...filters,
        buyerId: filterString,
      });
    },
    [onChange, filters]
  );

  return (
    <Row style={{ width: '100%' }}>
      <Col span={16} style={{ flexGrow: 2 }}>
        <Input
          placeholder="Filter by title or description..."
          value={filters.query}
        // TODO only fire recall from api after a second to stop spamming
          onChange={handleQueryChange}
        />
      </Col>
      <Col span={8} style={{ flexGrow: 1 }}>
        {/* TODO Using a virtualized array */}
        <Select
          style={{ width: '100%' }}
          placeholder="Choose a buyer to filter by..."
          onChange={handleFilterChange}
          options={[
            { label: "View all buyers", value: "" },
            ...availableBuyerRecords.map((buyer) => ({
              label: buyer.name,
              value: buyer.id,
            })),
          ]}
        />
      </Col>
    </Row>
  );
}

export default RecordSearchFilters;
