'use client'

import { useRef, useState } from 'react';
import { Video, YouTubePlayer } from '../src/common';
import QueueComponent from "../src/queue";
import Player from "../src/player";
import { Stack, Theme, ThemeProvider, createTheme, useMediaQuery } from '@mui/material';

function PlayerComponent() {
    const playerRef = useRef<null | YouTubePlayer>(null);
    const isMediumScreen = useMediaQuery((theme: Theme) => theme?.breakpoints.down('md'));
    const [endEvent, setEndEvent] = useState();
    const [initialized, setInitialized] = useState(false);
    const [first, setFirst] = useState<Video>();
    const setPlayerRef = (r: YouTubePlayer) => {
        if (!initialized) {
            console.log("initialized");
            playerRef.current = r;
            setInitialized(true);
        }
    };

    return (
        <Stack spacing={3} direction={{ md: "column", lg: "row"}}>
            <QueueComponent 
                initialized={initialized}
                stateEvent={endEvent}
                playerRef={playerRef}
                first={first}
                setFirst={setFirst}>
                    <Player 
                        video={first}
                        playerRef={playerRef}
                        setPlayerRef={setPlayerRef} 
                        setEndEvent={setEndEvent} />
                </QueueComponent>
        </Stack>
    );
}

export default function Page() {
    const theme = createTheme();
    return (
        <ThemeProvider theme={theme}>
            <h1 style={{textAlign: 'center', padding: '5px 20 px'}}>{"random play dance <3"}</h1>
            <PlayerComponent />
        </ThemeProvider>
    );
}