import CardCard from "@/components/cardCard";
import TotalCard from "@/components/totalCard";
import { Divider, Grid2 } from "@mui/material";
import Typography from "@mui/material/Typography";

// Cache the page for 10 seconds, and revalidate every 10  seconds if the page is requested
export const revalidate = 10;

export default async function Home() {
  const cardData = await fetch("https://api.laadpaal.jellevankraaij.nl/cards");
  const cards: {
    id: string;
    name: string;
    isValid: boolean;
    lastUsed: Date;
    totalWh: number;
    balance: number;
    kWhPrice: number;
  }[] = await cardData.json();

  const totalData = await fetch("https://api.laadpaal.jellevankraaij.nl/totals");
  const total: {
    chargeWh: number;
    totalWh: number;
    idleWh: number;
    compareWh: number;
  } = await totalData.json();

  return (
    <>
      <Typography variant="h3"><strong>Overview</strong></Typography>
      <Divider flexItem />
      <br />
      <Grid2 container spacing={3} sx={{ m: 0, mb: 5 }} >
        {cards.map((card) => (
          <CardCard
            key={card.id}
            card={card}
            detailsLink={`/details/${card.id}`}
          />
        ))}
      </Grid2>
      <TotalCard key="totals" totals={total} />
    </>
  );
}
