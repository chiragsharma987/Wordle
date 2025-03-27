from typing import List, Dict, Optional
import random
from .word_repository import WordRepository
import logging

logger = logging.getLogger(__name__)

class WordleGame:
    def __init__(self):
        self.word_repository = WordRepository()
        self.answers, self.valid_guesses = self.word_repository.get_words()
        self.target_word: Optional[str] = None
        self.guesses: List[str] = []
        self.feedback_history: List[List[Dict]] = []
        self.max_attempts = 6
        self.game_over = False
        self.won = False
        self.new_game()

    def new_game(self) -> None:
        self.target_word = random.choice(self.answers)
        self.guesses = []
        self.feedback_history = []
        self.game_over = False
        self.won = False
        logger.info(f"New game initialized with target word: {self.target_word}")

    def make_guess(self, guess: str) -> Dict:
        guess = guess.lower()

        # Validate guess
        if len(guess) != 5:
            return {"error": "Guess must be 5 letters"}
        if not guess.isalpha():
            return {"error": "Guess must contain only letters"}
        if guess not in self.answers and guess not in self.valid_guesses:
            return {"error": "Not a valid word"}
        if self.game_over:
            return {"error": "Game is over"}

        self.guesses.append(guess)

        # Generate feedback
        feedback = []
        target_chars = list(self.target_word)
        guess_chars = list(guess)

        # First pass: Mark correct letters
        for i in range(5):
            if guess_chars[i] == target_chars[i]:
                feedback.append({
                    "letter": guess_chars[i],
                    "result": "correct",
                    "position": i
                })
                target_chars[i] = None
                guess_chars[i] = None
            else:
                feedback.append({
                    "letter": guess[i],
                    "result": "absent",
                    "position": i
                })

        # Second pass: Mark present letters
        for i in range(5):
            if guess_chars[i] and guess_chars[i] in target_chars:
                feedback[i] = {
                    "letter": guess_chars[i],
                    "result": "present",
                    "position": i
                }
                target_chars[target_chars.index(guess_chars[i])] = None

        self.feedback_history.append(feedback)
        self.won = guess == self.target_word
        self.game_over = self.won or len(self.guesses) >= self.max_attempts

        return {
            "guesses": self.guesses,
            "feedback_history": self.feedback_history,
            "gameOver": self.game_over,
            "won": self.won,
            "guessCount": len(self.guesses),
            "targetWord": self.target_word if self.game_over else None
        }

    def get_game_state(self) -> Dict:
        return {
            "guesses": self.guesses,
            "feedback_history": self.feedback_history,
            "gameOver": self.game_over,
            "won": self.won,
            "guessCount": len(self.guesses),
            "maxAttempts": self.max_attempts,
            "targetWord": self.target_word if self.game_over else None
        }