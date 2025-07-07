import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const NEWS_BG_URL = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=80";
const DEFAULT_IMAGE_URL = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=80";

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState(DEFAULT_IMAGE_URL);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults(null);
    try {
      const response = await axios.post('http://localhost:8000/recommend', {
        query,
        top_k: 5,
        include_live: true,
        include_mind: false
      });
      setResults(response.data);
      // Fetch Unsplash image based on query
      try {
        const unsplashRes = await axios.get(
          "https://api.unsplash.com/search/photos",
          {
            params: { query: query, orientation: "landscape", per_page: 10 },
            headers: {
              Authorization: `Client-ID AjnFB-SWxZkKvBEm-ipkW-tJeMCamBk5bMdeyATxSNQ`,
            },
          }
        );
        if (unsplashRes.data.results && unsplashRes.data.results.length > 0) {
          setImageUrl(unsplashRes.data.results[0].urls.regular);
        } else {
          setImageUrl(DEFAULT_IMAGE_URL); // fallback
        }
      } catch (imgErr) {
        setImageUrl(DEFAULT_IMAGE_URL); // fallback
      }
    } catch (err) {
      setError('Failed to fetch recommendations. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-layout split-layout">
      <div className="left-panel fill-panel">
        <header className="app-title">The News</header>
        <div className="container fill-container">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Enter a topic, keywords, or article text..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              required
            />
            <button type="submit" disabled={loading || !query.trim()}>
              {loading ? 'Loading...' : 'Get Recommendations'}
            </button>
          </form>
          {error && <div className="error">{error}</div>}
          {results && (
            <div className="results">
              <h2 className="results-title">Recommendations for: <span className="query">{results.query}</span></h2>
              <div className="rec-section">
                <h3>Live NewsAPI Recommendations</h3>
                {results.live_recommendations && results.live_recommendations.length > 0 ? (
                  <ul>
                    {results.live_recommendations.map((art, idx) => (
                      <li key={idx} className="article">
                        <a href={art.url} target="_blank" rel="noopener noreferrer"><b>{art.title}</b></a>
                        <div className="desc">{art.description}</div>
                        <div className="meta">
                          <span>Source: {art.source}</span>
                          <span>Score: {art.similarity_score?.toFixed(3)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : <div>No live recommendations found.</div>}
              </div>
            </div>
          )}
          <footer>
            <p>
              <a
                href="https://github.com/Nithin-Rokkam/Real-Time-News-recommendations"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600', transition: 'color 0.3s ease' }}
                onMouseOver={(e) => e.target.style.color = '#764ba2'}
                onMouseOut={(e) => e.target.style.color = '#667eea'}
              >
                Powered by @Nithin Rokkam
              </a>
            </p>
          </footer>
        </div>
      </div>
      <div className="right-panel fill-panel">
        <img src={imageUrl} alt="Related to search" className="news-bg-img fill-img" />
      </div>
    </div>
  );
}

export default App;
