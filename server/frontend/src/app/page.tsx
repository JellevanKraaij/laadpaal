import { Grid, Box } from "@mui/material";
import { cardType } from "./types";
import makeCardFront from "./UImodules/frontCard";

export default async function Home() {
  const url = "https://laadpaal.jellevankraaij.nl/api/cards";
  const cards: cardType[] = await (await fetch(url, {cache:'no-store'})).json();
  const someArray: JSX.Element[] =[];

  cards.forEach((card: cardType) =>
  {
    someArray.push(makeCardFront(card));
  });

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