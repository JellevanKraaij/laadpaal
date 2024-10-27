import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useFormatter } from "next-intl";
import TocIcon from "@mui/icons-material/Toc";


export default function CardOverview(props: {card: {name: string, isValid: boolean, lastUsed: Date, totalWh: number, balance: number, kWhPrice: number}, detailsLink: string}) {
  const format = useFormatter();
  return (
    <>
      <Card sx={{ boxShadow: 4, minWidth: 200, maxWidth: 350 }}>
        <CardContent>
          <Typography variant="h5">{props.card.name}</Typography>
          <Typography sx={{ color: "text.secondary", mb: 2 }}>
            Card status: {props.card.isValid ? "valid" : "invalid"} 
            <br />
            Last used:{" "}
            {props.card.lastUsed
              ? format.relativeTime(props.card.lastUsed)
              : "never"}
          </Typography>
          <Typography variant="body1">
            Total usage: {(props.card.totalWh / 1000).toFixed(2)} kWh (€
            {((props.card.totalWh / 1000) * props.card.kWhPrice).toFixed(2)})
            <br />
            Card balance: {(props.card.balance / 1000).toFixed(2)} kWh (€
            {((props.card.balance / 1000) * props.card.kWhPrice).toFixed(2)})
            <br />
            Current price: €{props.card.kWhPrice}/kWh
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" startIcon={<TocIcon />} href={props.detailsLink}>Details</Button>
        </CardActions>
      </Card>
    </>
  );
}
