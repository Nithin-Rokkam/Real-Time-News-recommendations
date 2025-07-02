import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults(null);
    try {
      const response = await axios.post('http://localhost:8000/recommend', {
        query,
        top_k: 10,
        include_live: true,
        include_mind: true
      });
      setResults(response.data);
    } catch (err) {
      setError('Failed to fetch recommendations. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>News Recommender</h1>
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
          <h2>Recommendations for: <span className="query">{results.query}</span></h2>
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
        <p>Powered by @nithin_rokkam</p>
      </footer>
    </div>
  );
}

export default App;
