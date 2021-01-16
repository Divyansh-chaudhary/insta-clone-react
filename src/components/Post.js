import React, { useState, useEffect } from "react";
import { db } from "../firebase.config";
import "./css/post.css";
import Avatar from "@material-ui/core/Avatar";

export default function Post({ username, caption, imgUrl, postId }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState();

  useEffect(() => {
    if (postId) {
      db.collection("posts")
        .doc(postId)
        .collection("comments")
        .onSnapshot((snapshot) =>
          setComments(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [postId]);

  const postComment = (e) => {
    e.preventDefault();
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
      <form className="comment-form">
        <input
          placeholder="add a comment..."
          type="text"
          value={comment}
          onChange={(e) => setComments(e.target.valu)}
        />
        <button type="submit" disabled={!comment} onClick={postComment}>
          post
        </button>
      </form>
    </div>
  );
}
