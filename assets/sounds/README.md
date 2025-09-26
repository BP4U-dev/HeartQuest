HeartQuest Sound Assets

Drop your audio files in this folder. Suggested filenames (replace with your own):

- click.mp3           UI click
- notify.mp3          Notification toast
- success.mp3         Positive action (save, level up)
- error.mp3           Error/invalid action
- ambient.mp3         Light ambient loop for worlds
- chat_send.mp3       Chat sent
- chat_receive.mp3    Chat received

Guidelines
- Prefer short, lightweight MP3/OGG files (≤ 100 KB where possible) for fast load.
- Provide both `.mp3` and `.ogg` if you want broader browser support.
- Loopable tracks (e.g., ambient) should be trimmed to loop cleanly.

Note
This repository doesn't include binary audio to keep size small. Add your sounds here and they will be picked up by the sound manager (see `js/sound.js`).

