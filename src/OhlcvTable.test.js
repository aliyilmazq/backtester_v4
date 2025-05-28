import { render, screen } from "@testing-library/react";
import OhlcvTable from "./OhlcvTable";

describe("OhlcvTable", () => {
  const sampleData = [
    { t: 1704067200000, o: 100, h: 110, l: 95, c: 105, v: 10000 },
    { t: 1704153600000, o: 106, h: 112, l: 104, c: 110, v: 12000 },
  ];

  it("tablo başlıklarını ve verileri doğru gösterir", () => {
    render(
      <OhlcvTable
        data={sampleData}
        loading={false}
        error={""}
        onDownloadCSV={() => {}}
        ticker="AAPL"
        startDate="2024-01-01"
        endDate="2024-01-02"
      />
    );
    expect(screen.getByText("Tarih")).toBeInTheDocument();
    expect(screen.getByText("Açılış")).toBeInTheDocument();
    expect(screen.getByText("Yüksek")).toBeInTheDocument();
    expect(screen.getByText("Düşük")).toBeInTheDocument();
    expect(screen.getByText("Kapanış")).toBeInTheDocument();
    expect(screen.getByText("Hacim")).toBeInTheDocument();
    expect(screen.getByText("105")).toBeInTheDocument();
    expect(screen.getAllByText("110").length).toBeGreaterThanOrEqual(1);
  });

  it("yükleniyor mesajı gösterir", () => {
    render(
      <OhlcvTable
        data={[]}
        loading={true}
        error={""}
        onDownloadCSV={() => {}}
        ticker="AAPL"
        startDate="2024-01-01"
        endDate="2024-01-02"
      />
    );
    expect(screen.getByText("Yükleniyor...")).toBeInTheDocument();
  });

  it("hata mesajı gösterir", () => {
    render(
      <OhlcvTable
        data={[]}
        loading={false}
        error={"Veri bulunamadı."}
        onDownloadCSV={() => {}}
        ticker="AAPL"
        startDate="2024-01-01"
        endDate="2024-01-02"
      />
    );
    expect(screen.getByText("Veri bulunamadı.")).toBeInTheDocument();
  });
}); 