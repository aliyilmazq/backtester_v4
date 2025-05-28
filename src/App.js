import React, { useState, useMemo } from "react";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import './App.css';
import OhlcvTable from "./OhlcvTable";
import useOhlcvFetch from "./useOhlcvFetch";
import { SMA, EMA, RSI, MACD, BollingerBands } from "technicalindicators";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, Bar
} from "recharts";
import smaStrategy from "./strategies/smaStrategy";
import emaStrategy from "./strategies/emaStrategy";
import rsiStrategy from "./strategies/rsiStrategy";
import macdStrategy from "./strategies/macdStrategy";
import bbandsStrategy from "./strategies/bbandsStrategy";
import AnalysisTable from "./components/AnalysisTable";
import AnalysisChart from "./components/AnalysisChart";
import StrategyVsBuyHoldChart from "./components/StrategyVsBuyHoldChart";
import TradeLogTable from "./components/TradeLogTable";
import TradeLogTableMUI from "./components/TradeLogTableMUI";
import { Paper, Typography, Box, Button, TextField, Tabs, Tab, FormControlLabel, Checkbox, Select, MenuItem, InputLabel, Stack, Table, TableBody, TableCell, TableRow } from "@mui/material";
import AnalysisTableMUI from "./components/AnalysisTableMUI";
import AnalysisChartMUI from "./components/AnalysisChartMUI";
import StrategyVsBuyHoldChartMUI from "./components/StrategyVsBuyHoldChartMUI";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const ANALYSIS_OPTIONS = [
  { value: "sma", label: "SMA (Basit Hareketli Ortalama)" },
  { value: "ema", label: "EMA (Üssel Hareketli Ortalama)" },
  { value: "rsi", label: "RSI (Göreceli Güç Endeksi)" },
  { value: "macd", label: "MACD" },
  { value: "bbands", label: "Bollinger Bands" },
];

