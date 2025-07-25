// App.js için test geçici olarak kaldırıldı. Sadece OhlcvTable testleri çalışacak.

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";

import App from "./App";

// axios'u mock'la
jest.mock("axios", () => ({
  get: jest.fn()
}));

describe("App", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("başlığı ve inputları render eder", () => {
    render(<App />);
    expect(screen.getByText(/ABD Hisse Senedi Tarihsel OHLCV Verisi/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Sembol/i)).toBeInTheDocument();
    expect(screen.getAllByRole("button").length).toBeGreaterThanOrEqual(1);
  });

  it("kullanıcı inputlarını günceller", () => {
    render(<App />);
    const symbolInput = screen.getByPlaceholderText(/Sembol/i);
    fireEvent.change(symbolInput, { target: { value: "MSFT" } });
    expect(symbolInput.value).toBe("MSFT");
  });

  it("veri getirip tabloyu günceller", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        results: [
          { t: 1704067200000, o: 100, h: 110, l: 95, c: 105, v: 10000 }
        ]
      }
    });
    render(<App />);
    fireEvent.click(screen.getByText(/Veri Getir/i));
    await waitFor(() => expect(screen.getByText("105")).toBeInTheDocument());
    expect(screen.getByText("110")).toBeInTheDocument();
  });

  it("veri yoksa hata mesajı gösterir", async () => {
    axios.get.mockResolvedValueOnce({ data: {} });
    render(<App />);
    fireEvent.click(screen.getByText(/Veri Getir/i));
    await waitFor(() => expect(screen.getByText(/Veri bulunamadı/i)).toBeInTheDocument());
  });

  it("API hatasında hata mesajı gösterir", async () => {
    axios.get.mockRejectedValueOnce(new Error("API error"));
    render(<App />);
    fireEvent.click(screen.getByText(/Veri Getir/i));
    await waitFor(() => expect(screen.getByText(/Veri alınamadı/i)).toBeInTheDocument());
  });
});
