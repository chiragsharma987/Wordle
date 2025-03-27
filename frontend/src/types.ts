export interface FeedbackItem {
    letter: string;
    result: 'correct' | 'present' | 'absent';
    position: number;
}

export interface GameState {
    guesses: string[];
    feedback_history: FeedbackItem[][];
    gameOver: boolean;
    won: boolean;
    guessCount: number;
    maxAttempts: number;
    targetWord: string | null;
    debug_target_word?: string;  // For testing
}