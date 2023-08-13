/* eslint-disable react/style-prop-object */
import React from "react";
import { PostsInterface } from "../../models/post/IPost";
import ip_address from "../ip";
import {
  Alert,
  Autocomplete,
  Dialog,
  DialogTitle,
  Grid,
  Snackbar,
  TextField,
} from "@mui/material";
import UserFullAppBar from "../FullAppBar/UserFullAppBar";
import "./styles.css";
import Moment from "moment";
import moment from "moment";
import { GamesInterface } from "../../models/account/IGame";
import { UsersInterface } from "../../models/user/IUser";

export default function Home_User_UI() {
  const [post, setPost] = React.useState<PostsInterface[]>([]);
  const [game, setGame] = React.useState<GamesInterface[]>([]);
  const [listUserName, setListUserName] = React.useState<UsersInterface[]>([]);
  const [search, setSearch] = React.useState("");
  const [gameFilter, setGameFilter] = React.useState<number>();
  const [userNameFilter, setUserNameFilter] = React.useState<number>();

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

  const isOptionEqualToValue = (option: { ID: any }, value: { ID: any }) => {
    return option.ID === value.ID;
  };

  const getPost = async () => {
    const apiUrl = ip_address() + "/posts"; // email คือ email ที่ผ่านเข้ามาทาง parameter
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
          setPost(res.data);
          console.log(res.data);
        }
      });
  };

  const getGame = async () => {
    const apiUrl = ip_address() + "/games";
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

  const getListUserName = async () => {
    const apiUrl = ip_address() + "/usernamelist";
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
          setListUserName(res.data);
        }
      });
  };

  React.useEffect(() => {
    const fetchData = async () => {
      setDialogLoadOpen(true);
      await getPost();
      await getGame();
      await getListUserName();
      setDialogLoadOpen(false);
    };
    fetchData();
  }, []);

  return (
    <>
      <UserFullAppBar></UserFullAppBar>
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

      <Grid container>
        <Grid item xs={7} margin={1} marginLeft={2}>
          <TextField
            id="search-bar"
            fullWidth
            onChange={(event) => setSearch(event.target.value)}
            label="Search a game by description"
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={2} margin={1} marginLeft={4}>
          <Autocomplete
            id="game-autocomplete"
            options={game}
            size="small"
            value={
              gameFilter
                ? game.find((option) => option.ID === gameFilter)
                : null
            }
            onChange={(event: any, value) => {
              setGameFilter(value?.ID);
            }}
            getOptionLabel={(option: any) => `${option.Name}`}
            renderInput={(params: any) => {
              return (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Search game name"
                />
              );
            }}
            renderOption={(props: any, option: any) => {
              return (
                <li {...props} value={option.ID} key={option.ID}>
                  {option.Name}
                </li>
              );
            }}
            isOptionEqualToValue={isOptionEqualToValue}
          />
        </Grid>
        <Grid item xs={2} margin={1} marginLeft={4}>
          <Autocomplete
            id="username-autocomplete"
            options={listUserName}
            size="small"
            value={
              userNameFilter
                ? listUserName.find((option) => option.ID === userNameFilter)
                : null
            }
            onChange={(event: any, value) => {
              setUserNameFilter(value?.ID);
            }}
            getOptionLabel={(option: any) => `${option.Profile_Name}`}
            renderInput={(params: any) => {
              return (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Search user name"
                />
              );
            }}
            renderOption={(props: any, option: any) => {
              return (
                <li {...props} value={option.ID} key={option.ID}>
                  {option.Profile_Name}
                </li>
              );
            }}
            isOptionEqualToValue={isOptionEqualToValue}
          />
        </Grid>
      </Grid>

      <Grid sx={{ margin: 1 }} >
        {post
          .filter(
            (item) =>
              item.Description.toLowerCase().includes(search.toLowerCase()) &&
              (gameFilter === null ||
                gameFilter === undefined ||
                item.Account.Game_ID === gameFilter) &&
              (userNameFilter === null ||
                userNameFilter === undefined ||
                item.Account.User_ID === userNameFilter)
          )
          .map((item) => (
            <Grid  key={item.ID}>
              <div className="post">
                <div className="post-header">
                  <img
                    src={item.Account.User.Profile_Picture}
                    alt={`${item.Account.User.Profile_Name}'s profile`}
                  />
                  <div className="post-author">
                    <a
                      href={`/profile/${item.Account.User.Email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.Account.User.Profile_Name}
                    </a>
                  </div>
                  <div className="post-timestamp">
                    {moment(item.CreatedAt).format("DD/MM/YYYY hh:mm A")}
                  </div>
                </div>
                <div className="post-content">{item.Description}</div>
                <div className="post-price">
                  <h4>Price {item.Price} ฿</h4>
                </div>
                {item.Advertising_image && (
                  <img
                    src={item.Advertising_image}
                    alt="Posted content"
                    className="post-image"
                  />
                )}
              </div>
            </Grid>
          ))}
      </Grid>

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
