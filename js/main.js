// Main Application Initialization
class App {
    constructor() {
        this.init();
    }
    
    async init() {
        // Show loading screen
        this.showLoading();
        
        // Initialize all systems
        await this.preloadAssets();
        this.setupAccessibility();
        
        // Hide loading screen after everything is ready
        setTimeout(() => {
            this.hideLoading();
        }, 1000);
    }
    
    showLoading() {
        const overlay = document.querySelector('.loading-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
        }
    }
    
    hideLoading() {
        const overlay = document.querySelector('.loading-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
            
            // Animate page elements
            this.animateInitialLoad();
        }
    }
    
    async preloadAssets() {
        const promises = [];
        
        // Preload fonts
        if (document.fonts) {
            promises.push(document.fonts.ready);
        }
        
        await Promise.all(promises);
    }
    
    setupAccessibility() {
        // Add skip to main content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = `
            position: absolute;
            top: -100px;
            left: 0;
            background: var(--accent-cyan);
            color: var(--bg-deep);
            padding: 0.5rem 1rem;
            z-index: 10000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '0';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-100px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Set ARIA labels
        document.querySelector('.main-nav')?.setAttribute('aria-label', 'Main navigation');
        document.querySelector('.content-wrapper')?.setAttribute('id', 'main');
        document.querySelector('.content-wrapper')?.setAttribute('role', 'main');
        
        // Keyboard navigation enhancement
        this.enhanceKeyboardNavigation();
    }
    
    enhanceKeyboardNavigation() {
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Alt + number for quick navigation
            if (e.altKey && !e.ctrlKey && !e.shiftKey) {
                const key = parseInt(e.key);
                if (key >= 1 && key <= 5) {
                    const pages = ['home', 'skills', 'projects', 'experience', 'links'];
                    const page = pages[key - 1];
                    window.location.hash = page;
                    e.preventDefault();
                }
            }
            
            // Escape to close music playlist
            if (e.key === 'Escape') {
                const playlist = document.querySelector('.player-playlist.open');
                if (playlist) {
                    playlist.classList.remove('open');
                }
            }
        });
        
        // Focus visible enhancement
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });
        
        // Add focus visible styles
        const style = document.createElement('style');
        style.textContent = `
            .keyboard-nav *:focus {
                outline: 2px solid var(--accent-cyan) !important;
                outline-offset: 2px !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    animateInitialLoad() {
        // Animate navigation (initially hidden on home)
        const nav = document.querySelector('.main-nav');
        if (nav && window.location.hash !== '#home' && window.location.hash !== '') {
            nav.style.opacity = '0';
            nav.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                nav.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                nav.style.opacity = '1';
                nav.style.transform = 'translateY(0)';
            }, 300);
        }
        
        // Animate home page elements
        const activePage = document.querySelector('.page.active');
        if (activePage && activePage.id === 'page-home') {
            const elements = activePage.querySelectorAll('.hero-title-group, .nav-cards-grid, .github-heatmap-3d');
            elements.forEach((el, index) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                setTimeout(() => {
                    el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 300 + index * 200);
            });
        }
        
        // Animate music player
        const player = document.querySelector('.music-player');
        if (player) {
            player.style.opacity = '0';
            player.style.transform = 'translateY(20px) scale(0.9)';
            setTimeout(() => {
                player.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                player.style.opacity = '1';
                player.style.transform = 'translateY(0) scale(1)';
            }, 900);
        }
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    new App();
});

// Log initialization
console.log('%cAsync25 Portfolio - Optimized', 'font-size: 24px; font-weight: bold; color: #22D3EE;');
console.log('%cStatic Circuit Board Background', 'font-size: 14px; color: #94A3B8;');
console.log('%c- Fixed 3D GitHub Heatmap', 'color: #4FD1C5;');
console.log('%c- Audio Player with Visualization', 'color: #4FD1C5;');
console.log('%c- Card-based Navigation', 'color: #4FD1C5;');
console.log('%c- Performance Optimized', 'color: #4FD1C5;');
