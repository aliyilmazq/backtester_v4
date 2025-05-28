import axios from "axios";

const API_KEY = "HL2xahoATlTaojXcGhaU6TiHQ8tTqN4K";

export async function fetchOhlcvPolygon({ ticker, startDate, endDate, apiKey = API_KEY }) {
  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${startDate}/${endDate}`;
  const params = {
    adjusted: "true",
    sort: "asc",
    limit: 5000,
    apiKey,
  };
  const response = await axios.get(url, { params });
  return response.data;
} 