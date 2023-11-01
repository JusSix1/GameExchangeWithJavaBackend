/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-redundant-roles */
import React from "react";
import {
  Snackbar,
  Alert,
  Grid,
  Dialog,
  DialogTitle,
  Button,
  DialogActions,
} from "@mui/material";
import Moment from "moment";
import moment from "moment";
import { OrdersInterface } from "../../models/order/IOrder";
import ip_address from "../ip";
import { PostsInterface } from "../../models/post/IPost";
import "./myBasket.css";
import "../Home/Home_User_UI.css";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

export default function My_Basket_UI() {
  const [reserve, setReserve] = React.useState<OrdersInterface[]>([]);
  const [reserveForUploadSlip, setReserveForUploadSlip] = React.useState<
    Partial<OrdersInterface>
  >({});
  const [reserveBeforeUploadSlip, setReserveBeforeUploadSlip] = React.useState<
    Partial<OrdersInterface>
  >({});
  const [posts, setPosts] = React.useState<PostsInterface[]>([]);
  const [postID, setPostID] = React.useState<number>();

  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [dialogLoadOpen, setDialogLoadOpen] = React.useState(false);
  const [dialogSlipOpen, setDialogSlipOpen] = React.useState(false);
  const [dialogCancelOpen, setDialogCancelOpen] = React.useState(false);

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

  const handleImageChange = (event: any) => {
    const image = event.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      const base64Data = reader.result;
      setReserveForUploadSlip({
        ...reserveForUploadSlip,
        Slip: String(base64Data),
      });
    };
  };

  const handleOpenSlipDialog = (ID: Number) => {
    const foundOrder = reserve.find((order) => order.Account_ID === ID);
    if (foundOrder) {
      setReserveBeforeUploadSlip(foundOrder);
      setReserveForUploadSlip(foundOrder);
      setDialogSlipOpen(true);
    }
  };

  const handleCloseSlipDialog = () => {
    setDialogSlipOpen(false);
  };

  const handleDialogCancelClickOpen = (Account_ID: Number,Post_ID: Number) => {
    const foundOrder = reserve.find((order) => order.Account_ID === Account_ID);
    if (foundOrder) {
      setReserveForUploadSlip(foundOrder);
      setPostID(Number(Post_ID));
      setDialogCancelOpen(true);
    }
  };

  const handleDialogCancelClickClose = () => {
    setDialogCancelOpen(false);
  };

  const getReserve = async () => {
    const apiUrl = ip_address() + "/myreserve/" + localStorage.getItem("email");
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
        if (res.dataReserve) {
          await setReserve(res.dataReserve);
        }
        if (res.dataPosts) {
          await setPosts(res.dataPosts);
        } else {
          await setPosts([]);
        }
      });
  };

  const PatchOrder = () => {
    if (reserveForUploadSlip.Slip === "") {
      setError(true);
      setErrorMsg(" - Please enter the slip.");
    } else {
      let data = {
        ID: reserveForUploadSlip.ID,
        Slip: reserveForUploadSlip.Slip,
      };
      const apiUrl = ip_address() + "/orderslip"; //ส่งขอการแก้ไข
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
            getReserve();
            setReserveForUploadSlip({});
          } else {
            setError(true);
            setErrorMsg(" - " + res.error);
          }
          handleCloseSlipDialog();
        });
    }
  };

  const DeleteOrder = async () => {
    setDialogLoadOpen(true);

    let data = {
      Order_ID: reserveForUploadSlip.ID,
      Post_ID: postID,
    };

    const apiUrl = ip_address() + "/order"; //ส่งขอการแก้ไข
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
          getReserve();
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
      await getReserve();
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
        <h1 className="head-text">My Basket</h1>
      </Grid>

      <Grid //post
      >
        {posts.map((item) => (
          <Grid
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            sx={{ margin: 1 }}
          >
            <Grid key={item.ID} width={"80%"}>
              <div className="post">
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
                  <h4 style={{ color: "#FFF" }}>
                    Bank account number: {item.User.Bank_Account}
                  </h4>
                </div>

                {reserve.some(
                  (order) => order.Account_ID === item.Account_ID && !order.Slip
                ) ? (
                  <div>
                    {reserve
                      .filter(
                        (order) =>
                          order.Account_ID === item.Account_ID && !order.Slip
                      )
                      .map((order) => (
                        <div key={order.ID}>
                          <div className="post-upload">
                            <p>
                              <b>Upload your slip</b>
                              <br />
                              <br />
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : reserve.some(
                    (order) =>
                      order.Account_ID === item.Account_ID && order.Slip && !order.Is_Reject
                  ) ? (
                  <div>
                    {reserve
                      .filter(
                        (order) =>
                          order.Account_ID === item.Account_ID && order.Slip && !order.Is_Reject
                      )
                      .map((order) => (
                        <div key={order.ID}>
                          <div className="post-process">
                            <p>
                              <b>In progress</b>
                              <br />
                              <br />
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : reserve.some(
                    (order) =>
                      order.Account_ID === item.Account_ID && order.Is_Reject
                  ) ? (
                  <div>
                    {reserve
                      .filter(
                        (order) =>
                          order.Account_ID === item.Account_ID &&
                          order.Is_Reject
                      )
                      .map((order) => (
                        <div key={order.ID}>
                          <div className="post-alert">
                            <p>
                              <b>Your order was rejected.</b>
                              <br />
                              <br />
                              <b>Note: </b>
                              {order.Note}
                              <br/>
                              <br/>
                              <b>If you think I'm wrong, please contact me through my profile page.</b>
                            </p>
                            <br />
                          </div>
                        </div>
                      ))}
                  </div>
                ) : null}

                {item.Advertising_image && (
                  <img
                    src={item.Advertising_image}
                    alt="Posted content"
                    className="post-image"
                  />
                )}

                <div className="container-btn-slip">
                  {item &&
                  !reserve.some(
                    (order) =>
                      order.Account_ID === item.Account_ID && order.Slip
                  ) ? (
                    <button
                      className="button-slip"
                      role="button"
                      onClick={() => handleOpenSlipDialog(item.Account_ID)}
                    >
                      Upload Slip
                    </button>
                  ) : (
                    <button
                      className="button-slip"
                      role="button"
                      onClick={() => handleOpenSlipDialog(item.Account_ID)}
                    >
                      View Slip
                    </button>
                  )}
                  <button
                    className="button-cancel"
                    role="button"
                    onClick={() => handleDialogCancelClickOpen(item.Account_ID,item.ID)}
                  >
                    Cancel Reserve
                  </button>
                </div>
              </div>
            </Grid>
          </Grid>
        ))}
      </Grid>

      <Dialog //Slip
        open={dialogSlipOpen}
        onClose={handleCloseSlipDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Upload Slip</DialogTitle>
        <Grid margin={1} item xs={12}>
          <h4>Slip</h4>
          <div className="div-slip">
            {reserveForUploadSlip.Slip ? (
              <img
                src={`${reserveForUploadSlip?.Slip}`}
                width="480"
                height="640"
              />
            ) : (
              <>
                <label htmlFor="Image-Input-slip">
                  <AddPhotoAlternateIcon
                    sx={{
                      fontSize: 120,
                      margin: 1,
                      padding: 2,
                      cursor: "pointer", // เปลี่ยนรูปแบบเคอร์เซอร์เป็นตัวเลือก
                    }}
                  />
                </label>
              </>
            )}
          </div>
          {!reserveBeforeUploadSlip.Slip ? (
            <input
              id="Image-Input-slip"
              type="file"
              onChange={handleImageChange}
              accept=".jpg, .jpeg, .png"
            />
          ) : null}
        </Grid>
        <DialogActions>
          <Button size="small" onClick={handleCloseSlipDialog} color="inherit">
            Cancel
          </Button>
          {!reserveBeforeUploadSlip.Slip ? (
            <Button
              size="small"
              onClick={PatchOrder}
              sx={{ color: "#00ADB5" }}
              color="success"
              autoFocus
            >
              Upload
            </Button>
          ) : null}
        </DialogActions>
      </Dialog>

      <Dialog //Cancel
        open={dialogCancelOpen}
        onClose={handleDialogCancelClickClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title">{"Cancel Reserve"}</DialogTitle>
        <DialogActions>
          <Button
            size="small"
            onClick={handleDialogCancelClickClose}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            size="small"
            onClick={DeleteOrder}
            sx={{ color: "#ff753e" }}
            color="error"
            autoFocus
          >
            Cancel Reserve
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
