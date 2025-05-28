import React from "react";

export default function AnalysisTable({ data2, analysisResult, selectedAnalysis }) {
  if (!data2 || data2.length === 0 || analysisResult.length === 0) return null;
  let headers = ["Tarih", "Kapanış"];
  let rows = [];
  if (["sma", "ema", "rsi"].includes(selectedAnalysis)) {
    headers.push(selectedAnalysis.toUpperCase());
    const offset = data2.length - analysisResult.length;
    rows = data2.map((bar, i) => [
      new Date(bar.t).toLocaleDateString(),
      bar.c,
      i >= offset ? analysisResult[i - offset].toFixed(2) : ""
    ]);
  } else if (selectedAnalysis === "macd") {
    headers = ["Tarih", "Kapanış", "MACD", "Signal", "Histogram"];
    const offset = data2.length - analysisResult.length;
    rows = data2.map((bar, i) => [
      new Date(bar.t).toLocaleDateString(),
      bar.c,
      i >= offset ? analysisResult[i - offset].MACD.toFixed(2) : "",
      i >= offset ? analysisResult[i - offset].signal.toFixed(2) : "",
      i >= offset ? analysisResult[i - offset].histogram.toFixed(2) : ""
    ]);
  } else if (selectedAnalysis === "bbands") {
    headers = ["Tarih", "Kapanış", "Üst Band", "Orta Band", "Alt Band"];
    const offset = data2.length - analysisResult.length;
    rows = data2.map((bar, i) => [
      new Date(bar.t).toLocaleDateString(),
      bar.c,
      i >= offset ? analysisResult[i - offset].upper.toFixed(2) : "",
      i >= offset ? analysisResult[i - offset].middle.toFixed(2) : "",
      i >= offset ? analysisResult[i - offset].lower.toFixed(2) : ""
    ]);
  }
  return (
    <table border="1" cellPadding="5" style={{ borderCollapse: "collapse", width: "100%", marginTop: 20 }}>
      <thead>
        <tr style={{ background: "#f0f0f0" }}>
          {headers.map(h => <th key={h}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => <td key={j}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
} 