/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-redundant-roles */
import React from "react";
import "./myReserve.css";
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

export default function My_Reserve_UI() {
  const [reserve, setReserve] = React.useState<OrdersInterface[]>([]);
  const [reserveForUploadSlip, setReserveForUploadSlip] = React.useState<
    Partial<OrdersInterface>
  >({});
  const [posts, setPosts] = React.useState<PostsInterface[]>([]);
  const [postID, setPostID] = React.useState<number>();

  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [dialogLoadOpen, setDialogLoadOpen] = React.useState(false);
  const [dialogSlipOpen, setDialogSlipOpen] = React.useState(false);
  const [dialogDeleteOpen, setDialogDeleteOpen] = React.useState(false);

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
      setReserveForUploadSlip(foundOrder);
      setDialogSlipOpen(true);
    }
  };

  const handleCloseSlipDialog = () => {
    setDialogSlipOpen(false);
  };

  const handleDialogDeleteClickOpen = (ID: Number) => {
    const foundOrder = reserve.find((order) => order.Account_ID === ID);
    if (foundOrder) {
      setReserveForUploadSlip(foundOrder);
      setPostID(Number(ID));
      setDialogDeleteOpen(true);
    }
  };

  const handleDialogDeleteClickClose = () => {
    setDialogDeleteOpen(false);
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
      .then((res) => {
        if (res.dataReserve) {
          setReserve(res.dataReserve);
        }
        if (res.dataPosts) {
          setPosts(res.dataPosts);
        }
        console.log(res)
      });
  };

  const PatchOrder = () => {
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
          handleCloseSlipDialog();
        } else {
          setError(true);
          setErrorMsg(" - " + res.error);
        }
      });
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
          handleDialogDeleteClickClose();
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

      <Dialog
        open={dialogLoadOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Loading..."}</DialogTitle>
      </Dialog>

      <Grid container justifyContent={"center"}>
        <h1>My Reserve</h1>
      </Grid>

      <Grid>
        {posts.map((item) => (
          <Grid
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            sx={{ margin: 1 }}
          >
            <Grid key={item.ID} width={"60%"}>
              <div className="post">
                <div className="post-header">
                  <img
                    src={item.User.Profile_Picture}
                    alt={`${item.User.Profile_Name}'s profile`}
                  />
                  <div className="post-author">
                    <a
                      href={`/profile/${item.User.Email}`}
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
                  <h4>Price {item.Account.Price} ฿</h4>
                </div>
                {item.Advertising_image && (
                  <img
                    src={item.Advertising_image}
                    alt="Posted content"
                    className="post-image"
                  />
                )}
                <div className="container-btn-slip">
                  <button
                    className="button-slip"
                    role="button"
                    onClick={() => handleOpenSlipDialog(item.Account_ID)}
                  >
                    Upload Slip
                  </button>
                  <button className="button-cancel" role="button" onClick={() => handleDialogDeleteClickOpen(item.ID)}>
                    Cancel Reserve
                  </button>
                </div>
              </div>
            </Grid>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={dialogSlipOpen}
        onClose={handleCloseSlipDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Upload Slip</DialogTitle>
        <Grid margin={1} item xs={12}>
          <h4>Slip</h4>
          <Grid>
            <img
              src={`${reserveForUploadSlip?.Slip}`}
              width="480"
              height="640"
            />
          </Grid>
          <input type="file" onChange={handleImageChange} />
        </Grid>
        <DialogActions>
          <Button size="small" onClick={handleCloseSlipDialog} color="inherit">
            Cancel
          </Button>
          <Button size="small" onClick={PatchOrder} color="success" autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog  //Delete
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
              onClick={DeleteOrder}
              color="error"
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
    </>
  );
}
