'use client'

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation'
import { cardDetailsType } from '@/app/types';
import makeDetailCard from '@/app/UImodules/detailCard';
import { Grid, Box } from "@mui/material";

// async function getData(url: string): cardDetailsType | null
// {
//   return (await (await fetch(url)).json());
// }

export default function detailPage() {
    const urlPart = usePathname().split('/')[2];
    const url = `https://laadpaal.jellevankraaij.nl/api/cards/${urlPart}`;
    // const detailCard: cardDetailsType = await (await fetch(`https://laadpaal.jellevankraaij.nl/api/cards/${urlPart}`)).json();
  

    const [detailCard, fillCard] = useState<cardDetailsType | null>(null);

    // useEffect to respond to navigation
    useEffect(() => {

      fetch(url).then((data) => data.json().then((data) => fillCard(data)));
      // fillCard(await (await fetch(url)).json());

      // (await fetch(url)).json()).then((data) => fillCard(data))
      // (await (await fetch(url)).json()).then((data) => fillCard(data))

      // async function requestFill()// = async () =>
      // {
      //   fillCard(await (await fetch(url)).json());
      // };
      // requestFill();   
    }, [url]);

    if (!detailCard)
      return <div>Loading...</div>;

    return (
      <Box display="flex" alignItems="center" style={{ marginTop: '50px' }}>
        <Grid container spacing={0} justifyContent="center" >
        {makeDetailCard(detailCard)}
        </Grid>
      </Box>
    );
}