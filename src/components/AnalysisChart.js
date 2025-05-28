import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area
} from "recharts";

export default function AnalysisChart({ data2, analysisResult, selectedAnalysis }) {
  if (!data2 || data2.length === 0 || analysisResult.length === 0) return null;
  // Grafik datası hazırlanıyor
  let chartData = [];
  if (["sma", "ema", "rsi"].includes(selectedAnalysis)) {
    const offset = data2.length - analysisResult.length;
    chartData = data2.map((bar, i) => ({
      date: new Date(bar.t).toLocaleDateString(),
      close: bar.c,
      value: i >= offset ? analysisResult[i - offset] : null
    }));
  } else if (selectedAnalysis === "macd") {
    const offset = data2.length - analysisResult.length;
    chartData = data2.map((bar, i) => ({
      date: new Date(bar.t).toLocaleDateString(),
      close: bar.c,
      macd: i >= offset ? analysisResult[i - offset].MACD : null,
      signal: i >= offset ? analysisResult[i - offset].signal : null,
      histogram: i >= offset ? analysisResult[i - offset].histogram : null
    }));
  } else if (selectedAnalysis === "bbands") {
    const offset = data2.length - analysisResult.length;
    chartData = data2.map((bar, i) => ({
      date: new Date(bar.t).toLocaleDateString(),
      close: bar.c,
      upper: i >= offset ? analysisResult[i - offset].upper : null,
      middle: i >= offset ? analysisResult[i - offset].middle : null,
      lower: i >= offset ? analysisResult[i - offset].lower : null
    }));
  }
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" minTickGap={20} />
        <YAxis domain={["auto", "auto"]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="close" stroke="#8884d8" dot={false} name="Kapanış" />
        {(["sma", "ema", "rsi"].includes(selectedAnalysis)) && (
          <Line type="monotone" dataKey="value" stroke="#82ca9d" dot={false} name={selectedAnalysis.toUpperCase()} />
        )}
        {selectedAnalysis === "macd" && (
          <>
            <Line type="monotone" dataKey="macd" stroke="#ff7300" dot={false} name="MACD" />
            <Line type="monotone" dataKey="signal" stroke="#387908" dot={false} name="Signal" />
            <Area type="monotone" dataKey="histogram" fill="#ffc658" stroke="#ffc658" name="Histogram" />
          </>
        )}
        {selectedAnalysis === "bbands" && (
          <>
            <Line type="monotone" dataKey="upper" stroke="#d62728" dot={false} name="Üst Band" />
            <Line type="monotone" dataKey="middle" stroke="#1f77b4" dot={false} name="Orta Band" />
            <Line type="monotone" dataKey="lower" stroke="#2ca02c" dot={false} name="Alt Band" />
          </>
        )}
      </LineChart>
    </ResponsiveContainer>
  );
} 