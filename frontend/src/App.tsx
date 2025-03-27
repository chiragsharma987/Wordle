// src/App.tsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    Heading,
    Button,
    useToast,
} from '@chakra-ui/react';
import GameBoard from './components/GameBoard';
import Keyboard from './components/Keyboard';
import { makeGuess, startNewGame } from './api';
import { GameState, FeedbackItem } from './types';

const App: React.FC = () => {
    const toast = useToast();
    const [gameState, setGameState] = useState<GameState>({
        guesses: [],
        feedback_history: [],
        gameOver: false,
        won: false,
        guessCount: 0,
        maxAttempts: 6,
        targetWord: null
    });
    const [currentGuess, setCurrentGuess] = useState('');
    const [feedbackHistory, setFeedbackHistory] = useState<FeedbackItem[][]>([]);
    const [usedKeys, setUsedKeys] = useState<Record<string, string>>({});

    useEffect(() => {
        startNewGame().then(newGameState => {
            setGameState(newGameState);
            setFeedbackHistory([]);
            setUsedKeys({});
        });
    }, []);

    const handleKey = (key: string) => {
        if (gameState.gameOver) return;

        if (key === 'ENTER') {
            if (currentGuess.length !== 5) {
                toast({
                    title: 'Word must be 5 letters',
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                    position: 'top'
                });
                return;
            }
            submitGuess();
        } else if (key === 'BACKSPACE') {
            setCurrentGuess(prev => prev.slice(0, -1));
        } else if (currentGuess.length < 5) {
            setCurrentGuess(prev => prev + key.toLowerCase());
        }
    };

    const submitGuess = async () => {
        try {
            const result = await makeGuess(currentGuess);
            setGameState(result);
            setFeedbackHistory(result.feedback_history);

            // Update used keys
            if (result.feedback_history.length > 0) {
                const latestFeedback = result.feedback_history[result.feedback_history.length - 1];
                latestFeedback.forEach((item: FeedbackItem) => {
                    setUsedKeys(prev => ({
                        ...prev,
                        [item.letter.toUpperCase()]: item.result
                    }));
                });
            }

            setCurrentGuess('');

            if (result.gameOver) {
                toast({
                    title: result.won ? 'Congratulations!' : 'Game Over',
                    description: result.won
                        ? `You won in ${result.guessCount} guesses!`
                        : `The word was ${result.targetWord}`,
                    status: result.won ? 'success' : 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'top'
                });
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error?.response?.data?.detail || 'An error occurred',
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top'
            });
        }
    };

    const handleNewGame = async () => {
        const newGameState = await startNewGame();
        setGameState(newGameState);
        setCurrentGuess('');
        setFeedbackHistory([]);
        setUsedKeys({});
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                handleKey('ENTER');
            } else if (event.key === 'Backspace') {
                handleKey('BACKSPACE');
            } else if (/^[a-zA-Z]$/.test(event.key)) {
                handleKey(event.key.toUpperCase());
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentGuess, gameState.gameOver]);

    return (
        <Box
            minH="100vh"
            bg="gray.100"
            py={8}
            display="flex"
            flexDirection="column"
            alignItems="center"
        >
            <VStack spacing={8} maxW="600px" w="100%" px={4}>
                <Heading size="lg" color="gray.700">
                    Wordle Game
                </Heading>

                <Box w="100%" maxW="400px">
                    <GameBoard
                        guesses={gameState.guesses}
                        feedbackHistory={gameState.feedback_history}
                        currentGuess={currentGuess}
                        maxAttempts={gameState.maxAttempts}
                    />
                </Box>

                <Box w="100%" maxW="500px">
                    <Keyboard
                        onKey={handleKey}
                        usedKeys={usedKeys}
                    />
                </Box>

                {gameState.gameOver && (
                    <Button
                        colorScheme="blue"
                        onClick={handleNewGame}
                        size="lg"
                        w="200px"
                    >
                        New Game
                    </Button>
                )}
            </VStack>
        </Box>
    );
};

export default App;