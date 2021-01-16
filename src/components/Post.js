import React, { useState, useEffect } from "react";
import { db } from "../firebase.config";
import "./css/post.css";
import Avatar from "@material-ui/core/Avatar";
import firebase from 'firebase';

export default function Post({ user, username, caption, imgUrl, postId }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState();

  useEffect(() => {
    if (postId) {
      db.collection("posts")
        .doc(postId)
        .collection("comments")
		.orderBy("timestamp","desc")
        .onSnapshot((snapshot) =>
          setComments(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [postId]);

  const postComment = (e) => {
    e.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
        username: user.displayName,
        text: comment,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    setComment("");
  };

  return (
    <div className="post">
      <div className="post-header">
        <Avatar className="post-avatar" alt="..." src={imgUrl} />
        <h3>{username}</h3>
      </div>
      <img className="post-img" src={imgUrl} alt="..." />
      <h4 className="post-text">
        <strong>{username}</strong> {caption}
      </h4>
      <div className="post-comment">
        {comments.map((comment) => (
          <p>
            <b>{comment.username}</b> {comment.text}
          </p>
        ))}
      </div>
	  {
		 user && (
		  <form className="comment-form">
			<input
			  placeholder="add a comment..."
			  type="text"
			  value={comment}
			  onChange={(e) => setComment(e.target.value)}
			/>
			<button type="submit" disabled={!comment} onClick={postComment}>
			  Post
			</button>
		  </form>
		)
	  }
    </div>
  );
}
