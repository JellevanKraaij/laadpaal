import {Box, CardActions, CardContent, Card, CardMedia, Typography, Button } from "@mui/material";
import { cardDetailsType } from "../types";

function detailCheck(card: cardDetailsType)
{
	// let someArray;
	// if (typeof card === 'object' && card !== null) {
	// 	Object.keys(card).forEach(key => {
	// 		console.log(key);
	// 	});
	// }

	Object.entries(card).forEach(([key, value]) => {
		// Dynamically create variables using destructuring
		console.log(value);
	  });

}

export default function makeDetailCard(card: cardDetailsType): JSX.Element
{
	detailCheck(card);
	// card = detailCheck(card);
	return (
		<Box sx={{ m: '2rem', width:1/4, height:1/4}}>
		<Card style={{backgroundColor: "teal"}}>
		<CardMedia
			sx={{ height: 125, width:1}}
			// image={card.imageUrl}
		/>
		<CardContent >
			<Typography gutterBottom variant="h6" component="div" sx={{ color: 'white'}}>
			<b>current or last session</b><br/>
			<small><b> time </b></small><br/>
			start: {card.startTime} end: {card.endTime}<br/>
			<small><b> WH charged </b></small><br/>
			start: {card.startWh} end: {card.endWh}<br/>
			diff: {card.endWh - card.startWh}<br/>
			<br/>
			<b> total used </b><br/>
			{card.totalWh} WH<br/>
			</Typography>
		</CardContent>
		</Card>
		</Box>
	);
}
