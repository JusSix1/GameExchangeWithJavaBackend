/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/style-prop-object */
import React from "react";
import { PostsInterface } from "../../models/post/IPost";
import ip_address from "../ip";
import { Alert, Dialog, DialogTitle, Grid, Snackbar } from "@mui/material";
import "./Edit_post.css";
import Moment from "moment";
import moment from "moment";
import { useParams } from "react-router-dom";

const styles: { [name: string]: React.CSSProperties } = {
  container: {
    marginTop: 50,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  textareaDefaultStyle: {
    padding: 5,
    width: "99%",
    height: "100%",
    display: "block",
    resize: "none",
    backgroundColor: "#F",
    fontSize: 16,
  },
};

export default function Edit_post_UI() {
  const { id } = useParams();
  const [post, setPost] = React.useState<Partial<PostsInterface>>({});

  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

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

  const textAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPost({ ...post, Description: event.target.value });
  };

  const handleImageChange = (event: any) => {
    const image = event.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      const base64Data = reader.result;
      setPost({ ...post, Advertising_image: String(base64Data) });
    };
  };

  const getPost = async () => {
    const apiUrl =
      ip_address() + "/post/" + localStorage.getItem("email") + "/" + id;
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
          console.log(res.data);
        } else {
          setError(true);
          setErrorMsg(" - " + res.error);
        }
      });
  };

  const UpdatePost = async () => {
    setDialogLoadOpen(true);

    let data = {
      ID:                   post.ID,
      Description:          post.Description,
      Advertising_image:    post.Advertising_image,
    };

    const apiUrl = ip_address() + "/post"; //ส่งขอการเพิ่ม
    const requestOptions = {
      method: "PATCH",
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
          getPost();
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
        await getPost();
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
  }, [count, post.Description]);

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

      <Grid
        sx={{ margin: 1 }}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid width={"90%"}>
          <div className="post">
            <div className="post-header">
              <img
                src={post.User?.Profile_Picture}
                alt={`${post.User?.Profile_Name}'s profile`}
              />
              <div className="post-author">
                <a
                  href={`/profile/${post.User?.Profile_Name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {post.User?.Profile_Name}
                </a>
              </div>
              <div className="post-timestamp">
                {moment(post?.CreatedAt).format("DD/MM/YYYY hh:mm A")}
              </div>
            </div>
            <textarea
              ref={textareaRef}
              style={styles.textareaDefaultStyle}
              onChange={textAreaChange}
              defaultValue={post.Description}
            >
              {post.Description}
            </textarea>
            <div className="post-price">
              <h4>Price {post.Account?.Price} ฿</h4>
            </div>
            {post?.Advertising_image && (
              <>
                <div>
                  <img
                    src={post?.Advertising_image}
                    alt="Posted content"
                    className="post-image"
                  />
                </div>
                <div>
                  <input type="file" onChange={handleImageChange} style={{ color: "#FFF"}} />
                </div>
              </>
            )}
            {post.Description && (
              <div className="container-save">
                <button className="button-save" onClick={UpdatePost}>
                  Save
                </button>
              </div>
            )}
          </div>
        </Grid>
      </Grid>

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
