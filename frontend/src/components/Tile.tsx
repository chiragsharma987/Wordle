import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

interface TileProps {
    letter: string;
    state: 'correct' | 'present' | 'absent' | 'empty' | 'tbd';
    delay?: number;
}

const flipInKeyframes = keyframes`
    0% {
        transform: rotateX(0deg);
    }
    50% {
        transform: rotateX(-90deg);
    }
    100% {
        transform: rotateX(0deg);
    }
`;

const Tile: React.FC<TileProps> = ({ letter, state, delay = 0 }) => {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (state !== 'empty' && state !== 'tbd') {
            const timer = setTimeout(() => setAnimate(true), delay);
            return () => clearTimeout(timer);
        }
    }, [state, delay]);

    const getBgColor = () => {
        switch (state) {
            case 'correct':
                return 'green.500';
            case 'present':
                return 'yellow.400';
            case 'absent':
                return 'gray.500';
            case 'tbd':
                return 'white';
            default:
                return 'white';
        }
    };

    return (
        <Box
            w="60px"
            h="60px"
            bg={getBgColor()}
            border="2px solid"
            borderColor={state === 'empty' || state === 'tbd' ? 'gray.300' : getBgColor()}
            borderRadius="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="2xl"
            fontWeight="bold"
            color={state === 'empty' || state === 'tbd' ? 'black' : 'white'}
            textTransform="uppercase"
            style={{
                transformOrigin: '50% 50%',
                transform: 'rotateX(0deg)',
                animation: animate ? `${flipInKeyframes} 0.6s ease-in-out` : 'none'
            }}
        >
            {letter}
        </Box>
    );
};

export default Tile;