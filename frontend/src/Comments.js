import React, { useEffect, useState } from "react";
import axios from "axios";

function Comments({ postId, user }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Fetch comments initially
  useEffect(() => {
    axios
      .get(`http://localhost:5000/posts/${postId}/comments`)
      .then((res) => setComments(res.data))
      .catch((err) => console.error(err));
  }, [postId]);

  // Add a comment
  const handleComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(
        `http://localhost:5000/posts/${postId}/comments`,
        { authorId: user._id, content: newComment }
      );
      setComments([...comments, res.data.comment]);
      setNewComment("");
    } catch (err) {
      alert("Error adding comment");
    }
  };

  // Start editing a comment (local UI only)
  const startEdit = (id, currentContent) => {
    setComments((prev) =>
      prev.map((c) =>
        c._id === id ? { ...c, isEditing: true, editContent: currentContent } : c
      )
    );
  };

  // Cancel editing
  const cancelEdit = (id) => {
    setComments((prev) =>
      prev.map((c) => (c._id === id ? { ...c, isEditing: false } : c))
    );
  };

  // Save edited comment
  const saveEdit = async (id, content) => {
    try {
      const res = await axios.put(`http://localhost:5000/comments/${id}`, {
        content,
      });
      setComments((prev) =>
        prev.map((c) => (c._id === id ? res.data.comment : c))
      );
    } catch (err) {
      alert("Error updating comment");
    }
  };

  // Delete comment
  const deleteComment = async (id) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await axios.delete(`http://localhost:5000/comments/${id}`);
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert("Error deleting comment");
    }
  };

  // Permission check
  const canManage = (comment) =>
    user.role === "teacher" || user._id === comment.author._id;

  return (
    <div style={{ marginTop: "10px", paddingLeft: "20px", borderLeft: "2px solid #eee" }}>
      {/* Existing comments */}
      {comments.length === 0 ? (
        <p style={{ fontSize: "13px", color: "#666" }}>No comments yet.</p>
      ) : (
        comments.map((c) => (
          <div key={c._id} style={{ marginBottom: "10px" }}>
            <p style={{ margin: "0", fontSize: "14px" }}>
              <b>{c.author.name}</b>{" "}
              <span style={{ color: "#555", fontSize: "12px" }}>
                ({c.author.role})
              </span>
            </p>

            {/* content vs edit mode */}
            {c.isEditing ? (
              <>
                <input
                  value={c.editContent}
                  onChange={(e) =>
                    setComments((prev) =>
                      prev.map((x) =>
                        x._id === c._id ? { ...x, editContent: e.target.value } : x
                      )
                    )
                  }
                  style={{ width: "75%", padding: "6px", marginTop: "4px" }}
                />
                <button
                  onClick={() => saveEdit(c._id, c.editContent)}
                  style={{ marginLeft: "8px" }}
                >
                  Save
                </button>
                <button onClick={() => cancelEdit(c._id)} style={{ marginLeft: "6px" }}>
                  Cancel
                </button>
              </>
            ) : (
              <p style={{ margin: "2px 0 4px 0", fontSize: "14px" }}>{c.content}</p>
            )}

            {/* actions */}
            {canManage(c) && !c.isEditing && (
              <div style={{ marginTop: "2px" }}>
                <button onClick={() => startEdit(c._id, c.content)} style={{ marginRight: "8px" }}>
                  ✏️ Edit
                </button>
                <button onClick={() => deleteComment(c._id)}>🗑️ Delete</button>
              </div>
            )}
          </div>
        ))
      )}

      {/* Add new comment */}
      <div style={{ marginTop: "10px" }}>
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          style={{ width: "70%", padding: "6px" }}
        />
        <button onClick={handleComment} style={{ marginLeft: "10px", padding: "6px 14px" }}>
          Comment
        </button>
      </div>
    </div>
  );
}

export default Comments;
