'use client'
import { usePathname } from 'next/navigation'
import { cardDetailsType } from '@/app/types';
import makeDetailCard from '@/app/UImodules/detailCard';
import { Grid, Box } from "@mui/material";

export default async function detailPage() {
    const pathname = usePathname();
    const urlPart = pathname.split('/')[2];
    const detailCard: cardDetailsType = await (await fetch(`https://laadpaal.jellevankraaij.nl/api/cards/${urlPart}`)).json();
    
    return (
      <Box display="flex" alignItems="center" style={{ marginTop: '50px' }}>
        <Grid container spacing={0} justifyContent="center" >
        {makeDetailCard(detailCard)}
        </Grid>
      </Box>
    );
}