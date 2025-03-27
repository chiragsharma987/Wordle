# backend/word_repository.py
import requests
from typing import List, Tuple
import json
import os


class WordRepository:
    def __init__(self):
        self.answers_url = "https://gist.githubusercontent.com/cfreshman/a03ef2cba789d8cf00c08f767e0fad7b/raw/5d752e5f0702da315298a6bb5a771586d6ff445c/wordle-answers-alphabetical.txt"
        self.valid_guesses_url = "https://gist.githubusercontent.com/cfreshman/cdcdf777450c5b5301e439061d29694c/raw/de1df631b45492e0974f7affe266ec36fed736eb/wordle-allowed-guesses.txt"
        self.cache_file = "wordle_words_cache.json"

    def get_words(self) -> Tuple[List[str], List[str]]:
        """Get both answer words and valid guesses"""
        cached_words = self._load_cache()
        if cached_words:
            return cached_words

        answers = self._fetch_words(self.answers_url)
        valid_guesses = self._fetch_words(self.valid_guesses_url)

        if answers and valid_guesses:
            self._save_cache(answers, valid_guesses)
            return answers, valid_guesses

        # Fallback to some basic words if fetching fails
        return ["hello", "world", "quick", "brown", "foxes"], ["hello", "world", "quick", "brown", "foxes"]

    def _fetch_words(self, url: str) -> List[str]:
        try:
            response = requests.get(url)
            response.raise_for_status()
            words = [word.strip().lower() for word in response.text.split('\n') if word.strip()]
            return [word for word in words if len(word) == 5]
        except Exception as e:
            print(f"Error fetching words from {url}: {e}")
            return []

    def _load_cache(self) -> Tuple[List[str], List[str]] or None:
        if os.path.exists(self.cache_file):
            try:
                with open(self.cache_file, 'r') as f:
                    data = json.load(f)
                    return data['answers'], data['valid_guesses']
            except:
                return None
        return None

    def _save_cache(self, answers: List[str], valid_guesses: List[str]) -> None:
        try:
            with open(self.cache_file, 'w') as f:
                json.dump({
                    'answers': answers,
                    'valid_guesses': valid_guesses
                }, f)
        except Exception as e:
            print(f"Error saving cache: {e}")