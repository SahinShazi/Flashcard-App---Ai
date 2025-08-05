# 🧠 Flashcard Learning Platform

A modern, full-stack web application for creating and practicing flashcards to enhance learning.

## ✨ Features

- **User Authentication**: Secure signup, login, and logout with JWT tokens
- **Flashcard Set Management**: Create, edit, and delete flashcard sets
- **Interactive Practice**: Flip cards, navigate through sets, track progress
- **Responsive Design**: Mobile-first design with TailwindCSS
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Progress Tracking**: Monitor your learning progress across sets

## 🛠️ Tech Stack

- **Frontend**: React.js, TailwindCSS, React Router
- **Backend**: Node.js, Express.js, JWT Authentication
- **Database**: MongoDB with Mongoose ODM
- **Security**: bcrypt for password hashing, input sanitization

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB installed and running
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Flashcard
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # In backend directory, create .env file
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```
   MONGODB_URI=mongodb://localhost:27017/flashcard-app
   JWT_SECRET=your-secret-key-here
   PORT=5000
   ```

4. **Start the application**
   ```bash
   # Start backend server (from backend directory)
   npm run dev

   # Start frontend development server (from frontend directory)
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
Flashcard/
├── frontend/                 # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context for state management
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # CSS and TailwindCSS styles
│   └── package.json
├── backend/                 # Node.js backend application
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB schemas
│   ├── middleware/        # Custom middleware
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   └── server.js         # Main server file
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Flashcard Sets
- `GET /api/sets` - Get user's flashcard sets
- `POST /api/sets` - Create new flashcard set
- `GET /api/sets/:id` - Get specific flashcard set
- `PUT /api/sets/:id` - Update flashcard set
- `DELETE /api/sets/:id` - Delete flashcard set

### Flashcards
- `POST /api/sets/:id/cards` - Add card to set
- `PUT /api/sets/:id/cards/:cardId` - Update card
- `DELETE /api/sets/:id/cards/:cardId` - Delete card

## 🎨 Features in Detail

### User Dashboard
- View all created flashcard sets
- See set statistics (card count, creation date)
- Quick actions: View, Edit, Delete sets

### Flashcard Creation
- Create sets with custom titles
- Add unlimited question-answer pairs
- Edit and remove cards dynamically
- Auto-save functionality

### Practice Interface
- Card-by-card navigation
- Smooth flip animations
- Progress indicators
- Previous/Next navigation
- Optional progress tracking

### Security Features
- JWT token authentication
- Password hashing with bcrypt
- Input sanitization
- Protected routes
- CORS configuration

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to platforms like Heroku, Railway, or Vercel

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or GitHub Pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the repository or contact the development team. 
