// Friend Links Page
class LinksManager {
    constructor() {
        this.links = [
            {
                name: 'TechBlog',
                url: 'https://techblog.example.com',
                description: 'Insights on modern web development',
                avatar: 'T'
            },
            {
                name: 'CodeMaster',
                url: 'https://codemaster.dev',
                description: 'Advanced programming tutorials',
                avatar: 'C'
            },
            {
                name: 'DevOps Hub',
                url: 'https://devopshub.io',
                description: 'Cloud infrastructure and automation',
                avatar: 'D'
            },
            {
                name: 'AI Research',
                url: 'https://airesearch.org',
                description: 'Machine learning breakthroughs',
                avatar: 'AI'
            },
            {
                name: 'Design Studio',
                url: 'https://designstudio.co',
                description: 'UI/UX design inspiration',
                avatar: 'DS'
            },
            {
                name: 'Open Source',
                url: 'https://opensource.community',
                description: 'Contributing to open source',
                avatar: 'OS'
            },
            {
                name: 'Security Pro',
                url: 'https://securitypro.net',
                description: 'Cybersecurity best practices',
                avatar: 'SP'
            },
            {
                name: 'Data Science',
                url: 'https://datascience.io',
                description: 'Analytics and visualization',
                avatar: 'DS'
            },
            {
                name: 'Mobile Dev',
                url: 'https://mobiledev.app',
                description: 'Cross-platform mobile apps',
                avatar: 'MD'
            },
            {
                name: 'Cloud Native',
                url: 'https://cloudnative.tech',
                description: 'Kubernetes and containers',
                avatar: 'CN'
            },
            {
                name: 'Web3 World',
                url: 'https://web3world.xyz',
                description: 'Blockchain and decentralization',
                avatar: 'W3'
            },
            {
                name: 'Tech News',
                url: 'https://technews.today',
                description: 'Latest tech industry updates',
                avatar: 'TN'
            }
        ];
        
        this.render();
        this.setupObserver();
    }
    
    render() {
        const container = document.querySelector('.links-grid');
        if (!container) return;
        
        container.innerHTML = this.links.map((link, index) => `
            <a href="${link.url}" class="link-card" target="_blank" rel="noopener" data-index="${index}">
                <div class="link-avatar">${link.avatar}</div>
                <div class="link-info">
                    <div class="link-name">${link.name}</div>
                    <div class="link-description">${link.description}</div>
                </div>
            </a>
        `).join('');
    }
    
    setupObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = parseInt(entry.target.dataset.index);
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 50);
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.link-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            observer.observe(card);
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new LinksManager();
});
