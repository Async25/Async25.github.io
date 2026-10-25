// Four image-led projects with dedicated detail views.
class ProjectsManager {
    constructor() {
        this.projects = [
            {
                title: 'AI Code Assistant',
                description: '面向开发者的智能代码补全与重构工作台，将上下文理解、实时建议和工程效率整合在一个清晰的编辑体验中。',
                tech: ['Python', 'TypeScript', 'AI'],
                image: 'example.jpg',
                detail: '从代码搜索、上下文拼接到建议生成，项目重点探索了如何把复杂的 AI 能力变成可解释、可持续迭代的日常工具。'
            },
            {
                title: 'Realtime Collaboration',
                description: '支持实时同步、屏幕共享与多人协作的轻量平台，强调低延迟反馈和稳定的协作状态。',
                tech: ['WebRTC', 'React', 'Node.js'],
                image: 'example.jpg',
                detail: '通过事件流、房间状态和断线恢复机制，让远程团队可以在同一工作空间中自然地沟通和共同完成任务。'
            },
            {
                title: 'Distributed Task Queue',
                description: '面向高吞吐场景的分布式任务队列，覆盖优先级调度、失败重试和水平扩展。',
                tech: ['Go', 'Redis', 'gRPC'],
                image: 'example.jpg',
                detail: '项目围绕可观测性和可靠性设计：任务状态清晰可追踪，服务可以按工作负载独立扩容。'
            },
            {
                title: 'Water Surface Study',
                description: '以水面纹理为灵感的视觉实验，将自然材质、标题排版与交互式作品展示结合。',
                tech: ['WebGL', 'CSS', 'Creative UI'],
                image: 'example.jpg',
                detail: '这是一个持续迭代的视觉原型，用于测试图像叙事、沉浸式背景和项目案例页之间的关系。'
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
