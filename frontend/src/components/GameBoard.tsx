import React from 'react';
import { Grid } from '@chakra-ui/react';
import Tile from './Tile';
import { FeedbackItem } from '../types';

interface GameBoardProps {
    guesses: string[];
    feedbackHistory: FeedbackItem[][];
    currentGuess: string;
    maxAttempts: number;
}

const GameBoard: React.FC<GameBoardProps> = ({
    guesses = [],
    feedbackHistory = [],
    currentGuess = '',
    maxAttempts = 6
}) => {
    return (
        <Grid templateRows={`repeat(${maxAttempts}, 1fr)`} gap={4}>
            {Array(maxAttempts).fill(null).map((_, rowIndex) => (
                <Grid
                    key={rowIndex}
                    templateColumns="repeat(5, 1fr)"
                    gap={4}
                    justifyContent="center"
                >
                    {Array(5).fill(null).map((_, colIndex) => {
                        let letter = '';
                        let state: 'correct' | 'present' | 'absent' | 'empty' | 'tbd' = 'empty';
                        let delay = colIndex * 100; // Delay for animation

                        if (rowIndex < guesses.length) {
                            letter = guesses[rowIndex][colIndex];
                            const feedback = feedbackHistory[rowIndex]?.find(
                                f => f.position === colIndex
                            );
                            state = (feedback?.result || 'absent') as 'correct' | 'present' | 'absent';
                        } else if (rowIndex === guesses.length && colIndex < currentGuess.length) {
                            letter = currentGuess[colIndex];
                            state = 'tbd';
                        }

                        return (
                            <Tile
                                key={colIndex}
                                letter={letter}
                                state={state}
                                delay={delay}
                            />
                        );
                    })}
                </Grid>
            ))}
        </Grid>
    );
};

export default GameBoard;