"use client"
import { memo, useState } from "react";
import YouTube, { YouTubeEvent } from "react-youtube";
import { Video } from './common';

const offline = true;

const Player = memo(function Player(props: { video: Video | undefined, playerRef, setPlayerRef, setEndEvent }) {
    const { video , setPlayerRef, setEndEvent } = props;
    const [state, setState] = useState(-1);
    const start = 0;
    const end = 5;
    const options = {
        // width: width.toString(),
        // height: height.toString(),
        playerVars: {
            start: start,
            end: end,
        },
    }

    const getWidth = (documentWidth) => {
        const viewportWidth = Math.max(documentWidth || 0, window.innerWidth || 0);
        return viewportWidth > 750 ? Math.floor(viewportWidth * 0.7) : viewportWidth-16;
    }

    const getHeight = (width) => {
        return Math.floor(width * 9/16);
    }

    const onReady = async (event: YouTubeEvent) => {
        await setTimeout(() => {
            // console.log("player ready!", event.target.videoTitle);
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
        } else if (event.data == YouTube.PlayerState.ENDED && state != -1) {
            setEndEvent(event);
        }
        setState(event.data);
    }

    return(
        <div style={{paddingTop: '16px'}}>
            {video && (
                !offline ?
                (<YouTube
                    videoId={video.id}
                    opts={{
                        width: getWidth(document.documentElement.clientWidth),
                        height: getHeight(getWidth(document.documentElement.clientWidth)),
                        playerVars: {
                            start: start,
                            end: end,
                        },
                    }}
                    onReady={onReady}
                    onStateChange={onStateChange} />
                ) : (
                <div style={{height: getHeight(getWidth(document.documentElement.clientWidth)), width: getWidth(document.documentElement.clientWidth), backgroundColor: 'black'}}></div>))
            }
        </div>
    );
})

export default Player