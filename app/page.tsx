'use client'

import { useRef, useState } from 'react';
import { Video, YouTubePlayer } from '../src/common';
import VideoQueue from "../src/queue";
import Player from "../src/player";

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
        <div>
            <VideoQueue 
                initialized={initialized}
                stateEvent={endEvent}
                playerRef={playerRef}
                first={first}
                setFirst={setFirst} />
                {first && <Player 
                    video={first}
                    setPlayerRef={setPlayerRef} 
                    setEndEvent={setEndEvent} />}
        </div>
    );
}

export default function Page() {
    return (
            <PlayerComponent />
    );
}