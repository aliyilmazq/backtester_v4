import macdStrategy from "./macdStrategy";

describe("macdStrategy", () => {
  it("long/short pozisyonları doğru üretir", () => {
    const macd = [
      { MACD: 1, signal: 0 }, // long
      { MACD: -1, signal: 0 }, // short
      { MACD: 0.5, signal: 0.5 }, // flat
      { MACD: 2, signal: 1 }, // long
      { MACD: -2, signal: -1 }, // short
    ];
    expect(macdStrategy(macd, false)).toEqual([1,0,0,1,0]);
    expect(macdStrategy(macd, true)).toEqual([1,-1,0,1,-1]);
  });
}); 