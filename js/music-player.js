// Music Player with Audio Visualization - FIXED
class MusicPlayer {
    constructor() {
        this.playlist = [];
        this.currentTrackIndex = 0;
        this.audio = new Audio();
        window.musicPlayer = this;
        this.audio.preload = 'metadata';
        this.audio.volume = 1;
        this.lastVolume = 1;
        this.audio.muted = false;
        // Keep playback on the native HTMLMediaElement output path. Routing
        // through WebAudio can produce a running playhead but no Windows audio
        // session/output on some Chromium + Windows device configurations.
        this.isPlaying = false;
        
        // Audio context for visualization (will be created on first play)
        this.audioContext = null;
        this.analyser = null;
        this.source = null;
        this.dataArray = null;
        this.bufferLength = 0;
        
        this.loadPlaylist();
        this.setupControls();
        this.setupProgressBar();
        this.setupVolumeControls();
        this.setupVisualizer();
        
        // Update UI periodically
        setInterval(() => this.updateProgress(), 100);
        
        // Audio event listeners
        this.audio.addEventListener('ended', () => this.playNext());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            console.error('Failed to load:', this.audio.src);
            this.isPlaying = false;
            this.updatePlayButton('▶');
            document.getElementById('album-art')?.classList.remove('playing');
            const title = document.getElementById('track-title');
            if (title) title.textContent = '音频加载失败';
        });
    }
    
    async loadPlaylist() {
        // Music files from the music folder
        const musicFiles = [
            'DAMIDAMI.m4a',
            'You’re Not Supposed to Be Here.m4a',
            '不虚此行.m4a',
            '東南苦行山.m4a',
            '河北墨麒麟.m4a',
            '揪心的玩笑与漫长的白日梦.m4a',
            '凝固的浪花.m4a',
            '山雀.m4a',
            '妄想色心跳.m4a',
            '帷幕视窗.m4a',
            '为往昔而行.m4a',
            '再度和你.m4a',
            'DAMIDAMI(伴奏).m4a'
        ];
        
        this.playlist = musicFiles.map(file => ({
            filename: file,
            title: file.replace(/\.[^.]+$/, '').replace(/\([^)]*\)/g, '').trim(),
            path: `music/${encodeURIComponent(file)}`,
            duration: 0
        }));
        
        this.renderPlaylist();
        this.loadTrack(0);
    }
    
    setupVisualizer() {
        const canvas = document.getElementById('audio-visualizer');
        if (!canvas) return;
        
        this.visualizerCanvas = canvas;
        this.visualizerCtx = canvas.getContext('2d');
        
        const resizeVisualizer = () => {
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            this.visualizerCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        
        resizeVisualizer();
        window.addEventListener('resize', resizeVisualizer);
        
        this.animateVisualizer();
    }
    
    initAudioContext() {
        if (this.audioContext) return;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            
            // Create media element source
            this.source = this.audioContext.createMediaElementSource(this.audio);
            this.source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
            
            this.bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);
            
            console.log('AudioContext initialized successfully');
        } catch (error) {
            console.error('Failed to initialize AudioContext:', error);
        }
    }
    
    animateVisualizer() {
        if (!this.visualizerCanvas) return;
        
        const canvas = this.visualizerCanvas;
        const ctx = this.visualizerCtx;
        const width = canvas.width / window.devicePixelRatio;
        const height = canvas.height / window.devicePixelRatio;
        
        const draw = () => {
            ctx.fillStyle = 'rgba(30, 41, 59, 0.3)';
            ctx.fillRect(0, 0, width, height);
            
            if (this.analyser && this.isPlaying) {
                this.analyser.getByteFrequencyData(this.dataArray);
                
                const barWidth = width / this.bufferLength * 2.5;
                let x = 0;
                
                for (let i = 0; i < this.bufferLength; i++) {
                    const barHeight = (this.dataArray[i] / 255) * height * 0.8;
                    
                    const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
                    gradient.addColorStop(0, '#22D3EE');
                    gradient.addColorStop(1, '#4FD1C5');
                    
                    ctx.fillStyle = gradient;
                    ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);
                    
                    x += barWidth;
                }
            } else {
                // Idle animation
                const time = Date.now() / 1000;
                ctx.strokeStyle = 'rgba(34, 211, 238, 0.3)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                
                for (let x = 0; x < width; x += 5) {
                    const y = height / 2 + Math.sin(x / 20 + time * 2) * 10;
                    if (x === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                
                ctx.stroke();
            }
            
            requestAnimationFrame(draw);
        };
        
        draw();
    }
    
    setupControls() {
        const playPauseBtn = document.getElementById('play-pause-button');
        const prevBtn = document.getElementById('prev-button');
        const nextBtn = document.getElementById('next-button');
        const playlistToggle = document.getElementById('playlist-toggle');
        
        playPauseBtn?.addEventListener('click', () => this.togglePlayPause());
        prevBtn?.addEventListener('click', () => this.playPrevious());
        nextBtn?.addEventListener('click', () => this.playNext());
        playlistToggle?.addEventListener('click', () => this.togglePlaylist());
    }
    
    setupProgressBar() {
        const progressBar = document.getElementById('progress-bar');
        if (!progressBar) return;
        const seek = clientX => {
            const rect = progressBar.getBoundingClientRect();
            if (!rect.width || !Number.isFinite(this.audio.duration)) return;
            const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
            this.audio.currentTime = ratio * this.audio.duration;
            this.updateProgress();
        };
        progressBar.addEventListener('pointerdown', event => {
            event.preventDefault();
            progressBar.setPointerCapture?.(event.pointerId);
            seek(event.clientX);
        });
        progressBar.addEventListener('pointermove', event => {
            if (event.buttons & 1) seek(event.clientX);
        });
        progressBar.addEventListener('keydown', event => {
            const duration = this.audio.duration;
            if (!Number.isFinite(duration)) return;
            const step = event.shiftKey ? 10 : 5;
            if (event.key === 'ArrowRight' || event.key === 'ArrowUp') this.audio.currentTime = Math.min(duration, this.audio.currentTime + step);
            else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') this.audio.currentTime = Math.max(0, this.audio.currentTime - step);
            else if (event.key === 'Home') this.audio.currentTime = 0;
            else if (event.key === 'End') this.audio.currentTime = duration;
            else return;
            event.preventDefault();
            this.updateProgress();
        });
    }

    setupVolumeControls() {
        const slider = document.getElementById('volume-slider');
        const muteButton = document.getElementById('volume-mute-button');
        slider?.addEventListener('input', () => {
            this.audio.volume = Number(slider.value) / 100;
            this.audio.muted = this.audio.volume === 0;
            if (this.audio.volume > 0) this.lastVolume = this.audio.volume;
            this.updateVolumeUI();
        });
        muteButton?.addEventListener('click', () => {
            if (this.audio.muted || this.audio.volume === 0) {
                this.audio.muted = false;
                this.audio.volume = this.lastVolume || 1;
            } else {
                this.lastVolume = this.audio.volume;
                this.audio.muted = true;
            }
            this.updateVolumeUI();
        });
        this.updateVolumeUI();
    }

    updateVolumeUI() {
        const slider = document.getElementById('volume-slider');
        const valueLabel = document.getElementById('volume-value');
        const muteButton = document.getElementById('volume-mute-button');
        const percent = Math.round((this.audio.muted ? 0 : this.audio.volume) * 100);
        if (slider) {
            slider.value = String(percent);
            slider.setAttribute('aria-valuetext', `${percent}%`);
            slider.style.setProperty('--volume-level', `${percent}%`);
        }
        if (valueLabel) valueLabel.textContent = `${percent}%`;
        if (muteButton) {
            muteButton.textContent = percent === 0 ? '🔇' : percent < 50 ? '🔉' : '🔊';
            muteButton.setAttribute('aria-label', percent === 0 ? '取消静音' : '静音');
        }
    }
    
    loadTrack(index) {
        if (index < 0 || index >= this.playlist.length) return;
        
        this.currentTrackIndex = index;
        const track = this.playlist[index];
        
        this.audio.pause();
        this.audio.src = track.path;
        this.audio.load();
        this.updateTrackInfo();
        
        // Update playlist UI
        document.querySelectorAll('.playlist-item').forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    updateTrackInfo() {
        const track = this.playlist[this.currentTrackIndex];
        const titleEl = document.getElementById('track-title');
        const albumArt = document.getElementById('album-art');
        
        if (titleEl) {
            titleEl.textContent = track.title;
        }
        
        if (albumArt) {
            albumArt.textContent = track.title.charAt(0).toUpperCase();
        }
    }
    
    updateDuration() {
        const totalTimeEl = document.getElementById('total-time');
        if (totalTimeEl && this.audio.duration) {
            totalTimeEl.textContent = this.formatTime(this.audio.duration);
        }
    }
    
    updateProgress() {
        const currentTimeEl = document.getElementById('current-time');
        const progressFill = document.getElementById('progress-fill');
        const progressBar = document.getElementById('progress-bar');
        const duration = Number.isFinite(this.audio.duration) ? this.audio.duration : 0;
        const current = Number.isFinite(this.audio.currentTime) ? this.audio.currentTime : 0;
        const percent = duration > 0 ? Math.min(100, (current / duration) * 100) : 0;
        if (progressBar) {
            progressBar.setAttribute('aria-valuenow', String(Math.round(percent)));
            progressBar.setAttribute('aria-valuetext', `${this.formatTime(current)} / ${this.formatTime(duration)}`);
        }
        
        if (currentTimeEl) {
            currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
        }
        
        if (progressFill && this.audio.duration) {
            const percent = duration > 0 ? Math.min(100, (current / duration) * 100) : 0;
            progressFill.style.width = percent + '%';
        }
    }
    
    formatTime(seconds) {
        if (!isFinite(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    async togglePlayPause() {
        // Use native media output instead of attaching a WebAudio graph.
        // The element's play() remains directly bound to the user's click.
        if (this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
            this.updatePlayButton('▶');
            document.getElementById('album-art')?.classList.remove('playing');
        } else {
            try {
                const playResult = this.audio.play();
                if (playResult) await playResult;
                this.isPlaying = true;
                this.updatePlayButton('⏸');
                document.getElementById('album-art')?.classList.add('playing');
            } catch (error) {
                console.error('Playback failed:', error);
                this.isPlaying = false;
                this.updatePlayButton('▶');
                const title = document.getElementById('track-title');
                if (title) title.textContent = '播放失败，请检查音频格式或服务器';
            }
        }
    }
    
    updatePlayButton(symbol) {
        const btn = document.getElementById('play-pause-button');
        if (btn) {
            btn.textContent = symbol;
        }
    }
    
    playNext() {
        const nextIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        this.loadTrack(nextIndex);
        if (this.isPlaying) {
            this.audio.play();
        }
    }
    
    playPrevious() {
        const prevIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
        this.loadTrack(prevIndex);
        if (this.isPlaying) {
            this.audio.play();
        }
    }
    
    togglePlaylist() {
        const playlist = document.getElementById('player-playlist');
        const toggle = document.getElementById('playlist-toggle');
        
        if (playlist?.classList.contains('open')) {
            playlist.classList.remove('open');
            toggle.textContent = '播放列表 ▼';
        } else {
            playlist?.classList.add('open');
            toggle.textContent = '播放列表 ▲';
        }
    }
    
    renderPlaylist() {
        const container = document.getElementById('player-playlist');
        if (!container) return;
        
        container.innerHTML = this.playlist.map((track, index) => `
            <div class="playlist-item" data-index="${index}">
                ${track.title}
            </div>
        `).join('');
        
        // Add click listeners
        container.querySelectorAll('.playlist-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                this.loadTrack(index);
                if (this.isPlaying) {
                    this.audio.play();
                }
            });
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new MusicPlayer();
});
