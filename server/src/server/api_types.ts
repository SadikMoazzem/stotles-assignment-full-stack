export type RecordSearchRequest = {
  textSearch?: string;
  buyerIdFilter?: string;
  offset: number;
  limit: number;
};

export type BuyerDto = {
  id: string;
  name: string;
};

export type ProcurementRecordDto = {
  id: string;
  title: string;
  description: string;
  buyer: BuyerDto;
  publishDate: string;
  value: number;
  stage:  "TENDER" | "CONTRACT";
  closeDate: string | null;
  awardDate: string | null;
  currency: string | null;
};

export type RecordSearchResponse = {
  records: ProcurementRecordDto[];
  endOfResults: boolean; // this is true when there are no more results to search
};

export type BuyerRecordsResponse = {
    buyers: BuyerDto[];
};
