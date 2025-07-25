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
  ResponsiveContainer
} from "recharts";

export default function StrategyVsBuyHoldChartMUI({ data2, equityCurve, buyHoldCurve }) {
  const theme = useTheme();
  if (!data2 || data2.length === 0 || !equityCurve || equityCurve.length === 0 || !buyHoldCurve || buyHoldCurve.length === 0) return null;
  const chartData = data2.map((bar, i) => ({
    date: new Date(bar.t).toLocaleDateString(),
    strategy: equityCurve[i],
    buyhold: buyHoldCurve[i]
  }));
  return (
    <Paper sx={{ p: 2, mt: 3 }} elevation={3}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Strateji vs Al & Tut Getiri Grafiği
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis dataKey="date" minTickGap={20} tick={{ fill: theme.palette.text.primary }} />
          <YAxis domain={["auto", "auto"]} tick={{ fill: theme.palette.text.primary }} />
          <Tooltip contentStyle={{ background: theme.palette.background.paper, color: theme.palette.text.primary }} />
          <Legend />
          <Line type="monotone" dataKey="strategy" stroke={theme.palette.primary.main} dot={false} name="Strateji Getirisi" />
          <Line type="monotone" dataKey="buyhold" stroke={theme.palette.warning.main} dot={false} name="Al & Tut Getirisi" />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}

StrategyVsBuyHoldChartMUI.propTypes = {
  data2: PropTypes.array.isRequired,
  equityCurve: PropTypes.array.isRequired,
  buyHoldCurve: PropTypes.array.isRequired
}; 