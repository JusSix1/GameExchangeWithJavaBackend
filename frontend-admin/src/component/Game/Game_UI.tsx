import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  FilterColumnsArgs,
  GridColDef,
  DataGrid,
  GetColumnForNewFilterArgs,
} from "@mui/x-data-grid";
import * as React from "react";
import { GamesInterface } from "../../model/game/IGame";
import {
  Snackbar,
  Alert,
  Grid,
  Dialog,
  DialogTitle,
  Button,
  Box,
  DialogActions,
  DialogContent,
  Paper,
  TextField,
} from "@mui/material";
import ip_address from "../ip";
import "./Game_UI.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ReqGamesInterface } from "../../model/reqgame/reqgame";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function Game_UI() {
  const [game, setGame] = React.useState<GamesInterface[]>([]);
  const [reqGame, setReqGame] = React.useState<ReqGamesInterface[]>([]);
  const [newGame, setNewGame] = React.useState<Partial<GamesInterface>>({});
  const [gameID, setGameID] = React.useState<Number>();
  const [name, setName] = React.useState<string>();
  const [reqGameID, setReqGameID] = React.useState<Number>();

  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [dialogLoadOpen, setDialogLoadOpen] = React.useState(false);
  const [dialogEditOpen, setDialogEditOpen] = React.useState(false);
  const [dialogDeleteOpen, setDialogDeleteOpen] = React.useState(false);
  const [dialogCheckOpen, setDialogCheckOpen] = React.useState(false);

  function CustomToolbarListGame() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton sx={{ color: "#00ADB5" }} />
        <GridToolbarFilterButton sx={{ color: "#00ADB5" }} />
        <GridToolbarDensitySelector sx={{ color: "#00ADB5" }} />
      </GridToolbarContainer>
    );
  }

  const columnsListGame: GridColDef[] = [
    { field: "ID", headerName: "ID", flex: 1 },
    {
      field: "Name",
      headerName: "Name",
      flex: 2,
      renderCell: (params) => params.row.Admin_Name,
    },
    {
      field: "Edit",
      headerName: "Edit",
      flex: 1,
      renderCell: (params) => (
        <Button
          size="small"
          variant="contained"
          color="inherit"
          style={{ color: "#000" }}
          onClick={() => handleEditButtonClick(params.row)}
        >
          Edit
        </Button>
      ),
    },
    {
      field: "Delete",
      headerName: "Delete",
      flex: 1,
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

  const columnsListReqGame: GridColDef[] = [
    { field: "ID", headerName: "ID", flex: 1 },
    {
      field: "Name",
      headerName: "Game name",
      flex: 2,
      renderCell: (params) => params.row.Admin_Name,
    },
    {
      field: "User",
      headerName: "Requester",
      flex: 2,
      renderCell: (params) => (
        <a
          href={`/UserProfile/${String(params?.row.User.Profile_Name)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "white" }}
        >
          {String(params.row.User.Profile_Name)}
        </a>
      ),
    },
    {
      field: "Check",
      headerName: "Check",
      flex: 1,
      renderCell: (params) => (
        <Button
          size="small"
          variant="contained"
          color="primary"
          style={{ color: "#fff" }}
          onClick={() => handleCheckButtonClick(params.row.ID)}
        >
          Check
        </Button>
      ),
    },
  ];

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

  const handleEditButtonClick = (item: GamesInterface) => {
    setGameID(item.ID);
    setName(item.Name);
    setDialogEditOpen(true);
  };

  const handleDeleteButtonClick = (id: number) => {
    setGameID(id);
    setDialogDeleteOpen(true);
  };

  const handleCheckButtonClick = (id: number) => {
    setReqGameID(id);
    setDialogCheckOpen(true);
  };

  const handleDialogEditClickClose = () => {
    setGameID(undefined);
    setName("");
    setDialogEditOpen(false);
  };

  const handleDialogDeleteClickClose = () => {
    setGameID(undefined);
    setDialogDeleteOpen(false);
  };

  const handleDialogCheckClickClose = () => {
    setReqGameID(undefined);
    setDialogCheckOpen(false);
  };

  const getListGame = async () => {
    const apiUrl = ip_address() + "/listgame";
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
          setGame(res.data);
        }
      });
  };

  const getListReqGame = async () => {
    const apiUrl = ip_address() + "/listreqgames";
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
          setReqGame(res.data);
          console.log(res.data);
        }
      });
  };

  const CreateGame = async () => {
    setDialogLoadOpen(true);

    if (newGame.Name !== undefined) {
      let data = {
        Name: newGame.Name,
      };

      const apiUrl = ip_address() + "/game";
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
            getListGame();
            setNewGame({});
          } else {
            setError(true);
            setErrorMsg(" - " + res.error);
          }
        });
    } else {
      setError(true);
      setErrorMsg(" - game name is blank");
    }

    setDialogLoadOpen(false);
  };

  const UpdateGame = async () => {
    setDialogLoadOpen(true);

    let data = {
      ID: gameID,
      Name: name,
    };

    const apiUrl = ip_address() + "/game";
    const requestOptions = {
      method: "PATCH",
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
          getListGame();
          handleDialogEditClickClose();
        } else {
          setError(true);
          setErrorMsg(" - " + res.error);
        }
      });

    setDialogLoadOpen(false);
  };

  const DeleteGame = async () => {
    setDialogLoadOpen(true);

    let data = {
      ID: gameID,
    };

    const apiUrl = ip_address() + "/game";
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
          getListGame();
          handleDialogEditClickClose();
        } else {
          setError(true);
          setErrorMsg(" - " + res.error);
        }
      });

    setDialogLoadOpen(false);
  };

  const UpdateReqGame = async () => {
    setDialogLoadOpen(true);

    let data = {
      ID: reqGameID,
    };

    const apiUrl = ip_address() + "/reqgame";
    const requestOptions = {
      method: "PATCH",
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
          handleDialogCheckClickClose();
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
      await getListGame();
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

      <div className="div-main">
        <div className="div-game-datagrid">
          <div className="div-title-datagrid">
            <h2>List Game</h2>
          </div>
          <DataGrid
            style={{ background: "#3a3b3c", color: "white" }}
            rows={game}
            getRowId={(row) => row.ID}
            slots={{ toolbar: CustomToolbarListGame }}
            columns={columnsListGame}
            disableRowSelectionOnClick
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

        <div className="div-newgame-detagrid">
          <div className="div-title-datagrid">
            <h2>Request New Game</h2>
          </div>
          <div className="div-addnewgame">
            <div className="div-newgame-contant">
              <h3>Add new game</h3>
              <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <TextField
                  fullWidth
                  id="new_game_name"
                  label="Game Name"
                  type="string"
                  variant="outlined"
                  value={newGame.Name}
                  onChange={(event) =>
                    setNewGame({
                      ...newGame,
                      Name: event.target.value,
                    })
                  }
                />
              </ThemeProvider>
              <div className="div-newgame-contant-btn">
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={CreateGame}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
          <DataGrid
            style={{ background: "#3a3b3c", color: "white" }}
            rows={reqGame}
            getRowId={(row) => row.ID}
            columns={columnsListReqGame}
            disableRowSelectionOnClick
          />
        </div>
      </div>

      <Dialog //Edit Game
        open={dialogEditOpen}
        onClose={handleDialogEditClickClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">{"Edit Game"}</DialogTitle>

        <DialogContent>
          <Box>
            <div>
              <Paper elevation={2} sx={{ padding: 2, margin: 2 }}>
                <div>
                  <Grid margin={1} item xs={5}>
                    <TextField
                      fullWidth
                      id="game_name"
                      label="name"
                      type="string"
                      variant="outlined"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </Grid>
                </div>
              </Paper>
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            size="small"
            onClick={handleDialogEditClickClose}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            size="small"
            onClick={UpdateGame}
            sx={{ color: "#00ADB5" }}
            autoFocus
          >
            save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog //Delete
        open={dialogDeleteOpen}
        onClose={handleDialogDeleteClickClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Account"}</DialogTitle>
        <DialogActions>
          <Button size="small" onClick={handleDialogDeleteClickClose}>
            Cancel
          </Button>
          <Button
            size="small"
            onClick={DeleteGame}
            sx={{ color: "#ff753e" }}
            color="error"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog //Check
        open={dialogCheckOpen}
        onClose={handleDialogCheckClickClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title">{"Have you finished checking?"}</DialogTitle>
        <DialogActions>
          <Button size="small" color="inherit" onClick={handleDialogCheckClickClose}>
            Cancel
          </Button>
          <Button
            size="small"
            onClick={UpdateReqGame}
            color="primary"
            autoFocus
          >
            Check
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
