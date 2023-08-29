/* eslint-disable no-useless-concat */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import {
  Alert,
  Container,
  Snackbar,
} from "@mui/material";
import { Box, Grid } from "@mui/material";
import Moment from "moment";

import { useParams } from "react-router-dom";

import { UsersInterface } from "../../models/user/IUser";
import ip_address from "../ip";

function User_Profile() {
  const { profile_name } = useParams(); // ดึง parameter จาก url-parameter
  const [user, setUser] = React.useState<Partial<UsersInterface>>({});

  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

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
    const apiUrl = ip_address() + "/user/" + profile_name; // email คือ email ที่ผ่านเข้ามาทาง parameter
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
          console.log(res.data)
        }
      });
  };

  React.useEffect(() => {
    const fetchData = async () => {
      await getUser();
    };
    fetchData();
  }, []);

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
        <Grid>
          <Grid container>
            <Grid margin={2}>
              <img src={`${user.Profile_Picture}`} width="250" height="250" />{" "}
              {/** show base64 picture from string variable (that contain base64 picture data) */}
            </Grid>
            <Grid marginLeft={1} item xs={10}>
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
      </Container>
    </>
  );
}

export default User_Profile;
