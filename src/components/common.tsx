import { useEffect, useState } from 'react';

export { YouTubePlayer } from 'youtube-player/dist/types';

export interface Timestamp {
  display: string,
  seconds?: number
}

export interface Video {
    id: string,
    title?: string,
    channel?: string,
    start: Timestamp,
    end: Timestamp,
}

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }
  
export function useWindowDimensions() {
const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

useEffect(() => {
    function handleResize() {
    setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
}, []);

return windowDimensions;
}