// Page Transitions with Advanced Animations
class PageTransitions {
    constructor() {
        this.isTransitioning = false;
        this.setupTransitions();
    }
    
    setupTransitions() {
        // Monitor page changes and add transition effects
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.classList.contains('page')) {
                        if (target.classList.contains('active')) {
                            this.animatePageIn(target);
                        } else {
                            this.animatePageOut(target);
                        }
                    }
                }
            });
        });
        
        document.querySelectorAll('.page').forEach(page => {
            observer.observe(page, { attributes: true });
        });
    }
    
    animatePageIn(page) {
        // Page enter animation
        const elements = page.querySelectorAll('.page-header, .skill-card, .project-card, .timeline-item, .link-card');
        
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px) scale(0.95)';
            
            setTimeout(() => {
                el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0) scale(1)';
            }, index * 50);
        });
    }
    
    animatePageOut(page) {
        // Page exit animation (subtle)
        const elements = page.querySelectorAll('.page-header, .skill-card, .project-card, .timeline-item, .link-card');
        
        elements.forEach((el) => {
            el.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            el.style.opacity = '0';
            el.style.transform = 'translateY(-10px)';
        });
    }
    
    // Morphing transition effect
    createMorphTransition(fromEl, toEl) {
        const fromRect = fromEl.getBoundingClientRect();
        const toRect = toEl.getBoundingClientRect();
        
        const morph = document.createElement('div');
        morph.style.position = 'fixed';
        morph.style.left = fromRect.left + 'px';
        morph.style.top = fromRect.top + 'px';
        morph.style.width = fromRect.width + 'px';
        morph.style.height = fromRect.height + 'px';
        morph.style.background = getComputedStyle(fromEl).background;
        morph.style.borderRadius = getComputedStyle(fromEl).borderRadius;
        morph.style.zIndex = '9998';
        morph.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        
        document.body.appendChild(morph);
        
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                morph.style.left = toRect.left + 'px';
                morph.style.top = toRect.top + 'px';
                morph.style.width = toRect.width + 'px';
                morph.style.height = toRect.height + 'px';
                morph.style.opacity = '0';
            });
        });
        
        setTimeout(() => {
            morph.remove();
        }, 600);
    }
    
    // Ripple effect from click point
    createRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.style.position = 'fixed';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = '0';
        ripple.style.height = '0';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, transparent 70%)';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '9997';
        ripple.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        
        document.body.appendChild(ripple);
        
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const size = Math.max(window.innerWidth, window.innerHeight) * 2;
                ripple.style.width = size + 'px';
                ripple.style.height = size + 'px';
                ripple.style.opacity = '0';
            });
        });
        
        setTimeout(() => {
            ripple.remove();
        }, 800);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new PageTransitions();
    
    // Add ripple effect to navigation clicks
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const rect = link.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            
            const transitions = new PageTransitions();
            transitions.createRipple(x, y);
        });
    });
});
