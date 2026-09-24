import { useState } from 'react'
import './App.css'

function App() {
  const [reviews, setReviews] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const [analysis, setAnalysis] = useState(null)

  const handleAnalyze = async () => {
    setError('')

    const reviewList = reviews
      .split('\n')
      .map((review) => review.trim())
      .filter(Boolean)

    if (reviewList.length === 0) {
      setError('Please enter at least one review before analyzing.')
      return
    }

    setIsAnalyzing(true)

    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviews: reviewList,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Analysis failed.')
      }

      setAnalysis(data.analysis)
    } catch (error) {
      console.error('Analysis error:', error)
      setError(error.message || 'Could not connect to the backend server.')
    } finally {
      setIsAnalyzing(false)
    }
  }
  
  const handleClear = () => {
  setReviews('')
  setAnalysis(null)
  setError('')
}

  const sentimentCounts = {
    positive:
      analysis?.reviewSentiments?.filter(
        (item) => item.sentiment === 'Positive'
      ).length || 0,

    neutral:
      analysis?.reviewSentiments?.filter(
        (item) => item.sentiment === 'Neutral'
      ).length || 0,

    negative:
      analysis?.reviewSentiments?.filter(
        (item) => item.sentiment === 'Negative'
      ).length || 0,
  }

  const totalSentiments =
  sentimentCounts.positive +
  sentimentCounts.neutral +
  sentimentCounts.negative

