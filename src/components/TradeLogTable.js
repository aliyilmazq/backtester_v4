import React from "react";

export default function TradeLogTable({ trades }) {
  if (!trades || trades.length === 0) return null;
  return (
    <table border="1" cellPadding="5" style={{ borderCollapse: "collapse", width: "100%", marginTop: 20 }}>
      <thead>
        <tr style={{ background: "#f0f0f0" }}>
          <th>#</th>
          <th>Yön</th>
          <th>Giriş Tarihi</th>
          <th>Giriş Fiyatı</th>
          <th>Çıkış Tarihi</th>
          <th>Çıkış Fiyatı</th>
          <th>Kar/Zarar (%)</th>
        </tr>
      </thead>
      <tbody>
        {trades.map((tr, i) => (
          <tr key={i}>
            <td>{i + 1}</td>
            <td>{tr.side === 1 ? "Long" : "Short"}</td>
            <td>{tr.entryDate}</td>
            <td>{tr.entry.toFixed(2)}</td>
            <td>{tr.exitDate}</td>
            <td>{tr.exit.toFixed(2)}</td>
            <td style={{ color: tr.pnl >= 0 ? 'green' : 'red' }}>{tr.pnl.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
} 