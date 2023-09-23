/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/style-prop-object */
import React from "react";
import { PostsInterface } from "../../models/post/IPost";
import ip_address from "../ip";
import { Alert, Dialog, DialogTitle, Snackbar } from "@mui/material";
import Moment from "moment";
import moment from "moment";
import { useParams } from "react-router-dom";

export default function Individual_Post_UI() {
  const { account_id } = useParams();
  const [post, setPost] = React.useState<PostsInterface>();

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

  const getIndividualPost = async () => {
    const apiUrl = ip_address() + "/individualpost/" + account_id;
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

  React.useEffect(() => {
    const fetchData = async () => {
      setDialogLoadOpen(true);
      await getIndividualPost();
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

      <div style={{ width: "100%" }}>
        <div className="post">
          <div className="post-header">
            <img
              src={post?.User.Profile_Picture}
              alt={`${post?.User.Profile_Name}'s profile`}
            />
            <div className="post-author">
              <a
                href={`/profile/${post?.User.Profile_Name}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#FFF" }}
              >
                {post?.User.Profile_Name}
              </a>
            </div>
            <div className="post-timestamp">
              {moment(post?.CreatedAt).format("DD/MM/YYYY hh:mm A")}
            </div>
          </div>
          <div className="post-content">{post?.Description}</div>
          <div className="post-price">
            <h4 style={{ color: "#FFF" }}>Price {post?.Account.Price} ฿</h4>
          </div>
          {post?.Advertising_image && (
            <img
              src={post?.Advertising_image}
              alt="Posted content"
              className="post-image"
            />
          )}
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
