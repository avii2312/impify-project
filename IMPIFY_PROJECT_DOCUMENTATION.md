# Impify - Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture and Technology Stack](#architecture-and-technology-stack)
3. [Backend Implementation](#backend-implementation)
4. [Frontend Implementation](#frontend-implementation)
5. [Database Schema](#database-schema)
6. [Key Features](#key-features)
7. [API Documentation](#api-documentation)
8. [Authentication and Security](#authentication-and-security)
9. [AI Integration](#ai-integration)
10. [Deployment and Configuration](#deployment-and-configuration)
11. [Testing and Development](#testing-and-development)

---

## Project Overview

### What is Impify?
Impify is a comprehensive AI-powered study and note-taking platform that combines advanced language models with spaced repetition learning techniques. The platform enables students and learners to transform their notes into interactive flashcards, analyze question papers, and engage in AI-powered conversations about their study materials.

### Core Features
- **AI-Powered Note Generation**: Automatically generate comprehensive notes from uploaded documents
- **Interactive Flashcards**: Create and study flashcards with spaced repetition algorithms
- **Question Paper Analysis**: Analyze and extract insights from examination papers
- **AI Chat Interface**: Conversational AI for learning and clarification
- **Multi-LLM Support**: Integration with OpenAI, Google Gemini, and Ollama
- **Gamification**: XP system, streaks, achievements, and token-based economy
- **Subscription Management**: Tiered pricing with quota management
- **Admin Dashboard**: Comprehensive admin panel for user and system management

### Target Audience
- Students preparing for examinations
- Educators creating study materials
- Lifelong learners seeking efficient study methods
- Educational institutions requiring AI-powered learning tools

---

## Architecture and Technology Stack

### Backend Architecture
- **Framework**: Flask (Python web framework)
- **Database**: MySQL with SQLAlchemy ORM
- **Authentication**: JWT (JSON Web Tokens) with 7-day expiration
- **AI Integration**: Multiple LLM providers (OpenAI, Google Gemini, Ollama)
- **Vector Database**: ChromaDB for RAG (Retrieval-Augmented Generation)
- **File Processing**: Support for PDF, DOCX, TXT, and image formats
- **Caching**: In-memory caching for performance optimization

### Frontend Architecture
- **Framework**: React 18 with modern hooks
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context API
- **Routing**: React Router v6
- **UI Components**: Custom component library with shadcn/ui
- **Animations**: CSS animations and transitions
- **Responsive Design**: Mobile-first approach with responsive breakpoints

### Technology Stack Summary
```
Backend:
├── Flask 2.3+
├── SQLAlchemy 2.0+
├── MySQL 8.0+
├── JWT 2.8+
├── ChromaDB 0.4+
├── OpenAI API
├── Google Gemini API
├── Ollama
└── Various Python libraries (PyPDF2, python-docx, etc.)

Frontend:
├── React 18+
├── React Router 6+
├── Tailwind CSS 3+
├── Axios 1.5+
├── Sonner (toast notifications)
├── Lucide React (icons)
└── Custom UI components
```

---

## Backend Implementation

### Main Application Structure (`backend/server.py`)

The backend is built around a Flask application with the following key components:

#### Core Classes and Functions

**LLMClient Class**: Abstracted AI provider interface
```python
class LLMClient:
    def __init__(self):
        self.providers = {
            'openai': OpenAIProvider(),
            'gemini': GeminiProvider(),
            'ollama': OllamaProvider()
        }
```

**Database Models**:
- `User`: User authentication and profile management
- `Note`: Document storage and metadata
- `Flashcard`: Spaced repetition learning cards
- `Subscription`: User subscription and quota management
- `Notification`: User communication system

#### Key API Endpoints

**Authentication Routes**:
- `POST /auth/login` - User login with JWT token generation
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Token refresh mechanism
- `POST /auth/verify` - Token validation

**Note Management**:
- `POST /notes` - Create new notes (with AI generation)
- `GET /notes` - Retrieve user notes with pagination
- `PUT /notes/{id}` - Update note content
- `DELETE /notes/{id}` - Delete notes
- `POST /notes/upload` - Multi-file upload with processing

**Flashcard System**:
- `POST /flashcards/generate` - AI-powered flashcard generation
- `GET /flashcards/due` - Retrieve cards due for review
- `PATCH /flashcards/{id}/review` - Update card review status

**AI Processing Functions**:
- `generate_notes()` - Convert documents to structured notes
- `generate_flashcards_from_content()` - Create flashcards from text
- `analyze_question_paper()` - Extract insights from exam papers

#### Spaced Repetition Algorithm
```python
def calculate_next_review(card, was_correct):
    """Calculate next review date using modified SM-2 algorithm"""
    if was_correct:
        card.ease_factor = min(2.5, card.ease_factor + 0.1)
        card.interval_days = card.interval_days * card.ease_factor
    else:
        card.interval_days = 1
        card.ease_factor = max(1.3, card.ease_factor - 0.2)

    card.next_review_date = datetime.now() + timedelta(days=card.interval_days)
    return card
```

### File Processing Pipeline
1. **Upload Reception**: Files received via multipart form data
2. **Format Detection**: Automatic format identification
3. **Text Extraction**:
   - PDFs: PyPDF2 and pdfplumber for text extraction
   - DOCX: python-docx for document parsing
   - Images: OCR processing with pytesseract
4. **Content Chunking**: Text divided into manageable chunks for AI processing
5. **AI Generation**: Content sent to LLM for note/flashcard generation
6. **Database Storage**: Processed content stored with metadata

---

## Frontend Implementation

### Application Structure (`frontend/src/`)

#### Main Components
- `App.jsx` - Root component with context providers
- `AppRoutes.jsx` - Route configuration and protected routes
- `index.js` - Application entry point

#### Context Providers
- `AuthContext` - Authentication state management
- `ThemeContext` - Dark/light theme management
- `GamificationProvider` - XP, streaks, and achievement tracking

#### Key Pages
- `Dashboard` - Main user dashboard with stats and quick actions
- `Notes` - Note management and creation interface
- `Flashcards` - Study interface with spaced repetition
- `Chat` - AI conversation interface
- `Profile` - User profile and settings management

### Authentication Flow
```javascript
// AuthContext.jsx - Key authentication logic
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Auto-login check on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Activity tracking for auto-logout (30 minutes)
  useEffect(() => {
    const checkInactivity = () => {
      const timeSinceActivity = Date.now() - lastActivity;
      if (timeSinceActivity > 30 * 60 * 1000 && isAuthenticated) {
        logout('Session expired due to inactivity');
      }
    };
    const interval = setInterval(checkInactivity, 60000);
    return () => clearInterval(interval);
  }, [lastActivity, isAuthenticated]);
};
```

### UI Components

#### Flashcard System
- `FlipCard.jsx` - 3D flip animation component
- `Flashcard.jsx` - Individual flashcard with touch support
- `StackedCardAnimation.jsx` - Card stack animations

#### Dashboard Components
- `StatsCard.jsx` - Statistics display with animations
- `AnimatedStat.jsx` - Number animation component
- `RecentNotesStack.jsx` - Recent activity visualization

#### Gamification
- `TokenBalance.jsx` - Token display and management
- `XPBar.jsx` - Experience points progress bar
- `StreakCounter.jsx` - Study streak tracking

### API Integration (`frontend/src/api/api.js`)
```javascript
const ENDPOINTS = {
  // Authentication
  login: `/auth/login`,
  register: `/auth/register`,
  refresh: `/auth/refresh`,

  // Notes management
  notes: `/notes`,
  notesById: (id) => `/notes/${id}`,
  notesUpload: `/notes/upload`,

  // Flashcards
  flashcardsGenerate: `/flashcards/generate`,
  flashcardsDue: `/flashcards/due`,
  flashcardsReview: (id) => `/flashcards/${id}/review`,

  // And many more endpoints...
};
```

---

## Database Schema

### Core Tables

#### Users Table
```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    role ENUM('user', 'admin') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    -- Gamification fields
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_study_date DATE,
    -- Token system
    tokens INTEGER DEFAULT 0,
    -- Subscription
    subscription_tier ENUM('free', 'premium', 'pro') DEFAULT 'free',
    subscription_end_date DATETIME,
    -- Quotas
    monthly_note_quota INTEGER DEFAULT 20,
    monthly_flashcard_quota INTEGER DEFAULT 100,
    notes_used_this_month INTEGER DEFAULT 0,
    flashcards_used_this_month INTEGER DEFAULT 0,
    quota_reset_date DATE DEFAULT (CURRENT_DATE + INTERVAL 1 MONTH)
);
```

#### Notes Table
```sql
CREATE TABLE notes (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT,
    summary TEXT,
    tags JSON,
    folder_id VARCHAR(36),
    file_path VARCHAR(500),
    file_size INTEGER,
    mime_type VARCHAR(100),
    processing_status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE SET NULL
);
```

#### Flashcards Table
```sql
CREATE TABLE flashcards (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    note_id VARCHAR(36) NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    difficulty_score INTEGER DEFAULT 0,
    ease_factor DECIMAL(3,2) DEFAULT 2.50,
    interval_days INTEGER DEFAULT 1,
    review_count INTEGER DEFAULT 0,
    correct_count INTEGER DEFAULT 0,
    next_review_date DATETIME,
    is_new BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
);
```

#### Subscriptions Table
```sql
CREATE TABLE subscriptions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    plan_type ENUM('monthly', 'yearly', 'lifetime') NOT NULL,
    tier ENUM('premium', 'pro') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255),
    start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    end_date DATETIME NOT NULL,
    auto_renew BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Additional Tables
- `folders` - Note organization
- `notifications` - User notifications
- `analytics_events` - Usage tracking
- `referrals` - Referral system
- `support_tickets` - Customer support
- `admin_logs` - Administrative actions

---

## Key Features

### 1. AI-Powered Note Generation
- **Multi-format Support**: PDF, DOCX, TXT, images
- **Intelligent Chunking**: Content divided for optimal AI processing
- **Structured Output**: Notes generated with summaries and key points
- **Fallback Mechanisms**: Multiple AI providers for reliability

### 2. Flashcard System with Spaced Repetition
- **AI Generation**: Automatic flashcard creation from notes
- **SM-2 Algorithm**: Scientifically-backed learning intervals
- **Progress Tracking**: Detailed statistics and performance metrics
- **Mobile Optimization**: Touch-friendly interface with swipe gestures

### 3. Gamification System
- **XP and Levels**: Experience points for study activities
- **Streaks**: Daily study streak tracking with rewards
- **Achievements**: Milestone-based accomplishments
- **Token Economy**: Virtual currency for premium features

### 4. Subscription Management
- **Tiered Plans**: Free, Premium, and Pro tiers
- **Quota System**: Monthly limits with automatic resets
- **Payment Integration**: Secure payment processing
- **Auto-renewal**: Automatic subscription management

### 5. Admin Dashboard
- **User Management**: Complete user lifecycle management
- **Analytics**: Comprehensive usage statistics
- **Content Moderation**: Community and support management
- **System Monitoring**: Performance and health metrics

---

## API Documentation

### Authentication Endpoints

#### POST /auth/login
```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "user"
  }
}
```

#### POST /auth/register
```json
Request:
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}

Response:
{
  "message": "User registered successfully"
}
```

### Note Management Endpoints

#### POST /notes
```json
Request:
{
  "title": "Study Notes",
  "content": "Note content here...",
  "tags": ["math", "algebra"]
}

Response:
{
  "id": "note_id",
  "title": "Study Notes",
  "content": "Note content here...",
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### POST /notes/upload
Multi-part form data with file upload
- Supports multiple files
- Automatic processing and AI note generation
- Returns processing status and generated content

### Flashcard Endpoints

#### POST /flashcards/generate
```json
Request:
{
  "note_id": "note_id_here",
  "num_cards": 8
}

Response:
{
  "flashcards": [
    {
      "id": "card_id",
      "question": "What is photosynthesis?",
      "answer": "The process by which plants convert light energy...",
      "next_review_date": "2024-01-02T00:00:00Z"
    }
  ]
}
```

#### GET /flashcards/due
Returns flashcards due for review based on spaced repetition schedule

#### PATCH /flashcards/{id}/review
```json
Request:
{
  "was_correct": true
}

Response:
{
  "next_review_date": "2024-01-08T00:00:00Z",
  "ease_factor": 2.6
}
```

---

## Authentication and Security

### JWT Authentication
- **Token Expiration**: 7 days for access tokens
- **Auto-refresh**: Automatic token renewal before expiration
- **Secure Storage**: localStorage/sessionStorage with encryption
- **Logout on Inactivity**: 30-minute inactivity timeout

### Security Features
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Comprehensive input sanitization
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Content sanitization and CSP headers
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Configuration**: Proper cross-origin resource sharing

### User Consent Management
- **AI Processing Consent**: Required for AI features
- **Data Usage Transparency**: Clear privacy policy
- **Consent Withdrawal**: Users can revoke consent anytime
- **Audit Logging**: Consent changes are logged

---

## AI Integration

### Multiple LLM Providers

#### OpenAI Integration
```python
def generate_with_openai(content, prompt_type):
    client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": get_system_prompt(prompt_type)},
            {"role": "user", "content": content}
        ],
        temperature=0.3,
        max_tokens=2000
    )
    return response.choices[0].message.content
```

#### Google Gemini Integration
- Alternative to OpenAI for cost-effective processing
- Similar API structure with provider abstraction

#### Ollama Integration
- Local LLM deployment for privacy and cost savings
- Supports multiple open-source models (Llama, Mistral, etc.)
- Automatic fallback when other providers unavailable

### RAG (Retrieval-Augmented Generation)
- **Vector Database**: ChromaDB for semantic search
- **Content Chunking**: Intelligent text segmentation
- **Embedding Generation**: Convert text to vector representations
- **Context Retrieval**: Relevant information retrieval for AI responses

### AI Processing Pipeline
1. **Content Preparation**: Text extraction and cleaning
2. **Chunking**: Divide content into manageable segments
3. **Embedding**: Convert to vector representations
4. **Storage**: Save to vector database
5. **Retrieval**: Find relevant context for queries
6. **Generation**: AI generates responses using retrieved context

---

## Deployment and Configuration

### Environment Variables
```bash
# Database
DB_HOST=localhost
DB_USER=impify_user
DB_PASSWORD=secure_password
DB_NAME=impify_db

# JWT
JWT_SECRET_KEY=your_jwt_secret_key_here

# AI Providers
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
OLLAMA_URL=http://localhost:11434

# Email
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Frontend
REACT_APP_BACKEND_URL=https://your-backend-url.com
```

### Production Deployment

#### Backend Deployment
- **WSGI Server**: Gunicorn for production serving
- **Reverse Proxy**: Nginx for load balancing and SSL
- **SSL/TLS**: Let's Encrypt certificates
- **Process Management**: systemd for service management

#### Frontend Deployment
- **Build Process**: `npm run build` creates optimized bundle
- **Static Hosting**: Served via Nginx or CDN
- **Environment Configuration**: Production environment variables

#### Database Setup
- **MySQL 8.0+**: Required for full feature support
- **Connection Pooling**: SQLAlchemy connection pooling
- **Backup Strategy**: Automated daily backups
- **Migration Management**: Alembic for schema migrations

### Docker Configuration
```dockerfile
# Backend Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "server:app"]
```

---

## Testing and Development

### Backend Testing
```bash
# Run all tests
python test_flashcards_system.py
python test_user_stats_fix.py
python test_multi_file_upload.py

# Run Flask development server
python server.py
```

### Frontend Testing
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests (if configured)
npm test
```

### Test Coverage
- **Authentication Flow**: Login, registration, token refresh
- **File Upload**: Multi-format file processing
- **AI Generation**: Note and flashcard generation
- **Database Operations**: CRUD operations for all entities
- **API Endpoints**: Comprehensive endpoint testing
- **Frontend Components**: React component testing

### Development Workflow
1. **Local Development**: Run backend and frontend separately
2. **Database Setup**: Use local MySQL instance
3. **AI Testing**: Test with Ollama for local development
4. **Version Control**: Git with feature branches
5. **Code Review**: Pull request reviews for all changes

---

## Conclusion

Impify represents a comprehensive AI-powered learning platform that combines modern web technologies with advanced machine learning techniques. The platform's modular architecture, robust security measures, and user-centric design make it a powerful tool for modern education.

### Key Strengths
- **Scalable Architecture**: Modular design allows for easy extension
- **Multi-Provider AI**: Redundant AI systems ensure reliability
- **Comprehensive Security**: Enterprise-grade security measures
- **Mobile-First Design**: Responsive design for all devices
- **Gamification**: Engaging user experience with rewards

### Future Enhancements
- **Advanced Analytics**: Detailed learning analytics and insights
- **Collaborative Features**: Multi-user study sessions
- **Offline Support**: Progressive Web App capabilities
- **Integration APIs**: Third-party educational platform integration
- **Advanced AI Features**: Personalized learning paths and recommendations

This documentation provides a complete overview of the Impify platform, covering all aspects from architecture to deployment. The system is designed to be maintainable, scalable, and user-friendly while providing powerful AI-driven learning capabilities.