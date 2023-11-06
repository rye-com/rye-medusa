import { Client, cacheExchange, fetchExchange, gql } from "@urql/core";
import Medusa from "@medusajs/medusa-js";

export const medusaClient = new Medusa({
  baseUrl: "http://localhost:9000",
  maxRetries: 3,
  apiKey: "test-api-key",
});

export const ryeClient = new Client({
  url: "https://graphql.api.rye.com/v1/query",
  fetchOptions: {
    headers: {
      Authorization: process.env.RYE_AUTH_HEADER,
    },
  },
  exchanges: [cacheExchange, fetchExchange],
});
