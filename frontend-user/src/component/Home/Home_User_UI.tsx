/* eslint-disable react/style-prop-object */
import React from "react";
import { PostsInterface } from "../../models/post/IPost";
import ip_address from "../ip";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import "./Home_User_UI.css";
import Moment from "moment";
import moment from "moment";

export default function Home_User_UI() {
  const [post, setPost] = React.useState<PostsInterface[]>([]);
  const textareaRefDescription = React.useRef<HTMLTextAreaElement | null>(null);
  const textareaRefGame = React.useRef<HTMLTextAreaElement | null>(null);
  const textareaRefUser = React.useRef<HTMLTextAreaElement | null>(null);

  const [searchDescription, setSearchDescription] = React.useState("");
  const [searchGame, setSearchGame] = React.useState("");
  const [searchUser, setSearchUser] = React.useState("");
  const [postID, setPostID] = React.useState<number>();
  const [accountID, setAccountID] = React.useState<number>();
  const [sortFilter, setSortFilter] = React.useState<number>(0);

  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [dialogLoadOpen, setDialogLoadOpen] = React.useState(false);
  const [dialogReserveOpen, setDialogReserveOpen] = React.useState(false);

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

  const textAreaChangeDescription = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setSearchDescription(event.target.value);
  };

  const textAreaChangeGame = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setSearchGame(event.target.value);
  };

  const textAreaChangeUser = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setSearchUser(event.target.value);
  };

  const handleReserveButtonClick = (item: any) => {
    setPostID(item.ID);
    setAccountID(item.Account.ID);
    handleDialogReserveClickOpen();
  };

  const handleDialogReserveClickOpen = () => {
    setDialogReserveOpen(true);
  };

  const handleDialogReserveClickClose = () => {
    setDialogReserveOpen(false);
  };

  const getPost = async () => {
    const apiUrl = ip_address() + "/posts";
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
        }
      });
  };

  const CreateReserve = async () => {
    setDialogLoadOpen(true);

    let data = {
      Account_ID: accountID,
      Post_ID: postID,
    };

    const apiUrl = ip_address() + "/order/" + localStorage.getItem("email"); //ส่งขอการเพิ่ม
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
          handleDialogReserveClickClose();
          getPost();
        } else {
          setError(true);
          setErrorMsg(" - " + res.error);
        }
      });
    setDialogLoadOpen(false);
  };

  const [count, setCount] = React.useState<number>(0);

  React.useEffect(() => {
    if (count === 0) {
      const fetchData = async () => {
        setDialogLoadOpen(true);
        await getPost();
        setDialogLoadOpen(false);
      };
      fetchData();
      setCount(1);
    }
    if (textareaRefDescription && textareaRefDescription.current) {
      textareaRefDescription.current.style.height = "0px";
      const scrollHeightDescription =
        textareaRefDescription.current.scrollHeight;
      textareaRefDescription.current.style.height =
        scrollHeightDescription + "px";
    }
    if (textareaRefGame && textareaRefGame.current) {
      textareaRefGame.current.style.height = "0px";
      const scrollHeightGame = textareaRefGame.current.scrollHeight;
      textareaRefGame.current.style.height = scrollHeightGame + "px";
    }
    if (textareaRefUser && textareaRefUser.current) {
      textareaRefUser.current.style.height = "0px";
      const scrollHeightUser = textareaRefUser.current.scrollHeight;
      textareaRefUser.current.style.height = scrollHeightUser + "px";
    }
  }, [count, searchDescription, searchGame, searchUser]);

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

      <div className="div-body">
        <div className="search">
          <div className="search-body">
            <div className="search-component">Description</div>
            <div className="search-component">
              <textarea
                className="textareaDescription"
                ref={textareaRefDescription}
                onChange={textAreaChangeDescription}
              >
                {searchDescription}
              </textarea>
            </div>
            <div className="search-component">Game name</div>
            <div className="search-component">
              <textarea
                className="textareaDescription"
                ref={textareaRefGame}
                onChange={textAreaChangeGame}
              >
                {searchGame}
              </textarea>
            </div>
            <div className="search-component">User name</div>
            <div className="search-component">
              <textarea
                className="textareaDescription"
                ref={textareaRefUser}
                onChange={textAreaChangeUser}
              >
                {searchUser}
              </textarea>
            </div>
            <div className="search-component">Sort by</div>
            <div className="search-component">
              <div className="radio-item">
                <input name="radio" id="radio1" type="radio" defaultChecked onChange={(event) => setSortFilter(1)} />
                <label htmlFor="radio1">Newest</label>
              </div>
              <div className="radio-item">
                <input name="radio" id="radio2" type="radio" onChange={(event) => setSortFilter(2)} />
                <label htmlFor="radio2">Cheapest - most expensive</label>
              </div>
              <div className="radio-item">
                <input name="radio" id="radio3" type="radio" onChange={(event) => setSortFilter(3)} />
                <label htmlFor="radio3">Most expensive - cheapest</label>
              </div>
            </div>
          </div>
        </div>

        <div style={{ width: "100%" }}>
          {post
            .filter(
              (item) =>
                item.Description.toLowerCase().includes(
                  searchDescription.toLowerCase()
                ) &&
                item.Account.Game.Name.toLowerCase().includes(
                  searchGame.toLowerCase()
                ) &&
                item.User.Profile_Name.toLowerCase().includes(
                  searchUser.toLowerCase()
                )
            )
            .sort((a, b) => {
              if (sortFilter === 1) {
                return b.ID - a.ID;
              } else if (sortFilter === 2) {
                return a.Account.Price - b.Account.Price;
              } else if (sortFilter === 3) {
                return b.Account.Price - a.Account.Price;
              } else {
                return 0;
              }
            })
            .map((item) => (
              <div key={item.ID} className="post">
                <div className="post-header">
                  <img
                    src={item.User.Profile_Picture}
                    alt={`${item.User.Profile_Name}'s profile`}
                  />
                  <div className="post-author">
                    <a
                      href={`/profile/${item.User.Profile_Name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#FFF" }}
                    >
                      {item.User.Profile_Name}
                    </a>
                  </div>
                  <div className="post-timestamp">
                    {moment(item.CreatedAt).format("DD/MM/YYYY hh:mm A")}
                  </div>
                </div>
                <div className="post-content">{item.Description}</div>
                <div className="post-price">
                  <h4 style={{ color: "#FFF" }}>
                    Price {item.Account.Price} ฿
                  </h4>
                </div>
                {item.Advertising_image && (
                  <img
                    src={item.Advertising_image}
                    alt="Posted content"
                    className="post-image"
                  />
                )}
                <div className="container-reserve">
                  <button
                    className="button-reserve"
                    onClick={() => handleReserveButtonClick(item)}
                  >
                    Add to basket
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      <Dialog //Reserve
        open={dialogReserveOpen}
        onClose={handleDialogReserveClickClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title">{"Reserve Account"}</DialogTitle>
        <DialogActions>
          <Button
            size="small"
            color="error"
            onClick={handleDialogReserveClickClose}
          >
            Cancel
          </Button>
          <Button size="small" onClick={CreateReserve} autoFocus>
            Reserve
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
