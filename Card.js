document.addEventListener('DOMContentLoaded', () => {
    // Define the AudioContext once when the script loads for efficiency
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Load sound effects
    const clickSound = new Audio('https://cdn.pixabay.com/download/audio/2021/08/04/audio_bb630cc098.mp3');
    const whooshSound = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_745420d1e3.mp3');
    
    // Get all the important elements from the HTML page
    const pages = {
        start: document.getElementById('page1'),
        wish: document.getElementById('page2'),
        celebrate: document.getElementById('page3')
    };
    const buttons = {
        start: document.getElementById('startButton'),
        wish: document.getElementById('wishButton')
    };
    const audio = {
        song: document.getElementById('birthdaySong'),
        toggle: document.getElementById('music-toggle')
    };
    const confettiContainer = document.getElementById('confettiContainer');

    // Shows a specific page and hides the others
    function showPage(pageId) {
        Object.values(pages).forEach(page => {
            page.classList.remove('visible');
        });
        if (pages[pageId]) {
            pages[pageId].classList.add('visible');
        }
    }
    
    // Uses the browser's audio features to play the "Happy Birthday" tune
    function playBirthdayTune() {
        if (!audioContext) return;

        // Note frequencies and their durations (in milliseconds)
        const melody = [ 261.6, 261.6, 293.7, 261.6, 349.2, 329.6, 261.6, 261.6, 293.7, 261.6, 392.0, 349.2, 261.6, 261.6, 523.3, 440.0, 349.2, 329.6, 293.7, 493.9, 493.9, 440.0, 349.2, 392.0, 349.2 ];
        const durations = [ 300, 150, 450, 450, 450, 900, 300, 150, 450, 450, 450, 900, 300, 150, 450, 450, 450, 450, 900, 300, 150, 450, 450, 450, 900 ];

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.type = 'sine';

        let currentTime = audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, currentTime);

        // Go through each note and schedule it to play
        let noteStartTime = currentTime;
        melody.forEach((note, index) => {
            const noteDuration = durations[index] / 1000;
            if (note > 0) {
                oscillator.frequency.setValueAtTime(note, noteStartTime);
                gainNode.gain.linearRampToValueAtTime(0.3, noteStartTime + 0.05);
            }
            gainNode.gain.linearRampToValueAtTime(0, noteStartTime + noteDuration - 0.05);
            noteStartTime += noteDuration;
        });
        
        oscillator.start(currentTime);
        oscillator.stop(noteStartTime);
    }

    // When the first button is clicked, go to the cake page
    buttons.start.addEventListener('click', () => {
        clickSound.play().catch(e => console.error(e));
        showPage('wish');
    });

    // When the "blow out" button is clicked, start the celebration
    buttons.wish.addEventListener('click', () => {
        handleCandleBlowout();
    });

    // When the music icon is clicked, mute or unmute the song
    audio.toggle.addEventListener('click', () => {
        audio.song.muted = !audio.song.muted;
        audio.toggle.textContent = audio.song.muted ? '🔇' : '🔊';
        if (!audio.song.muted && audio.song.paused) {
            audio.song.play();
        }
    });
    
    // Blows out candles and transitions to the final page
    function handleCandleBlowout() {
        whooshSound.play().catch(e => console.error(e));
        document.querySelectorAll('.flame').forEach(flame => flame.classList.add('out'));
        playBirthdayTune();

        setTimeout(() => {
            showPage('celebrate');
            startCelebration();
        }, 800);
    }

    // Starts the confetti and background music
    function startCelebration() {
        createConfetti();
        audio.toggle.classList.add('visible');
        audio.song.muted = false;
        
        const playPromise = audio.song.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                audio.toggle.textContent = '🔊';
            }).catch(() => {
                // If autoplay is blocked, show the muted icon
                audio.song.muted = true;
                audio.toggle.textContent = '🔇';
            });
        }
    }

    // Creates the falling confetti pieces
    function createConfetti() {
        if (confettiContainer.hasChildNodes()) return;

        const confettiCount = 150;
        const colors = ['#ef4444', '#f97316', '#84cc16', '#10b981', '#0ea5e9', '#8b5cf6', '#d946ef'];
        const shapes = ['■', '●', '♦', '♥', '★'];

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            
            confetti.style.setProperty('--x-start', (Math.random() - 0.5) * 200 + 'vw');
            confetti.style.setProperty('--x-end', (Math.random() - 0.5) * 200 + 'vw');
            confetti.style.setProperty('--delay', Math.random() * 6 + 's');
            confetti.style.setProperty('--duration', 5 + Math.random() * 5 + 's');
            
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.color = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.fontSize = 12 + Math.random() * 10 + 'px';
            confetti.innerHTML = shapes[Math.floor(Math.random() * shapes.length)];
            
            confettiContainer.appendChild(confetti);
        }
    }
});