const sentimentPercentages = {
  positive: totalSentiments
    ? Math.round((sentimentCounts.positive / totalSentiments) * 100)
    : 0,

  neutral: totalSentiments
    ? Math.round((sentimentCounts.neutral / totalSentiments) * 100)
    : 0,

  negative: totalSentiments
    ? Math.round((sentimentCounts.negative / totalSentiments) * 100)
    : 0,
}

  return (
    <>
      <div className="app">
        <header className="navbar">
          <div className="logo">
            <div className="logo-icon">AI</div>

            <span>
              Feedback<span className="logo-highlight">AI</span>
            </span>
          </div>

          <div className="nav-status">
            <span className="status-dot"></span>
            AI Analysis Ready
          </div>
        </header>

        <main className="main-content">
          <section className="hero-section">
            <div className="badge">
              ✦ AI-POWERED PRODUCT RESEARCH
            </div>

            <h1>
              Turn customer feedback into
              <span> product insights.</span>
            </h1>

            <p className="hero-description">
              Analyze customer reviews with AI to uncover sentiment,
              recurring themes, pain points, and actionable product
              recommendations.
            </p>
          </section>

          <section className="analyzer-card">
            <div className="card-header">
              <div>
                <h2>Analyze Reviews</h2>

                <p>
                  Paste customer reviews below to get started.
                </p>
              </div>

              <div className="review-count">
  {reviews.trim()
    ? reviews.trim().split('\n').filter(Boolean).length
    : 0}{' '}
  {reviews.trim().split('\n').filter(Boolean).length === 1
    ? 'review'
    : 'reviews'}
</div>
            </div>

            <textarea
              className="review-input"
              value={reviews}
              onChange={(event) => setReviews(event.target.value)}
              placeholder={`Paste customer reviews here...

Example:
"The delivery was extremely late and customer support didn't help."

"I love the app, but the payment process failed twice."

"The interface is simple and easy to use."`}
            ></textarea>

            
              {error && (
  <div className="error-message">
    <span className="error-icon">⚠</span>

    <div>
      <strong>Analysis unavailable</strong>
      <p>{error}</p>
    </div>
  </div>
)}

            <div className="input-footer">
              <span>
                Paste multiple reviews, one per line.
              </span>

              <div className="input-actions">
  <button
    className="analyze-button"
    onClick={handleAnalyze}
    disabled={isAnalyzing || !reviews.trim()}
  >
    {isAnalyzing ? (
      <>
        <span className="button-spinner"></span>
        Analyzing...
      </>
    ) : (
      '✦ Analyze Reviews'
    )}
  </button>

  <button
    className="clear-button"
    onClick={handleClear}
    disabled={!reviews.trim() && !analysis && !error}
  >
    Clear
  </button>
</div>

            </div>
          </section>

          {analysis && (
            <section className="results-section">
              <div className="results-header">
                <div>
                  <p className="section-label">AI ANALYSIS</p>
                  <h2>Feedback Insights</h2>
                </div>

                <div
                  className={`sentiment-badge ${analysis.overallSentiment.toLowerCase()}`}
                >
                  {analysis.overallSentiment}
                </div>
              </div>

              <div className="summary-card">
                <h3>AI Summary</h3>
                <p>{analysis.summary}</p>
              </div>

              <div className="results-grid">
                <div className="result-card">
                  <h3>Key Issues</h3>

                  {analysis.keyIssues.length > 0 ? (
                    <ul>
                      {analysis.keyIssues.map((issue, index) => (
                        <li key={index}>{issue}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No major issues identified.</p>
                  )}
                </div>

                <div className="result-card">
                  <h3>Positive Feedback</h3>

                  {analysis.positiveFeedback.length > 0 ? (
                    <ul>
                      {analysis.positiveFeedback.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No positive feedback identified.</p>
                  )}
                </div>

                <div className="result-card priority-card">
                  <h3>Priority</h3>
                  <strong>{analysis.priority}</strong>
                </div>
              </div>

              <div className="themes-section">
                <div className="themes-header">
                  <div>
                    <p className="section-label">RECURRING THEMES</p>
                    <h3>What customers are talking about</h3>
                  </div>
                </div>

                <div className="themes-grid">
                  {analysis.themes?.map((theme, index) => (
                    <div className="theme-card" key={index}>
                      <div className="theme-card-top">
                        <h4>{theme.name}</h4>

                        <span>
                          {theme.mentions}{' '}
                          {theme.mentions === 1
                            ? 'mention'
                            : 'mentions'}
                        </span>
                      </div>

                      <p>{theme.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="recommendations-section">
                <div className="recommendations-header">
                  <p className="section-label">
                    PRODUCT RECOMMENDATIONS
                  </p>
                  <h3>What should the product team do?</h3>
                </div>

                <div className="recommendations-grid">
                  {analysis.recommendations?.map(
                    (recommendation, index) => (
                      <div
                        className="recommendation-card"
                        key={index}
                      >
                        <div className="recommendation-top">
                          <h4>{recommendation.title}</h4>

                          <span
                            className={`impact-badge ${recommendation.impact.toLowerCase()}`}
                          >
                            {recommendation.impact} Impact
                          </span>
                        </div>

                        <p>{recommendation.description}</p>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="sentiment-overview">
                <div className="sentiment-overview-header">
                  <p className="section-label">
                    SENTIMENT OVERVIEW
                  </p>
                  <h3>Overall customer sentiment</h3>
                </div>

                <div className="sentiment-overview-grid">
                  <div className="sentiment-stat positive-stat">
                    <span className="sentiment-stat-label">
                      Positive
                    </span>

                    <strong>{sentimentCounts.positive}</strong>

                    <span className="sentiment-stat-text">
                      {sentimentCounts.positive === 1
                        ? 'review'
                        : 'reviews'}
                    </span>
                  </div>

                  <div className="sentiment-stat neutral-stat">
                    <span className="sentiment-stat-label">
                      Neutral
                    </span>

                    <strong>{sentimentCounts.neutral}</strong>

                    <span className="sentiment-stat-text">
                      {sentimentCounts.neutral === 1
                        ? 'review'
                        : 'reviews'}
                    </span>
                  </div>

                  <div className="sentiment-stat negative-stat">
                    <span className="sentiment-stat-label">
                      Negative
                    </span>

                    <strong>{sentimentCounts.negative}</strong>

                    <span className="sentiment-stat-text">
                      {sentimentCounts.negative === 1
                        ? 'review'
                        : 'reviews'}
                    </span>
                  </div>
                </div>
                
              </div>

              <div className="review-sentiments-section">
                <div className="review-sentiments-header">
                  <p className="section-label">REVIEW SENTIMENTS</p>
                  <h3>How customers feel about your product</h3>
                </div>

                <div className="review-sentiments-list">
                  {analysis.reviewSentiments?.map((item, index) => (
                    <div
                      className="review-sentiment-card"
                      key={index}
                    >
                      <p className="review-text">
                        "{item.review}"
                      </p>

                      <span
                        className={`review-sentiment-badge ${item.sentiment.toLowerCase()}`}
                      >
                        {item.sentiment}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="features">
            <div className="feature-card">
              <div className="feature-icon">
                ◉
              </div>

              <h3>
                Sentiment Analysis
              </h3>

              <p>
                Understand how customers feel about your product.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                ⌁
              </div>

              <h3>
                Theme Detection
              </h3>

              <p>
                Discover recurring topics across customer feedback.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                ↗
              </div>

              <h3>
                Product Insights
              </h3>

              <p>
                Turn pain points into actionable product improvements.
              </p>
            </div>
          </section>
        </main>

        <footer className="footer">
          <span>
            AI Product Feedback Analyzer
          </span>

          <span>
            Built for product research
          </span>
        </footer>
      </div>
    </>
  )
}

export default App