import React, { useState, useEffect } from "react";
import "./components/css/app.css";
import Post from "./components/Post";
import { db, auth } from "./firebase.config";
import "./components/css/header.css";
import SearchSharpIcon from "@material-ui/icons/SearchSharp";
import HomeIcon from "@material-ui/icons/Home";
import SendOutlinedIcon from "@material-ui/icons/SendOutlined";
import ExploreOutlinedIcon from "@material-ui/icons/ExploreOutlined";
import FavoriteBorderSharpIcon from "@material-ui/icons/FavoriteBorderSharp";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import { Input } from "@material-ui/core";
import ImageUpload from "./ImageUpload";
import InstagramEmbed from "react-instagram-embed";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function App() {
  const classes = useStyles(),
    [posts, setPosts] = useState([]),
    [open, setOpen] = useState(false),
    [username, setUsername] = useState(""),
    [email, setEmail] = useState(""),
    [openSignIn, setOpenSignIn] = useState(false),
    [password, setPassword] = useState(""),
    [modalStyle] = useState(getModalStyle),
    [user, setUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user logged in
        console.log(authUser);
        setUser(authUser);
      } else {
        // user logged out
        setUser(null);
      }
    });
  }, [user, username]);

  useEffect(() => {
    // snapshot runs every times document updates on firebase -> database colllection -> posts
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        )
      );
  }, [posts]);

  const signUp = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((err) => alert(err.message));
    setOpen(false);
  };

  const signIn = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((err) => alert(err.message));
    setOpenSignIn(false);
  };

  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="signup-form" onSubmit={signUp}>
            <center>
              <img
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="logo"
              />
              <Input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit">SignUp</Button>
            </center>
          </form>
        </div>
      </Modal>
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="signup-form" onSubmit={signIn}>
            <center>
              <img
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="logo"
              />
              <Input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit">SignIn</Button>
            </center>
          </form>
        </div>
      </Modal>
      <div className="app-header">
        <div className="logo">
          <img
            className="app-header-img"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt="logo"
          />
        </div>
        <div className="header-search">
          <input type="text" placeholder="Search" />
          <span>
            <SearchSharpIcon style={{ fontSize: "20px" }} />
          </span>
        </div>
        <div className="header-features">
          <span>
            <HomeIcon style={{ fontSize: "27px" }} />
          </span>
          <span>
            <SendOutlinedIcon style={{ fontSize: "27px" }} />
          </span>
          <span>
            <ExploreOutlinedIcon style={{ fontSize: "27px" }} />
          </span>
          <span>
            <FavoriteBorderSharpIcon style={{ fontSize: "27px" }} />
          </span>
          {user ? (
            <Button type="submit" onClick={() => auth.signOut()}>
              Logout
            </Button>
          ) : (
            <div className="login-container">
              <Button onClick={() => setOpenSignIn(true)}>Sign in</Button>
              <Button onClick={() => setOpen(true)}>Sign Up</Button>
            </div>
          )}
        </div>
      </div>
      <div className="app_posts">
        <div className="app-posts-left">
          {posts.map(({ post, id }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imgUrl={post.imgUrl}
            />
          ))}
        </div>
        <div className="app-posts-right"></div>
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3 style={{textAlign:"center"}}>login to upload</h3>
      )}
    </div>
  );
}
