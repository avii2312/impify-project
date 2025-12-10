# Flashcard System Documentation

## Overview

The Impify Flashcard System is an AI-powered study tool that generates interactive flashcards from your notes and implements a spaced repetition algorithm to optimize learning and retention. The system includes both backend API endpoints and a complete frontend interface for studying.

## Features

### 🎯 AI-Powered Flashcard Generation
- Automatically generates high-quality flashcards from your existing notes
- Uses advanced language models (OpenAI, Ollama) to create questions and answers
- Supports both general notes and question paper analysis
- Configurable number of cards generated per note

### 🧠 Spaced Repetition Algorithm
- Implements scientifically-backed spaced repetition for optimal learning
- Cards become due based on your performance and difficulty level
- Automatic interval adjustment based on recall success
- Difficulty scoring and tracking

### 📚 Study Interface
- Interactive flip cards with 3D animations
- Real-time progress tracking
- Performance analytics and success rates
- Session management and review tracking

### 🎨 User Experience
- Beautiful UI with smooth animations
- Responsive design for all devices
- Integration with existing notes and dashboard
- Easy navigation between study and note views

## System Architecture

### Backend Components

#### Database Schema
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
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (note_id) REFERENCES notes(id)
);
```

#### API Endpoints

**Generate Flashcards**
```
POST /api/flashcards/generate
{
  "note_id": "string",
  "num_cards": 8
}
```

**Get User Flashcards**
```
GET /api/flashcards
GET /api/flashcards?note_id=string
```

**Get Due Flashcards**
```
GET /api/flashcards/due
```

**Review Flashcard**
```
PATCH /api/flashcards/{id}/review
{
  "was_correct": boolean
}
```

**Delete Flashcard**
```
DELETE /api/flashcards/{id}
```

#### AI Generation Process
1. **Content Analysis**: Extracts key concepts from notes
2. **Question Generation**: Creates diverse question types
3. **Answer Formulation**: Provides comprehensive, accurate answers
4. **Difficulty Assessment**: Evaluates complexity for each card
5. **Initial Scheduling**: Sets up spaced repetition intervals

#### Spaced Repetition Algorithm
The system uses a modified SM-2 algorithm:

```python
def calculate_next_interval(ease_factor, was_correct, interval_days):
    if was_correct:
        ease_factor = ease_factor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
        if ease_factor < 1.3:
            ease_factor = 1.3
        interval_days = interval_days * ease_factor
    else:
        interval_days = 1
    
    return ease_factor, interval_days
```

### Frontend Components

#### Flashcard Component (`Flashcard.js`)
- **Features**: 3D flip animation, progress tracking, review feedback
- **Props**: 
  - `flashcard`: The flashcard data object
  - `onReview`: Callback function for review results
  - `showAnswer`: Boolean to control answer visibility
  - `disableInteractions`: Boolean to disable user interactions

#### Study Interface (`Study.js`)
- **Features**: Session management, progress tracking, navigation controls
- **States**: Current card index, session statistics, loading states
- **Functions**: 
  - `startStudy()`: Initialize study session
  - `handleReview()`: Process user feedback
  - `nextCard()` / `prevCard()`: Navigation controls

#### Integration with Notes (`NoteView.js`)
- **Features**: Generate flashcards from notes, view existing cards
- **Actions**: Generate new cards, view card list, delete cards
- **Navigation**: Direct links to study interface

## Usage Guide

### For Students

#### 1. Generate Flashcards from Notes
1. Navigate to any note in your dashboard
2. Scroll to the "Flashcards" section
3. Click "Generate Flashcards" to create AI-powered cards
4. Review the generated cards in the expanded view

#### 2. Study Session
1. Go to the Study page from the main navigation
2. Click "Start Study" to begin a session
3. Study cards in order or jump to specific cards
4. Rate your recall: "Got It!" or "Needs Review"
5. Track your progress and accuracy

#### 3. Track Progress
- View success rates for each card
- Monitor your study streak
- Check upcoming reviews
- See your learning statistics

### For Developers

#### API Integration
```javascript
// Generate flashcards
const response = await axiosInstance.post('/api/flashcards/generate', {
  note_id: 'note-123',
  num_cards: 10
});

// Get due cards
const dueCards = await axiosInstance.get('/api/flashcards/due');

