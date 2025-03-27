# Wordle Backend

The backend service for the Wordle game, built with FastAPI.

## Setup

1. Create and activate virtual environment:
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

2. Install dependencies:
pip install -r requirements.txt

3. Start the server:
uvicorn app:app --reload

## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Dependencies

All dependencies are listed in requirements.txt with their specific versions.

Main dependencies:
- fastapi
- uvicorn
- python-dotenv
- pydantic
- requests