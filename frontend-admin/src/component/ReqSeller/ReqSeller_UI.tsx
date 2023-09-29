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

import ip_address from "../ip";
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
import { ReqSellersInterface } from "../../model/reqseller/IReqSeller";
import moment from "moment";
import Moment from "moment";

export default function List_ReqSeller_UI() {
  const [reqSeller, setReqSeller] = React.useState<ReqSellersInterface[]>([]);

  const [reqSellerID, setReqSellerID] = React.useState<Number>();
  const [imageString, setImageString] = React.useState<
    string | ArrayBuffer | null
  >(null);
  const [headDialog, setHeadDialog] = React.useState<string>();

  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [dialogLoadOpen, setDialogLoadOpen] = React.useState(false);
  const [dialogCardOpen, setDialogCardOpen] = React.useState(false);
  const [dialogGiveOpen, setDialogGiveOpen] = React.useState(false);
  const [dialogRejectOpen, setDialogRejectOpen] = React.useState(false);

  Moment.locale("th");

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
    { field: "ID", headerName: "Request ID", width: 70 },
    {
      field: "CreatedAt",
      headerName: "Create at",
      width: 200,
      valueFormatter: (params) =>
        moment(params?.value).format("DD/MM/YYYY hh:mm A"),
    },
    {
      field: "User",
      headerName: "User",
      width: 200,
      renderCell: (params) => params.row.User.Profile_Name,
    },
    {
      field: "Front card",
      headerName: "Front card",
      width: 150,
      renderCell: (params) => (
        <Button
          size="small"
          variant="contained"
          color="inherit"
          style={{ color: "#000" }}
          onClick={() => handleFrontButtonClick(params.row.Personal_Card_Front)}
        >
          View Front
        </Button>
      ),
    },
    {
      field: "Back card",
      headerName: "Back card",
      width: 150,
      renderCell: (params) => (
        <Button
          size="small"
          variant="contained"
          color="inherit"
          style={{ color: "#000" }}
          onClick={() => handleBackButtonClick(params.row.Personal_Card_Back)}
        >
          View Back
        </Button>
      ),
    },
    {
      field: "Admin",
      headerName: "Grantor",
      width: 200,
      renderCell: (params) => params.row.Admin.Admin_Name,
    },
    {
      field: "Give Permission",
      headerName: "Give Permission",
      width: 150,
      renderCell: (params) => (
        <Button
          disabled={params.row.Is_Confirm}
          size="small"
          variant="contained"
          color="primary"
          style={{ color: "#000" }}
          onClick={() => handleGiveButtonClick(params.row.ID)}
        >
          Give
        </Button>
      ),
    },
    {
      field: "Reject",
      headerName: "Reject",
      width: 150,
      renderCell: (params) => (
        <Button
          disabled={params.row.Is_Confirm}
          size="small"
          variant="contained"
          color="error"
          sx={{ backgroundColor: "#ff753e" }}
          onClick={() => handleRejectButtonClick(params.row.ID)}
        >
          Reject
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

  const handleFrontButtonClick = (slipBase64: string) => {
    setImageString(slipBase64);
    setHeadDialog("Front card");
    setDialogCardOpen(true);
  };

  const handleBackButtonClick = (slipBase64: string) => {
    setImageString(slipBase64);
    setHeadDialog("Back card");
    setDialogCardOpen(true);
  };

  const handleGiveButtonClick = (ID: number) => {
    setReqSellerID(ID);
    setDialogGiveOpen(true);
  };

  const handleRejectButtonClick = (ID: number) => {
    setReqSellerID(ID);
    setDialogRejectOpen(true);
  };

  const handleCloseCardDialog = () => {
    setDialogCardOpen(false);
  };

  const handleDialogGiveClickClose = () => {
    setDialogGiveOpen(false);
  };

  const handleDialogRejectClickClose = () => {
    setDialogRejectOpen(false);
  };

  const getReqSeller = async () => {
    const apiUrl = ip_address() + "/reqseller"; // email คือ email ที่ผ่านเข้ามาทาง parameter
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
          setReqSeller(res.data);
          console.log(res.data);
        }
      });
  };

  const GivePermission = () => {
    let data = {
      ID: reqSellerID,
    };
    const apiUrl =
      ip_address() + "/givepermission/" + localStorage.getItem("account_name"); //ส่งขอการแก้ไข
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
          getReqSeller();
          setDialogGiveOpen(false);
        } else {
          setError(true);
          setErrorMsg(" - " + res.error);
        }
      });
  };

  const RejectRequest = async () => {
    setDialogLoadOpen(true);

    let data = {
      ID: reqSellerID,
    };

    const apiUrl = ip_address() + "/rejectrequest"; //ส่งขอการแก้ไข
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
          await getReqSeller();
          handleDialogRejectClickClose();
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
      await getReqSeller();
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
            style={{ background: "#3a3b3c", color: "white" }}
            rows={reqSeller}
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

      <Dialog //view card
        open={dialogCardOpen}
        onClose={handleCloseCardDialog}
      >
        <DialogTitle>{headDialog}</DialogTitle>
        <DialogContent>
          <img src={`${imageString}`} alt="card" width="100%" height="auto" />
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={handleCloseCardDialog} color="inherit">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog //give
        open={dialogGiveOpen}
        onClose={handleDialogGiveClickClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title">{"Give permission"}</DialogTitle>
        <DialogActions>
          <Button
            size="small"
            onClick={handleDialogGiveClickClose}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            size="small"
            onClick={GivePermission}
            sx={{ color: "#00ADB5" }}
            color="primary"
            autoFocus
          >
            Give
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog //Reject
        open={dialogRejectOpen}
        onClose={handleDialogRejectClickClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title">{"Reject request"}</DialogTitle>
        <DialogActions>
          <Button
            size="small"
            onClick={handleDialogRejectClickClose}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            size="small"
            onClick={RejectRequest}
            sx={{ color: "#ff753e" }}
            color="error"
            autoFocus
          >
            Reject
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
