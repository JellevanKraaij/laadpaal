import { detailsType } from '@/app/types';
import { makeChargeTable, makePaymentsTable } from '@/app/UImodules/detailTable';
import { Grid, Box, Paper } from "@mui/material";

export default async function detailPage({params}: {params: {id: string}}) {

    const url = `https://laadpaal.jellevankraaij.nl/api/cards/${params.id}`;
    const detailCard: detailsType = await (await fetch(url)).json();

    return (
      <div>
      <Box alignItems="center" justifyContent="center" component={Paper} style={{ padding: '10px 20px', marginTop: '50px', width: 'fit-content' }}>
      <b>{detailCard.name} charge sessions</b>
      </Box>
      <Box display="flex" alignItems="center" style={{ marginTop: '10px' }}>
      {makeChargeTable(detailCard.chargeSessions)}
      </Box>
      <br/>
      <Box alignItems="center" justifyContent="center" component={Paper} style={{ padding: '10px 20px', marginTop: '50px', width: 'fit-content' }}>
      <b>credit left: {detailCard.balance}</b>
      </Box>
      <Box display="flex" alignItems="center" style={{ marginTop: '10px' }}>
      {makePaymentsTable(detailCard.payments)}
      </Box>
      </div>
    )
}