export type BuyerRecord = {
    id: string;
    name: string;
}

export type BuyerRecordsResponse = {
    buyers: BuyerRecord[];
}

export type SearchRecordsRequest = {
  textSearch?: string;
  buyerIdFilter?: string;
  limit: number;
  offset: number;
};

export type ProcurementRecord = {
  id: string;
  title: string;
  description: string;
  publishDate: string;
  closeDate: string | null;
  awardDate: string | null;
  value: number;
  currency: string | null;
  stage: "TENDER" | "CONTRACT";
  buyer: BuyerRecord;
};

export type SearchRecordsResponse = {
  records: ProcurementRecord[];
  endOfResults: boolean;
};

export type SearchFilters = {
    query: string;
    buyerId?: string;
  };