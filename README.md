# random play dance <3
we're just tryna dance... randomly....

[latest build](https://random-play-dance-ela-ine-es-projects-53d012bd.vercel.app/?_vercel_share=lUA37rncfaH8NRxC1pXAyQDrMDsF2tJH)

## features
- queue playlist
- queue video
- play a snippet from queued videos

## in progress...
- delete from queue
- set custom timestamps for snippets

## wishlist
- save & share playlists
- collaborative sessions
- ai integration
    - prompt for playlist creation (e.g. genre/generation)
    - timestamp suggestions (e.g. chorus, dance break, etc.)
- ui for adjusting timestamp within video player
- lyrics integration? for timestamps

## bugs
- queue: generally inconsistent behavior
    - player requires a timeout in order to call queue without null ref
    - calling queue video then playlist -> null ref
    - queueing video while playlist is playing -> null ref
- responsive design for video player

## architecture
```│
player component:
└── video queue
    ├── currently playing video
    ├── queued videos
    ├── video player
    └── submit functions for playlist/video queuing
```