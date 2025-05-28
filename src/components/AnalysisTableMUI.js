import React from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  useMediaQuery
} from "@mui/material";

export default function AnalysisTableMUI({ data2, analysisResult, selectedAnalysis }) {
  const isMobile = useMediaQuery('(max-width:600px)');
  if (!data2 || data2.length === 0 || analysisResult.length === 0) return (
    <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2 }}>
      Gösterilecek analiz verisi yok.
    </Typography>
  );
  let headers = ["Tarih", "Kapanış"];
  let rows = [];
  if (["sma", "ema", "rsi"].includes(selectedAnalysis)) {
    headers.push(selectedAnalysis.toUpperCase());
    const offset = data2.length - analysisResult.length;
    rows = data2.map((bar, i) => [
      new Date(bar.t).toLocaleDateString(),
      bar.c,
      i >= offset ? analysisResult[i - offset]?.toFixed(2) : ""
    ]);
  } else if (selectedAnalysis === "macd") {
    headers = ["Tarih", "Kapanış", "MACD", "Signal", "Histogram"];
    const offset = data2.length - analysisResult.length;
    rows = data2.map((bar, i) => [
      new Date(bar.t).toLocaleDateString(),
      bar.c,
      i >= offset ? analysisResult[i - offset]?.MACD?.toFixed(2) : "",
      i >= offset ? analysisResult[i - offset]?.signal?.toFixed(2) : "",
      i >= offset ? analysisResult[i - offset]?.histogram?.toFixed(2) : ""
    ]);
  } else if (selectedAnalysis === "bbands") {
    headers = ["Tarih", "Kapanış", "Üst Band", "Orta Band", "Alt Band"];
    const offset = data2.length - analysisResult.length;
    rows = data2.map((bar, i) => [
      new Date(bar.t).toLocaleDateString(),
      bar.c,
      i >= offset ? analysisResult[i - offset]?.upper?.toFixed(2) : "",
      i >= offset ? analysisResult[i - offset]?.middle?.toFixed(2) : "",
      i >= offset ? analysisResult[i - offset]?.lower?.toFixed(2) : ""
    ]);
  }
  return (
    <TableContainer component={Paper} sx={{ mt: 3, maxHeight: 440 }}>
      <Table stickyHeader size={isMobile ? "small" : "medium"}>
        <TableHead>
          <TableRow>
            {headers.map(h => <TableCell key={h}>{h}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i} hover>
              {row.map((cell, j) => <TableCell key={j}>{cell}</TableCell>)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

AnalysisTableMUI.propTypes = {
  data2: PropTypes.array.isRequired,
  analysisResult: PropTypes.array.isRequired,
  selectedAnalysis: PropTypes.string.isRequired
}; 