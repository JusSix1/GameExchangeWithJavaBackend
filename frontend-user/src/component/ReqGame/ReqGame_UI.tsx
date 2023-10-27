/* eslint-disable react/jsx-pascal-case */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
/* eslint-disable jsx-a11y/alt-text */
import {
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  TableCell,
  CssBaseline,
  ThemeProvider,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  createTheme,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import * as React from "react";
import ip_address from "../ip";
import Moment from "moment";

import { ReqGamesInterface } from "../../models/reqgame/IReqGame";
import "./ReqGame_UI.css";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function ReqGame_Status_Table_UI() {
  const [listReqGame, setListReqGame] = React.useState<ReqGamesInterface[]>([]);
  const [reqGame, setReqGame] = React.useState<Partial<ReqGamesInterface>>({});

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

  const getListReqGame = async () => {
    const apiUrl =
      ip_address() + "/listmyreqgames/" + localStorage.getItem("email");
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
          await setListReqGame(res.data);
        }
      });
  };

  const CreateReqGame = async () => {
    setDialogLoadOpen(true);

    let data = {
      Name: reqGame.Name,
    };

    const apiUrl = ip_address() + "/reqgame/" + localStorage.getItem("email"); //ส่งขอการเพิ่ม
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
          setSuccess(true);
          getListReqGame();
          setReqGame({
            ...reqGame,
            Name:"",
          })
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
      await getListReqGame();
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
      
      <Grid container justifyContent={"center"}>
        <h1 className="head-text">Request new game</h1>
      </Grid>

      <div className="div-request-game-main">
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <div className="div-request-game-request-component">
            <div className="div-request-game-request-component-1">
              <p>Name:</p>
            </div>
            <div className="div-request-game-request-component-2">
              <TextField
                fullWidth
                id="request_game_name"
                label="Game Name"
                type="string"
                variant="outlined"
                value={reqGame.Name}
                onChange={(event) =>
                  setReqGame({
                    ...reqGame,
                    Name: event.target.value,
                  })
                }
              />
            </div>
            <div className="div-request-game-request-component-1">
              <Button
                size="large"
                variant="contained"
                color="primary"
                onClick={CreateReqGame}
              >
                Send
              </Button>
            </div>
          </div>

          <div className="div-ReqGame-table">
            <TableContainer component={Paper}>
              <Table style={{ minWidth: "650px" }} aria-label="Basket">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">
                      <h3>Name</h3>
                    </TableCell>
                    <TableCell align="center">
                      <h3>Status</h3>
                    </TableCell>
                    <TableCell align="center" style={{ maxWidth: "400px" }}>
                      <h3>Note</h3>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody style={{ backgroundColor: "#3a3b3c" }}>
                  {listReqGame.map((item, index) => (
                    <TableRow key={item.ID}>
                      <TableCell align="center" style={{ maxWidth: "400px" }}>
                        {item.Name}
                      </TableCell>
                      <TableCell align="center">
                        {item.Is_Add && !item.Is_Reject ? (
                          <h4 style={{ color: "#00ff00" }}>Added</h4>
                        ) : !item.Is_Add && item.Is_Reject ? (
                          <h4 style={{ color: "#ff0000" }}>Reject</h4>
                        ) : (
                          <h4>In progress</h4>
                        )}
                      </TableCell>
                      <TableCell align="center" style={{ maxWidth: "400px" }}>
                        {item.Note}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </ThemeProvider>
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
