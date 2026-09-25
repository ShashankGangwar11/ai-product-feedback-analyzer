# AI Product Feedback Analyzer

An AI-powered product research tool that transforms raw customer reviews into structured product insights.

Paste multiple customer reviews and get AI-generated sentiment analysis, recurring themes, key issues, positive feedback, product recommendations, and review-level sentiment classification.

## ✨ Features

- 📊 Overall sentiment analysis
- 📝 AI-generated feedback summary
- 🔍 Key issue detection
- 👍 Positive feedback extraction
- 🎯 Product priority identification
- 🧩 Recurring theme detection with mention counts
- 💡 Actionable product recommendations
- 💬 Individual review sentiment classification
- 📈 Sentiment distribution overview
- 🧹 Clear and reset analysis
- 📱 Responsive mobile-friendly interface
- ⚡ AI-powered analysis using Google Gemini

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- Node.js
- Express.js
- Google Gemini API
- @google/genai
- CORS
- dotenv

## 🏗️ Architecture

Customer Reviews
       ↓
React Frontend
       ↓
Express.js Backend
       ↓
Google Gemini API
       ↓
Structured JSON Analysis
       ↓
Insights Dashboard

## 🔎 What the Analyzer Produces

For a set of customer reviews, the application generates:

### Overall Sentiment

Classifies the overall feedback as:

- Positive
- Neutral
- Negative

### Key Issues

Identifies the major pain points mentioned by customers.

### Positive Feedback

Highlights what customers appreciate about the product.

### Recurring Themes

Groups related feedback into themes and estimates how many reviews mention each theme.

### Product Recommendations

Converts customer pain points into practical product improvement recommendations with impact levels.

### Review Sentiments

Classifies every individual review as Positive, Neutral, or Negative.

### Sentiment Distribution

Provides a visual breakdown of positive, neutral, and negative reviews.

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ShashankGangwar11/ai-product-feedback-analyzer.git
cd ai-product-feedback-analyzer
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd server
npm install
```

### 4. Configure the Gemini API

Create a `.env` file inside the `server` folder:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Never commit your API key to GitHub.

### 5. Start the backend

From the `server` directory:

```bash
node server.js
```

The backend runs on:

`http://localhost:5000`

### 6. Start the frontend

Open another terminal in the project root:

```bash
npm run dev
```

The frontend runs on:

`http://localhost:5173`

## 🔐 Environment Variables

The backend requires:

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key used for AI analysis |

The `.env` file is excluded from Git using `.gitignore`.

## 📡 API

### Health Check

```http
GET /api/health
```

Returns the backend health status.

### Analyze Reviews

```http
POST /api/analyze
```

Example request:

```json
{
  "reviews": [
    "The product quality is excellent.",
    "Delivery was very late.",
    "The payment process failed twice."
  ]
}
```

The endpoint returns structured AI-generated analysis including sentiment, themes, issues, recommendations, and review-level sentiment.

## 🎯 Product Research Use Case

The goal of this project is to demonstrate how unstructured customer feedback can be converted into actionable product research.

Instead of manually reading hundreds of reviews, a product team can use the analyzer to quickly identify:

- What customers like
- What customers dislike
- Recurring problems
- Important product themes
- Potential improvement areas
- Overall customer sentiment

## 📱 Responsive Design

The interface is designed to work across:

- Desktop
- Tablet
- Mobile

The analysis dashboard automatically adapts its layout for smaller screens.

## 🔮 Future Improvements

Potential future enhancements include:

- CSV review upload
- Review history
- Product/project workspaces
- Authentication
- Persistent database storage
- Advanced analytics
- Sentiment trend charts
- Export reports as PDF
- Multi-product comparison
- Batch review processing
- Production deployment

## 📸 Screenshots

### Homepage

![AI Product Feedback Analyzer Homepage](screenshots/homepage.png)

### AI Analysis Dashboard

![AI Product Feedback Analyzer Dashboard](screenshots/analysis-dashboard.png)

## 👨‍💻 Author

**Shashank Gangwar**

Built as an AI-powered product research portfolio project.
