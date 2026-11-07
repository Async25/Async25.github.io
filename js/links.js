// Friend Links Page
class LinksManager {
    constructor() {
        this.links = [
            {
                name: '996.ICU',
                url: 'https://996.icu/#/zh_CN',
                description: '工作996,生病ICU',
                avatar: 'ICU'
            },
            {
                name: 'hermes-agent',
                url: 'https://github.com/NousResearch/hermes-agent',
                description: 'Grow with you',
                avatar: 'AI'
            },
            {
                name: 'ekko-agent',
                url: 'https://github.com/EKKOLearnAI/ekko-studio',
                description: 'Work with us',
                avatar: 'AI'
            },
            {
                name: 'JLC EDA',
                url: 'https://lceda.cn/',
                description: 'Moonlight',
                avatar: 'EDA'
            },
            {
                name: 'KK University',
                url: 'https://github.com/CollegesChat/university-information',
                description: 'Share and help',
                avatar: 'UNI'
            },
            {
                name: 'MU5735',
                url: 'https://github.com/wrongly-cuddly-obsession/NTSB_FOIA_MU5735',
                description: '孔雀东南飞,入山不复归',
                avatar: 'AIR'
            }
            //,
            // {
            //     name: 'Security Pro',
            //     url: 'https://securitypro.net',
            //     description: 'Cybersecurity best practices',
            //     avatar: 'SP'
            // },
            // {
            //     name: 'Data Science',
            //     url: 'https://datascience.io',
            //     description: 'Analytics and visualization',
            //     avatar: 'DS'
            // },
            // {
            //     name: 'Mobile Dev',
            //     url: 'https://mobiledev.app',
            //     description: 'Cross-platform mobile apps',
            //     avatar: 'MD'
            // },
            // {
            //     name: 'Cloud Native',
            //     url: 'https://cloudnative.tech',
            //     description: 'Kubernetes and containers',
            //     avatar: 'CN'
            // },
            // {
            //     name: 'Web3 World',
            //     url: 'https://web3world.xyz',
            //     description: 'Blockchain and decentralization',
            //     avatar: 'W3'
            // },
            // {
            //     name: 'Tech News',
            //     url: 'https://technews.today',
            //     description: 'Latest tech industry updates',
            //     avatar: 'TN'
            // }
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
