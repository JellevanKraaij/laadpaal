import { paymentType, chargeSessionType} from "../types";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';

function readableDate(date: string)
{
	if (date === null)
		return ("N/A");
	const ymd = date.split('T')[0];
	const time = date.split('T')[1].substring(0,5);
	return ([time, ymd]);
}

export function makeChargeTable(sessions: chargeSessionType[]): JSX.Element
{
	return (
	<TableContainer component={Paper}>
	<Table>
	<TableHead>
	<TableRow>
		<TableCell><b>Start Time</b></TableCell>
		<TableCell><b>Start Wh</b></TableCell>
		<TableCell><b>End Time</b></TableCell>
		<TableCell><b>End Wh</b></TableCell>
		<TableCell><b>Total Wh</b></TableCell>
	</TableRow>
	</TableHead>
	<TableBody>
	{sessions.map((row) => (
	<TableRow key={row.id}>
		<TableCell>{readableDate(row.startTime)[0]}<br/>
		{readableDate(row.startTime)[1]}</TableCell>
		<TableCell>{row.startWh}</TableCell>
		<TableCell>{readableDate(row.endTime)[0]}<br/>
		{readableDate(row.endTime)[1]}</TableCell>
		<TableCell>{row.endWh}</TableCell>
		<TableCell>{row.totalWh}</TableCell>
	</TableRow>
	))}
	</TableBody>
	</Table>
	</TableContainer>
	)
}

export function makePaymentsTable(payments: paymentType[]): JSX.Element
{
	return (
	<TableContainer component={Paper}>
	<Table>
	<TableHead>
	<TableRow>
		<TableCell><b>date of pay</b></TableCell>
		<TableCell><b>amount of WH paid</b></TableCell>
		<TableCell><b>description</b></TableCell>
	</TableRow>
	</TableHead>
	<TableBody>
	{payments.map((row) => (
	<TableRow key={row.id}>
		<TableCell>{readableDate(row.createTime)[0]}<br/>
		{readableDate(row.createTime)[1]}</TableCell>
		<TableCell>{row.whPaid}</TableCell>
		<TableCell>{row.description}</TableCell>
	</TableRow>
	))}
	</TableBody>
	</Table>
	</TableContainer>
	)
}

// return (
// 	<Box sx={{ m: '2rem', width:1/4, height:1/4}}>
// 	<Card style={{backgroundColor: "teal"}}>
// 	<CardMedia
// 		sx={{ height: 125, width:1}}
// 		image={table.imageUrl}
// 	/>
// 	<CardContent >
// 		<Typography gutterBottom variant="h6" component="div" sx={{ color: 'white'}}>
// 		<b>current or last session</b><br/>
// 		<small><b> time </b></small><br/>
// 		start: {sessions[0].startTime || "N/A"} end: {sessions[0].endTime || "N/A"}<br/>
// 		<small><b> WH charged </b></small><br/>
// 		start: {sessions[0].startWh} end: {sessions[0].endWh}<br/>
// 		diff: {sessions[0].endWh - sessions[0].startWh}<br/>
// 		<br/>
// 		<b> total used </b><br/>
// 		{sessions[0].totalWh} WH<br/>
// 		</Typography>
// 	</CardContent>
// 	</Card>
// 	</Box>
// );