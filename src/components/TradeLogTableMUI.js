import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  useMediaQuery
} from "@mui/material";
import PropTypes from "prop-types";

export default function TradeLogTableMUI({ trades }) {
  const isMobile = useMediaQuery('(max-width:600px)');
  if (!trades || trades.length === 0) return (
    <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2 }}>
      Kayıtlı işlem yok.
    </Typography>
  );
  return (
    <TableContainer component={Paper} sx={{ mt: 3, maxHeight: 440 }}>
      <Table stickyHeader size={isMobile ? "small" : "medium"}>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Yön</TableCell>
            <TableCell>Giriş Tarihi</TableCell>
            <TableCell>Giriş Fiyatı</TableCell>
            <TableCell>Çıkış Tarihi</TableCell>
            <TableCell>Çıkış Fiyatı</TableCell>
            <TableCell>Kar/Zarar (%)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {trades.map((tr, i) => (
            <TableRow key={i} hover>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{tr.side === 1 ? "Long" : "Short"}</TableCell>
              <TableCell>{tr.entryDate}</TableCell>
              <TableCell>{tr.entry.toFixed(2)}</TableCell>
              <TableCell>{tr.exitDate}</TableCell>
              <TableCell>{tr.exit.toFixed(2)}</TableCell>
              <TableCell sx={{ color: tr.pnl >= 0 ? 'green' : 'red', fontWeight: 600 }}>{tr.pnl.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

TradeLogTableMUI.propTypes = {
  trades: PropTypes.arrayOf(
    PropTypes.shape({
      side: PropTypes.number.isRequired,
      entryDate: PropTypes.string.isRequired,
      entry: PropTypes.number.isRequired,
      exitDate: PropTypes.string.isRequired,
      exit: PropTypes.number.isRequired,
      pnl: PropTypes.number.isRequired
    })
  )
}; 