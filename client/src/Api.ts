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

class Api {
  async searchRecords(
    request: SearchRecordsRequest
  ): Promise<SearchRecordsResponse> {
    const response = await fetch("/api/records", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(request),
    });
    return await response.json();
  }
  async getBuyers(): Promise<BuyerRecordsResponse> {
    const response = await fetch("/api/buyers", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    });
    return await response.json();
  }
}

export default Api;
