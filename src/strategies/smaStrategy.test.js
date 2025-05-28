import smaStrategy from "./smaStrategy";

describe("smaStrategy", () => {
  it("long/short pozisyonları doğru üretir", () => {
    const closes = [10, 12, 14, 16, 18, 20, 22];
    const sma = [11, 13, 15, 17, 19]; // offset=2
    // closes: 14>11=1, 16>13=1, 18>15=1, 20>17=1, 22>19=1
    expect(smaStrategy(closes, sma, false)).toEqual([0,0,1,1,1,1,1]);
    // short aktif
    expect(smaStrategy(closes, sma, true)).toEqual([0,0,1,1,1,1,1]); // çünkü hepsi üstte
    // short için bir örnek
    const closes2 = [20, 18, 16, 14, 12, 10, 8];
    const sma2 = [19, 17, 15, 13, 11];
    expect(smaStrategy(closes2, sma2, true)).toEqual([0,0,-1,-1,-1,-1,-1]);
  });
}); 