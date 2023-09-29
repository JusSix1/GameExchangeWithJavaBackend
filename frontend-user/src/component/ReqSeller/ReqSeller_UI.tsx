/* eslint-disable jsx-a11y/alt-text */
import { Snackbar, Alert, Dialog, DialogTitle } from "@mui/material";
import * as React from "react";
import "./ReqSeller.css";
import { ReqSellersInterface } from "../../models/reqseller/IReqSeller";
import ip_address from "../ip";

export default function Req_Seller_UI() {
  const [reqSeller, setReqSeller] = React.useState<
    Partial<ReqSellersInterface>
  >({});

  const [isUserReqSeller, setIsUserReqSeller] = React.useState(false);

  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const [dialogLoadOpen, setDialogLoadOpen] = React.useState(false);

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

  const handleImageChangeFront = (event: any) => {
    const image = event.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      const base64Data = reader.result;
      setReqSeller({
        ...reqSeller,
        Personal_Card_Front: String(base64Data),
      });
    };
  };

  const handleImageChangeBack = (event: any) => {
    const image = event.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      const base64Data = reader.result;
      setReqSeller({
        ...reqSeller,
        Personal_Card_Back: String(base64Data),
      });
    };
  };

  const isReqSeller = async () => {
    const apiUrl =
      ip_address() + "/isreqseller/" + localStorage.getItem("email");
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
          setIsUserReqSeller(true);
        } else {
          setIsUserReqSeller(false);
        }
      });
  };

  const CreateReqSeller = async () => {
    setDialogLoadOpen(true);

    let data = {
      Personal_Card_Front: reqSeller.Personal_Card_Front,
      Personal_Card_Back: reqSeller.Personal_Card_Back,
    };

    const apiUrl = ip_address() + "/reqseller/" + localStorage.getItem("email"); //ส่งขอการเพิ่ม
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
          await isReqSeller();
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
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
      await isReqSeller();
      setDialogLoadOpen(false);
    };
    fetchData();
  }, []);

  if (!isUserReqSeller) {
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
          <div>
            <div className="div-header">
              <h2>Register seller</h2>
            </div>

            <div className="div-description">
              You must register as a seller with us first. This registration
              will not take long. <br />
              Upload a picture of your Personal card both front and back.
              <br />
              <br />
            </div>

            <div className="div-upload">
              <div>Front:</div>
              {reqSeller.Personal_Card_Front && (
                <img
                  src={`${reqSeller?.Personal_Card_Front}`}
                  width="80%"
                  height="100%"
                />
              )}
              <input type="file" onChange={handleImageChangeFront} />
            </div>

            <div className="div-upload">
              <div>
                <br />
                Back:
              </div>
              {reqSeller.Personal_Card_Back && (
                <img
                  src={`${reqSeller?.Personal_Card_Back}`}
                  width="80%"
                  height="100%"
                />
              )}
              <input type="file" onChange={handleImageChangeBack} />
            </div>
          </div>

          <div className="div-btn">
            <button className="btn-send" onClick={CreateReqSeller}>
              Send
            </button>
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
  } else {
    return (
      <>
        <div className="div-main">
          <div>
            <div className="div-header">
              <h2>Register seller</h2>
            </div>

            <div className="div-description-wait">
              Please wait for verification. It may take 1-2 days.
              <br />
              <br />
              <br />
              <br />
              <div>
                <div className="custom-loader" />
              </div>
              <br />
              <br />
              <br />
              <br />
            </div>
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
