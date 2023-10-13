/* eslint-disable jsx-a11y/no-redundant-roles */
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
  DialogActions,
  DialogTitle,
  Snackbar,
  Typography,
} from "@mui/material";
import Moment from "moment";
import "./My_Profile_UI.css";

import { useParams } from "react-router-dom";

import { UsersInterface } from "../../models/user/IUser";
import ip_address from "../ip";
import { CommentsInterface } from "../../models/comment/IComment";
import moment from "moment";

function User_Profile() {
  const { profile_name } = useParams(); // ดึง parameter จาก url-parameter
  const [user, setUser] = React.useState<Partial<UsersInterface>>({});
  const [commentList, setCommentList] = React.useState<CommentsInterface[]>([]);
  const [avgRating, setAvgRating] = React.useState<number>();
  const [commentedID, setCommentedID] = React.useState<CommentsInterface[]>([]);
  const [commentID, setCommentID] = React.useState<number>();

  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const [showComments, setShowComments] = React.useState(false);
  const [commentText, setCommentText] = React.useState<string>();
  const [commentRating, setCommentRating] = React.useState<number>();
  const [imageString, setImageString] = React.useState<
    string | ArrayBuffer | null
  >(null);

  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [dialogLoadOpen, setDialogLoadOpen] = React.useState(false);
  const [dialogDeleteOpen, setDialogDeleteOpen] = React.useState(false);

  Moment.locale("th");

  const textAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(event.target.value);
  };

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
      setImageString(base64Data);
    };
  };

  const handleClickRating = (point: number) => {
    setCommentRating(point);
  };

  const handleClickDelete = (id: number) => {
    setDialogDeleteOpen(true);
    setCommentID(id);
  };

  const handleDialogDeleteClickClose = () => {
    setDialogDeleteOpen(false);
    setCommentID(undefined);
  };

  const getUser = async () => {
    const apiUrl = ip_address() + "/user/" + profile_name;
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
    const apiUrl = ip_address() + "/comment/" + profile_name;
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
        // Assuming res.data is an array of comment objects
        const commentList = res.data;

        // Calculate the average rating
        const totalRating = commentList.reduce(
          (accumulator: any, comment: { Rating: any }) =>
            accumulator + comment.Rating,
          0
        );
        const averageRating =
          commentList.length > 0 ? totalRating / commentList.length : 0;

        setAvgRating(Math.round(averageRating));

        await setCommentList(res.data);
      });
  };

  const getMyCommentedID = async () => {
    const apiUrl =
      ip_address() +
      "/mycommentedid/" +
      localStorage.getItem("email") +
      "/" +
      profile_name;
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
        await setCommentedID(res.data);
      });
  };

  const CreateComment = async () => {
    if (
      commentRating === undefined ||
      !(commentRating >= 1 && commentRating <= 5)
    ) {
      setError(true);
      setErrorMsg(" -  Please rate");
    } else {
      setDialogLoadOpen(true);

      let data = {
        Profile_Name: profile_name,
        Comment_Text: commentText,
        Review_image: imageString,
        Rating: commentRating,
      };

      const apiUrl = ip_address() + "/comment/" + localStorage.getItem("email"); //ส่งขอการเพิ่ม
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
            getComment();
            getMyCommentedID();
            setCommentText("");
            setCommentRating(0);
            setImageString(null);
            if (!showComments) {
              setShowComments(!showComments);
            }
          } else {
            setError(true);
            setErrorMsg(" - " + res.error);
          }
        });
      setDialogLoadOpen(false);
    }
  };

  const DeleteComment = async () => {
    setDialogLoadOpen(true);

    let data = {
      ID: commentID,
    };

    const apiUrl = ip_address() + "/deletecomment";
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
          getComment();
          getMyCommentedID();
          handleDialogDeleteClickClose();
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
        await getUser();
        await getComment();
        await getMyCommentedID();
        setDialogLoadOpen(false);
      };
      fetchData();
      setCount(1);
    }
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = "0px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + "px";
    }
  }, [count, commentText]);

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
          {user.Facebook && ("Facebook: " + user.Facebook + "\n\n")}
          {user.Instagram && ("Instagram: " + user.Instagram + "\n\n")}
          {user.Line && ("Line: " + user.Line + "\n\n")}
        </div>
      </div>

      <div className="comment">
        <Card style={{ background: "#c1c1c1" }}>
          <CardContent>
            <div className="comment-header">
              <div style={{ width: "100%" }}>
                <Typography sx={{ marginBottom: 1 }}>Add a comment</Typography>

                <div className="rating">
                  <div className="star-group">
                    <input
                      type="radio"
                      className="star"
                      id="one"
                      name="star_rating"
                      checked={commentRating === 1}
                      onClick={() => handleClickRating(1)}
                    />
                    <input
                      type="radio"
                      className="star"
                      id="two"
                      name="star_rating"
                      checked={commentRating === 2}
                      onClick={() => handleClickRating(2)}
                    />
                    <input
                      type="radio"
                      className="star"
                      id="three"
                      name="star_rating"
                      checked={commentRating === 3}
                      onClick={() => handleClickRating(3)}
                    />
                    <input
                      type="radio"
                      className="star"
                      id="four"
                      name="star_rating"
                      checked={commentRating === 4}
                      onClick={() => handleClickRating(4)}
                    />
                    <input
                      type="radio"
                      className="star"
                      id="five"
                      name="star_rating"
                      checked={commentRating === 5}
                      onClick={() => handleClickRating(5)}
                    />
                  </div>
                </div>

                <div>
                  <textarea
                    ref={textareaRef}
                    style={{
                      padding: 5,
                      marginTop: 10,
                      width: "98%",
                      height: "100%",
                      display: "block",
                      resize: "none",
                      backgroundColor: "#F",
                      fontSize: 16,
                      borderRadius: "5px",
                    }}
                    onChange={textAreaChange}
                    value={commentText}
                  ></textarea>
                </div>

                <div style={{ marginTop: "1rem" }}>
                  {imageString && (
                    <img
                      src={`${imageString}`}
                      alt="Posted content"
                      className="comment-image"
                    />
                  )}
                  <input type="file" onChange={handleImageChange} />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "1rem",
                  }}
                >
                  <Button
                    color="inherit"
                    onClick={() => setShowComments(!showComments)}
                  >
                    {showComments ? "Hide comment" : "Show comment"}
                  </Button>
                  <div className="rating">
                    <div className="star-group">
                      <p style={{ fontSize: "12px" }}>Average rating: </p>
                      <input
                        type="radio"
                        className="star"
                        id="one"
                        name="avg_rating"
                        checked={avgRating === 1}
                      />
                      <input
                        type="radio"
                        className="star"
                        id="two"
                        name="avg_rating"
                        checked={avgRating === 2}
                      />
                      <input
                        type="radio"
                        className="star"
                        id="three"
                        name="avg_rating"
                        checked={avgRating === 3}
                      />
                      <input
                        type="radio"
                        className="star"
                        id="four"
                        name="avg_rating"
                        checked={avgRating === 4}
                      />
                      <input
                        type="radio"
                        className="star"
                        id="five"
                        name="avg_rating"
                        checked={avgRating === 5}
                      />
                    </div>
                  </div>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "#00ADB5" }}
                    onClick={() => CreateComment()}
                  >
                    Comment
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="comment-list">
          {showComments &&
            commentList.map((item) => (
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
                            {moment(item.CreatedAt).format(
                              "DD/MM/YYYY hh:mm A"
                            )}
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
                          <div className="delete-container">
                            {commentedID.some(
                              (commentedItem) => commentedItem.ID === item.ID
                            ) && (
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() => handleClickDelete(item.ID)}
                              >
                                Delete
                              </Button>
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
            onClick={DeleteComment}
            sx={{ color: "#ff753e" }}
            color="error"
            autoFocus
          >
            Delete
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

export default User_Profile;
