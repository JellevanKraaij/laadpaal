import { Box, CardContent, Card, Grid, Grid2, Paper, Rating, Typography } from "@mui/material";
import Link from "next/link";

type cardType =
{
  "id": string,
  "cardHash": string,
  "name": string,
  "isValid": boolean,
  "totalWh": number,
  "lastUsed": string
};

export default function makeCardHtml(card: cardType)
{
    return (
      <div>
        <Card variant="outlined" style={{backgroundColor: "grey"}} sx={{maxWidth: 250, maxHeight: 250}}>
        <CardContent>
        <p>this is a card</p>
        <p> name: {card.name}</p>
        <br/>
        <Link href={`http://localhost:3001/details/${card.id}`}>LINKIE</Link>
        </CardContent>
      </Card>
      <br/>
      </div>
    )
}