function App() {
  const [activeTab, setActiveTab] = useState(0);
  // 1. sekme input state
  const [ticker, setTicker] = useState("AAPL");
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-01-31");
  // 2. sekme input state
  const [ticker2, setTicker2] = useState("");
  const [startDate2, setStartDate2] = useState("");
  const [endDate2, setEndDate2] = useState("");
  const [selectedAnalysis, setSelectedAnalysis] = useState(ANALYSIS_OPTIONS[0].value);
  const [includeShort, setIncludeShort] = useState(false);
  const [trailingStopActive, setTrailingStopActive] = useState(false);
  const [trailingStopPercent, setTrailingStopPercent] = useState(2);
  const [aiFeedback, setAiFeedback] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  // 1. sekme veri çekme hook'u
  const { data, loading, error, success, fetchOhlcv } = useOhlcvFetch();
  // 2. sekme veri çekme hook'u
  const { data: data2, loading: loading2, error: error2, success: success2, fetchOhlcv: fetchOhlcv2 } = useOhlcvFetch();

  // Analiz parametreleri
  const [smaPeriod, setSmaPeriod] = useState(14);
  const [emaPeriod, setEmaPeriod] = useState(14);
  const [rsiPeriod, setRsiPeriod] = useState(14);
  const [macdFast, setMacdFast] = useState(12);
  const [macdSlow, setMacdSlow] = useState(26);
  const [macdSignal, setMacdSignal] = useState(9);
  const [bbandsPeriod, setBbandsPeriod] = useState(20);
  const [bbandsStd, setBbandsStd] = useState(2);

  const handleFetch1 = () => {
    fetchOhlcv(ticker, startDate, endDate);
  };
  const handleFetch2 = () => {
    fetchOhlcv2(ticker2, startDate2, endDate2);
  };

  // Teknik analiz hesaplama
  const analysisResult = useMemo(() => {
    if (!data2 || data2.length === 0) return [];
    const closes = data2.map(bar => bar.c);
    switch (selectedAnalysis) {
      case "sma":
        return SMA.calculate({ period: smaPeriod, values: closes });
      case "ema":
        return EMA.calculate({ period: emaPeriod, values: closes });
      case "rsi":
        return RSI.calculate({ period: rsiPeriod, values: closes });
      case "macd":
        return MACD.calculate({
          values: closes,
          fastPeriod: macdFast,
          slowPeriod: macdSlow,
          signalPeriod: macdSignal,
          SimpleMAOscillator: false,
          SimpleMASignal: false
        });
      case "bbands":
        return BollingerBands.calculate({
          period: bbandsPeriod,
          values: closes,
          stdDev: bbandsStd
        });
      default:
        return [];
    }
  }, [data2, selectedAnalysis, smaPeriod, emaPeriod, rsiPeriod, macdFast, macdSlow, macdSignal, bbandsPeriod, bbandsStd]);

  // Grafik için veri hizalama
  const chartData = useMemo(() => {
    if (!data2 || data2.length === 0) return [];
    const base = data2.map(bar => ({
      date: new Date(bar.t).toLocaleDateString(),
      close: bar.c
    }));
    const offset = data2.length - analysisResult.length;
    if (["sma", "ema", "rsi"].includes(selectedAnalysis)) {
      return base.map((row, i) => ({
        ...row,
        value: i >= offset ? Number(analysisResult[i - offset]) : null
      }));
    } else if (selectedAnalysis === "macd") {
      return base.map((row, i) => ({
        ...row,
        macd: i >= offset ? Number(analysisResult[i - offset]?.MACD) : null,
        signal: i >= offset ? Number(analysisResult[i - offset]?.signal) : null,
        histogram: i >= offset ? Number(analysisResult[i - offset]?.histogram) : null
      }));
    } else if (selectedAnalysis === "bbands") {
      return base.map((row, i) => ({
        ...row,
        upper: i >= offset ? Number(analysisResult[i - offset]?.upper) : null,
        middle: i >= offset ? Number(analysisResult[i - offset]?.middle) : null,
        lower: i >= offset ? Number(analysisResult[i - offset]?.lower) : null
      }));
    }
    return base;
  }, [data2, analysisResult, selectedAnalysis]);

  const downloadCSV = () => {
    if (!data.length) return;
    const csv = Papa.unparse(
      data.map(bar => ({
        Date: new Date(bar.t).toISOString().slice(0, 10),
        Open: bar.o,
        High: bar.h,
        Low: bar.l,
        Close: bar.c,
        Volume: bar.v,
      }))
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${ticker}_ohlcv_${startDate}_${endDate}.csv`);
  };

  // Strateji getirisi ve buy&hold getirisi hesaplama
  const { strategyReturn, buyHoldReturn, tradeCount, daysInMarket, avgTradeDuration, avgTradeReturn, maxDrawdown, sharpe, sortino, avgTradesPerMonth, equityCurve, buyHoldCurve, tradeLog } = useMemo(() => {
    if (!data2 || data2.length === 0 || analysisResult.length === 0) return {
      strategyReturn: null, buyHoldReturn: null, tradeCount: null, daysInMarket: null, avgTradeDuration: null, avgTradeReturn: null, maxDrawdown: null, sharpe: null, sortino: null, avgTradesPerMonth: null, equityCurve: [], buyHoldCurve: [], tradeLog: []
    };
    const closes = data2.map(bar => bar.c);
    let positions = Array(data2.length).fill(0);
    if (selectedAnalysis === "sma") {
      positions = smaStrategy(closes, analysisResult, includeShort);
    } else if (selectedAnalysis === "ema") {
      positions = emaStrategy(closes, analysisResult, includeShort);
    } else if (selectedAnalysis === "rsi") {
      positions = rsiStrategy(analysisResult, includeShort);
    } else if (selectedAnalysis === "macd") {
      positions = macdStrategy(analysisResult, includeShort);
    } else if (selectedAnalysis === "bbands") {
      positions = bbandsStrategy(closes, analysisResult, includeShort);
    }
    let equity = 1;
    let lastEntry = null;
    let lastSide = 0;
    let tradeCount = 0;
    let daysInMarket = 0;
    let tradeDurations = [];
    let tradeReturns = [];
    let currentTradeStart = null;
    let equityCurve = [1];
    let tradeLog = [];
    let trailingHigh = null;
    let trailingLow = null;
    for (let i = 1; i < data2.length; i++) {
      let closePos = false;
      if (trailingStopActive && positions[i - 1] !== 0 && lastEntry !== null && lastSide !== 0) {
        if (lastSide === 1) {
          trailingHigh = trailingHigh === null ? closes[i - 1] : Math.max(trailingHigh, closes[i]);
          if (closes[i] <= trailingHigh * (1 - trailingStopPercent / 100)) {
            closePos = true;
          }
        } else if (lastSide === -1) {
          trailingLow = trailingLow === null ? closes[i - 1] : Math.min(trailingLow, closes[i]);
          if (closes[i] >= trailingLow * (1 + trailingStopPercent / 100)) {
            closePos = true;
          }
        }
      }
      if (positions[i - 1] !== positions[i] || closePos) {
        if (positions[i - 1] !== 0 && lastEntry !== null && lastSide !== 0) {
          let entryIdx = currentTradeStart;
          let exitIdx = i;
          let entryDate = new Date(data2[entryIdx].t).toLocaleDateString();
          let exitDate = new Date(data2[exitIdx].t).toLocaleDateString();
          let entry = lastEntry;
          let exit = closes[i];
          let side = lastSide;
          let pnl = side === 1 ? ((exit / entry - 1) * 100) : ((entry / exit - 1) * 100);
          tradeLog.push({ entryDate, entry, exitDate, exit, side, pnl });
          if (side === 1) {
            equity *= exit / entry;
            tradeReturns.push((exit / entry - 1) * 100);
          } else if (side === -1) {
            equity *= entry / exit;
            tradeReturns.push((entry / exit - 1) * 100);
          }
          tradeCount++;
          daysInMarket += i - currentTradeStart;
          tradeDurations.push(i - currentTradeStart);
          lastEntry = null;
          lastSide = 0;
          currentTradeStart = null;
          trailingHigh = null;
          trailingLow = null;
        }
        if (!closePos && positions[i] !== 0) {
          lastEntry = closes[i];
          lastSide = positions[i];
          currentTradeStart = i;
          trailingHigh = lastSide === 1 ? closes[i] : null;
          trailingLow = lastSide === -1 ? closes[i] : null;
        }
      } else {
        if (positions[i] === 1 && lastEntry !== null && lastSide === 1) {
          trailingHigh = trailingHigh === null ? closes[i] : Math.max(trailingHigh, closes[i]);
          equityCurve.push(equity * closes[i] / lastEntry);
        } else if (positions[i] === -1 && lastEntry !== null && lastSide === -1) {
          trailingLow = trailingLow === null ? closes[i] : Math.min(trailingLow, closes[i]);
          equityCurve.push(equity * lastEntry / closes[i]);
        } else {
          equityCurve.push(equity);
        }
        continue;
      }
      equityCurve.push(equity);
    }
    if (positions[data2.length - 1] !== 0 && lastEntry !== null && lastSide !== 0) {
      let entryIdx = currentTradeStart;
      let exitIdx = data2.length - 1;
      let entryDate = new Date(data2[entryIdx].t).toLocaleDateString();
      let exitDate = new Date(data2[exitIdx].t).toLocaleDateString();
      let entry = lastEntry;
      let exit = closes[data2.length - 1];
      let side = lastSide;
      let pnl = side === 1 ? ((exit / entry - 1) * 100) : ((entry / exit - 1) * 100);
      tradeLog.push({ entryDate, entry, exitDate, exit, side, pnl });
      if (side === 1) {
        equity *= exit / entry;
        tradeReturns.push((exit / entry - 1) * 100);
      } else if (side === -1) {
        equity *= entry / exit;
        tradeReturns.push((entry / exit - 1) * 100);
      }
      tradeCount++;
      daysInMarket += data2.length - currentTradeStart;
      tradeDurations.push(data2.length - currentTradeStart);
      equityCurve[equityCurve.length - 1] = equity;
    }
    let buyHoldCurve = [1];
    for (let i = 1; i < closes.length; i++) {
      buyHoldCurve.push(closes[i] / closes[0]);
    }
    const strategyReturn = (equity - 1) * 100;
    const buyHoldReturn = ((closes[closes.length - 1] / closes[0]) - 1) * 100;
    const avgTradeDuration = tradeDurations.length ? (tradeDurations.reduce((a, b) => a + b, 0) / tradeDurations.length) : null;
    const avgTradeReturn = tradeReturns.length ? (tradeReturns.reduce((a, b) => a + b, 0) / tradeReturns.length) : null;
    let peak = equityCurve[0];
    let maxDrawdown = 0;
    for (let v of equityCurve) {
      if (v > peak) peak = v;
      const dd = (peak - v) / peak;
      if (dd > maxDrawdown) maxDrawdown = dd;
    }
    let dailyReturns = [];
    for (let i = 1; i < equityCurve.length; i++) {
      dailyReturns.push(Math.log(equityCurve[i] / equityCurve[i - 1]));
    }
    const mean = dailyReturns.length ? dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length : 0;
    const std = dailyReturns.length ? Math.sqrt(dailyReturns.reduce((a, b) => a + (b - mean) ** 2, 0) / dailyReturns.length) : 0;
    const downsideStd = dailyReturns.length ? Math.sqrt(dailyReturns.filter(r => r < 0).reduce((a, b) => a + (b - mean) ** 2, 0) / dailyReturns.length) : 0;
    const sharpe = std !== 0 ? (mean / std) * Math.sqrt(252) : null;
    const sortino = downsideStd !== 0 ? (mean / downsideStd) * Math.sqrt(252) : null;
    const months = (data2.length > 1)
      ? ((new Date(data2[data2.length - 1].t) - new Date(data2[0].t)) / (1000 * 60 * 60 * 24 * 30.44))
      : 1;
    const avgTradesPerMonth = tradeCount && months > 0 ? (tradeCount / months) : null;
    return { strategyReturn, buyHoldReturn, tradeCount, daysInMarket, avgTradeDuration, avgTradeReturn, maxDrawdown, sharpe, sortino, avgTradesPerMonth, equityCurve, buyHoldCurve, tradeLog };
  }, [data2, analysisResult, selectedAnalysis, includeShort, trailingStopActive, trailingStopPercent]);

  async function fetchAIFeedback(metrics) {
    setAiLoading(true);
    setAiError("");
    try {
      const res = await fetch("http://localhost:5001/api/ai-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metrics }),
      });
      const data = await res.json();
      if (data.feedback) setAiFeedback(data.feedback);
      else setAiError("AI'dan yanıt alınamadı.");
    } catch (err) {
      setAiError("AI servisine bağlanılamadı.");
    } finally {
      setAiLoading(false);
    }
  }

  // AI feedback'i metrikler değiştiğinde otomatik çek
  React.useEffect(() => {
    if (activeTab === 1 && strategyReturn !== null && buyHoldReturn !== null) {
      fetchAIFeedback({
        strategyReturn,
        buyHoldReturn,
        sharpe,
        maxDrawdown,
        tradeCount,
        avgTradeReturn,
        avgTradesPerMonth,
        daysInMarket,
        avgTradeDuration,
      });
    }
    // eslint-disable-next-line
  }, [activeTab, strategyReturn, buyHoldReturn, sharpe, maxDrawdown, tradeCount, avgTradeReturn, avgTradesPerMonth, daysInMarket, avgTradeDuration]);

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        p: { xs: 2, md: 4 },
        bgcolor: "#e0d4c4",
        minHeight: "100vh"
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <img src="/logo-citalf.svg" alt="Citalf Logo" style={{ height: 48, marginRight: 16 }} />
      </Box>
      {/* Sekme başlıkları */}
      <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 3 }}>
        <Tab label="OHLCV Verisi" />
        <Tab label="Backtest" />
      </Tabs>
      {/* Sekme içerikleri */}
      {activeTab === 0 && (
        <Box>
          <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <TextField label="Sembol" value={ticker} onChange={e => setTicker(e.target.value.toUpperCase())} size="small" />
            <TextField label="Başlangıç Tarihi" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} size="small" InputLabelProps={{ shrink: true }} />
            <TextField label="Bitiş Tarihi" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} size="small" InputLabelProps={{ shrink: true }} />
            <Button variant="contained" onClick={handleFetch1} disabled={loading} sx={{ minWidth: 120 }}>
              {loading ? "Yükleniyor..." : "Veri Getir"}
            </Button>
          </Box>
          <Paper sx={{ p: 2, mt: 3 }} elevation={3}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              OHLCV Tablosu
            </Typography>
            <OhlcvTable
              data={data}
              loading={loading}
              error={error}
              onDownloadCSV={downloadCSV}
              ticker={ticker}
              startDate={startDate}
              endDate={endDate}
            />
          </Paper>
        </Box>
      )}
      {activeTab === 1 && (
        <Box>
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 2 }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems="center"
              justifyContent="flex-start"
              flexWrap="wrap"
              useFlexGap
            >
              <TextField label="Sembol" value={ticker2} onChange={e => setTicker2(e.target.value.toUpperCase())} size="small" />
              <TextField label="Başlangıç Tarihi" type="date" value={startDate2} onChange={e => setStartDate2(e.target.value)} size="small" InputLabelProps={{ shrink: true }} />
              <TextField label="Bitiş Tarihi" type="date" value={endDate2} onChange={e => setEndDate2(e.target.value)} size="small" InputLabelProps={{ shrink: true }} />
              <Button variant="contained" onClick={handleFetch2} disabled={loading2} sx={{ minWidth: 120 }}>
                {loading2 ? "Yükleniyor..." : "Veri Getir"}
              </Button>
              <FormControlLabel
                control={<Checkbox checked={includeShort} onChange={e => setIncludeShort(e.target.checked)} />}
                label="Short işlemleri dahil et"
                sx={{ ml: 1 }}
              />
              <FormControlLabel
                control={<Checkbox checked={trailingStopActive} onChange={e => setTrailingStopActive(e.target.checked)} />}
                label="Trailing Stop Aktif"
                sx={{ ml: 1 }}
              />
              {trailingStopActive && (
                <TextField
                  label="Stop %"
                  type="number"
                  min={0.1}
                  max={20}
                  step={0.1}
                  value={trailingStopPercent}
                  onChange={e => setTrailingStopPercent(Number(e.target.value))}
                  size="small"
                  sx={{ width: 100 }}
                />
              )}
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  select
                  label="Analiz"
                  value={selectedAnalysis}
                  onChange={e => setSelectedAnalysis(e.target.value)}
                  size="small"
                  sx={{ minWidth: 180 }}
                >
                  {ANALYSIS_OPTIONS.map(opt => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </TextField>
                {selectedAnalysis === "sma" && (
                  <TextField label="SMA Periyot" type="number" min={2} max={100} value={smaPeriod} onChange={e => setSmaPeriod(Number(e.target.value))} size="small" sx={{ width: 100 }} />
                )}
                {selectedAnalysis === "ema" && (
                  <TextField label="EMA Periyot" type="number" min={2} max={100} value={emaPeriod} onChange={e => setEmaPeriod(Number(e.target.value))} size="small" sx={{ width: 100 }} />
                )}
                {selectedAnalysis === "rsi" && (
                  <TextField label="RSI Periyot" type="number" min={2} max={100} value={rsiPeriod} onChange={e => setRsiPeriod(Number(e.target.value))} size="small" sx={{ width: 100 }} />
                )}
                {selectedAnalysis === "macd" && (
                  <>
                    <TextField label="Fast" type="number" min={2} max={50} value={macdFast} onChange={e => setMacdFast(Number(e.target.value))} size="small" sx={{ width: 80 }} />
                    <TextField label="Slow" type="number" min={2} max={100} value={macdSlow} onChange={e => setMacdSlow(Number(e.target.value))} size="small" sx={{ width: 80 }} />
                    <TextField label="Signal" type="number" min={2} max={50} value={macdSignal} onChange={e => setMacdSignal(Number(e.target.value))} size="small" sx={{ width: 80 }} />
                  </>
                )}
                {selectedAnalysis === "bbands" && (
                  <>
                    <TextField label="Periyot" type="number" min={2} max={100} value={bbandsPeriod} onChange={e => setBbandsPeriod(Number(e.target.value))} size="small" sx={{ width: 100 }} />
                    <TextField label="StdDev" type="number" min={1} max={5} step={0.1} value={bbandsStd} onChange={e => setBbandsStd(Number(e.target.value))} size="small" sx={{ width: 100 }} />
                  </>
                )}
              </Stack>
            </Stack>
          </Paper>
          {success2 && <Typography color="success.main" mb={2}>Veri başarıyla çekildi!</Typography>}
          {error2 && <Typography color="error.main" mb={2}>{error2}</Typography>}
          {(strategyReturn !== null && buyHoldReturn !== null) && (
            <Paper sx={{ p: 3, mt: 3, borderRadius: 3, boxShadow: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Strateji Performans Özeti
              </Typography>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell><TrendingUpIcon color="primary" sx={{ mr: 1 }} /> Strateji Getirisi</TableCell>
                    <TableCell>{strategyReturn.toFixed(2)}%</TableCell>
                    <TableCell><TrendingUpIcon color="warning" sx={{ mr: 1 }} /> Al & Tut Getirisi</TableCell>
                    <TableCell>{buyHoldReturn.toFixed(2)}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><ListAltIcon color="action" sx={{ mr: 1 }} /> İşlem Sayısı</TableCell>
                    <TableCell>{tradeCount}</TableCell>
                    <TableCell><CalendarMonthIcon color="action" sx={{ mr: 1 }} /> Aylık Ortalama İşlem</TableCell>
                    <TableCell>{avgTradesPerMonth ? avgTradesPerMonth.toFixed(2) : '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><ShowChartIcon color="success" sx={{ mr: 1 }} /> Ortalama İşlem Getirisi</TableCell>
                    <TableCell>{avgTradeReturn ? avgTradeReturn.toFixed(2) : '-'}</TableCell>
                    <TableCell><ArrowDownwardIcon color="error" sx={{ mr: 1 }} /> Maksimum Drawdown</TableCell>
                    <TableCell>{maxDrawdown !== null ? (maxDrawdown * 100).toFixed(2) : '-'}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><ShowChartIcon color="primary" sx={{ mr: 1 }} /> Sharpe Oranı</TableCell>
                    <TableCell>{sharpe !== null ? sharpe.toFixed(2) : '-'}</TableCell>
                    <TableCell><ShowChartIcon color="secondary" sx={{ mr: 1 }} /> Sortino Oranı</TableCell>
                    <TableCell>{sortino !== null ? sortino.toFixed(2) : '-'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Bu metrikler seçili stratejiye göre hesaplanmıştır.
              </Typography>
            </Paper>
          )}
          <Paper sx={{ p: 2, mt: 3 }} elevation={3}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Strateji vs Al & Tut Getiri Grafiği
            </Typography>
            <StrategyVsBuyHoldChartMUI data2={data2} equityCurve={equityCurve} buyHoldCurve={buyHoldCurve} />
          </Paper>
          <AnalysisChartMUI data2={data2} analysisResult={analysisResult} selectedAnalysis={selectedAnalysis} />
          <Paper sx={{ p: 2, mt: 3 }} elevation={3}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              İşlem Geçmişi
            </Typography>
            <TradeLogTableMUI trades={tradeLog} />
          </Paper>
        </Box>
      )}
    </Box>
  );
}

export default App;
