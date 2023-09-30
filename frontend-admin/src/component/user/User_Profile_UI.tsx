/* eslint-disable no-template-curly-in-string */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-concat */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogTitle,
  Snackbar,
  Typography,
} from "@mui/material";
import Moment from "moment";
import "./User_Profile_UI.css";

import { useParams } from "react-router-dom";

import { UsersInterface } from "../../model/user/IUser";
import ip_address from "../ip";
import { CommentsInterface } from "../../model/comment/IComment";
import moment from "moment";

function User_Profile_For_Admin() {
  const { profile_name } = useParams(); // ดึง parameter จาก url-parameter
  const [user, setUser] = React.useState<Partial<UsersInterface>>({});
  const [commentList, setCommentList] = React.useState<CommentsInterface[]>([]);

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

  const getUser = async () => {
    const apiUrl = ip_address() + "/userforadmin/" + profile_name;
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
          setUser(res.data);
        }
      });
  };

  const getComment = async () => {
    const apiUrl = ip_address() + "/commentforadmin/" + profile_name;
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
        await setCommentList(res.data);
      });
  };

  const [count, setCount] = React.useState<number>(0);

  React.useEffect(() => {
    if (count === 0) {
      const fetchData = async () => {
        setDialogLoadOpen(true);
        await getUser();
        await getComment();
        setDialogLoadOpen(false);
      };
      fetchData();
      setCount(1);
    }
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

      <div className="user">
        <div className="picture">
          <img
            src={`${user.Profile_Picture}`}
            width="250"
            height="250"
            style={{ borderRadius: "15px" }}
          />
        </div>
        <div className="username">
          <h2>{user.Profile_Name}</h2>
        </div>
        <div className="info">
          {"Full name: " + user.FirstName + " " + user.LastName + "\n\n"}
          {"Email: " + user.Email + "\n\n"}
          {"Phone number: " + user.Phone_Number + "\n\n"}
          {"Gender: " + user.Gender?.Gender + "\n\n"}
        </div>
      </div>

      <div className="comment">
        <div className="comment-list">
          {commentList.map((item) => (
            <section>
              <Container style={{ maxWidth: "100%" }}>
                <div className="comment-body">
                  <img
                    style={{
                      borderRadius: "50%",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                      marginRight: "0.75rem",
                    }}
                    src={item.Commenter.Profile_Picture}
                    alt={`${item.Commenter.Profile_Name}'s profile`}
                    width="65"
                    height="65"
                  />
                  <Card style={{ width: "100%", background: "#c1c1c1" }}>
                    <CardContent
                      style={{
                        padding: "1rem",
                      }}
                    >
                      <div>
                        <Typography>
                          <a
                            href={`/profile/${item.Commenter.Profile_Name}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "black" }}
                          >
                            {item.Commenter.Profile_Name + " "}
                          </a>
                        </Typography>
                        <p className="small">
                          {moment(item.CreatedAt).format("DD/MM/YYYY hh:mm A")}
                        </p>
                        <div className="rating">
                          <div className="star-group">
                            <input
                              type="radio"
                              className="star"
                              id="one"
                              name={`star_rate_${item.ID}`}
                              checked={item.Rating === 1}
                            />
                            <input
                              type="radio"
                              className="star"
                              id="two"
                              name={`star_rate_${item.ID}`}
                              checked={item.Rating === 2}
                            />
                            <input
                              type="radio"
                              className="star"
                              id="three"
                              name={`star_rate_${item.ID}`}
                              checked={item.Rating === 3}
                            />
                            <input
                              type="radio"
                              className="star"
                              id="four"
                              name={`star_rate_${item.ID}`}
                              checked={item.Rating === 4}
                            />
                            <input
                              type="radio"
                              className="star"
                              id="five"
                              name={`star_rate_${item.ID}`}
                              checked={item.Rating === 5}
                            />
                          </div>
                        </div>

                        <p>{item.Comment_Text}</p>
                        <div>
                          {item.Review_image && (
                            <img
                              src={item.Review_image}
                              alt="Review content"
                              className="comment-image"
                            />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </Container>
            </section>
          ))}
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

export default User_Profile_For_Admin;
