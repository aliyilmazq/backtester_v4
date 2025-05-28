import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function StrategyVsBuyHoldChart({ data2, equityCurve, buyHoldCurve }) {
  if (!data2 || data2.length === 0 || !equityCurve || equityCurve.length === 0 || !buyHoldCurve || buyHoldCurve.length === 0) return null;
  const chartData = data2.map((bar, i) => ({
    date: new Date(bar.t).toLocaleDateString(),
    strategy: equityCurve[i],
    buyhold: buyHoldCurve[i]
  }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" minTickGap={20} />
        <YAxis domain={["auto", "auto"]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="strategy" stroke="#1976d2" dot={false} name="Strateji Getirisi" />
        <Line type="monotone" dataKey="buyhold" stroke="#ff9800" dot={false} name="Al & Tut Getirisi" />
      </LineChart>
    </ResponsiveContainer>
  );
} 