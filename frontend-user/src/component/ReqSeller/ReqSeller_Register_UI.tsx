/* eslint-disable react/jsx-pascal-case */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
/* eslint-disable jsx-a11y/alt-text */
import { Snackbar, Alert, Dialog, DialogTitle } from "@mui/material";
import * as React from "react";
import "./ReqSeller.css";
import { ReqSellersInterface } from "../../models/reqseller/IReqSeller";
import ip_address from "../ip";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import Moment from "moment";

export default function ReqSeller_Register_UI() {
  const [reqSeller, setReqSeller] = React.useState<
    Partial<ReqSellersInterface>
  >({});

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
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
          setReqSeller({});
          setSuccess(true);
          window.location.href = "/Status_Seller";
        } else {
          setError(true);
          setErrorMsg(" - " + res.error);
        }
      });

    setDialogLoadOpen(false);
  };

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
            You must register as a seller with us first. This registration will
            not take long. <br />
            Upload a picture of your Personal card both front and back.
            <br />
            <br />
            <br />
            <h3>Community rules:</h3>
            <ul>
              <li>Do not cheat in trading</li>
              <li>
                Please send the account to the customer as soon as possible. If
                you have already received the money transfer
              </li>
            </ul>
            <br />
          </div>

          <div className="div-upload">
            <div>Front:</div>
            <div className="div-personalID-image">
              {reqSeller.Personal_Card_Front ? (
                <img
                  src={`${reqSeller?.Personal_Card_Front}`}
                  width="80%"
                  height="100%"
                />
              ) : (
                <>
                  <input
                    type="file"
                    id="Image-Input-front"
                    style={{ display: "none" }}
                    onChange={handleImageChangeFront}
                  />
                  <label htmlFor="Image-Input-front">
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
            {reqSeller.Personal_Card_Front ? (
              <>
                <input
                  type="file"
                  id="Image-Input-front"
                  style={{ display: "none" }}
                  onChange={handleImageChangeFront}
                  accept=".jpg, .jpeg, .png"
                />
                <label
                  htmlFor="Image-Input-front"
                  style={{ cursor: "pointer" }}
                >
                  <div className="div-change-personal-image">Change Front Image</div>
                </label>
              </>
            ) : null}
          </div>

          <div className="div-upload">
            <div>
              <br />
              Back:
            </div>
            <div className="div-personalID-image">
              {reqSeller.Personal_Card_Back ? (
                <img
                  src={`${reqSeller?.Personal_Card_Back}`}
                  width="80%"
                  height="100%"
                />
              ) : (
                <>
                  <input
                    type="file"
                    id="Image-Input-Back"
                    style={{ display: "none" }}
                    onChange={handleImageChangeBack}
                  />
                  <label htmlFor="Image-Input-Back">
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
            {reqSeller.Personal_Card_Back ? (
              <>
                <input
                  type="file"
                  id="Image-Input-back"
                  style={{ display: "none" }}
                  onChange={handleImageChangeFront}
                  accept=".jpg, .jpeg, .png"
                />
                <label htmlFor="Image-Input-back" style={{ cursor: "pointer" }}>
                  <div className="div-change-personal-image">Change Back Image</div>
                </label>
              </>
            ) : null}
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
}
