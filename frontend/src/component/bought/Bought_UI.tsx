/* eslint-disable jsx-a11y/alt-text */
import * as React from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  Snackbar,
} from "@mui/material";

import ip_address from "../ip";
import { OrdersInterface } from "../../models/order/IOrder";
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridColDef,
  DataGrid,
  FilterColumnsArgs,
  GetColumnForNewFilterArgs,
} from "@mui/x-data-grid";

export default function My_Bought_UI() {
  const [order, setOrder] = React.useState<OrdersInterface[]>([]);

  const [orderID, setOrderID] = React.useState<Number>();

  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [dialogLoadOpen, setDialogLoadOpen] = React.useState(false);
  const [dialogReceiveOpen, setDialogReceiveOpen] = React.useState(false);

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton sx={{ color: "#00ADB5" }} />
        <GridToolbarFilterButton sx={{ color: "#00ADB5" }} />
        <GridToolbarDensitySelector sx={{ color: "#00ADB5" }} />
      </GridToolbarContainer>
    );
  }

  const columns: GridColDef[] = [
    { field: "ID", headerName: "Order ID", width: 70 },
    {
      field: "Game_Name",
      headerName: "Game",
      width: 200,
      renderCell: (params) => params.row.Account.Game.Name,
    },
    {
      field: "Game_Account",
      headerName: "Account name",
      width: 200,
      renderCell: (params) => params.row.Account.Game_Account,
    },
    {
      field: "Game_Password",
      headerName: "Account Password",
      width: 200,
      renderCell: (params) => params.row.Account.Game_Password,
    },
    {
      field: "Email",
      headerName: "Email",
      width: 200,
      renderCell: (params) => params.row.Account.Email,
    },
    {
      field: "Email_Password",
      headerName: "Email Password",
      width: 200,
      renderCell: (params) => params.row.Account.Email_Password,
    },
    {
      field: "Received",
      headerName: "Received",
      width: 150,
      renderCell: (params) => (
        <Button
          disabled={params.row.Is_Receive}
          size="small"
          variant="contained"
          sx={{ backgroundColor: "#00ADB5" }}
          color="primary"
          onClick={() => handleReceiveButtonClick(params.row.ID)}
        >
          Confirm receive
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

  const handleReceiveButtonClick = (ID: Number) => {
    setOrderID(ID);
    setDialogReceiveOpen(true);
  };

  const handleDialogReceiveClickClose = () => {
    setDialogReceiveOpen(false);
  };

  const getMyBought = async () => {
    const apiUrl = ip_address() + "/mybought/" + localStorage.getItem("email"); // email คือ email ที่ผ่านเข้ามาทาง parameter
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

  const Confirmreceive = () => {
    let data = {
      ID: orderID,
    };
    const apiUrl = ip_address() + "/orderreive"; //ส่งขอการแก้ไข
    const requestOptions = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then(async (res) => {
        if (res.data) {
          setSuccess(true);
          getMyBought();
          setDialogReceiveOpen(false);
        } else {
          setError(true);
          setErrorMsg(" - " + res.error);
        }
      });
  };

  React.useEffect(() => {
    const fetchData = async () => {
      setDialogLoadOpen(true);
      await getMyBought();
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

      <Grid //ตารางแสดงผล
        container
        sx={{ padding: 2 }}
      >
        <div style={{ height: "90vh", width: "100%" }}>
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
          />
        </div>
      </Grid>

      <Dialog //receive
        open={dialogReceiveOpen}
        onClose={handleDialogReceiveClickClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Receive"}</DialogTitle>
        <DialogActions>
          <Button
            size="small"
            onClick={handleDialogReceiveClickClose}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            size="small"
            onClick={Confirmreceive}
            sx={{ color: "#00ADB5" }}
            color="primary"
            autoFocus
          >
            Receive
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog //Load
        open={dialogLoadOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div className="custom-loader" />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div>Loading...</div>
          </div>
        </DialogTitle>
      </Dialog>
    </>
  );
}
