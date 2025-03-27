# Wordle Game

A full-stack implementation of the Wordle game with both frontend and backend components.

## Prerequisites

- Python 3.x
- Node.js and npm
- Git

## Project Structure

Wordle/
├── backend/
│   ├── app.py
│   ├── game.py
│   ├── word_repository.py
│   └── requirements.txt
└── frontend/
    ├── src/
    ├── public/
    └── package.json

## Setup Instructions

### Backend Setup

1. Create and activate virtual environment:

# Navigate to project root
cd Wordle

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

2. Install backend dependencies:
cd backend
pip install -r requirements.txt

3. Start the backend server:
uvicorn app:app --reload

The backend server will run on http://localhost:8000

### Frontend Setup

1. Navigate to frontend directory:
cd frontend

2. Install dependencies:
npm install

3. Start the frontend development server:
npm start

The frontend will be available at http://localhost:3000

## API Documentation

Once the backend is running, you can access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Development

- Backend API is built with FastAPI
- Frontend is built with React
- Make sure to activate the virtual environment before working on the backend
- The backend provides RESTful API endpoints for the Wordle game logic
- The frontend implements the game interface and communicates with the backend

## Dependencies

### Backend Dependencies
- FastAPI: Web framework for building APIs
- Uvicorn: ASGI server for running the application
- Python-dotenv: Environment variable management
- Pydantic: Data validation
- Requests: HTTP library for making API calls

### Frontend Dependencies
(Listed in package.json)

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request