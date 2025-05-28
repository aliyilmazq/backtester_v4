import { useState } from "react";
import { fetchOhlcvPolygon } from "./api/polygon";

const API_KEY = "HL2xahoATlTaojXcGhaU6TiHQ8tTqN4K";

export default function useOhlcvFetch() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const fetchOhlcv = async (ticker, startDate, endDate) => {
    setLoading(true);
    setError("");
    setSuccess(false);
    setData([]);
    try {
      const response = await fetchOhlcvPolygon({ ticker, startDate, endDate });
      setData(response.results || []);
      if (response.results && response.results.length > 0) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      } else {
        setError("Veri bulunamadı.");
      }
    } catch (err) {
      setError("Veri alınamadı.");
    }
    setLoading(false);
  };

  return { data, loading, error, success, fetchOhlcv };
} 