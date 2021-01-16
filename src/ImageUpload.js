import React, { useState } from "react";
import { Input, Button } from "@material-ui/core/";
import { storage, db } from "./firebase.config";
import firebase from "firebase";
import "./components/css/imageupload.css";

export default function ImageUpload({ username }) {
  const [caption, setCaption] = useState(""),
    [img, setImg] = useState(null),
    [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImg(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`img/${img.name}`).put(img);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        let progress = Math.round((snapshot.bytesTransferred / snapshot) * 100);
        setProgress(progress);
      },
      (err) => {
        console.log(err);
        alert(err.message);
      },
      () => {
        storage
          .ref(`img`)
          .child(img.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imgUrl: url,
              username: username,
            });
            setProgress(0);
            setCaption("");
            setImg(null);
          });
      }
    );
  };

  return (
    <div className="imageupload">
      <progress value={progress} max="100" />
      <Input
        type="text"
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Enter a caption..."
        value={caption}
      />
      <Input type="file" onChange={handleChange} />
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
}
