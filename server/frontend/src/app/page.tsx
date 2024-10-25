'use client'

import { Grid, Box } from "@mui/material";
import { cardType } from "./types";
import makeCardFront from "./UImodules/frontCard";
import { useEffect, useState } from "react";

export default function Home() {
  const url = "https://laadpaal.jellevankraaij.nl/api/cards";
  // const cards: cardType[] = await (await fetch(API_URL, {cache:'no-store'})).json();
  
  const [cards, fillCard] = useState<cardType[] | null>(null);

  useEffect(()=>
  {
    fetch(url).then((data)=>data.json().then((data)=>fillCard(data)));
  }, [url])

  const someArray: JSX.Element[] =[];
  
  if (!cards)
    return (<div>Loading...</div>)
  else
  {
    cards.forEach( (card: cardType) =>
    {
      someArray.push(makeCardFront(card));
    });
  }

  return (
    <Box display="flex" alignItems="center" style={{ marginTop: '50px' }}>
      <Grid container spacing={0} justifyContent="center" >
      {someArray}
      </Grid>
    </Box>
  );
}

// logs for debug:
// console.log('logging cards =', cards);
// someArray.forEach((card) =>
// {
//   console.log('html Object array=', card);
// })