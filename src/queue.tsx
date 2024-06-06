'use client';
import { useEffect, useState } from 'react';
import YouTube, { YouTubeEvent } from 'react-youtube';
import { List, ListItemButton, ListItemText, Grid, Stack, Divider, Theme, useMediaQuery } from '@mui/material';
import { Video, YouTubePlayer } from './common';
import Submit from './submit';
import { getVideo, getVideosFromPlaylist } from './gapi';

interface Props {
    initialized: boolean,
    playerRef: YouTubePlayer,
    stateEvent: any,
    first: Video | undefined,
    setFirst: any,
    children: any
}

function QueueList({ head, rest, handleClick }) {
    const QueueItem = (i: number, value: Video) => (
        <div>
            <ListItemButton
                key={i}
                selected={i===0}
                onClick={(_) => handleClick(i)}>
                    <ListItemText primary={value?.title} secondary={value?.channel} />
            </ListItemButton>
            <Divider />
        </div>
    )

    return(
        <div>
            <p>QUEUE</p>
            <List dense sx={{ width: '100%', maxHeight: '400px', overflow: 'auto', border: '1px solid gray', borderRadius: '10px', padding: '0' }}>
                {QueueItem(0, head)}
                {rest.map((x, i) => (QueueItem(i+1, x)))}
            </List>
        </div>
    )
}

export default function QueueComponent(props: Props) {
    const { initialized, playerRef, stateEvent, first, setFirst, children } = props;
    const [videos, setVideos] = useState<Video[]>([]);
    const [playing, setPlaying] = useState<Video>();
    const [loading, setLoading] = useState(false);
    const isMediumScreen = useMediaQuery((theme: Theme) => theme?.breakpoints.down('lg'));
    const isSmallScreen = useMediaQuery((theme: Theme) => theme?.breakpoints.down('sm'));
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

    const handleClick = (i: number) => {
        pop(i);
    }

    const queueListComponent = () => (
        <div>
            { playing && <QueueList head={playing} rest={videos} handleClick={handleClick} /> }
            <div style={{textAlign: 'center'}}>
                { loading && !initialized && <b>loading...</b> }
                { loading && initialized && <b>loading video(s)...</b> }
            </div>
        </div>
    )
    
    const queueSubmitComponent = () => (
        <div>
            <Submit 
                label={"Queue playlist:"} 
                initialValue={'PLSGEqKTEpB0FDOYLNSJeKrEZeIT_iehIh'} 
                handleSubmit={loadPlaylist} />
            <Submit 
                label={"Queue video:"} 
                initialValue={'klBnLJSKHBA'} 
                handleSubmit={(v) => push(v)} />
        </div>
    )

    return(
        <div style={{margin: 'auto'}}>
            {isSmallScreen ? (
                <div>
                    {children}
                    <Stack style={{padding: '15px 30px'}}>
                        {queueSubmitComponent()}
                        {queueListComponent()}
                    </Stack>
                </div>
            ) : (isMediumScreen ? (
            <Stack>
                {queueSubmitComponent()}
                {children}
                {queueListComponent()}
            </Stack>
            ) : (
            <Stack spacing={5} direction="row">
                <Stack spacing={2} style={{width: '300px'}}>
                    {queueSubmitComponent()}
                    {queueListComponent()}
                </Stack>
                {children}
            </Stack>))}
        </div>
    );
}