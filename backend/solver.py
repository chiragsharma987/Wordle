# backend/solver.py
from typing import List, Dict, Set
from .word_repository import WordRepository


class WordleSolver:
    def __init__(self):
        self.word_repository = WordRepository()
        self.answers, self.valid_guesses = self.word_repository.get_words()
        self.possible_words = set(self.answers)
        self.word_length = 5

    def get_next_guess(self, previous_guesses: List[str], feedback_list: List[List[Dict]]) -> str:
        """Get the next best guess based on previous guesses and feedback"""
        if not previous_guesses:
            return "raise"  # Starting word

        self._update_possible_words(previous_guesses, feedback_list)

        if len(self.possible_words) == 1:
            return list(self.possible_words)[0]

        return self._get_best_word()

    def _update_possible_words(self, guesses: List[str], feedback_list: List[List[Dict]]) -> None:
        """Update possible words based on feedback"""
        for guess, feedback in zip(guesses, feedback_list):
            current_possible = set()
            for word in self.possible_words:
                if self._is_word_compatible(word, guess, feedback):
                    current_possible.add(word)
            self.possible_words = current_possible

    def _is_word_compatible(self, word: str, guess: str, feedback: List[Dict]) -> bool:
        """Check if a word is compatible with the given feedback"""
        word_chars = list(word)
        guess_chars = list(guess)

        # Check exact matches
        for i, fb in enumerate(feedback):
            if fb["result"] == "correct":
                if word_chars[i] != guess_chars[i]:
                    return False
            elif fb["result"] == "present":
                if guess_chars[i] not in word_chars or word_chars[i] == guess_chars[i]:
                    return False
            elif fb["result"] == "absent":
                if guess_chars[i] in word_chars:
                    # Count occurrences of the letter in correct and present positions
                    correct_count = sum(1 for f in feedback
                                        if f["letter"] == guess_chars[i]
                                        and f["result"] in ["correct", "present"])
                    if word.count(guess_chars[i]) > correct_count:
                        return False
        return True

    def _get_best_word(self) -> str:
        """Get the best word to guess next based on letter frequency"""
        if len(self.possible_words) == 0:
            return "stare"  # fallback word

        # Calculate letter frequencies in remaining possible words
        letter_freq = {}
        for word in self.possible_words:
            for letter in set(word):  # Use set to count each letter once per word
                letter_freq[letter] = letter_freq.get(letter, 0) + 1

        # Score each possible word
        max_score = 0
        best_word = "stare"  # fallback word

        # Consider both answer words and valid guesses
        all_words = set(self.answers + self.valid_guesses)

        for word in all_words:
            # Score based on unique letters and their frequencies
            score = sum(letter_freq.get(letter, 0) for letter in set(word))
            if score > max_score:
                max_score = score
                best_word = word

        return best_word

    def reset(self) -> None:
        """Reset the solver state"""
        self.possible_words = set(self.answers)