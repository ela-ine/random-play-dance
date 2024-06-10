import Form from "../form/form";
import { Video } from '../common';
import TimestampForm from "../form/TimestampForm";
import FormField from "../form/FormField";

export function QueueForm({ loadPlaylist, push }) {
    const videoMatch = /^https:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})$/;
    const playlistMatch = /^https:\/\/(?:www\.)?(?:youtube\.com\/playlist\?list=)(.{34})$/;

    const videoId = 'video';
    const playlistId = 'playlistId';
    const startId = 'start';
    const endId = 'end';

    const handleVideo = (form: object) => {
        if (!form[videoId] || form[videoId].length != 2 || !form[startId] || !form[endId]) {
            console.log(form);
            throw new Error('video parsing failed: ' + [videoId, startId, endId].join(', '));
        }
        const id = form[videoId][1];
        const startTime = form[startId];
        const endTime = form[endId];

        const video: Video = {
            id: id,
            start: startTime,
            end: endTime,
        }

        push(video);
    }

    return (
        <div style={{width: '350px', margin: 'auto'}}>
            <Form submitText={"queue"} handleSubmit={handleVideo}>
                    <FormField id={videoId} label={'queue video:'} initialValue={'https://www.youtube.com/watch?v=dpMrI9fztlU'} regex={videoMatch} />
                    <TimestampForm startId={startId} endId={endId}></TimestampForm>
            </Form>
            <Form submitText={"queue"} handleSubmit={loadPlaylist}>
                    <FormField id={playlistId} label={'queue playlist:'} initialValue={'https://www.youtube.com/playlist?list=PLSGEqKTEpB0FDOYLNSJeKrEZeIT_iehIh'} regex={playlistMatch}></FormField>
            </Form>
        </div>
)}