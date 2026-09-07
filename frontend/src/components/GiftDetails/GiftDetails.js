import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import urlConfig from '../../config';

function GiftDetails() {
    const { id } = useParams();

    const [gift, setGift] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [commentMessage, setCommentMessage] = useState('');

    const fetchGift = async () => {
        try {
            const response = await fetch(
                `${urlConfig.backendUrl}/api/gifts/${id}`
            );

            if (!response.ok) {
                throw new Error('Gift not found');
            }

            const data = await response.json();

            setGift(data);
            setComments(data.comments || []);
        } catch (err) {
            console.error(err);
            setError('Unable to load gift details.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGift();
    }, [id]);

    const handleComment = async () => {
        const email = sessionStorage.getItem('email');
        const token = sessionStorage.getItem('auth-token');

        if (!email || !token) {
            setCommentMessage('Please login first to add a comment.');
            return;
        }

        if (!comment.trim()) {
            setCommentMessage('Please enter a comment.');
            return;
        }

        try {
            const response = await fetch(
                `${urlConfig.backendUrl}/api/gifts/${id}/comments`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        comment: comment.trim(),
                        email: email
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setCommentMessage(data.error || 'Unable to add comment.');
                return;
            }

            setComment('');
            setCommentMessage('Comment added successfully!');

            fetchGift();

        } catch (err) {
            console.error(err);
            setCommentMessage('Unable to connect to backend.');
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <h2>Loading gift details...</h2>
            </div>
        );
    }

    if (error || !gift) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <h2>{error || 'Gift not found.'}</h2>

                <Link to="/">
                    <button style={{ padding: '10px 20px' }}>
                        Back to Home
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div
            style={{
                maxWidth: '700px',
                margin: '0 auto',
                padding: '40px',
                textAlign: 'center'
            }}
        >
            <h1>{gift.name || gift.title}</h1>

            <p style={{ fontSize: '18px' }}>
                {gift.description || 'No description available.'}
            </p>

            {gift.category && (
                <p>
                    <strong>Category:</strong> {gift.category}
                </p>
            )}

            {gift.condition && (
                <p>
                    <strong>Condition:</strong> {gift.condition}
                </p>
            )}

            <hr style={{ margin: '30px 0' }} />

            <h2>Comments 💬</h2>

            {comments.length === 0 ? (
                <p>No comments yet.</p>
            ) : (
                <div>
                    {comments.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                padding: '15px',
                                margin: '10px 0',
                                textAlign: 'left'
                            }}
                        >
                            <strong>{item.email}</strong>

                            <p style={{ marginBottom: 0 }}>
                                {item.comment}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            <hr style={{ margin: '30px 0' }} />

            <h3>Leave a Comment</h3>

            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your comment..."
                rows="4"
                style={{
                    width: '90%',
                    maxWidth: '500px',
                    padding: '12px'
                }}
            />

            <br />

            <button
                onClick={handleComment}
                style={{
                    marginTop: '15px',
                    padding: '10px 25px',
                    cursor: 'pointer'
                }}
            >
                Add Comment
            </button>

            {commentMessage && (
                <p>{commentMessage}</p>
            )}

            <br />

            <Link to="/">
                <button
                    style={{
                        marginTop: '20px',
                        padding: '10px 20px'
                    }}
                >
                    Back to Home
                </button>
            </Link>
        </div>
    );
}

export default GiftDetails;