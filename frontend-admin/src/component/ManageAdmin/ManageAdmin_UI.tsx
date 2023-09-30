/* eslint-disable jsx-a11y/alt-text */
import * as React from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Snackbar,
  TextField,
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
import { AdminsInterface } from "../../model/admin/IAdmin";
import moment from "moment";
import Moment from "moment";
import "./ManageAdmin_UI.css";

export default function Manage_Admin_UI() {
  const [admin, setAdmin] = React.useState<AdminsInterface[]>([]);
  const [newAdmin, setNewAdmin] = React.useState<Partial<AdminsInterface>>({});
  const [password, setPassword] = React.useState<string>();
  const [confirmPassword, setConfirmPassword] = React.useState<string>();

  const [adminID, setAdminID] = React.useState<Number>();

  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [dialogLoadOpen, setDialogLoadOpen] = React.useState(false);
  const [dialogAddAdminOpen, setDialogAddAdminOpen] = React.useState(false);
  const [dialogDeleteOpen, setDialogDeleteOpen] = React.useState(false);

  Moment.locale("th");

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <Button
          size="small"
          variant="contained"
          color="primary"
          style={{ color: "#fff", background: "#00ADB5" }}
          onClick={() => handleAddAdminButtonClick()}
        >
          Add Admin
        </Button>
        <GridToolbarColumnsButton sx={{ color: "#00ADB5" }} />
        <GridToolbarFilterButton sx={{ color: "#00ADB5" }} />
        <GridToolbarDensitySelector sx={{ color: "#00ADB5" }} />
      </GridToolbarContainer>
    );
  }

  const columns: GridColDef[] = [
    { field: "ID", headerName: "ID", width: 100 },
    {
      field: "CreatedAt",
      headerName: "Create at",
      width: 200,
      valueFormatter: (params) =>
        moment(params?.value).format("DD/MM/YYYY hh:mm A"),
    },
    {
      field: "Account_Name",
      headerName: "Account Name",
      width: 200,
      renderCell: (params) => params.row.Account_Name,
    },
    {
      field: "Admin_Name",
      headerName: "Name",
      width: 200,
      renderCell: (params) => params.row.Admin_Name,
    },
    {
      field: "Delete",
      headerName: "Delete",
      width: 150,
      renderCell: (params) => (
        <Button
          size="small"
          variant="contained"
          color="error"
          style={{ color: "#fff" }}
          onClick={() => handleDeleteButtonClick(params.row.ID)}
        >
          Delete
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

  const handleAddAdminButtonClick = () => {
    setDialogAddAdminOpen(true);
  };

  const handleDeleteButtonClick = (ID: number) => {
    setAdminID(ID);
    setDialogDeleteOpen(true);
  };

  //   const handleCloseCardDialog = () => {
  //     setDialogCardOpen(false);
  //   };

  const handleDialogAddAdminClickClose = () => {
    setDialogAddAdminOpen(false);
  };

  const handleDialogDeleteClickClose = () => {
    setDialogDeleteOpen(false);
  };

  //   const handleDialogRejectClickClose = () => {
  //     setDialogRejectOpen(false);
  //   };

  const getListAdmin = async () => {
    const apiUrl = ip_address() + "/listadmin";
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
          setAdmin(res.data);
        }
      });
  };

  const CreateAdmin = async () => {
    setDialogLoadOpen(true);

    if (password === confirmPassword) {
      let data = {
        Account_Name: newAdmin.Account_Name,
        Admin_Name: newAdmin.Admin_Name,
        Password: password,
      };

      const apiUrl = ip_address() + "/createadmin";
      const requestOptions = {
        method: "POST",
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
            await getListAdmin();
            setPassword(undefined);
            setConfirmPassword(undefined);
            setNewAdmin({});
            setSuccess(true);
          } else {
            setError(true);
            setErrorMsg(" - " + res.error);
          }
        });
    } else {
      setError(true);
      setErrorMsg(" - Passwords don't match");
    }

    setDialogLoadOpen(false);
  };

  const DeleteAdmin = async () => {
    setDialogLoadOpen(true);

      let data = {
        ID: adminID,
        Password: password,
      };

      const apiUrl = ip_address() + "/admin/" + localStorage.getItem("account_name");
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
            await getListAdmin();
            setPassword(undefined);
            setSuccess(true);
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
      await getListAdmin();
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
        <div style={{ height: "80vh", width: "100%" }}>
          <DataGrid
            style={{ background: "#3a3b3c", color: "white" }}
            rows={admin}
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

      <Dialog //Add Admin
        open={dialogAddAdminOpen}
        onClose={handleDialogAddAdminClickClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Add new admin"}</DialogTitle>

        <DialogContent>
          <Box>
            <Paper elevation={2} sx={{ padding: 2, margin: 2 }}>
              <Grid container>
                <Grid container>
                  <Grid margin={1} item xs={12}>
                    <Grid margin={2} item xs={12} style={{ fontSize: "18px" }}>
                      Information:
                    </Grid>
                    <Grid margin={1} item xs={12}>
                      <TextField
                        fullWidth
                        id="Account_Name"
                        label="Account Name"
                        variant="outlined"
                        onChange={(event) =>
                          setNewAdmin({
                            ...newAdmin,
                            Account_Name: event.target.value,
                          })
                        }
                      />
                    </Grid>
                    <Grid margin={1} item xs={12}>
                      <TextField
                        fullWidth
                        id="Admin_Name"
                        label="Admin Name"
                        variant="outlined"
                        onChange={(event) =>
                          setNewAdmin({
                            ...newAdmin,
                            Admin_Name: event.target.value,
                          })
                        }
                      />
                    </Grid>
                  </Grid>
                  <Grid margin={1} item xs={12}>
                    <Grid margin={2} item xs={12} style={{ fontSize: "18px" }}>
                      Password:
                    </Grid>
                    <Grid margin={1} item xs={12}>
                      <TextField
                        fullWidth
                        type="password"
                        id="password"
                        label="Password"
                        variant="outlined"
                        onChange={(event) =>
                          setPassword(String(event.target.value))
                        }
                      />
                    </Grid>
                    <Grid margin={1} item xs={12}>
                      <TextField
                        fullWidth
                        type="password"
                        id="confirm-password"
                        label="Confirm Password"
                        variant="outlined"
                        onChange={(event) =>
                          setConfirmPassword(String(event.target.value))
                        }
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogAddAdminClickClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={CreateAdmin} autoFocus>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog //Delete Admin
        open={dialogDeleteOpen}
        onClose={handleDialogDeleteClickClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete"}</DialogTitle>

        <DialogContent>
          <Box>
            <Paper elevation={2} sx={{ padding: 2, margin: 2 }}>
              <Grid container>
                <Grid container>
                  <Grid margin={1} item xs={12}>
                    <Grid margin={2} item xs={12} style={{ fontSize: "18px" }}>
                      Password:
                    </Grid>
                    <Grid margin={1} item xs={12}>
                      <TextField
                        fullWidth
                        type="password"
                        id="password"
                        label="Password"
                        variant="outlined"
                        onChange={(event) =>
                          setPassword(String(event.target.value))
                        }
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogDeleteClickClose} color="inherit">
            Cancel
          </Button>
          <Button color="error" onClick={DeleteAdmin} autoFocus>
            Delete
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
