// src/services/commentService.js
import api from "./api";

const COMMENT_BASE = "/comments";

const commentService = {
  /**
   * Get all comments for a ticket
   */
  getComments(ticketId) {
    return api.get(`${COMMENT_BASE}/ticket/${ticketId}`)
      .then(res => res.data);
  },

  /**
   * Add a new comment to a ticket
   */
  addComment(ticketId, commentData) {
    return api.post(`${COMMENT_BASE}/${ticketId}`, commentData)
      .then(res => res.data);
  },

  /**
   * Delete a comment (admin-only if required)
   */
  deleteComment(commentId) {
    return api.delete(`${COMMENT_BASE}/${commentId}`)
      .then(res => res.data);
  },

  /**
   * Edit/update a comment (optional — depending on your backend)
   */
  updateComment(commentId, updatedData) {
    return api.put(`${COMMENT_BASE}/${commentId}`, updatedData)
      .then(res => res.data);
  }
};

export default commentService;
