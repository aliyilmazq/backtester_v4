import rsiStrategy from "./rsiStrategy";

describe("rsiStrategy", () => {
  it("long/short pozisyonları doğru üretir", () => {
    // 25: long, 75: short, 50: pozisyon yok
    const rsi = [25, 50, 75, 25, 75, 50];
    expect(rsiStrategy(rsi, false)).toEqual([1,1,0,1,0,0]);
    expect(rsiStrategy(rsi, true)).toEqual([1,1,-1,1,-1,-1]);
  });
}); 