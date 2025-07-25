import { useTheme, Paper, Typography } from "@mui/material";
import PropTypes from "prop-types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area
} from "recharts";

export default function AnalysisChartMUI({ data2, analysisResult, selectedAnalysis }) {
  const theme = useTheme();
  if (!data2 || data2.length === 0 || analysisResult.length === 0) return null;
  let chartData = [];
  if (["sma", "ema", "rsi"].includes(selectedAnalysis)) {
    const offset = data2.length - analysisResult.length;
    chartData = data2.map((bar, i) => ({
      date: new Date(bar.t).toLocaleDateString(),
      close: bar.c,
      value: i >= offset ? analysisResult[i - offset] : null
    }));
  } else if (selectedAnalysis === "macd") {
    const offset = data2.length - analysisResult.length;
    chartData = data2.map((bar, i) => ({
      date: new Date(bar.t).toLocaleDateString(),
      close: bar.c,
      macd: i >= offset ? analysisResult[i - offset].MACD : null,
      signal: i >= offset ? analysisResult[i - offset].signal : null,
      histogram: i >= offset ? analysisResult[i - offset].histogram : null
    }));
  } else if (selectedAnalysis === "bbands") {
    const offset = data2.length - analysisResult.length;
    chartData = data2.map((bar, i) => ({
      date: new Date(bar.t).toLocaleDateString(),
      close: bar.c,
      upper: i >= offset ? analysisResult[i - offset].upper : null,
      middle: i >= offset ? analysisResult[i - offset].middle : null,
      lower: i >= offset ? analysisResult[i - offset].lower : null
    }));
  }
  return (
    <Paper sx={{ p: 2, mt: 3 }} elevation={3}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Teknik Analiz Grafiği
      </Typography>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis dataKey="date" minTickGap={20} tick={{ fill: theme.palette.text.primary }} />
          <YAxis domain={["auto", "auto"]} tick={{ fill: theme.palette.text.primary }} />
          <Tooltip contentStyle={{ background: theme.palette.background.paper, color: theme.palette.text.primary }} />
          <Legend />
          <Line type="monotone" dataKey="close" stroke={theme.palette.primary.main} dot={false} name="Kapanış" />
          {["sma", "ema", "rsi"].includes(selectedAnalysis) && (
            <Line type="monotone" dataKey="value" stroke={theme.palette.success.main} dot={false} name={selectedAnalysis.toUpperCase()} />
          )}
          {selectedAnalysis === "macd" && (
            <>
              <Line type="monotone" dataKey="macd" stroke={theme.palette.warning.main} dot={false} name="MACD" />
              <Line type="monotone" dataKey="signal" stroke={theme.palette.secondary.main} dot={false} name="Signal" />
              <Area type="monotone" dataKey="histogram" fill={theme.palette.info.light} stroke={theme.palette.info.main} name="Histogram" />
            </>
          )}
          {selectedAnalysis === "bbands" && (
            <>
              <Line type="monotone" dataKey="upper" stroke={theme.palette.error.main} dot={false} name="Üst Band" />
              <Line type="monotone" dataKey="middle" stroke={theme.palette.info.main} dot={false} name="Orta Band" />
              <Line type="monotone" dataKey="lower" stroke={theme.palette.success.main} dot={false} name="Alt Band" />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}

AnalysisChartMUI.propTypes = {
  data2: PropTypes.array.isRequired,
  analysisResult: PropTypes.array.isRequired,
  selectedAnalysis: PropTypes.string.isRequired
}; 