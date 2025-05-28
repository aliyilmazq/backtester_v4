import React from "react";

function OhlcvTable({ data, loading, error, onDownloadCSV, ticker, startDate, endDate }) {
  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button onClick={onDownloadCSV} disabled={!data.length} style={{ padding: 6 }}>
          CSV İndir
        </button>
      </div>
      {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
      <table border="1" cellPadding="5" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th>Tarih</th>
            <th>Açılış</th>
            <th>Yüksek</th>
            <th>Düşük</th>
            <th>Kapanış</th>
            <th>Hacim</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={6} style={{ textAlign: "center" }}>Yükleniyor...</td></tr>
          ) : (
            data.map(bar => (
              <tr key={bar.t}>
                <td>{new Date(bar.t).toLocaleDateString()}</td>
                <td>{bar.o}</td>
                <td>{bar.h}</td>
                <td>{bar.l}</td>
                <td>{bar.c}</td>
                <td>{bar.v}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default OhlcvTable; 