import { Paper, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export default function PaymentsTable(props: {
  payments: {
    id: string;
    cardId: string;
    createTime: string;
    whPaid: number;
    description: string;
  }[];
  kWhPrice: number;
}) {
  const payments = props.payments.map((payment) => ({
    ...payment,
    whPaid: (payment.whPaid / 1000).toFixed(2) + " kWh",
  }));

  const totalWh =
    props.payments.reduce((acc, payment) => acc + payment.whPaid, 0) / 1000;

  const columns = [
    { field: "createTime", headerName: "Created at", flex: 2 },
    { field: "whPaid", headerName: "Wh paid", flex: 1 },
    { field: "description", headerName: "Description", flex: 8 },
  ];

  return (
    <>
      <Typography variant="h6">Payments:</Typography>
      <Typography sx={{ color: "text.secondary" }}>
        Total payed: {totalWh.toFixed(2)} kWh,{" "} ({payments.length} payments)
      </Typography>

      <Paper sx={{ mt: 1 }}>
        <DataGrid
          rows={payments}
          columns={columns}
          pageSizeOptions={[5, 10, 20]}
          initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
        />
      </Paper>
    </>
  );
}
