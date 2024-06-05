# random play dance <3
we're just tryna dance... randomly....

## features
- queue playlist
- queue video
- play a snippet from queued videos

## in progress...
- set custom timestamps for snippets

## wishlist
- save & share playlists
- collaborative sessions
- ai integration
    - prompt for playlist creation (e.g. genre/generation)
    - timestamp suggestions (e.g. chorus, dance break, etc.)
- ui for adjusting timestamp within video player
- lyrics integration? for timestamps

## architecture
```│
player component:
├── video player
└── video queue
    ├── currently playing video
    ├── queued videos
    └── submit functions for playlist/video queuing
```