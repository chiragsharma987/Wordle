import React from 'react';
import { Grid, Button } from '@chakra-ui/react';

const KEYBOARD_LAYOUT = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
];

interface KeyboardProps {
    onKey: (key: string) => void;
    usedKeys: Record<string, string>;
}

const Keyboard: React.FC<KeyboardProps> = ({ onKey, usedKeys = {} }) => {
    const getKeyColor = (key: string) => {
        const state = usedKeys[key];
        switch (state) {
            case 'correct':
                return 'green.500';
            case 'present':
                return 'yellow.400';
            case 'absent':
                return 'gray.500';
            default:
                return 'gray.200';
        }
    };

    const getTextColor = (key: string) => {
        return usedKeys[key] ? 'white' : 'black';
    };

    return (
        <Grid gap={2} w="100%" maxW="600px">
            {KEYBOARD_LAYOUT.map((row, i) => (
                <Grid
                    key={i}
                    templateColumns={`repeat(${row.length}, 1fr)`}
                    gap={2}
                    justifyContent="center"
                >
                    {row.map((key) => (
                        <Button
                            key={key}
                            onClick={() => onKey(key)}
                            bg={getKeyColor(key)}
                            color={getTextColor(key)}
                            _hover={{ opacity: 0.8 }}
                            height="50px"
                            fontSize={key.length > 1 ? 'xs' : 'md'}
                            fontWeight="bold"
                            borderRadius="md"
                            w={key === 'ENTER' || key === 'BACKSPACE' ? '70px' : '40px'}
                        >
                            {key}
                        </Button>
                    ))}
                </Grid>
            ))}
        </Grid>
    );
};

export default Keyboard;