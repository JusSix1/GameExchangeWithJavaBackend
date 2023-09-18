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
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import { Box, Grid, Paper } from "@mui/material";
import Moment from "moment";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { GendersInterface } from "../../models/user/IGender";

import { UsersInterface } from "../../models/user/IUser";
import ip_address from "../ip";
import moment from "moment";
import { CommentsInterface } from "../../models/comment/IComment";
import "./My_Profile_UI.css";

const ITEM_HEIGHT = 40;

function My_Profile() {
  const [user, setUser] = React.useState<Partial<UsersInterface>>({});
  const [userEdit, setUserEdit] = React.useState<Partial<UsersInterface>>({});
  const [genders, setGenders] = React.useState<GendersInterface[]>([]);
  const [commentList, setCommentList] = React.useState<CommentsInterface[]>([]);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [imageString, setImageString] = React.useState<
    string | ArrayBuffer | null
  >(null);
  const [birthday, setBirthday] = React.useState<Dayjs | null>(dayjs());
  const [password, setPassword] = React.useState<string | null>(null);
  const [old_password, setOld_password] = React.useState<string | null>(null);
  const [new_password, setNew_password] = React.useState<string | null>(null);
  const [confirm_password, setConfirm_password] = React.useState<string | null>(
    null
  );
  const [countPositive, setCountPositive] = React.useState<number>(0);
  const [countNegative, setCountNegative] = React.useState<number>(0);

  const openOption = Boolean(anchorEl);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [dialogEditOpen, setDialogEditOpen] = React.useState(false);
  const [dialogEditPasswordOpen, setDialogEditPasswordOpen] =
    React.useState(false);
  const [dialogDeleteOpen, setDialogDeleteOpen] = React.useState(false);
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

  const handleImageChange = (event: any) => {
    const image = event.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      const base64Data = reader.result;
      setImageString(base64Data);
    };
  };

  const handleClickOption = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseOption = () => {
    setAnchorEl(null);
  };

  const handleDialogEditClickOpen = () => {
    setUserEdit(user);
    setBirthday(dayjs(user.Birthday));
    setImageString(user.Profile_Picture || null);
    setDialogEditOpen(true);
    setAnchorEl(null);
  };

  const handleDialogEditClickClose = () => {
    setDialogEditOpen(false);
  };

  const handleDialogEditPasswordClickOpen = () => {
    setDialogEditPasswordOpen(true);
    setAnchorEl(null);
  };

  const handleDialogEditPasswordClickClose = () => {
    setDialogEditPasswordOpen(false);
  };

  const handleDialogDeleteClickOpen = () => {
    setDialogDeleteOpen(true);
    setAnchorEl(null);
  };

  const handleDialogDeleteClickClose = () => {
    setDialogDeleteOpen(false);
  };

  const getUser = async () => {
    const apiUrl = ip_address() + "/myinfo/" + localStorage.getItem("email"); // email คือ email ที่ผ่านเข้ามาทาง parameter
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

  const getGender = async () => {
    const apiUrl = ip_address() + "/genders";
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    await fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setGenders(res.data);
        }
      });
  };

  const getMyComment = async () => {
    setDialogLoadOpen(true);
    const apiUrl = ip_address() + "/mycomment/" + localStorage.getItem("email");
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
    setDialogLoadOpen(false);
  };

  const EditUser = () => {
    setDialogLoadOpen(true);
    let data = {
      Email: localStorage.getItem("email"),
      FirstName: userEdit.FirstName,
      LastName: userEdit.LastName,
      Profile_Name: userEdit.Profile_Name,
      Profile_Picture: imageString,
      Birthday: birthday,
      Address: userEdit.Address,
      PersonalID: userEdit.PersonalID,
      Bank_Account: userEdit.Bank_Account,
      Phone_number: userEdit.Phone_Number,
      Gender_ID: userEdit.Gender_ID,
    };
    const apiUrl = ip_address() + "/users"; //ส่งขอการแก้ไข
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
          getUser();
          handleDialogEditClickClose();
        } else {
          setError(true);
          setErrorMsg(" - " + res.error);
        }
      });
    setDialogLoadOpen(false);
  };

  const EditPasswordAccount = async () => {
    setDialogLoadOpen(true);
    if (new_password === confirm_password) {
      let data = {
        Email: localStorage.getItem("email"),
        OldPassword: old_password,
        NewPassword: new_password,
      };
      const apiUrl = ip_address() + "/usersPassword"; //ส่งขอการแก้ไข
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
            getUser();
            handleDialogEditPasswordClickClose();
          } else {
            setError(true);
            setErrorMsg(" - " + res.error);
          }
        });
    } else {
      setError(true);
      setErrorMsg("รหัสผ่านไม่ตรงกัน");
    }
    setDialogLoadOpen(false);
  };

  const DeleteAccount = async () => {
    setDialogLoadOpen(true);
    let data = {
      Password: password,
    };
    const apiUrl = ip_address() + "/users/" + localStorage.getItem("email"); //ส่งขอการลบ
    const requestOptions = {
      method: "DELETE",
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
          handleDialogDeleteClickClose();
          signout();
        } else {
          setError(true);
          setErrorMsg(" - " + res.error);
        }
      });
    setDialogLoadOpen(false);
  };

  const signout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  React.useEffect(() => {
    const fetchData = async () => {
      setDialogLoadOpen(true);
      await getUser();
      await getGender();
      await getMyComment();
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

      <div className="user">
        <div className="picture">
          <img
            src={`${user.Profile_Picture}`}
            width="250"
            height="250"
            style={{ borderRadius: "15px" }}
          />
        </div>
        <div className="username-btn">
          <div className="username">
            <h1>{user.Profile_Name}</h1>
          </div>
          <div className="div-btn">
            <IconButton
              aria-label="more"
              id="long-button"
              aria-controls={openOption ? "long-menu" : undefined}
              aria-expanded={openOption ? "true" : undefined}
              aria-haspopup="true"
              onClick={handleClickOption}
              style={{ color: "#FFF" }}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="long-menu"
              MenuListProps={{
                "aria-labelledby": "long-button",
              }}
              anchorEl={anchorEl}
              open={openOption}
              onClose={handleCloseOption}
              PaperProps={{
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: "20ch",
                },
              }}
            >
              <MenuItem onClick={handleDialogEditClickOpen}>edit</MenuItem>
              <MenuItem onClick={handleDialogEditPasswordClickOpen}>
                Change Password
              </MenuItem>
              <MenuItem onClick={handleDialogDeleteClickOpen}>
                Delete Account
              </MenuItem>
            </Menu>
          </div>
        </div>

        <div className="info">
          {/** กำหนดให้เว้นบรรทัด auto จาก white space */}
          {"Full name: " + user.FirstName + " " + user.LastName + "\n\n"}
          {"Personal ID: " + user.PersonalID + "\n\n"}
          {"Email: " + user.Email + "\n\n"}
          {"Birthday: " +
            `${Moment(user.Birthday).format("DD MMMM YYYY")}` +
            "\n\n"}
          {"Phone number: " + user.Phone_Number + "\n\n"}
          {"Gender: " + user.Gender?.Gender + "\n\n"}
          {"Address: " + user.Address + "\n\n"}
          {"Bank account number: " + user.Bank_Account + "\n\n"}
        </div>
      </div>

      <div className="comment">
        <Card style={{ background: "#c1c1c1" }}>
          <CardContent>
            <div className="comment-header">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                Positive: {countPositive}
                <ThumbUpAltIcon style={{ color: "green" }} />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {countPositive >= countNegative ? (
                  <div style={{ color: "green" }}>
                    Most of the comments were positive.
                  </div>
                ) : (
                  <div style={{ color: "red" }}>
                    Most of the comments were negative.
                  </div>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                Negative: {countNegative}
                <ThumbDownAltIcon style={{ color: "red" }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="div-btn"></div>

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
                          {item.Is_Positive ? (
                            <ThumbUpAltIcon style={{ color: "green" }} />
                          ) : (
                            <ThumbDownAltIcon style={{ color: "red" }} />
                          )}
                        </a>
                      </Typography>
                      <p className="small">
                        {moment(item.CreatedAt).format("DD/MM/YYYY hh:mm A")}
                      </p>
                      <p>{item.Comment_Text}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </Container>
          </section>
        ))}
      </div>

      <Dialog //Edit
        open={dialogEditOpen}
        onClose={handleDialogEditClickClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Update Data"}</DialogTitle>

        <DialogContent>
          <Box>
            <Paper elevation={2} sx={{ padding: 2, margin: 2 }}>
              <Grid container>
                <Grid container>
                  <Grid margin={1} item xs={12}>
                    <TextField
                      fullWidth
                      id="firstname"
                      label="First name"
                      variant="outlined"
                      defaultValue={user.FirstName}
                      onChange={(event) =>
                        setUserEdit({
                          ...userEdit,
                          FirstName: event.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid margin={1} item xs={12}>
                    <TextField
                      fullWidth
                      id="lastname"
                      label="Last name"
                      variant="outlined"
                      defaultValue={user.LastName}
                      onChange={(event) =>
                        setUserEdit({
                          ...userEdit,
                          LastName: event.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid margin={1} item xs={12}>
                    <TextField
                      fullWidth
                      id="personalID"
                      label="Personal ID"
                      variant="outlined"
                      defaultValue={user.PersonalID}
                      onChange={(event) =>
                        setUserEdit({
                          ...userEdit,
                          PersonalID: event.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid margin={1} item xs={12}>
                    <TextField
                      fullWidth
                      id="address"
                      label="Address"
                      variant="outlined"
                      defaultValue={user.Address}
                      onChange={(event) =>
                        setUserEdit({
                          ...userEdit,
                          Address: event.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid margin={1} item xs={12}>
                    <TextField
                      fullWidth
                      id="bank_account"
                      label="Bank account number"
                      variant="outlined"
                      defaultValue={user.Bank_Account}
                      onChange={(event) =>
                        setUserEdit({
                          ...userEdit,
                          Bank_Account: event.target.value,
                        })
                      }
                    />
                  </Grid>
                </Grid>

                <Grid container>
                  <Grid margin={1} item xs={5}>
                    <TextField
                      fullWidth
                      id="profile-name"
                      label="Profile Name"
                      variant="outlined"
                      defaultValue={user.Profile_Name}
                      onChange={(event) =>
                        setUserEdit({
                          ...userEdit,
                          Profile_Name: event.target.value,
                        })
                      }
                    />
                  </Grid>

                  <Grid marginTop={1}>
                    <Grid>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Birthday"
                          value={dayjs(user.Birthday)}
                          onChange={(newValue) => {
                            setBirthday(newValue);
                          }}
                        />
                      </LocalizationProvider>
                    </Grid>
                  </Grid>

                  <Grid container>
                    <Grid margin={1} item xs={5}>
                      <TextField
                        fullWidth
                        id="phonr-number"
                        label="Phone number"
                        variant="outlined"
                        defaultValue={user.Phone_Number}
                        onChange={(event) =>
                          setUserEdit({
                            ...userEdit,
                            Phone_Number: event.target.value,
                          })
                        }
                      />
                    </Grid>
                    <Grid marginTop={1}>
                      <FormControl>
                        <FormLabel id="radio-buttons-group-gender">
                          Gender
                        </FormLabel>
                        <RadioGroup
                          aria-labelledby="radio-buttons-group-gender"
                          name="radio-buttons-group-gender"
                          onChange={(event) =>
                            setUserEdit({
                              ...userEdit,
                              Gender_ID: Number(event.target.value),
                            })
                          }
                          defaultValue={user.Gender_ID}
                        >
                          {genders.map((o) => (
                            <FormControlLabel
                              value={o.ID} // <---- pass a primitive id value, don't pass the whole object here
                              control={<Radio size="small" />}
                              label={o.Gender}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <h4>Profile Picture</h4>
                    <Grid>
                      <img src={`${imageString}`} width="250" height="250" />
                    </Grid>
                    <input type="file" onChange={handleImageChange} />
                    <FormHelperText>
                      recommend size is 250*250 pixels
                    </FormHelperText>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            size="small"
            color="inherit"
            onClick={handleDialogEditClickClose}
          >
            Cancel
          </Button>
          <Button
            size="small"
            onClick={EditUser}
            sx={{ color: "#00ADB5" }}
            color="error"
            autoFocus
          >
            Update Data
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog //ChangePassword
        open={dialogEditPasswordOpen}
        onClose={handleDialogEditPasswordClickClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Change Password"}</DialogTitle>

        <DialogContent>
          <Box>
            <Paper elevation={2} sx={{ padding: 2, margin: 2 }}>
              <Grid container>
                <Grid container>
                  <Grid margin={1} item xs={12}>
                    <TextField
                      fullWidth
                      id="old_password"
                      label="Old Password"
                      variant="outlined"
                      type="password"
                      onChange={(event) => setOld_password(event.target.value)}
                    />
                  </Grid>
                  <Grid margin={1} item xs={12}>
                    <TextField
                      fullWidth
                      id="new_password"
                      label="New Password"
                      variant="outlined"
                      type="password"
                      onChange={(event) => setNew_password(event.target.value)}
                    />
                  </Grid>
                  <Grid margin={1} item xs={12}>
                    <TextField
                      fullWidth
                      id="confirnm_password"
                      label="Confirm New Password"
                      variant="outlined"
                      type="password"
                      onChange={(event) =>
                        setConfirm_password(event.target.value)
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            size="small"
            color="inherit"
            onClick={handleDialogEditPasswordClickClose}
          >
            Cancel
          </Button>
          <Button
            size="small"
            onClick={EditPasswordAccount}
            color="error"
            sx={{ color: "#ff753e" }}
            autoFocus
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog //DeleteAccount
        open={dialogDeleteOpen}
        onClose={handleDialogDeleteClickClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Account"}</DialogTitle>

        <DialogContent>
          <Box>
            <Paper elevation={2} sx={{ padding: 2, margin: 2 }}>
              <Grid container>
                <Grid container>
                  <Grid margin={1} item xs={12}>
                    <TextField
                      fullWidth
                      id="password"
                      label="Password"
                      variant="outlined"
                      type="password"
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            size="small"
            color="inherit"
            onClick={handleDialogDeleteClickClose}
          >
            Cancel
          </Button>
          <Button
            size="small"
            onClick={DeleteAccount}
            sx={{ color: "#ff753e" }}
            color="error"
            autoFocus
          >
            Delete Password
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

export default My_Profile;
