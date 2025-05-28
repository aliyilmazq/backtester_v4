import bbandsStrategy from "./bbandsStrategy";

describe("bbandsStrategy", () => {
  it("long/short pozisyonları doğru üretir", () => {
    const closes = [10, 12, 8, 15, 20, 5, 25];
    const bbands = [
      { upper: 14, middle: 12, lower: 9 },
      { upper: 15, middle: 13, lower: 10 },
      { upper: 16, middle: 14, lower: 11 },
      { upper: 17, middle: 15, lower: 12 },
      { upper: 18, middle: 16, lower: 13 },
    ]; // offset=2
    // closes[2]=8<11=long, closes[3]=15>12, closes[4]=20>18=short, closes[5]=5<13=long, closes[6]=25>18=short
    expect(bbandsStrategy(closes, bbands, false)).toEqual([0,0,1,1,0,1,0]);
    expect(bbandsStrategy(closes, bbands, true)).toEqual([0,0,1,1,-1,1,-1]);
  });
}); 