// Experience Timeline with Fluid Transitions
class ExperienceManager {
    constructor() {
        this.experiences = [
            {
                date: '2024 - Present',
                title: 'Senior Full Stack Engineer',
                company: 'Tech Innovations Inc.',
                description: 'Leading development of cloud-native microservices architecture. Implemented real-time collaboration features serving 100K+ users. Mentoring junior developers and establishing engineering best practices.'
            },
            {
                date: '2022 - 2024',
                title: 'Full Stack Developer',
                company: 'Digital Solutions Corp',
                description: 'Built and deployed scalable web applications using React, Node.js, and AWS. Reduced API response time by 60% through optimization. Collaborated with cross-functional teams on product development.'
            },
            {
                date: '2021 - 2022',
                title: 'Software Engineer',
                company: 'StartupXYZ',
                description: 'Developed mobile-first Progressive Web Apps with offline capabilities. Implemented CI/CD pipelines and automated testing infrastructure. Contributed to open-source projects and technical documentation.'
            },
            {
                date: '2020 - 2021',
                title: 'Junior Developer',
                company: 'CodeCraft Agency',
                description: 'Assisted in building responsive websites and e-commerce platforms. Learned modern web technologies and agile development methodologies. Participated in code reviews and pair programming sessions.'
            },
            {
                date: '2019 - 2020',
                title: 'Computer Science Degree',
                company: 'University of Technology',
                description: 'Graduated with honors in Computer Science. Specialized in algorithms, data structures, and distributed systems. Led university hackathon team and won regional coding competitions.'
            }
        ];
        
        this.render();
        this.setupObserver();
        this.setupScrollAnimation();
    }
    
    render() {
        const container = document.querySelector('.experience-timeline');
        if (!container) return;
        
        container.innerHTML = this.experiences.map((exp, index) => `
            <div class="timeline-item" data-index="${index}">
                <div class="timeline-date">${exp.date}</div>
                <div class="timeline-content">
                    <h3 class="timeline-title">${exp.title}</h3>
                    <div class="timeline-company">${exp.company}</div>
                    <p class="timeline-description">${exp.description}</p>
                </div>
            </div>
        `).join('');
    }
    
    setupObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = parseInt(entry.target.dataset.index);
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 150);
                }
            });
        }, { threshold: 0.2 });
        
        document.querySelectorAll('.timeline-item').forEach(item => {
            observer.observe(item);
        });
    }
    
    setupScrollAnimation() {
        const timeline = document.querySelector('.experience-timeline');
        if (!timeline) return;
        
        // Parallax effect on scroll
        window.addEventListener('scroll', () => {
            const rect = timeline.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const items = timeline.querySelectorAll('.timeline-item');
                items.forEach((item, index) => {
                    const itemRect = item.getBoundingClientRect();
                    const progress = (window.innerHeight - itemRect.top) / window.innerHeight;
                    
                    if (progress > 0 && progress < 1) {
                        // Subtle parallax
                        const offset = (1 - progress) * 20;
                        item.style.transform = `translateX(${offset}px)`;
                    }
                });
            }
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new ExperienceManager();
});
