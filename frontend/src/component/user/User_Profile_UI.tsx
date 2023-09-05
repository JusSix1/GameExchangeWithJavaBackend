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
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Snackbar,
  Typography,
} from "@mui/material";
import { Box, Grid } from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import Moment from "moment";

import { useParams } from "react-router-dom";

import { UsersInterface } from "../../models/user/IUser";
import ip_address from "../ip";
import { CommentsInterface } from "../../models/comment/IComment";
import moment from "moment";

function User_Profile() {
  const { profile_name } = useParams(); // ดึง parameter จาก url-parameter
  const [user, setUser] = React.useState<Partial<UsersInterface>>({});
  const [commentList, setCommentList] = React.useState<CommentsInterface[]>([]);

  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const [showComments, setShowComments] = React.useState(false);
  const [isPositive, setIsPositive] = React.useState<Boolean>();
  const [value, setValue] = React.useState("");
  const [commentText, setCommentText] = React.useState<string>();
  const [countPositive, setCountPositive] = React.useState<number>(0);
  const [countNegative, setCountNegative] = React.useState<number>(0);

  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [dialogLoadOpen, setDialogLoadOpen] = React.useState(false);

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

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if ((event.target as HTMLInputElement).value === "1") {
      setIsPositive(true);
      setValue((event.target as HTMLInputElement).value);
    } else if ((event.target as HTMLInputElement).value === "2") {
      setIsPositive(false);
      setValue((event.target as HTMLInputElement).value);
    }
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

    let countPositiveIn = 0;
    let countNegativeIn = 0;

    await fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then(async (res) => {
        if (res.data) {
          res.data.forEach((comment: { Is_Positive: any }) => {
            if (comment.Is_Positive) {
              countPositiveIn++;
            } else {
              countNegativeIn++;
            }
          });

          await setCountPositive(countPositiveIn);
          await setCountNegative(countNegativeIn);

          await setCommentList(res.data);
        }
      });
  };

  const CreateComment = async () => {
    if (isPositive === undefined) {
      setError(true);
      setErrorMsg(" -  Please rate");
    } else {
      setDialogLoadOpen(true);

      let data = {
        Profile_Name: profile_name,
        Comment_Text: commentText,
        Is_Positive: isPositive,
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
            setCommentText("");
            setIsPositive(undefined);
            setValue("");
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
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = "0px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + "px";
    }
  }, [count, commentText]);

  return (
    <>
      <Container>
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

        <Grid //แสดงผลข้อมูล User
        >
          <Grid container>
            <Grid margin={2}>
              <img src={`${user.Profile_Picture}`} width="250" height="250" />{" "}
              {/** show base64 picture from string variable (that contain base64 picture data) */}
            </Grid>
            <Grid marginLeft={1} item xs={12}>
              <Grid>
                <h2>{user.Profile_Name}</h2>
              </Grid>
              <Grid item>
                {" "}
                {/** เอา Grid มาล็อคไม่ให้ component มันเด้งไปที่อื่น */}
                <Box
                  component="div"
                  sx={{
                    width: "100%",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "break-spaces",
                    my: 2,
                    p: 1,
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark" ? "#101010" : "grey.100",
                    color: (theme) =>
                      theme.palette.mode === "dark" ? "grey.300" : "grey.800",
                    border: "1px solid",
                    borderColor: (theme) =>
                      theme.palette.mode === "dark" ? "grey.800" : "grey.300",
                    borderRadius: 2,
                    fontSize: "0.875rem",
                    fontWeight: "700",
                  }}
                >
                  {/** กำหนดให้เว้นบรรทัด auto จาก white space */}
                  {"Full name: " +
                    user.FirstName +
                    " " +
                    user.LastName +
                    "\n\n"}
                  {"Email: " + user.Email + "\n\n"}
                  {"Phone number: " + user.Phone_Number + "\n\n"}
                  {"Gender: " + user.Gender?.Gender + "\n\n"}
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid //Comment
          sx={{ marginTop: 1 }}
        >
          <Card>
            <CardContent>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  width: "100%",
                }}
              >
                <div style={{ width: "100%" }}>
                  <Typography sx={{ marginBottom: 1 }}>
                    Add a comment
                  </Typography>

                  <FormControl>
                    <FormLabel id="demo-controlled-radio-buttons-group">
                      Satisfaction
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      onChange={handleRadioChange}
                      value={value}
                    >
                      <FormControlLabel
                        value="1"
                        control={
                          <Radio
                            sx={{
                              color: "green",
                              "&.Mui-checked": { color: "green" },
                            }}
                          />
                        }
                        label="Positive"
                      />
                      <FormControlLabel
                        value="2"
                        control={
                          <Radio
                            sx={{
                              color: "red",
                              "&.Mui-checked": { color: "red" },
                            }}
                          />
                        }
                        label="Negative"
                      />
                    </RadioGroup>
                  </FormControl>

                  <Grid container>
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
                      }}
                      onChange={textAreaChange}
                      value={commentText}
                    ></textarea>
                  </Grid>

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
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      Positive: {countPositive}<ThumbUpAltIcon style={{ color: "green" }} />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {countPositive >= countNegative ? (
                        <div style={{ color: "green" }}>Most of the comments were positive.</div>
                      ) : (
                        <div style={{ color: "red" }}>Most of the comments were negative.</div>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      Negative: {countNegative}<ThumbDownAltIcon style={{ color: "red" }} />
                    </div>
                    <Button variant="contained" sx={{backgroundColor: "#00ADB5"}} onClick={() => CreateComment()}>
                      Comment
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Grid sx={{ marginTop: 2 }}>
            {showComments &&
              commentList.map((item) => (
                <section>
                  <Container style={{ maxWidth: "100%" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        marginBottom: "1rem",
                      }}
                    >
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
                      <Card style={{ width: "100%" }}>
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
                                {item.Is_Positive ? (
                                  <ThumbUpAltIcon style={{ color: "green" }} />
                                ) : (
                                  <ThumbDownAltIcon style={{ color: "red" }} />
                                )}
                              </a>
                            </Typography>
                            <p className="small">
                              {moment(item.CreatedAt).format(
                                "DD/MM/YYYY hh:mm A"
                              )}
                            </p>
                            <p>{item.Comment_Text}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </Container>
                </section>
              ))}
          </Grid>
        </Grid>
      </Container>

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
              <div className="custom-loader"/>
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