// Review a card
await axiosInstance.patch('/api/flashcards/card-123/review', {
  was_correct: true
});
```

#### Custom Flashcard Creation
```javascript
// Create custom flashcard
const card = {
  question: "What is photosynthesis?",
  answer: "The process by which plants convert light energy into chemical energy",
  note_id: "note-123"
};
```

## Configuration

### Environment Variables
```bash
# OpenAI Configuration (optional)
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini

# Ollama Configuration (optional alternative)
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3:8b
```

### Algorithm Parameters
```python
SPACED_REPETITION_CONFIG = {
    'initial_interval': 1,      # Days until first review
    'min_ease_factor': 1.3,     # Minimum ease factor
    'max_ease_factor': 2.5,     # Maximum ease factor
    'ease_bonus': 0.1,          # Bonus for correct answers
    'ease_penalty': 0.2,        # Penalty for incorrect answers
    'new_card_interval': 1,     # Interval for new cards after incorrect
}
```

## Testing

### Automated Test Suite
Run the comprehensive test script:

```bash
python test_flashcards_system.py
```

### Manual Testing Checklist
- [ ] User can register and login
- [ ] Flashcards generate successfully from notes
- [ ] Study interface displays cards correctly
- [ ] Spaced repetition intervals update properly
- [ ] Performance tracking works accurately
- [ ] CRUD operations function correctly
- [ ] UI animations and interactions work smoothly

## Performance Considerations

### Optimization Strategies
1. **Lazy Loading**: Cards load on demand during study sessions
2. **Caching**: Frequently accessed cards are cached
3. **Batch Operations**: Database operations use batch processing
4. **Background Processing**: AI generation runs asynchronously
5. **Progressive Enhancement**: Core functionality works without JavaScript

### Scalability
- Database indexes on user_id and next_review_date
- Pagination for large card sets
- Connection pooling for database access
- Rate limiting on AI generation endpoints

## Security

### Data Protection
- User data isolation through proper authorization
- Input validation and sanitization
- SQL injection prevention
- XSS protection in frontend

### Privacy
- User consent required for AI processing
- No data sharing with third parties
- Local data encryption options
- GDPR compliance considerations

## Future Enhancements

### Planned Features
- [ ] **Bulk Import**: Import flashcards from external sources
- [ ] **Shared Decks**: Share flashcard sets with other users
- [ ] **Advanced Analytics**: Detailed learning analytics
- [ ] **Mobile App**: Native mobile application
- [ ] **Offline Mode**: Study without internet connection
- [ ] **Voice Cards**: Audio-based flashcards
- [ ] **Image Support**: Visual learning with images
- [ ] **Collaborative Study**: Study sessions with friends

### Technical Improvements
- [ ] **WebSockets**: Real-time sync across devices
- [ ] **Service Workers**: Offline functionality
- [ ] **Progressive Web App**: Installable application
- [ ] **Advanced Caching**: Redis integration
- [ ] **Machine Learning**: Personalized difficulty adjustment
- [ ] **Natural Language Processing**: Better question generation

## Troubleshooting

### Common Issues

#### AI Generation Fails
- Check API key configuration
- Verify note content is not empty
- Ensure rate limits are not exceeded
- Check network connectivity

#### Flashcards Not Appearing
- Verify user authentication
- Check database connection
- Ensure proper note_id format
- Check for JavaScript errors in console

#### Study Interface Issues
- Clear browser cache
- Check for JavaScript errors
- Verify API endpoints are accessible
- Ensure proper user permissions

#### Database Issues
- Run database migrations
- Check connection string
- Verify table schemas
- Check for constraint violations

### Debug Mode
Enable debug logging:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Support
For issues and support:
1. Check the troubleshooting guide
2. Review test results
3. Check system logs
4. Contact development team

## Conclusion

The Impify Flashcard System provides a comprehensive, AI-powered learning solution that combines the best of modern technology with proven learning science. The system's modular architecture allows for easy extension and customization while maintaining high performance and user experience standards.

The implementation demonstrates advanced concepts including:
- AI integration for content generation
- Spaced repetition algorithms
- Real-time user interface with animations
- Full-stack development with React and Flask
- Database design and optimization
- API design and documentation
- Testing and quality assurance

This system represents a significant enhancement to the educational technology landscape, providing students with an effective, engaging, and scientifically-backed study tool.