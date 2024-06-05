# random play dance <3
we're just tryna dance... randomly....

[latest build](https://random-play-dance-ela-ine-es-projects-53d012bd.vercel.app/?_vercel_share=lUA37rncfaH8NRxC1pXAyQDrMDsF2tJH)

## features
- queue playlist
- queue video
- play a snippet from queued videos

## in progress...
- display queue
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
- queue
    - player requires a timeout in order to call queue without null ref
    - calling queue video then playlist will result in null ref

## architecture
```│
player component:
├── video player
└── video queue
    ├── currently playing video
    ├── queued videos
    └── submit functions for playlist/video queuing
```