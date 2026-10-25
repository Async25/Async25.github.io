// Four compact horizontal skill rows.
class SkillsManager {
    constructor() {
        this.skills = [
            { name: 'Web Engineering', category: 'Frontend', level: 95, icon: '⚡', tags: ['HTML', 'CSS', 'JavaScript', 'React'] },
            { name: 'Backend & Data', category: 'Backend', level: 90, icon: '⚙', tags: ['Node.js', 'Python', 'SQL', 'APIs'] },
            { name: 'Cloud & Delivery', category: 'Infrastructure', level: 85, icon: '☁', tags: ['Docker', 'Linux', 'CI/CD', 'Cloud'] },
            { name: 'AI & Creative Tools', category: 'AI / ML', level: 82, icon: '🧠', tags: ['PyTorch', 'Automation', 'Prototyping', 'Vision'] }
        ];
        this.render();
        this.setupObserver();
    }

    render() {
        const container = document.querySelector('.skills-grid');
        if (!container) return;
        container.innerHTML = this.skills.map((skill, index) => `
            <article class="skill-card" data-index="${index}">
                <div class="skill-icon" aria-hidden="true">${skill.icon}</div>
                <div>
                    <div class="skill-name">${skill.name}</div>
                    <div class="skill-category">${skill.category}</div>
                </div>
                <div class="skill-level" aria-label="熟练度 ${skill.level}%">
                    <div class="level-bar"><div class="level-fill" style="--level-width:${skill.level}%"></div></div>
                </div>
                <div class="skill-tags">${skill.tags.map(tag => `<span class="skill-tag">${tag}</span>`).join('')}</div>
            </article>
        `).join('');
    }

    setupObserver() {
        const observer = new IntersectionObserver(entries => entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        }), { threshold: 0.1 });
        document.querySelectorAll('.skill-card').forEach(card => observer.observe(card));
    }
}

document.addEventListener('DOMContentLoaded', () => { window.skillsManager = new SkillsManager(); });
