// Four image-led projects with dedicated detail views.
class ProjectsManager {
    constructor() {
        this.projects = [
            {
                title: '车载平衡滚球运动控制系统',
                description: '26电赛H题     MSPM0 + STM32F4 + RK3576',
                tech: ['Python/C', 'PID/Kalman', '裸机多任务'],
                image: 'project1.jpg',
                detail: '。'
            },
            {
                title: '简易自行瞄准装置（正在重制）',
                description: '25电赛E题     MSSPM0 + STM32F4 + Jetson',
                tech: ['C++/C', 'Kalman', 'ROS2'],
                image: 'project2.jpg',
                detail: '。'
            },
            {
                title: 'RS485工业边缘网关',
                description: '企业项目',
                tech: ['Python', 'FreeRTOS', 'MQTT'],
                image: 'example.jpg',
                detail: '。'
            },
            {
                title: '。',
                description: '。',
                tech: ['WebGL', 'CSS', 'Creative UI'],
                image: 'example.jpg',
                detail: '。'
            }
        ];
        this.render();
        this.setupObserver();
        window.projectsManager = this;
        const route = /^project-(\d+)$/.exec(window.location.hash.slice(1));
        if (route) this.showDetail(Number(route[1]), false);
    }

    render() {
        const container = document.querySelector('.projects-grid');
        if (!container) return;
        container.innerHTML = this.projects.map((project, index) => `
            <article class="project-card" data-index="${index}" tabindex="0" role="link" aria-label="查看${project.title}详情">
                <div class="project-thumbnail">
                    <img class="project-image" src="${project.image}" alt="${project.title} 项目图片" loading="lazy">
                    <h2 class="project-title-overlay">${project.title}</h2>
                </div>
                <div class="project-content"><p class="project-description">${project.description}</p></div>
            </article>
        `).join('');

        container.querySelectorAll('.project-card').forEach(card => {
            const open = () => this.showDetail(Number(card.dataset.index));
            card.addEventListener('click', open);
            card.addEventListener('keydown', event => {
                if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); }
            });
        });
    }

    showDetail(index, updateHash = true) {
        const project = this.projects[index];
        if (!project) return;
        document.getElementById('project-detail-image').src = project.image;
        document.getElementById('project-detail-image').alt = `${project.title} 项目图片`;
        document.getElementById('project-detail-title').textContent = project.title;
        document.getElementById('project-detail-tech').textContent = project.tech.join('  /  ');
        document.getElementById('project-detail-description').textContent = project.description;
        document.getElementById('project-detail-content').textContent = project.detail;
        if (window.navigation) window.navigation.navigateToPage('project-detail', updateHash ? `project-${index}` : null);
        else if (updateHash) window.location.hash = `project-${index}`;
    }

    setupObserver() {
        const observer = new IntersectionObserver(entries => entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.style.opacity = '1'; entry.target.style.transform = 'translateY(0)'; }
        }), { threshold: 0.1 });
        document.querySelectorAll('.project-card').forEach(card => {
            card.style.opacity = '0'; card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'; observer.observe(card);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => { new ProjectsManager(); });
