'use client'

import { useRef, useState } from 'react';
import { Video, YouTubePlayer } from '../src/common';
import QueueComponent from "../src/queue";
import Player from "../src/player";
import { Stack } from '@mui/material';

function PlayerComponent() {
    const playerRef = useRef<null | YouTubePlayer>(null);
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
        <Stack spacing={3} direction="row">
            <QueueComponent 
                initialized={initialized}
                stateEvent={endEvent}
                playerRef={playerRef}
                first={first}
                setFirst={setFirst} />
                {first && <Player 
                    video={first}
                    setPlayerRef={setPlayerRef} 
                    setEndEvent={setEndEvent} />}
        </Stack>
    );
}

export default function Page() {
    return (
        <div style={{margin: "50px"}}>
            <h1>{"random dance play <3"}</h1>
            <br></br>
            <PlayerComponent />
        </div>
    );
}