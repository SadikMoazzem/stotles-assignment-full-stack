import React, { useState, useEffect, useCallback } from "react";
import { Button } from "antd";

import Api from "../Api";
import RecordSearchFilters from "../components/RecordSearchFilters";
import RecordsTable from "../components/RecordsTable";
import { ProcurementRecord, SearchFilters } from "../types";

/**
 * This component implements very basic pagination.
 * We fetch `PAGE_SIZE` records using the search endpoint which also returns
 * a flag indicating whether there are more results available or we reached the end.
 *
 * If there are more we show a "Load more" button which fetches the next page and
 * appends the new results to the old ones.
 *
 * Any change to filters resets the pagination state.
 *
 */

const PAGE_SIZE = 10;

const RecordSearchPage = () => {
  const [page, setPage] = useState<number>(1);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: "",
    buyerId: undefined,
  });
  const [records, setRecords] = useState<ProcurementRecord[] | undefined>();
  const [reachedEndOfSearch, setReachedEndOfSearch] = useState(false);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const api = new Api();
        const response = await api.searchRecords({
          textSearch: searchFilters.query,
          buyerIdFilter: searchFilters.buyerId,
          limit: PAGE_SIZE,
          offset: PAGE_SIZE * (page - 1),
        });

        if (page === 1) {
          setRecords(response.records);
        } else {
          setRecords((oldRecords) => [...oldRecords, ...response.records]);
        }
        setReachedEndOfSearch(response.endOfResults);
      } catch (error) {
        console.error("Failed to fetch records:", error);
      }
    };

    fetchRecords();
  }, [searchFilters, page]);

  const handleChangeFilters = useCallback((newFilters: SearchFilters) => {
    setSearchFilters(newFilters);
    setPage(1);
  }, []);

  const handleLoadMore = useCallback(() => {
    setPage((page) => page + 1);
  }, []);

  return (
    <>
      <RecordSearchFilters
        filters={searchFilters}
        onChange={handleChangeFilters}
      />
      {records && (
        <>
          <RecordsTable records={records} />
          {!reachedEndOfSearch && (
            <Button onClick={handleLoadMore}>Load more</Button>
          )}
        </>
      )}
    </>
  );
}

export default RecordSearchPage;
