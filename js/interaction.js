// js/interaction.js

const Interaction = {
    audioCtx: null,
    ambientNodes: [],
    isSoundActive: false,
    selectedDoor: null,

    init() {
        this.setupEventListeners();
        this.setupJoystick();
        this.setupLookJoystick();

        // Auto-fullscreen on first user interaction for all devices (bypassing UA checks)
        const enterFullscreen = () => {
            const docEl = document.documentElement;
            const requestFS = docEl.requestFullscreen || 
                              docEl.webkitRequestFullscreen || 
                              docEl.mozRequestFullScreen || 
                              docEl.msRequestFullscreen;
            
            if (requestFS && !document.fullscreenElement && !document.webkitFullscreenElement) {
                try {
                    const promise = requestFS.call(docEl);
                    if (promise && promise.catch) {
                        promise.catch(err => console.log("Fullscreen promise rejected:", err));
                    }
                } catch (err) {
                    console.log("Fullscreen call failed:", err);
                }
            }
            window.removeEventListener('pointerdown', enterFullscreen);
            window.removeEventListener('touchstart', enterFullscreen);
            window.removeEventListener('click', enterFullscreen);
        };
        window.addEventListener('pointerdown', enterFullscreen);
        window.addEventListener('touchstart', enterFullscreen);
        window.addEventListener('click', enterFullscreen);

        // Global half-screen touch delegation for joysticks
        window.addEventListener('pointerdown', (e) => {
            // Ignore if a door details panel is currently open
            if (this.selectedDoor) {
                return;
            }

            // Ignore if clicking interactive buttons, inputs, panels or video player
            if (e.target.closest('button, input, a, .control-btn, #door-overlay, #sound-toggle-btn, #close-door-btn, #open-portal-btn, .timeline-container, .volume-container, #custom-video')) {
                return;
            }

            const clientX = e.clientX;
            const clientY = e.clientY;

            // Ignore if clicking a door in the 3D scene
            if (window.App3D && window.App3D.checkDoorIntersect && window.App3D.checkDoorIntersect(clientX, clientY)) {
                return;
            }

            if (clientX < window.innerWidth / 2) {
                if (this.startMoveJoystick) {
                    this.startMoveJoystick(clientX, clientY, e.pointerId);
                }
            } else {
                if (this.startLookJoystick) {
                    this.startLookJoystick(clientX, clientY, e.pointerId);
                }
            }
        });
    },

    setupJoystick() {
        const container = document.getElementById('joystick-container');
        const ring = document.getElementById('joystick-ring');
        const orb = document.getElementById('joystick-orb');
        if (!ring || !orb || !container) return;

        let isDragging = false;
        let activePointerId = null;
        let startX = 0;
        let startY = 0;

        const startMoveJoystick = (clientX, clientY, pointerId) => {
            isDragging = true;
            activePointerId = pointerId;

            // Position container under touch
            container.style.position = 'fixed';
            container.style.left = `${clientX - 43}px`;
            container.style.top = `${clientY - 43}px`;
            container.style.bottom = 'auto';

            const rect = ring.getBoundingClientRect();
            startX = rect.left + rect.width / 2;
            startY = rect.top + rect.height / 2;

            try { ring.setPointerCapture(pointerId); } catch(err) {}

            updateJoystick(clientX, clientY);
        };

        const onMove = (e) => {
            if (!isDragging || e.pointerId !== activePointerId) return;
            updateJoystick(e.clientX, e.clientY);
        };

        const onEnd = (e) => {
            if (!isDragging || e.pointerId !== activePointerId) return;
            isDragging = false;
            activePointerId = null;

            try { ring.releasePointerCapture(e.pointerId); } catch(err) {}

            // Restore default position
            container.style.position = '';
            container.style.left = '';
            container.style.top = '';
            container.style.bottom = '';

            orb.style.transition = 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)';
            orb.style.transform = `translate(0px, 0px)`;

            if (window.App3D) {
                window.App3D.joystickMove.x = 0;
                window.App3D.joystickMove.y = 0;
            }
        };

        const updateJoystick = (clientX, clientY) => {
            let dx = clientX - startX;
            let dy = clientY - startY;
            
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxRadius = 23;

            if (dist > maxRadius) {
                dx = (dx / dist) * maxRadius;
                dy = (dy / dist) * maxRadius;
            }

            orb.style.transition = 'none';
            orb.style.transform = `translate(${dx}px, ${dy}px)`;

            if (window.App3D) {
                window.App3D.joystickMove.x = dx / maxRadius;
                window.App3D.joystickMove.y = -dy / maxRadius;
            }
        };

        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onEnd);
        window.addEventListener('pointercancel', onEnd);

        this.startMoveJoystick = startMoveJoystick;
    },

    setupLookJoystick() {
        const container = document.getElementById('look-joystick-container');
        const ring = document.getElementById('look-joystick-ring');
        const orb = document.getElementById('look-joystick-orb');
        if (!ring || !orb || !container) return;

        let isDragging = false;
        let activePointerId = null;
        let startX = 0;
        let startY = 0;

        const startLookJoystick = (clientX, clientY, pointerId) => {
            isDragging = true;
            activePointerId = pointerId;

            // Position container under touch
            container.style.position = 'fixed';
            container.style.left = `${clientX - 43}px`;
            container.style.top = `${clientY - 43}px`;
            container.style.bottom = 'auto';
            container.style.right = 'auto';

            const rect = ring.getBoundingClientRect();
            startX = rect.left + rect.width / 2;
            startY = rect.top + rect.height / 2;

            try { ring.setPointerCapture(pointerId); } catch(err) {}

            updateJoystick(clientX, clientY);
        };

        const onMove = (e) => {
            if (!isDragging || e.pointerId !== activePointerId) return;
            updateJoystick(e.clientX, e.clientY);
        };

        const onEnd = (e) => {
            if (!isDragging || e.pointerId !== activePointerId) return;
            isDragging = false;
            activePointerId = null;

            try { ring.releasePointerCapture(e.pointerId); } catch(err) {}

            // Restore default position
            container.style.position = '';
            container.style.left = '';
            container.style.top = '';
            container.style.bottom = '';
            container.style.right = '';

            orb.style.transition = 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)';
            orb.style.transform = `translate(0px, 0px)`;

            if (window.App3D) {
                window.App3D.lookJoystickMove.x = 0;
                window.App3D.lookJoystickMove.y = 0;
            }
        };

        const updateJoystick = (clientX, clientY) => {
            let dx = clientX - startX;
            let dy = clientY - startY;
            
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxRadius = 23;

            if (dist > maxRadius) {
                dx = (dx / dist) * maxRadius;
                dy = (dy / dist) * maxRadius;
            }

            orb.style.transition = 'none';
            orb.style.transform = `translate(${dx}px, ${dy}px)`;

            if (window.App3D) {
                window.App3D.lookJoystickMove.x = dx / maxRadius;
                window.App3D.lookJoystickMove.y = dy / maxRadius;
            }
        };

        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onEnd);
        window.addEventListener('pointercancel', onEnd);

        this.startLookJoystick = startLookJoystick;
    },

    setupEventListeners() {
        // Sound toggle button
        const soundBtn = document.getElementById('sound-toggle-btn');
        soundBtn.addEventListener('click', () => this.toggleSound());

        // Close door details panel
        document.getElementById('close-door-btn').addEventListener('click', () => {
            this.hideDoorPanel();
            if (window.App3D) {
                window.App3D.resetCamera();
            }
        });

        // "Open Portal" button interaction (Now triggers full screen video play)
        const openPortalBtn = document.getElementById('open-portal-btn');
        openPortalBtn.addEventListener('click', () => {
            if (!this.selectedDoor || !this.selectedDoor.videoUrl) return;
            
            let isAlreadyOpen = false;
            if (window.App3D && window.App3D.doors[this.selectedDoor.id]) {
                isAlreadyOpen = window.App3D.doors[this.selectedDoor.id].isOpened;
            }

            if (isAlreadyOpen) {
                this.launchVideoPlayer(this.selectedDoor.videoUrl);
            } else {
                // Open door first in 3D scene
                if (window.App3D) {
                    window.App3D.animateDoorState(this.selectedDoor.id, true);
                    
                    // Update UI immediately for "Open" state
                    openPortalBtn.textContent = "مشاهدة الفيديو";
                    openPortalBtn.classList.add('glow-red');
                }
                
                // Play portal sound
                const s = this.selectedDoor.sound;
                this.playSpookySynth(s.frequency, s.type, s.duration, s.modFreq, s.modGain);
                
                // Show video player overlay after a short delay to match door animation
                setTimeout(() => {
                    this.launchVideoPlayer(this.selectedDoor.videoUrl);
                }, 1000);
            }
        });


        // Setup custom video controls
        this.setupVideoPlayerControls();
    },

    setupVideoPlayerControls() {
        const video = document.getElementById('custom-video');
        const overlay = document.getElementById('video-player-overlay');
        const closeBtn = document.getElementById('close-video-btn');
        const playPauseBtn = document.getElementById('play-pause-btn');
        const playIcon = playPauseBtn.querySelector('.play-icon');
        const pauseIcon = playPauseBtn.querySelector('.pause-icon');
        const muteBtn = document.getElementById('mute-btn');
        const soundOnIcon = muteBtn.querySelector('.sound-on-icon');
        const muteIcon = muteBtn.querySelector('.mute-icon');
        const volumeSlider = document.getElementById('volume-slider');
        const timelineContainer = document.getElementById('timeline-container');
        const progressBar = document.getElementById('progress-bar');
        const hoverProgress = document.getElementById('hover-progress');
        const currentTimeEl = document.getElementById('current-time');
        const durationTimeEl = document.getElementById('duration-time');
        const fullscreenBtn = document.getElementById('fullscreen-btn');

        // Play/Pause
        const togglePlay = () => {
            if (video.paused) {
                video.play();
                playIcon.classList.add('hidden');
                pauseIcon.classList.remove('hidden');
            } else {
                video.pause();
                playIcon.classList.remove('hidden');
                pauseIcon.classList.add('hidden');
            }
        };

        playPauseBtn.addEventListener('click', togglePlay);
        video.addEventListener('click', togglePlay);

        // Close player
        closeBtn.addEventListener('click', () => {
            video.pause();
            video.src = "";
            overlay.style.display = 'none';
            
            // Exit fullscreen if active
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(err => {
                    console.log("Error trying to exit fullscreen:", err);
                });
            }

            // Unlock and return orientation to landscape if mobile
            if (screen.orientation && screen.orientation.unlock) {
                screen.orientation.unlock();
            }
            if (screen.orientation && screen.orientation.lock) {
                screen.orientation.lock('landscape').catch(err => console.log("Orientation landscape lock failed:", err));
            }
            
            // Resume ambient sounds
            if (this.isSoundActive && this.audioCtx) {
                this.audioCtx.resume();
            }

            // Close door overlay panel and push camera back
            this.hideDoorPanel();
            if (window.App3D) {
                window.App3D.resetCamera();
            }
        });

        // Time format utility
        const formatTime = (time) => {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        };

        // Update progress & time displays
        video.addEventListener('timeupdate', () => {
            const percentage = (video.currentTime / video.duration) * 100;
            progressBar.style.width = `${percentage}%`;
            currentTimeEl.textContent = formatTime(video.currentTime);
        });

        video.addEventListener('loadedmetadata', () => {
            durationTimeEl.textContent = formatTime(video.duration);
        });

        // Scrubbing timeline
        const scrub = (e) => {
            const rect = timelineContainer.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const newTime = (clickX / width) * video.duration;
            video.currentTime = newTime;
        };

        let isScrubbing = false;
        timelineContainer.addEventListener('mousedown', (e) => {
            isScrubbing = true;
            scrub(e);
        });
        window.addEventListener('mousemove', (e) => {
            if (isScrubbing) scrub(e);
        });
        window.addEventListener('mouseup', () => {
            isScrubbing = false;
        });

        // Timeline hover effect
        timelineContainer.addEventListener('mousemove', (e) => {
            const rect = timelineContainer.getBoundingClientRect();
            const hoverX = e.clientX - rect.left;
            const width = rect.width;
            const percentage = (hoverX / width) * 100;
            hoverProgress.style.width = `${percentage}%`;
        });

        timelineContainer.addEventListener('mouseleave', () => {
            hoverProgress.style.width = '0';
        });

        // Volume slider
        volumeSlider.addEventListener('input', () => {
            video.volume = volumeSlider.value;
            video.muted = false;
            soundOnIcon.classList.remove('hidden');
            muteIcon.classList.add('hidden');
        });

        // Mute button
        muteBtn.addEventListener('click', () => {
            if (video.muted) {
                video.muted = false;
                soundOnIcon.classList.remove('hidden');
                muteIcon.classList.add('hidden');
                volumeSlider.value = video.volume;
            } else {
                video.muted = true;
                soundOnIcon.classList.add('hidden');
                muteIcon.classList.remove('hidden');
                volumeSlider.value = 0;
            }
        });

        // Fullscreen
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                overlay.requestFullscreen().catch(err => {
                    console.error(`Error attempting to enable full-screen mode: ${err.message}`);
                });
            } else {
                document.exitFullscreen();
            }
        });
    },

    launchVideoPlayer(videoUrl) {
        const video = document.getElementById('custom-video');
        const overlay = document.getElementById('video-player-overlay');
        const playPauseBtn = document.getElementById('play-pause-btn');
        const playIcon = playPauseBtn.querySelector('.play-icon');
        const pauseIcon = playPauseBtn.querySelector('.pause-icon');

        // Dim or suspend ambient audio
        if (this.audioCtx) {
            this.audioCtx.suspend();
        }

        // Load & Play
        video.src = videoUrl;
        
        // Determine orientation and object-fit based on filename
        const filename = videoUrl.split('/').pop().split('.')[0];
        // Check if filename contains '0' (Arabic or English)
        const hasZero = filename.includes('0') || filename.includes('٠');

        if (hasZero) {
            video.classList.add('object-cover');
        } else {
            video.classList.remove('object-cover');
        }

        overlay.style.display = 'flex';
        
        const targetOrientation = hasZero ? 'landscape' : 'portrait';
        const applyOrientationLock = () => {
            if (screen.orientation && screen.orientation.lock) {
                screen.orientation.lock(targetOrientation).catch(err => {
                    console.log("Orientation lock failed:", err);
                });
            }
        };
        
        // Request fullscreen on overlay automatically and lock orientation AFTER fullscreen is active
        if (overlay.requestFullscreen) {
            overlay.requestFullscreen()
                .then(() => applyOrientationLock())
                .catch(err => {
                    console.log("Error attempting to auto-enable full-screen mode:", err);
                    applyOrientationLock();
                });
        } else if (overlay.webkitRequestFullscreen) {
            overlay.webkitRequestFullscreen();
            setTimeout(applyOrientationLock, 300);
        } else if (overlay.msRequestFullscreen) {
            overlay.msRequestFullscreen();
            setTimeout(applyOrientationLock, 300);
        } else if (video.webkitEnterFullscreen) {
            // Fallback for iOS Safari (iPhone) which only supports fullscreen directly on the video element
            try {
                video.webkitEnterFullscreen();
            } catch(e) {
                console.log("webkitEnterFullscreen failed:", e);
            }
        }

        video.play().then(() => {
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
        }).catch(err => {
            // Autoplay blocked handling
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
            console.log("Autoplay was blocked or interrupted: ", err);
        });
    },



    // Initialize Web Audio API and start ambient hell loop
    initAudio() {
        if (this.audioCtx) return;
        
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContextClass();
        } catch (e) {
            console.error("Web Audio API is not supported in this browser", e);
            return;
        }

        // 1. LOW VOLCANIC RUMBLE
        const rumbleOsc = this.audioCtx.createOscillator();
        const rumbleGain = this.audioCtx.createGain();
        const lowpass = this.audioCtx.createBiquadFilter();

        rumbleOsc.type = 'triangle';
        rumbleOsc.frequency.setValueAtTime(45, this.audioCtx.currentTime); // very low hum

        // Modulate rumble pitch slightly for lava movements
        const rumbleLfo = this.audioCtx.createOscillator();
        const rumbleLfoGain = this.audioCtx.createGain();
        rumbleLfo.frequency.setValueAtTime(0.15, this.audioCtx.currentTime); // slow waves
        rumbleLfoGain.gain.setValueAtTime(4, this.audioCtx.currentTime); // modulate up/down 4Hz

        rumbleLfo.connect(rumbleLfoGain);
        rumbleLfoGain.connect(rumbleOsc.frequency);

        lowpass.type = 'lowpass';
        lowpass.frequency.setValueAtTime(80, this.audioCtx.currentTime);

        rumbleGain.gain.setValueAtTime(0.18, this.audioCtx.currentTime);

        rumbleOsc.connect(lowpass);
        lowpass.connect(rumbleGain);
        rumbleGain.connect(this.audioCtx.destination);

        rumbleOsc.start();
        rumbleLfo.start();

        // 2. HELL WIND SOUNDS (FILTERED WHITE NOISE)
        const bufferSize = 2 * this.audioCtx.sampleRate;
        const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = this.audioCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const bandpass = this.audioCtx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.setValueAtTime(250, this.audioCtx.currentTime);
        bandpass.Q.setValueAtTime(1.5, this.audioCtx.currentTime);

        // Modulate wind frequency
        const windLfo = this.audioCtx.createOscillator();
        const windLfoGain = this.audioCtx.createGain();
        windLfo.type = 'sine';
        windLfo.frequency.setValueAtTime(0.08, this.audioCtx.currentTime); // super slow wind cycle
        windLfoGain.gain.setValueAtTime(120, this.audioCtx.currentTime); // wind sweeps 120Hz

        windLfo.connect(windLfoGain);
        windLfoGain.connect(bandpass.frequency);

        const windGain = this.audioCtx.createGain();
        windGain.gain.setValueAtTime(0.06, this.audioCtx.currentTime);

        whiteNoise.connect(bandpass);
        bandpass.connect(windGain);
        windGain.connect(this.audioCtx.destination);

        whiteNoise.start();
        windLfo.start();

        // 3. TERRIFYING HELL WHISPERS / MOANS
        const whisperOsc1 = this.audioCtx.createOscillator();
        const whisperOsc2 = this.audioCtx.createOscillator();
        const whisperOsc3 = this.audioCtx.createOscillator();
        
        whisperOsc1.type = 'sawtooth';
        whisperOsc2.type = 'triangle';
        whisperOsc3.type = 'square';
        
        whisperOsc1.frequency.setValueAtTime(110, this.audioCtx.currentTime);
        whisperOsc2.frequency.setValueAtTime(114, this.audioCtx.currentTime); // Dissonance
        whisperOsc3.frequency.setValueAtTime(55, this.audioCtx.currentTime); // Deep undertone

        const whisperLfo = this.audioCtx.createOscillator();
        whisperLfo.type = 'sine';
        whisperLfo.frequency.setValueAtTime(0.15, this.audioCtx.currentTime); // Slow eerie sweep

        const whisperLfoGain = this.audioCtx.createGain();
        whisperLfoGain.gain.setValueAtTime(30, this.audioCtx.currentTime); // Wide pitch bend for moaning

        whisperLfo.connect(whisperLfoGain);
        whisperLfoGain.connect(whisperOsc1.frequency);
        whisperLfoGain.connect(whisperOsc2.frequency);
        whisperLfoGain.connect(whisperOsc3.frequency);

        const whisperFilter = this.audioCtx.createBiquadFilter();
        whisperFilter.type = 'bandpass';
        whisperFilter.frequency.setValueAtTime(500, this.audioCtx.currentTime);
        whisperFilter.Q.setValueAtTime(8.0, this.audioCtx.currentTime); // High resonance for vocal formant feel

        // Modulate filter frequency to sound like stuttering/whispering
        const formantLfo = this.audioCtx.createOscillator();
        formantLfo.type = 'sawtooth';
        formantLfo.frequency.setValueAtTime(6, this.audioCtx.currentTime); // fast stutter/whisper rate
        const formantGain = this.audioCtx.createGain();
        formantGain.gain.setValueAtTime(300, this.audioCtx.currentTime);

        formantLfo.connect(formantGain);
        formantGain.connect(whisperFilter.frequency);

        const whisperOut = this.audioCtx.createGain();
        whisperOut.gain.setValueAtTime(0.05, this.audioCtx.currentTime); // Keep it ambient but unsettling

        whisperOsc1.connect(whisperFilter);
        whisperOsc2.connect(whisperFilter);
        whisperOsc3.connect(whisperFilter);
        
        whisperFilter.connect(whisperOut);
        whisperOut.connect(this.audioCtx.destination);

        whisperOsc1.start();
        whisperOsc2.start();
        whisperOsc3.start();
        whisperLfo.start();
        formantLfo.start();

        // Store nodes to suspend/resume
        this.ambientNodes = [
            rumbleOsc, rumbleLfo, whiteNoise, windLfo, rumbleGain, windGain,
            whisperOsc1, whisperOsc2, whisperOsc3, whisperLfo, formantLfo, whisperOut
        ];
    },

    toggleSound() {
        const soundBtn = document.getElementById('sound-toggle-btn');

        if (!this.audioCtx) {
            this.initAudio();
        }

        if (this.isSoundActive) {
            // Suspend audio
            if (this.audioCtx) this.audioCtx.suspend();
            this.isSoundActive = false;
            soundBtn.textContent = "🔇";
            soundBtn.classList.remove('glow-red');
        } else {
            // Resume audio
            if (this.audioCtx) this.audioCtx.resume();
            this.isSoundActive = true;
            soundBtn.textContent = "🔊";
            soundBtn.classList.add('glow-red');
            
            // Play a scary startup chime
            this.playSpookySynth(60, "sawtooth", 1.8, 12, 10);
        }
    },

    // Dynamic Spooky Synthesizer using Web Audio API nodes
    playSpookySynth(baseFreq, type, duration, modFreq, modGain) {
        if (!this.isSoundActive || !this.audioCtx) return;

        const osc = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();
        const delay = this.audioCtx.createDelay();
        const feedback = this.audioCtx.createGain();
        const filter = this.audioCtx.createBiquadFilter();

        // Base wave configuration
        osc.type = type;
        osc.frequency.setValueAtTime(baseFreq, this.audioCtx.currentTime);

        // Frequency Modulation LFO for scary vibration/screech/growl
        if (modFreq > 0) {
            const lfo = this.audioCtx.createOscillator();
            const lfoGain = this.audioCtx.createGain();
            
            lfo.type = 'sawtooth';
            lfo.frequency.setValueAtTime(modFreq, this.audioCtx.currentTime);
            lfoGain.gain.setValueAtTime(modGain, this.audioCtx.currentTime);

            // Frequency envelope sweep (pitch goes down over time)
            lfo.frequency.exponentialRampToValueAtTime(1, this.audioCtx.currentTime + duration);

            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            lfo.start();
            lfo.stop(this.audioCtx.currentTime + duration);
        }

        // Echo/Delay setup for cavernous space feel
        delay.delayTime.setValueAtTime(0.35, this.audioCtx.currentTime);
        feedback.gain.setValueAtTime(0.4, this.audioCtx.currentTime); // fade echoes
        
        // Connect Echo loops
        delay.connect(feedback);
        feedback.connect(delay);

        // Filter out harsh high-frequency noise
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(900, this.audioCtx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(200, this.audioCtx.currentTime + duration);

        // Gain Envelope (Fade-in rapidly, decay slowly)
        gainNode.gain.setValueAtTime(0.01, this.audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.25, this.audioCtx.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

        // Routing
        osc.connect(filter);
        filter.connect(gainNode);
        
        // Send dry sound to speakers
        gainNode.connect(this.audioCtx.destination);
        
        // Send wet sound to delay
        gainNode.connect(delay);
        delay.connect(this.audioCtx.destination);

        // Start and stop synth
        osc.start();
        osc.stop(this.audioCtx.currentTime + duration);
    },

    playFootstep() {
        if (!this.isSoundActive || !this.audioCtx) return;

        // Footstep synthesis: low-frequency thuds (using a sine wave ramped down quickly)
        const osc = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();

        osc.type = 'sine';
        const freq = 65 + Math.random() * 15;
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(10, this.audioCtx.currentTime + 0.12);

        gainNode.gain.setValueAtTime(0.25, this.audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.12);

        osc.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.15);

        // Add a gravel/dirt crunch noise:
        const bufferSize = 0.05 * this.audioCtx.sampleRate;
        const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const noiseSrc = this.audioCtx.createBufferSource();
        noiseSrc.buffer = noiseBuffer;

        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(320, this.audioCtx.currentTime);
        filter.Q.setValueAtTime(3.0, this.audioCtx.currentTime);

        const noiseGain = this.audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0.025, this.audioCtx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.05);

        noiseSrc.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.audioCtx.destination);

        noiseSrc.start();
    },

    playJumpSound() {
        if (!this.isSoundActive || !this.audioCtx) return;

        const osc = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(90, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(260, this.audioCtx.currentTime + 0.28);

        gainNode.gain.setValueAtTime(0.18, this.audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.32);

        osc.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.35);
    },

    showDoorPanel(doorData) {
        this.selectedDoor = doorData;

        // Populate details
        document.getElementById('door-title').textContent = doorData.name;
        document.getElementById('door-danger').textContent = `مستوى الخطر: ${doorData.danger}`;
        document.getElementById('door-description').textContent = doorData.description;

        // Reset Portal Viewport state
        const openPortalBtn = document.getElementById('open-portal-btn');
        
        let isOpened = false;
        if (window.App3D && window.App3D.doors[doorData.id]) {
            isOpened = window.App3D.doors[doorData.id].isOpened;
        }

        if (isOpened) {
            openPortalBtn.textContent = "مشاهدة الفيديو";
            openPortalBtn.classList.add('glow-red');
        } else {
            openPortalBtn.textContent = "فتح البوابة وعبور البعد";
            openPortalBtn.classList.remove('glow-red');
        }



        // Slide panel in
        document.getElementById('door-overlay').classList.add('active');
        document.getElementById('instruction-box').style.opacity = '0';

        // Play door opening rumble sound
        const s = doorData.sound;
        this.playSpookySynth(s.frequency, s.type, s.duration, s.modFreq, s.modGain);
    },

    hideDoorPanel() {
        this.selectedDoor = null;
        document.getElementById('door-overlay').classList.remove('active');
        document.getElementById('instruction-box').style.opacity = '1';
        
        // Play short closing thump
        this.playSpookySynth(90, "sine", 0.4, 0, 0);
    }
};

document.addEventListener('DOMContentLoaded', () => Interaction.init());
