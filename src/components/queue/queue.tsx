'use client';
import { useEffect, useState } from 'react';
import { Stack, Theme, useMediaQuery } from '@mui/material';
import { Video, YouTubePlayer } from '../common';
import { getVideo, getVideosFromPlaylist } from '../../services/gapi';
import { QueueList } from './QueueList';
import { QueueForm } from './QueueForm';
import { PlaylistForm } from './PlaylistForm';

interface Props {
    initialized: boolean,
    playerRef: YouTubePlayer,
    endEvent: any,
    first: Video | undefined,
    setFirst: any,
    children: any
}

export default function Queue(props: Props) {
    const { initialized, playerRef, endEvent, first, setFirst, children } = props;
    const [videos, setVideos] = useState<Video[]>([]);
    const [playing, setPlaying] = useState<Video>();
    const [loading, setLoading] = useState(false);
    const [showPlaylistForm, setShowPlaylistForm] = useState(false);
    const isMediumScreen = useMediaQuery((theme: Theme) => theme?.breakpoints.down('lg'));
    const start = 0;
    const end = 5;

    useEffect(() => {
        if (initialized && playerRef?.current && playing) {
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
        if (endEvent) {
            pop();
        }
    }, [endEvent]);

    // basic push/pop functions
    const pop = (i = 0) => {
        setLoading(true);
        console.log('pop!', i, videos);
        if (videos.length === 0) {
            setPlaying(undefined);
            return;
        }
        i = i > 0 ? i-1 : 0;
        setPlaying(videos[i]);
        setVideos([...videos.slice(i+1)]);
        setLoading(false);
    }

    const push = async (v: Video) => {
        setLoading(true);
        const video = await getVideo(v.id);
        if (!video) {
            return;
        }
        
        v.channel = video.channel;
        v.title = video.title;

        if (playing) {
            setVideos([v, ...videos]);
        } else {
            setPlaying(v);
        }
        
        if (!first) {
            setFirst(v);
        }
        setLoading(false);
    }

    // handlers
    const handleClick = (i: number) => {
        console.log(i);
        pop(i);
    }

    const handlePlaylistSubmit = (submission: object) => {
        console.log('handle playlist submit', submission);
        setShowPlaylistForm(false);
        const submittedVideos = videos.map((v: Video, i: number) => { 
            const startId = i.toString() + '-start';
            const endId = i.toString() + '-end';
            v.start = submission[startId];
            v.end = submission[endId];
            return v;
        })

        if (submittedVideos.length > 0) {
            setPlaying(submittedVideos[0]);
            setVideos([...submittedVideos.slice(1)]);
            if (!first) {
                setFirst(submittedVideos[0]);
            }
        }
    }

    // api calls
    const getPlaylist = async (id) => { 
        setLoading(true);
        const playlist = await getVideosFromPlaylist(id);
        console.log('getting playlist', playlist);
        setShowPlaylistForm(true);
        setVideos(playlist);
        setLoading(false);
    };
    
    // misc
    const queueList = () => (
        <div>
            { playing && <QueueList items={[playing, ...videos]} handleClick={handleClick} /> }
            <div style={{textAlign: 'center'}}>
                { loading && !initialized && <b>loading...</b> }
                { loading && initialized && <b>loading video(s)...</b> }
            </div>
        </div>
    )

    return(
        <div style={{margin: 'auto'}}>
            {isMediumScreen ? (
                <div>
                    {children}
                    <Stack style={{padding: '15px 30px'}}>
                        <QueueForm loadPlaylist={getPlaylist} push={push} />
                        {queueList()}
                        {showPlaylistForm && <PlaylistForm playlist={videos} handleSubmit={handlePlaylistSubmit} />}
                    </Stack>
                </div>
            ) : (
            <Stack spacing={5} direction='row'>
                <Stack spacing={2}>
                    <QueueForm loadPlaylist={getPlaylist} push={push} />
                    {queueList()}
                    {showPlaylistForm && <PlaylistForm playlist={videos} handleSubmit={handlePlaylistSubmit} />}
                    </Stack>
                {children}
            </Stack>)}
        </div>
    );
}