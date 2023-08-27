/* eslint-disable jsx-a11y/alt-text */
import * as React from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Snackbar,
} from "@mui/material";
import Moment from "moment";

import ip_address from "../ip";
import { OrdersInterface } from "../../models/order/IOrder";
import moment from "moment";
import {
  GridRowSelectionModel,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridColDef,
  DataGrid,
  FilterColumnsArgs,
  GetColumnForNewFilterArgs,
} from "@mui/x-data-grid";

export default function My_Order_UI() {
  const [order, setOrder] = React.useState<OrdersInterface[]>([]);

  const [imageString, setImageString] = React.useState<
    string | ArrayBuffer | null
  >(null);

  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [dialogLoadOpen, setDialogLoadOpen] = React.useState(false);
  const [dialogSlipOpen, setDialogSlipOpen] = React.useState(false);

  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>([]);

  Moment.locale("th");

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport
          csvOptions={{
            fileName: "MyAccountGame",
            utf8WithBom: true,
          }}
        />
      </GridToolbarContainer>
    );
  }

  const columns: GridColDef[] = [
    { field: "ID", headerName: "ID", width: 70 },
    {
      field: "User",
      headerName: "Buyer",
      width: 200,
      valueFormatter: (params) => String(params?.value.Profile_Name),
    },
    {
      field: "Account",
      headerName: "Account name",
      width: 200,
      valueFormatter: (params) => String(params?.value.Game_Account),
    },
    {
      field: "Slip_Create_At",
      headerName: "Slip Created At",
      width: 200,
      valueFormatter: (params) =>
        moment(params?.value).format("DD/MM/YYYY hh:mm A"),
    },
    {
      field: "Slip",
      headerName: "Slip",
      width: 200,
      renderCell: (params) => (
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={() => handleSlipButtonClick(params.row.Slip)}
        >
          View Slip
        </Button>
      ),
    },
  ];

  const filterColumns = ({
    field,
    columns,
    currentFilters,
  }: FilterColumnsArgs) => {
    // remove already filtered fields from list of columns
    const filteredFields = currentFilters?.map((item) => item.field);
    return columns
      .filter(
        (colDef) =>
          colDef.filterable &&
          (colDef.field === field || !filteredFields.includes(colDef.field))
      )
      .map((column) => column.field);
  };

  const getColumnForNewFilter = ({
    currentFilters,
    columns,
  }: GetColumnForNewFilterArgs) => {
    const filteredFields = currentFilters?.map(({ field }) => field);
    const columnForNewFilter = columns
      .filter(
        (colDef) => colDef.filterable && !filteredFields.includes(colDef.field)
      )
      .find((colDef) => colDef.filterOperators?.length);
    return columnForNewFilter?.field ?? null;
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccess(false);
    setError(false);
    setErrorMsg("");
  };

  const handleSlipButtonClick = (slipBase64: string) => {
    setImageString(slipBase64);
    setDialogSlipOpen(true);
  };

  const handleCloseSlipDialog = () => {
    setDialogSlipOpen(false);
    setImageString(null);
};

  const getMyOrder = async () => {
    const apiUrl = ip_address() + "/myorder/" + localStorage.getItem("email"); // email คือ email ที่ผ่านเข้ามาทาง parameter
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    await fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setOrder(res.data);
          console.log(res.data);
        }
      });
  };

  React.useEffect(() => {
    const fetchData = async () => {
      setDialogLoadOpen(true);
      await getMyOrder();
      setDialogLoadOpen(false);
    };
    fetchData();
  }, []);

  return (
    <>
      <Snackbar //ป้ายบันทึกสำเร็จ
        open={success}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity="success">
          Succes
        </Alert>
      </Snackbar>

      <Snackbar //ป้ายบันทึกไม่สำเร็จ
        open={error}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity="error">
          Error {errorMsg}
        </Alert>
      </Snackbar>

      <Grid container sx={{ padding: 2 }}>
        {" "}
        {/* ตารางแสดงผล */}
        <div style={{ height: 540, width: "100%" }}>
          <DataGrid
            rows={order}
            getRowId={(row) => row.ID}
            slots={{ toolbar: CustomToolbar }}
            columns={columns}
            slotProps={{
              filterPanel: {
                filterFormProps: {
                  filterColumns,
                },
                getColumnForNewFilter,
              },
            }}
            checkboxSelection
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setRowSelectionModel(newRowSelectionModel);
            }}
            rowSelectionModel={rowSelectionModel}
            disableRowSelectionOnClick
          />
        </div>
      </Grid>

      <Dialog open={dialogSlipOpen} onClose={handleCloseSlipDialog}>
        <DialogTitle>Slip Image</DialogTitle>
        <DialogContent>
          <img src={`${imageString}`} alt="Slip" width="100%" height="auto" />
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={handleCloseSlipDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={dialogLoadOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Loading..."}</DialogTitle>
      </Dialog>
    </>
  );
}
