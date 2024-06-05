'use client';
import { useEffect, useState } from 'react';
import YouTube, { YouTubeEvent } from 'react-youtube';
import { List, ListItemButton, ListItemText, Grid, Stack  } from '@mui/material';
import { Video, YouTubePlayer } from './common';
import Submit from './submit';
import { getVideo, getVideosFromPlaylist } from './gapi';

interface Props {
    initialized: boolean,
    playerRef: YouTubePlayer,
    stateEvent: any,
    setFirst: any
}

function QueueList({ head, rest, handleClick }) {
    const QueueItem = (i: number, value: Video) => (
        <ListItemButton
            key={i}
            selected={i===0}
            onClick={(_) => handleClick(i)}>
                <ListItemText primary={value?.title} secondary={value?.channel} />
        </ListItemButton>
    )

    return(
        <div>
            <b>QUEUE</b>
            <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {QueueItem(0, head)}
                {rest.map((x, i) => (QueueItem(i+1, x)))}
            </List>
        </div>
    )
}

export default function QueueComponent(props) {
    const { initialized, playerRef, stateEvent, first, setFirst } = props;
    const [videos, setVideos] = useState<Video[]>([]);
    const [playing, setPlaying] = useState<Video>();
    const [loading, setLoading] = useState(false);
    const start = 0;
    const end = 5;

    useEffect(() => {
        console.log('useeffect', initialized, playerRef);
        if (initialized && playerRef?.current) {
            console.log('next playing...', playing);
            if (playerRef.current && playing) {
                playerRef.current.cueVideoById({
                    videoId: playing.id,
                    startSeconds: start,
                    endSeconds: end,
                });
            }
        }
    }, [playing]);

    useEffect(() => {
        if (stateEvent) {
            handleStateChange(stateEvent);
        }
    }, [stateEvent]);


    const getPlaylist = async (id) => { 
        const playlist = await getVideosFromPlaylist(id);
        console.log("getting videos...", playlist);
        setPlaying(playlist[0]);
        setVideos(playlist.slice(1));
        setFirst(playlist[0])
        setLoading(false);
    };

    const pop = (i = 0) => {
        setLoading(true);
        if (videos.length === 0) {
            setPlaying(undefined);
            return;
        }
        setPlaying(videos[i]);
        setVideos([...videos.slice(i+1)]);
        setLoading(false);
        console.log("pop!");
    }

    const push = async (x) => {
        setLoading(true);
        const v = await getVideo(x);
        if (playing) {
            setVideos([v, ...videos]);
        } else {
            console.log("queueing video...", v, playing);
            setPlaying(v);
        }
        
        if (!first) {
            setFirst(v);
        }
        setLoading(false);
    }

    const loadPlaylist = (val) => {
        setLoading(true);
        getPlaylist(val);
    };

    const handleStateChange = (event: YouTubeEvent) => {
        if (event.data == YouTube.PlayerState.ENDED) {
            pop();
        }
    }

    const handleClick = (i) => {
        pop(i);
    }

    return(
        <Stack spacing={2}>
            <Submit 
                label={"Queue playlist:"} 
                initialValue={'PLSGEqKTEpB0FDOYLNSJeKrEZeIT_iehIh'} 
                handleSubmit={loadPlaylist} />
            <Submit 
                label={"Queue video:"} 
                initialValue={'klBnLJSKHBA'} 
                handleSubmit={(v) => push(v)} />
            { playing && <QueueList head={playing} rest={videos} handleClick={handleClick} /> }
            { loading && !initialized && <b>loading...</b> }
            { loading && initialized && <b>loading... will play after this video</b> }
        </Stack>
    );
}