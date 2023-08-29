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
  const [orderID, setOrderID] = React.useState<Number>();

  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [dialogLoadOpen, setDialogLoadOpen] = React.useState(false);
  const [dialogSlipOpen, setDialogSlipOpen] = React.useState(false);
  const [dialogConfirmSlipOpen, setDialogConfirmSlipOpen] =
    React.useState(false);
  const [dialogCancelOpen, setDialogCancelOpen] = React.useState(false);

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
      renderCell: (params) => (
        <a
        href={`/profile/${String(params?.value.Profile_Name)}`}
        target="_blank"
        rel="noopener noreferrer"
        >
          {String(params?.value.Profile_Name)}
        </a>
      ),
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
      width: 150,
      renderCell: (params) => (
        <Button
          size="small"
          variant="contained"
          color="inherit"
          onClick={() => handleSlipButtonClick(params.row.Slip)}
        >
          View Slip
        </Button>
      ),
    },
    {
      field: "confirm",
      headerName: "Confirm",
      width: 150,
      renderCell: (params) => (
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={() => handleConfirmButtonClick(params.row.ID)}
        >
          Confirm Slip
        </Button>
      ),
    },
    {
      field: "cancel",
      headerName: "cancel",
      width: 150,
      renderCell: (params) => (
        <Button
          size="small"
          variant="contained"
          color="error"
          onClick={() => handleCanelButtonClick(params.row.ID)}
        >
          cancel
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

  const handleConfirmButtonClick = (ID: Number) => {
    setOrderID(ID);
    setDialogConfirmSlipOpen(true);
  };

  const handleDialogConfrimClickClose = () => {
    setDialogConfirmSlipOpen(false);
  };

  const handleCanelButtonClick = (ID: Number) => {
    setOrderID(ID);
    setDialogCancelOpen(true);
  };

  const handleDialogCancelClickClose = () => {
    setDialogCancelOpen(false);
  };

  const handleSlip = () => {
    if (imageString) {
      return (
        <img src={`${imageString}`} alt="Slip" width="100%" height="auto" />
      );
    } else {
      return <Grid>No slip upload</Grid>;
    }
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
        }
      });
  };

  const ConfirmSlip = () => {
    let data = {
      ID: orderID,
    };
    const apiUrl = ip_address() + "/orderslipconfirm"; //ส่งขอการแก้ไข
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
          getMyOrder();
          setDialogConfirmSlipOpen(false);
        } else {
          setError(true);
          setErrorMsg(" - " + res.error);
        }
        handleCloseSlipDialog();
      });
  };

  const CancelOrder = async () => {
    setDialogLoadOpen(true);

    let data = {
      ID: orderID,
    };

    const apiUrl = ip_address() + "/cancelorder"; //ส่งขอการแก้ไข
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    await fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then(async (res) => {
        if (res.data) {
          setSuccess(true);
          handleDialogCancelClickClose();
          getMyOrder();
        } else {
          setError(true);
          setErrorMsg(" - " + res.error);
        }
      });
    setDialogLoadOpen(false);
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
        <DialogContent>{handleSlip()}</DialogContent>
        <DialogActions>
          <Button size="small" onClick={handleCloseSlipDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog //Delete
        open={dialogConfirmSlipOpen}
        onClose={handleDialogConfrimClickClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm slip"}</DialogTitle>
        <DialogActions>
          <Button
            size="small"
            onClick={handleDialogConfrimClickClose}
            color="inherit"
          >
            Cancel
          </Button>
          <Button size="small" onClick={ConfirmSlip} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog //Delete
        open={dialogCancelOpen}
        onClose={handleDialogCancelClickClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title">{"Cancel order"}</DialogTitle>
        <DialogActions>
          <Button size="small" onClick={handleDialogCancelClickClose}>
            Cancel
          </Button>
          <Button size="small" onClick={CancelOrder} color="error" autoFocus>
            Cancel
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
