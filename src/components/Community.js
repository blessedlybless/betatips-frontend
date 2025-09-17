import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://betatips-backend.onrender.com/api'
  : 'http://localhost:5000/api';


const Community = ({ user }) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(false);
  const [replyTexts, setReplyTexts] = useState({});
  const [showReplyFor, setShowReplyFor] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/posts`, {  // ✅ Correct endpoint
      headers: {
        'Authorization': `Bearer ${token}`  // ✅ Add auth header
      }
    });
    setPosts(response.data);
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
};


  const handleSubmitPost = async (e) => {
    e.preventDefault();
    
    if (!newPost.trim()) {
      toast.error('Please write something before posting!');
      return;
    }

    setLoading(true);
    
    try {
      await axios.post(`${API_URL}/community/posts`, {
        content: newPost.trim()
      });

      setNewPost('');
      fetchPosts();
      toast.success('Post shared with community!');
      
    } catch (error) {
      console.error('Error posting:', error);
      toast.error('Error posting to community');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async (postId) => {
  const replyText = replyTexts[postId];
  if (!replyText?.trim()) {
    toast.error('Please write a reply!');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    await axios.post(`${API_URL}/posts/${postId}/comments`, {  // ✅ Changed endpoint
      content: replyText.trim()
    }, {
      headers: {
        'Authorization': `Bearer ${token}`  // ✅ Add auth
      }
    });

    setReplyTexts({ ...replyTexts, [postId]: '' });
    setShowReplyFor(null);
    fetchPosts();
    toast.success('Reply added!');
  } catch (error) {
    console.error('Reply error:', error);
    toast.error('Error adding reply');
  }
};


const deletePost = async (postId) => {
  if (window.confirm('Are you sure you want to delete this post?')) {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/posts/${postId}`, {  // ✅ Fixed endpoint
        headers: {
          'Authorization': `Bearer ${token}`  // ✅ Add auth
        }
      });
      fetchPosts();
      toast.success('Post deleted successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Error deleting post');
    }
  }
};


  return (
    <div className="community-page">
      <div className="community-header">
        <button 
          onClick={() => navigate('/')}
          className="back-to-tips-btn"
        >
          ← Back to Tips
        </button>
        <h2>💬 Community Discussion</h2>
      </div>
      
      <div className="community-section">
        <div className="post-form">
          <form onSubmit={handleSubmitPost}>
            <textarea
              placeholder="Share your thoughts, wins, or ask for advice..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              rows="3"
              disabled={loading}
            />
            <button 
              type="submit" 
              disabled={loading || !newPost.trim()}
            >
              {loading ? '⏳ Posting...' : '📝 Share'}
            </button>
          </form>
        </div>

        <div className="posts-list">
          {posts.length > 0 ? (
            posts.map(post => (
              <div key={post._id} className="community-post">
                <div className="post-header">
                  <span className="username">👤 {post.author.username}</span>
                  {post.author.hasPaid && <span className="vip-badge">👑</span>}
                  <span className="post-time">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                  
                  {user.isAdmin && (
                    <button 
                      onClick={() => deletePost(post._id)}
                      className="admin-delete-btn"
                      title="Delete Post"
                    >
                      🗑️
                    </button>
                  )}
                </div>
                
                <div className="post-content">
                  <p>{post.content}</p>
                </div>
                
                <div className="post-actions">
                  <button 
                    onClick={() => setShowReplyFor(showReplyFor === post._id ? null : post._id)}
                    className="reply-btn"
                  >
                    💬 Reply
                  </button>
                  {post.replies && post.replies.length > 0 && (
                    <span className="replies-count">
                      {post.replies.length} {post.replies.length === 1 ? 'reply' : 'replies'}
                    </span>
                  )}
                </div>

                {showReplyFor === post._id && (
                  <div className="reply-form">
                    <textarea
                      placeholder="Write your reply..."
                      value={replyTexts[post._id] || ''}
                      onChange={(e) => setReplyTexts({ 
                        ...replyTexts, 
                        [post._id]: e.target.value 
                      })}
                      rows="2"
                    />
                    <div className="reply-actions">
                      <button 
                        onClick={() => handleSubmitReply(post._id)}
                        disabled={!replyTexts[post._id]?.trim()}
                      >
                        📨 Send Reply
                      </button>
                      <button 
                        onClick={() => setShowReplyFor(null)}
                        className="cancel-btn"
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  </div>
                )}

                {post.replies && post.replies.length > 0 && (
                  <div className="replies-list">
                    {post.replies.map(reply => (
                      <div key={reply._id} className="reply-item">
                        <div className="reply-header">
                          <span className="username">👤 {reply.author.username}</span>
                          {reply.author.hasPaid && <span className="vip-badge">👑</span>}
                          <span className="reply-time">
                            {new Date(reply.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="reply-content">
                          <p>{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="no-posts">
              <p>Be the first to start a community discussion! 💭</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;
