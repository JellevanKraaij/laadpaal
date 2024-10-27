import {
  Button,
  Divider,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChargeSessionTable from "@/components/chargeSessionTable";
import PaymentsTable from "@/components/paymentsTable";

export default async function Details({ params }: { params: { id: string } }) {
  const data = await fetch(
    "https://laadpaal.jellevankraaij.nl/api/cards/" + params.id
  );
  const card = await data.json();

  return (
    <div>
      <Typography variant="h3">
        <strong>{card.name}</strong>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          sx={{ float: "right" }}
          size="large"
          href="/"
        >
          Back
        </Button>
      </Typography>

      <Divider flexItem sx={{ mt: 1, mb: 2}} />
      <ChargeSessionTable
        chargeSessions={card.chargeSessions}
        kWhPrice={card.kWhPrice}
      />
      <Divider flexItem sx={{ mt: 5, mb: 2}} />
      <PaymentsTable payments={card.payments} kWhPrice={card.kWhPrice} />
    </div>
  );
}
