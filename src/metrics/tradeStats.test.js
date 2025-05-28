import tradeStats from "./tradeStats";

describe("tradeStats", () => {
  it("işlem metriklerini doğru hesaplar", () => {
    const trades = [
      { duration: 5, return: 2 },
      { duration: 3, return: -1 },
      { duration: 2, return: 0.5 }
    ];
    const data2 = [
      { t: 1704067200000 },
      { t: 1704153600000 },
      { t: 1704240000000 },
      { t: 1704326400000 },
      { t: 1704412800000 },
      { t: 1704499200000 },
      { t: 1704585600000 },
      { t: 1704672000000 },
      { t: 1704758400000 },
      { t: 1704844800000 }
    ];
    const res = tradeStats(trades, data2);
    expect(res.tradeCount).toBe(3);
    expect(res.avgTradeDuration).toBeCloseTo((5+3+2)/3, 4);
    expect(res.avgTradeReturn).toBeCloseTo((2-1+0.5)/3, 4);
    expect(res.daysInMarket).toBe(10);
    expect(res.avgTradesPerMonth).toBeGreaterThan(0);
  });
  it("işlem yoksa null/0 döner", () => {
    const res = tradeStats([], []);
    expect(res.tradeCount).toBe(0);
    expect(res.avgTradeDuration).toBeNull();
    expect(res.avgTradeReturn).toBeNull();
    expect(res.daysInMarket).toBe(0);
    expect(res.avgTradesPerMonth).toBeNull();
  });
}); 