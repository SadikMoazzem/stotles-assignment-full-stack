/**
 * TODO
 * Group common funcitonality together and pull out utility functions
 * Leave only api views in a file for readability
 * Move all helper/types into their own files
 * Testing
 */
import express, { request } from "express";

import { Sequelize } from "sequelize-typescript";
import {
  ProcurementRecordDto,
  RecordSearchRequest,
  RecordSearchResponse,
  BuyerDto,
  BuyerRecordsResponse,
} from "./api_types";
import { Buyer } from "./db/Buyer";
import { ProcurementRecord } from "./db/ProcurementRecord";

/**
 * This file has little structure and doesn't represent production quality code.
 * Feel free to refactor it or add comments on what could be improved.
 *
 * We specifically avoided any use of sequelize ORM features for simplicity and used plain SQL queries.
 * Sequelize's data mapping is used to get nice JavaScript objects from the database rows.
 *
 * You can switch to using the ORM features or continue using SQL.
 */

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: process.env["SQLITE_DB"] || "./db.sqlite3",
});

sequelize.addModels([Buyer, ProcurementRecord]);

const app = express();

app.set("port", process.env.PORT || 3000);
app.set("views", "./views");
app.set("view engine", "ejs");

app.locals["assets_url"] = process.env.VITE_URL || "http://localhost:3001";

app.get("/", (_req, res) => {
  res.render("index.html.ejs");
});

app.use(express.json());

async function getAvailableBuyers() {
  return await sequelize.query("SELECT * FROM buyers", {
    model: Buyer,
  });
}

function serializeBuyer(buyer: Buyer): BuyerDto {
  return {
    id: buyer.id,
    name: buyer.name,
  };
}


type RecordSearchFilters = {
  textSearch?: string;
  buyerIdFilter?: string;
};

/**
 * Queries the database for procurement records according to the search filters.
 */
async function searchRecords(
  { textSearch, buyerIdFilter }: RecordSearchFilters,
  offset: number,
  limit: number
): Promise<ProcurementRecord[]> {
    let query = "SELECT * FROM procurement_records";

    if (buyerIdFilter || textSearch) {
        query += " WHERE";
    }

    if (buyerIdFilter) {
        query += " buyer_id = :buyerIdFilter";
    }

    if (textSearch) {
        if (buyerIdFilter) {
            query += " AND";
        }
        query += " (title LIKE :textSearch OR description LIKE :textSearch)";
    }

    query += " LIMIT :limit OFFSET :offset";

    return await sequelize.query(
      query,
      {
        model: ProcurementRecord,
        replacements: {
          textSearch: `%${textSearch}%`,
          buyerIdFilter,
          offset: offset,
          limit: limit,
        },
      }
    );
}

/**
 * Converts a DB-style ProcurementRecord object to an API type.
 * Assumes that all related objects (buyers) are prefetched upfront and passed in the `buyersById` map
 */
function serializeProcurementRecord(
  record: ProcurementRecord,
  buyersById: Map<string, Buyer>
): ProcurementRecordDto {
  const buyer = buyersById.get(record.buyer_id);
  if (!buyer) {
    throw new Error(
      `Buyer ${record.buyer_id} was not pre-fetched when loading record ${record.id}.`
    );
  }

  return {
    id: record.id,
    title: record.title,
    description: record.description,
    publishDate: record.publish_date,
    value: record.value,
    currency: record.currency,
    stage: record.stage,
    closeDate: record.close_date,
    awardDate: record.award_date,
    buyer: {
      id: buyer.id,
      name: buyer.name,
    },
  };
}

function unique<T>(items: Iterable<T>): T[] {
  return Array.from(new Set(items));
}

/**
 * Converts an array of DB-style procurement record object into API types.
 * Prefetches all the required relations.
 */
async function serializeProcurementRecords(
  records: ProcurementRecord[]
): Promise<ProcurementRecordDto[]> {
  // Get unique buyer ids for the selected records
  const buyerIds = unique(records.map((pr) => pr.buyer_id));

  // Fetch the buyer data in one query
  const buyers = await sequelize.query(
    "SELECT * FROM buyers WHERE id IN (:buyerIds)",
    {
      model: Buyer,
      replacements: {
        buyerIds,
      },
    }
  );

  const buyersById = new Map(buyers.map((b) => [b.id, b]));
  return records.map((r) => serializeProcurementRecord(r, buyersById));
}

/**
 * This endpoint implements basic way to paginate through the search results.
 * It returns a `endOfResults` flag which is true when there are no more records to fetch.
 */
app.post("/api/records", async (req, res) => {
  const requestPayload = req.body as RecordSearchRequest;

  const { limit, offset } = requestPayload;

  if (limit === 0 || limit > 100) {
    res.status(400).json({ error: "Limit must be between 1 and 100." });
    return;
  }

  // We fetch one more record than requested.
  // If number of returned records is larger than
  // the requested limit it means there is more data than requested
  // and the client can fetch the next page.
  const records = await searchRecords(
    {
      textSearch: requestPayload.textSearch,
      buyerIdFilter: requestPayload.buyerIdFilter,
    },
    offset,
    limit + 1
  );

  const response: RecordSearchResponse = {
    records: await serializeProcurementRecords(
      records.slice(0, limit) // only return the number of records requested
    ),
    endOfResults: records.length <= limit, // in this case we've reached the end of results
  };

  res.json(response);
});

app.get("/api/buyers", async (req, res) => {
    const buyers = await getAvailableBuyers();
  
    const response: BuyerRecordsResponse = {
        buyers: buyers.map(serializeBuyer),
    };
  
    res.json(response);
  });

app.listen(app.get("port"), () => {
  console.log("  App is running at http://localhost:%d", app.get("port"));
  console.log("  Press CTRL-C to stop\n");
});
