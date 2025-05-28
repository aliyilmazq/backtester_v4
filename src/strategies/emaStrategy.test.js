import emaStrategy from "./emaStrategy";

describe("emaStrategy", () => {
  it("long/short pozisyonları doğru üretir", () => {
    const closes = [10, 12, 14, 16, 18, 20, 22];
    const ema = [11, 13, 15, 17, 19]; // offset=2
    expect(emaStrategy(closes, ema, false)).toEqual([0,0,1,1,1,1,1]);
    expect(emaStrategy(closes, ema, true)).toEqual([0,0,1,1,1,1,1]);
    const closes2 = [20, 18, 16, 14, 12, 10, 8];
    const ema2 = [19, 17, 15, 13, 11];
    expect(emaStrategy(closes2, ema2, true)).toEqual([0,0,-1,-1,-1,-1,-1]);
  });
}); 