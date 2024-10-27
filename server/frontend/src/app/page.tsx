import CardOverview from "@/components/cardOverview";
import { Divider, Grid2 } from "@mui/material";
import Typography from "@mui/material/Typography";

// Cache the page for 10 seconds, and revalidate every 10  seconds if the page is requested
export const revalidate = 10;

export default async function Home() {
  const data = await fetch("https://laadpaal.jellevankraaij.nl/api/cards");
  const cards: {
    id: string;
    name: string;
    isValid: boolean;
    lastUsed: Date;
    totalWh: number;
    balance: number;
    kWhPrice: number;
  }[] = await data.json();
  return (
    <>
      <Typography variant="h3"><strong>Overview</strong></Typography>
      <Divider flexItem />
      <br />
      <Grid2 container spacing={3} sx={{ m: 0 }} >
        {cards.map((card) => (
          <CardOverview
            key={card.id}
            card={card}
            detailsLink={`/card/${card.id}`}
          />
        ))}
      </Grid2>
    </>
  );
}
