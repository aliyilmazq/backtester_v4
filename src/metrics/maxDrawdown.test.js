import maxDrawdown from "./maxDrawdown";

describe("maxDrawdown", () => {
  it("maksimum drawdown'u doğru hesaplar", () => {
    const equity = [1, 1.2, 1.1, 1.5, 1.2, 1.8, 1.3, 2];
    // En yüksekten (1.8) en düşüğe (1.3) %27.77 drawdown
    expect(maxDrawdown(equity)).toBeCloseTo((1.8-1.3)/1.8, 4);
  });
  it("hiç drawdown yoksa 0 döner", () => {
    expect(maxDrawdown([1, 1.1, 1.2, 1.3])).toBe(0);
  });
}); 