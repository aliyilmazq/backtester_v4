import { render, screen } from "@testing-library/react";
import AnalysisTable from "./AnalysisTable";

describe("AnalysisTable", () => {
  const data2 = [
    { t: 1704067200000, c: 105 },
    { t: 1704153600000, c: 110 },
    { t: 1704240000000, c: 120 }
  ];
  const analysisResult = [null, 107.5, 115];

  it("SMA başlıklarını ve verilerini doğru gösterir", () => {
    render(
      <AnalysisTable data2={data2} analysisResult={analysisResult.slice(1)} selectedAnalysis="sma" />
    );
    expect(screen.getByText("Tarih")).toBeInTheDocument();
    expect(screen.getByText("Kapanış")).toBeInTheDocument();
    expect(screen.getByText("SMA")).toBeInTheDocument();
    expect(screen.getByText("105")).toBeInTheDocument();
    expect(screen.getByText("110")).toBeInTheDocument();
    expect(screen.getByText("120")).toBeInTheDocument();
    expect(screen.getByText("107.50")).toBeInTheDocument();
    expect(screen.getByText("115.00")).toBeInTheDocument();
  });

  it("veri yoksa tabloyu render etmez", () => {
    const { container } = render(
      <AnalysisTable data2={[]} analysisResult={[]} selectedAnalysis="sma" />
    );
    expect(container.querySelector("table")).toBeNull();
  });
}); 