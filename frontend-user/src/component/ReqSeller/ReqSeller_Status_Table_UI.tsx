/* eslint-disable react/jsx-pascal-case */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
/* eslint-disable jsx-a11y/alt-text */
import {
  Snackbar,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  Stack,
  Button,
} from "@mui/material";
import * as React from "react";
import "./ReqSeller.css";
import { ReqSellersInterface } from "../../models/reqseller/IReqSeller";
import ip_address from "../ip";
import Moment from "moment";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import ReqSeller_Register_UI from "./ReqSeller_Register_UI";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function ReqSeller_Status_Table_UI() {
  const [reqSellerData, setReqSellerData] = React.useState<
    ReqSellersInterface[]
  >([]);

  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const [dialogLoadOpen, setDialogLoadOpen] = React.useState(false);

  Moment.locale("th");

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

  const handleReRegisterButtonClick = () => {
    window.location.href = "/RequestSeller/Re-Register";
  };

  const GetMyReqData = async () => {
    const apiUrl = ip_address() + "/reqdata/" + localStorage.getItem("email");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    await fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then(async (res) => {
        if (res.data) {
          setReqSellerData(res.data);
        }
      });
  };

  React.useEffect(() => {
    const fetchData = async () => {
      setDialogLoadOpen(true);
      await GetMyReqData();
      setDialogLoadOpen(false);
    };
    fetchData();
  }, []);

  if (reqSellerData.length === 0) {
    return <ReqSeller_Register_UI />;
  } else {
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

        <div className="div-status-table">
          <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <TableContainer component={Paper}>
              <Table style={{ minWidth: "650px" }} aria-label="Basket">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">
                      <h3>Created at</h3>
                    </TableCell>
                    <TableCell align="center">
                      <h3>Personal card front</h3>
                    </TableCell>
                    <TableCell align="center">
                      <h3>Personal card back</h3>
                    </TableCell>
                    <TableCell align="center">
                      <h3>Status</h3>
                    </TableCell>
                    <TableCell align="center" style={{ maxWidth: "400px" }}>
                      <h3>Note</h3>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody style={{ backgroundColor: "#3a3b3c"}}>
                  {reqSellerData.map((item, index) => (
                    <TableRow key={item.ID}>
                      <TableCell align="center">{`${Moment(
                        item.CreatedAt
                      ).format("DD MMMM YYYY hh:mm A")}`}</TableCell>
                      <TableCell align="center">
                        <img
                          src={`${item.Personal_Card_Front}`}
                          width="200"
                          height="150"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <img
                          src={`${item.Personal_Card_Back}`}
                          width="200"
                          height="150"
                        />
                      </TableCell>
                      <TableCell align="center">
                        {item.Is_Confirm &&
                        !item.Is_Reject &&
                        !item.Is_Cancel ? (
                          <h4 style={{ color: "#57D3F9" }}>Accept</h4>
                        ) : !item.Is_Confirm &&
                          item.Is_Reject &&
                          !item.Is_Cancel ? (
                          <h4 style={{ color: "#ff753e" }}>Reject</h4>
                        ) : !item.Is_Confirm &&
                          !item.Is_Reject &&
                          item.Is_Cancel ? (
                          <h4 style={{ color: "#ff0000" }}>Cancel</h4>
                        ) : (
                          <h4>In progress</h4>
                        )}
                      </TableCell>
                      <TableCell align="center" style={{ maxWidth: "400px" }}>
                        {" "}
                        <Stack direction="column" spacing={2}>
                          {item.Note}
                          {index === 0 && item.Is_Reject ? (
                            <Button
                              size="small"
                              onClick={handleReRegisterButtonClick}
                              color="primary"
                              style={{ margin: "1rem" }}
                            >
                              Re-Register
                            </Button>
                          ) : index === 0 && item.Is_Cancel ? (
                            <p style={{ fontSize: "16px" }}>
                              Please contact if you haven't done anything wrong:
                              <br />
                              GameExchangSupport@GE.com
                            </p>
                          ) : null}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </ThemeProvider>
          <div className="div-rule-under-table">
            <h3>Community rules:</h3>
            <ul>
              <li>Do not cheat in trading.</li>
              <li>
                Please send the account to the customer as soon as possible. If
                you have already received the money transfer.
              </li>
            </ul>
          </div>
        </div>

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
}
