import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export default function TotalCard(props: {
  totals: {
    chargeWh: number;
    totalWh: number;
    idleWh: number;
    compareWh: number;
  };
}) {
  return (
    <Card sx={{ boxShadow: 4, width: 450 }}>
      <CardContent>
        <Typography variant="h5" component="div" sx={{ mb: 1 }}>
          Totals
        </Typography>
        <Typography variant="body1">
          Charged: {(props.totals.chargeWh / 1000).toFixed(2)} kWh
        </Typography>
        <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
          (consumed while charging a car, paid for)
        </Typography>
        <Typography variant="body1">
          Idle: {(props.totals.idleWh / 1000).toFixed(2)} kWh
        </Typography>
        <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
          (consumed while waiting for a car, not paid for)
        </Typography>
        <Typography variant="body1">
          Total: {(props.totals.totalWh / 1000).toFixed(2)} kWh
        </Typography>
        <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
          (total consumed, paid and unpaid)
        </Typography>
        <Typography variant="body1">
          Compare: {(props.totals.compareWh / 1000).toFixed(2)} kWh
        </Typography>
        <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
          (estimated total of physical kWh meter, used for comparison)
        </Typography>
      </CardContent>
    </Card>
  );
}
