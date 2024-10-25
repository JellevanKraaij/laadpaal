import {Box, CardActions, CardContent, Card, CardMedia, Typography, Button } from "@mui/material";
import { cardType } from "../types";
import Link from "next/link";

function readableDate(date: string)
{
  const ymd = date.split('T')[0];
  const time = date.split('T')[1].substring(0,5);
  // return (ymd + ' ' + time);
  return ([time, ymd]);
}

export default function makeCardFront(card: cardType): JSX.Element
{
  return (
    <Box sx={{ m: '2rem', width:1/4, height:1/4}}>
    <Card style={{backgroundColor: "teal"}}>
      <CardMedia
        sx={{ height: 125, width:1}}
        image={card.imageUrl}
      />
      <CardContent >
        <Typography gutterBottom variant="h6" component="div" sx={{ color: 'white'}}>
         <small><b>cardname </b> </small> <br/>{card.name}<br/>
         <small><b>total WH </b> </small> <br/> {card.totalWh}<br/>
         <small><b>last used </b> </small> <br/>
         {readableDate(card.lastUsed)[0]}<br/>{readableDate(card.lastUsed)[1]}
        </Typography>
      </CardContent>
      <CardActions>
        <Button style={{ backgroundColor: 'green', color: 'white' }} variant="contained" size="small">
          <Link href={`http://localhost:8002/details/${card.id}`}><b>Details</b></Link>
        </Button>
      </CardActions>
    </Card>
    </Box>
  );
}