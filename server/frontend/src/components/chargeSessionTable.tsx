import { Paper, Typography } from "@mui/material";
import { useFormatter } from "next-intl";
import { DataGrid } from "@mui/x-data-grid";

export default function ChargeSessionTable(props: {
  chargeSessions: {
    id: string;
    cardId: string;
    createTime: string;
    startTime: string;
    endTime: string;
    startWh: number;
    endWh: number;
    totalWh: number;
  }[];
  kWhPrice: number;
}) {
  const format = useFormatter();

  const chargeSessions = props.chargeSessions.map((session) => ({
    ...session,
    startWh: (session.startWh / 1000).toFixed(2) + " kWh",
    endWh: (session.endWh / 1000).toFixed(2) + " kWh",
    totalWh: (session.totalWh / 1000).toFixed(2) + " kWh",
    totalCost: format.number((session.totalWh * props.kWhPrice) / 1000, {
      style: "currency",
      currency: "EUR",
    }),
  }));

  const totalWh =
    props.chargeSessions.reduce((acc, session) => acc + session.totalWh, 0) /
    1000;
  const totalCost = totalWh * props.kWhPrice;

  const columns = [
    { field: "createTime", headerName: "Created at", flex: 3 },
    { field: "startTime", headerName: "Start time", flex: 3 },
    { field: "endTime", headerName: "End time", flex: 3 },
    { field: "totalWh", headerName: "Total used", flex: 2 },
    { field: "totalCost", headerName: "Total cost", flex: 2 },
  ];

  return (
    <>
      <Typography variant="h6">
        Charge Sessions:
      </Typography>
      <Typography sx={{ color: "text.secondary" }}>
        Price:{" "}
        {format.number(props.kWhPrice, { style: "currency", currency: "EUR" })}
        /kWh
        <br />
        Total: {totalWh.toFixed(2)} kWh, {format.number(totalCost, { style: "currency", currency: "EUR" })}, ({chargeSessions.length} sessions)
      </Typography>

      <Paper sx={{ mt: 1, minWidth: 900}}>
        <DataGrid
          rows={chargeSessions}
          columns={columns}
          pageSizeOptions={[5, 10, 20]}
          initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
        />
      </Paper>
    </>
  );
}
