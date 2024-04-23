import { BuyerRecordsResponse, SearchRecordsRequest, SearchRecordsResponse } from "./types";

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
