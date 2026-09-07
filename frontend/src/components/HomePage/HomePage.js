import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import urlConfig from '../../config';

function HomePage() {
    const [gifts, setGifts] = useState([]);
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [recommendationText, setRecommendationText] = useState('');
    const [recommendation, setRecommendation] = useState(null);
    const [recommendationLoading, setRecommendationLoading] = useState(false);
    const [recommendationError, setRecommendationError] = useState('');

    const fetchGifts = async (selectedCategory = '') => {
        setLoading(true);
        setError('');

        try {
            const endpoint = selectedCategory
                ? `${urlConfig.backendUrl}/api/search?category=${encodeURIComponent(selectedCategory)}`
                : `${urlConfig.backendUrl}/api/gifts`;

            const response = await fetch(endpoint);

            if (!response.ok) {
                throw new Error('Failed to fetch gifts');
            }

            const data = await response.json();
            setGifts(data);
        } catch (err) {
            console.error(err);
            setError('Unable to load gifts.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGifts();
    }, []);

    const handleSearch = () => {
        fetchGifts(category);
    };

    const handleRecommendation = async () => {
        if (!recommendationText.trim()) {
            setRecommendationError('Please enter a gift description.');
            return;
        }

        setRecommendationLoading(true);
        setRecommendationError('');
        setRecommendation(null);

        try {
            const response = await fetch(
                'http://localhost:3070/api/recommend',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        text: recommendationText
                    })
                }
            );

            if (!response.ok) {
                throw new Error('Recommendation service failed');
            }

            const data = await response.json();
            setRecommendation(data);
        } catch (err) {
            console.error(err);
            setRecommendationError(
                'Unable to connect to Recommendation Engine.'
            );
        } finally {
            setRecommendationLoading(false);
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '40px' }}>
            <h1>Welcome to GiftLink 🎁</h1>

            <p>
                GiftLink helps you find the perfect gift for your loved ones.
            </p>

            <div style={{ marginTop: '20px' }}>
                <Link to="/app/register">
                    <button style={{ margin: '10px', padding: '10px 20px' }}>
                        Register
                    </button>
                </Link>

                <Link to="/app/login">
                    <button style={{ margin: '10px', padding: '10px 20px' }}>
                        Login
                    </button>
                </Link>

                <Link to="/app/profile">
                    <button style={{ margin: '10px', padding: '10px 20px' }}>
                        Profile
                    </button>
                </Link>
            </div>

            <hr style={{ margin: '40px 0' }} />

            <h2>Search Gifts 🔎</h2>

            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                    padding: '10px',
                    margin: '10px',
                    minWidth: '200px'
                }}
            >
                <option value="">All Categories</option>
                <option value="Birthday">Birthday</option>
                <option value="Chocolate">Chocolate</option>
                <option value="Flowers">Flowers</option>
            </select>

            <button
                onClick={handleSearch}
                style={{
                    padding: '10px 20px',
                    margin: '10px',
                    cursor: 'pointer'
                }}
            >
                Search
            </button>

            <h2 style={{ marginTop: '30px' }}>Available Gifts 🎁</h2>

            {loading && <p>Loading gifts...</p>}

            {error && <p>{error}</p>}

            {!loading && !error && gifts.length === 0 && (
                <p>No gifts found for this category.</p>
            )}

            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '20px',
                    marginTop: '30px'
                }}
            >
                {gifts.map((gift) => (
                    <div
                        key={gift.id}
                        style={{
                            border: '1px solid #ddd',
                            borderRadius: '10px',
                            padding: '20px',
                            width: '250px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                    >
                        <Link to={`/app/gift/${gift.id}`}>
                            <h3>{gift.name || gift.title}</h3>
                        </Link>

                        <p>
                            {gift.description || 'No description available.'}
                        </p>

                        {gift.category && (
                            <p>
                                <strong>Category:</strong> {gift.category}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            <hr style={{ margin: '50px 0' }} />

            <h2>Gift Recommendation Engine 🤖🎁</h2>

            <p>
                Enter a gift description to analyze its keywords and sentiment.
            </p>

            <textarea
                value={recommendationText}
                onChange={(e) => setRecommendationText(e.target.value)}
                placeholder="Example: A wonderful and beautiful gift for a birthday"
                rows="5"
                style={{
                    width: '350px',
                    padding: '12px',
                    marginTop: '10px'
                }}
            />

            <br />

            <button
                onClick={handleRecommendation}
                style={{
                    marginTop: '15px',
                    padding: '12px 25px',
                    cursor: 'pointer'
                }}
            >
                {recommendationLoading
                    ? 'Analyzing...'
                    : 'Get Recommendation'}
            </button>

            {recommendationError && (
                <p>{recommendationError}</p>
            )}

            {recommendation && (
                <div
                    style={{
                        margin: '25px auto',
                        padding: '20px',
                        maxWidth: '500px',
                        border: '1px solid #ddd',
                        borderRadius: '10px'
                    }}
                >
                    <h3>Recommendation Result 🤖</h3>

                    <p>
                        <strong>Keywords:</strong>{' '}
                        {recommendation.tokens.join(', ')}
                    </p>

                    <p>
                        <strong>Sentiment Score:</strong>{' '}
                        {recommendation.sentimentScore}
                    </p>

                    <p>
                        {recommendation.sentimentScore > 0
                            ? 'This description has a positive sentiment. 💚'
                            : recommendation.sentimentScore < 0
                            ? 'This description has a negative sentiment.'
                            : 'This description has a neutral sentiment.'}
                    </p>
                </div>
            )}
        </div>
    );
}

export default HomePage;