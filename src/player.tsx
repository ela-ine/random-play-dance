"use client"
import { MutableRefObject, createContext, memo, useContext, useEffect, useRef, useState } from "react";
import YouTube, { YouTubeEvent } from "react-youtube";
import { Video } from './common';

const offline = process.env.ENV === 'OFFLINE'

const Player = memo(function Player(props: { video: Video | undefined, playerRef, setPlayerRef, setEndEvent }) {
    const { video , setPlayerRef, setEndEvent } = props;
    const start = 0;
    const end = 5;
    const viewportWidth = Math.max(document?.documentElement.clientWidth || 0, window.innerWidth || 0)
    // TODO: replace width condition to reflect xs
    const width = viewportWidth > 750 ? Math.floor(viewportWidth * 0.7) : viewportWidth-16;
    const height = Math.floor(width * 9/16);
    const options = {
        width: width.toString(),
        height: height.toString(),
        playerVars: {
            start: start,
            end: end,
        },
    }

    const onReady = async (event: YouTubeEvent) => {
        await setTimeout(() => {
            console.log("player ready!", event.target.videoTitle);
            if (offline) {
                event.target.mute();
            }
            event.target.playVideo();
            setPlayerRef(event.target);
        }, 1);
    }

    const onStateChange = (event: YouTubeEvent) => {
        if (event.data == YouTube.PlayerState.CUED) {
            event.target.playVideo();
        }
    }

    const onEnd = (event: YouTubeEvent) => {
        setEndEvent(event);
    }

    return(
        <div style={{paddingTop: '16px'}}>
            {video && (
                !offline ?
                (<YouTube
                videoId={video.id}
                opts={options}
                onReady={onReady}
                onStateChange={onStateChange}
                onEnd={onEnd} />) : (
                <div style={{height: height, width: width, backgroundColor: 'black'}}></div>))
            }
        </div>
    );
})

export default Player