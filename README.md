# Impify - AI-Powered Study Assistant

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-2.0+-000000.svg)](https://flask.palletsprojects.com/)

> Transform your study materials into comprehensive, AI-generated notes with advanced RAG technology and intelligent analysis.

## 🌟 Features

### 🤖 AI-Powered Note Generation
- **Multiple LLM Support**: OpenAI GPT-4, Google Gemini, and Ollama integration
- **Intelligent Analysis**: Advanced text extraction from PDFs using pdfplumber and PyPDF2
- **RAG Technology**: Retrieval-Augmented Generation for context-aware note creation
- **Vector Embeddings**: ChromaDB integration with OpenAI/HuggingFace embeddings

### 📚 Study Material Types
- **General Notes**: Comprehensive study notes from textbooks and articles
- **Question Paper Analysis**: Detailed solutions with highlighted important questions and study tips

### 🔒 Security & Privacy
- **JWT Authentication**: Secure user authentication and authorization
- **Consent Management**: User-controlled AI processing consent
- **Data Encryption**: Secure password hashing with Werkzeug
- **Analytics Tracking**: Privacy-respecting usage analytics

### 📊 Usage Analytics
- **Real-time Stats**: Track uploads, exports, and AI success rates
- **Quota Management**: Free tier limits with daily/monthly tracking
- **Performance Metrics**: Processing time and success rate monitoring

### 🎨 Modern UI/UX
- **Matrix Theme**: Cyberpunk-inspired dark theme with neon accents
- **Responsive Design**: Mobile-first approach with glassmorphism effects
- **Drag & Drop**: Intuitive file upload with visual feedback
- **Real-time Updates**: Live quota and stats display

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- MySQL 8.0+
- Ollama (optional, for local LLM)

### Backend Setup

1. **Clone and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up MySQL database:**
   ```sql
   CREATE DATABASE impify_db;
   ```

5. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and database credentials
   ```

6. **Run the backend:**
   ```bash
   python server.py
   ```

### Frontend Setup

1. **Navigate to frontend:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

### Ollama Setup (Optional)

For local LLM support:
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model
ollama pull llama3:8b

# Configure in .env
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3:8b
```

## 🔧 Configuration

### Environment Variables

```env
# Database
MYSQL_URL=mysql+pymysql://user:password@localhost/impify_db

# Authentication
JWT_SECRET_KEY=your-secret-key-here

# AI Providers
OPENAI_API_KEY=your-openai-key
GEMINI_API_KEY=your-gemini-key
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3:8b

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Free Tier Limits

- **Daily**: 5 notes per day
- **Monthly**: 20 notes per month
- **File Size**: 10MB per PDF

## 🏗️ Architecture

### Backend (Flask + SQLAlchemy)
- **Authentication**: JWT-based user management
- **Database**: MySQL with SQLAlchemy ORM
- **AI Integration**: Pluggable LLM client architecture
- **Vector DB**: ChromaDB for document embeddings
- **File Processing**: PDF text extraction and chunking

### Frontend (React)
- **State Management**: React hooks and context
- **UI Components**: Custom components with CSS-in-JS
- **API Integration**: Axios for HTTP requests
- **Routing**: React Router for navigation

### Key Components

```
impify/
├── backend/
│   ├── server.py          # Main Flask application
│   ├── chroma_db/         # Vector database storage
│   └── training/          # AI training data logs
├── frontend/
│   ├── src/
│   │   ├── pages/         # React pages (Dashboard, etc.)
│   │   └── components/    # Reusable UI components
│   └── public/            # Static assets
└── tests/                 # Test suites
```

## 📈 Analytics & Monitoring

### User Analytics
- **Event Tracking**: User actions and feature usage
- **Performance Metrics**: API response times and success rates
- **Quota Monitoring**: Real-time usage limits and warnings

### AI Analytics
- **Success Rates**: Track AI generation success/failure
- **Processing Times**: Monitor text extraction and note generation
- **Model Performance**: Compare different LLM providers

## 🔐 Security Features

- **Password Hashing**: Secure bcrypt/werkzeug hashing
- **JWT Tokens**: Stateless authentication with expiration
- **CORS Protection**: Configurable origin restrictions
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: Built-in quota system preventing abuse

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow PEP 8 for Python code
- Use ESLint for JavaScript/React
- Write comprehensive tests
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for GPT models and embeddings
- **Google** for Gemini AI
- **Ollama** for local LLM support
- **ChromaDB** for vector database
- **LangChain** for text processing utilities

## 📞 Support

For support, email support@impify.com or join our Discord community.

---

**Made with ❤️ for students by developers**
