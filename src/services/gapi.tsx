'use server';
import { google } from "googleapis";
import { Video } from "../components/common";

const youtube = google.youtube({
    version: 'v3',
    auth: process.env.GAPI_KEY,
});

const offline = process.env.ENV == 'OFFLINE';
const dummy: Video = { 
    id: 'test', 
    title: 'loooooooong title', 
    channel: 'channel', 
    start: { display: '00:00', seconds: 0 }, 
    end: { display: '00:05', seconds: 5}
}

// gets videos by playlist id
export async function getVideosFromPlaylist(playlist) {
    if (offline) {
        return [dummy, dummy, dummy]
    }
    
    var videos: Video[] = [];

    var nextPageToken: string | null | undefined = '';
    while (nextPageToken != null || nextPageToken != undefined) {
        const response = await youtube.playlistItems.list({
            part: ['snippet'],
            playlistId: playlist,
            maxResults: 50
        });
        
        const pushVideos = response.data.items?.map(async (playlistItem) => {
            const id = playlistItem.snippet?.resourceId?.videoId;
            if (id) {
                const video = await getVideo(id);
                if (video) {
                    videos.push(video);
                }
            }
        })
        
        await Promise.all(pushVideos || []);

        nextPageToken = response.data.nextPageToken;
    }
    return videos;
}

// gets video by id
export async function getVideo(id: string) {
    if (offline) {
        return dummy;
    }
    const response = await youtube.videos.list({
        part: ['snippet', 'contentDetails'],
        id: [id],
        maxResults: 1
    })
    const items = response.data.items;

    if (items && items[0].snippet) {
        const snippet = items[0].snippet;
        const endTime = parseInt(items[0].contentDetails?.duration || '0');
        const v: Video = {
            id: id,
            title: snippet.title || '',
            channel: snippet.channelTitle || '',
            start: { display: "00:00", seconds: 0 },
            end: {
                display: secondsToTimestamp(endTime),
                seconds: endTime
            },
        };
        return v;
    }

}

function secondsToTimestamp(s: number) {
    const toStr = (n: number) => { 
        n > 0 
        ? (n < 10 ? '0'+n.toString() : n.toString()) 
        : '00' 
    }
    const minutes = toStr(Math.floor(s/60));
    const seconds = toStr(s % 60);
    const hours = Math.floor(s/3600) > 0 ? Math.floor(s/3600).toString() : null;

    return hours ? [hours, minutes, seconds].join(':') : minutes + ':' + seconds;
}
    