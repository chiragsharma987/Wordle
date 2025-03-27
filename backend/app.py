from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from game import WordleGame
import logging
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('wordle.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Wordle Game API")

# Configure CORS
origins = [
    os.getenv('FRONTEND_URL', 'http://localhost:3000'),  # Default to localhost if not set
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create game instance
game = WordleGame()

class GuessRequest(BaseModel):
    word: str

@app.get("/")
async def root():
    return {"message": "Welcome to Wordle Game API"}

@app.post("/new-game")
async def new_game():
    """Start a new game"""
    game.new_game()
    logger.info(f"New game started. Target word: {game.target_word}")
    return game.get_game_state()

@app.get("/game-state")
async def get_game_state():
    """Get current game state"""
    return game.get_game_state()

@app.post("/guess")
async def make_guess(guess_request: GuessRequest):
    """Make a guess"""
    logger.info(f"Guess attempt: {guess_request.word}, Target word: {game.target_word}")
    result = game.make_guess(guess_request.word)
    if "error" in result:
        logger.error(f"Invalid guess: {guess_request.word}, Error: {result['error']}")
        raise HTTPException(status_code=400, detail=result["error"])
    return result