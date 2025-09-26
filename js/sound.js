// HeartQuest - Minimal sound manager
(function(){
    const manifest = {
        click: ['assets/sounds/click.mp3', 'assets/sounds/click.ogg'],
        notify: ['assets/sounds/notify.mp3', 'assets/sounds/notify.ogg'],
        success: ['assets/sounds/success.mp3', 'assets/sounds/success.ogg'],
        error: ['assets/sounds/error.mp3', 'assets/sounds/error.ogg'],
        chat_send: ['assets/sounds/chat_send.mp3', 'assets/sounds/chat_send.ogg'],
        chat_receive: ['assets/sounds/chat_receive.mp3', 'assets/sounds/chat_receive.ogg'],
        ambient: ['assets/sounds/ambient.mp3', 'assets/sounds/ambient.ogg']
    };

    const cache = new Map();
    let ambientAudio = null;

    function createAudio(urls) {
        const audio = new Audio();
        audio.preload = 'auto';
        for (const url of urls) {
            const source = document.createElement('source');
            source.src = url;
            source.type = url.endsWith('.ogg') ? 'audio/ogg' : 'audio/mpeg';
            audio.appendChild(source);
        }
        return audio;
    }

    const Sound = {
        play(name, { volume = 1.0 } = {}) {
            const urls = manifest[name];
            if (!urls) return;
            let audio = cache.get(name);
            if (!audio) {
                audio = createAudio(urls);
                cache.set(name, audio);
            }
            try {
                audio.volume = volume;
                audio.currentTime = 0;
                audio.play();
            } catch(e) {}
        },
        ambient({ volume = 0.2, loop = true } = {}) {
            const urls = manifest.ambient;
            if (!urls) return;
            if (!ambientAudio) ambientAudio = createAudio(urls);
            ambientAudio.loop = loop;
            ambientAudio.volume = volume;
            try { ambientAudio.play(); } catch(e) {}
        },
        stopAmbient() {
            if (ambientAudio) {
                try { ambientAudio.pause(); } catch(e) {}
            }
        }
    };

    window.Sound = Sound;
})();


