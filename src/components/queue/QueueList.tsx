import { Video } from '../common';
import { List, ListItemButton, ListItemText, Divider } from '@mui/material';

export function QueueList({ items, handleClick }) {
    const QueueItem = (value: Video, i: number) => (
        <div>
            <ListItemButton
                key={i}
                selected={i===0}
                onClick={(_) => handleClick(i)}>
                    <ListItemText primary={value?.title} secondary={value?.channel} />
                    <ListItemText secondary={value?.start.display + '-' + value?.end.display} />
            </ListItemButton>
            <Divider />
        </div>
    )

    return(
        <div>
            <p>QUEUE</p>
            <List dense sx={{ width: '100%', maxHeight: '400px', maxWidth: '500px', overflow: 'auto', border: '1px solid gray', borderRadius: '10px', padding: '0' }}>
                {items.map((x, i) => (QueueItem(x, i)))}
            </List>
        </div>
    )
}