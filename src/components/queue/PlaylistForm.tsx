import { Video } from '../common';
import { List, ListItem, ListItemText, Divider } from '@mui/material';
import Form from '../form/form';
import TimestampForm from '../form/TimestampForm';

// { videoid: {start, end} }

export function PlaylistForm({ playlist, handleSubmit }) {
    const QueueItem = (i: number, value: Video) => (
        <div>
            <ListItem key={i}>
                    <ListItemText primary={value?.title} secondary={value?.channel} />
                    <TimestampForm startId={i.toString() + '-start'} endId={i.toString() + '-end'} duration={value?.end.display}/>
            </ListItem>
            <Divider />
        </div>
    )

    const onSubmit = () => {}

    return(
        <div>
            <Form handleSubmit={handleSubmit} submitText={"submit"} style={{width: '600px'}}>
                <List dense sx={{ width: '100%', overflow: 'auto', border: '1px solid gray', borderRadius: '10px', padding: '0' }}>
                    {playlist.map((x, i) => (QueueItem(i, x)))}
                </List>
            </Form>
        </div>
    )
}