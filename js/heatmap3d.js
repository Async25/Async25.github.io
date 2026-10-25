// GitHub Heatmap 3D - Fixed Camera View
class GitHubHeatmap3D {
    constructor() {
        this.canvas = document.getElementById('heatmap-canvas');
        if (!this.canvas) return;
        
        const ctx = this.canvas.getContext('2d');
        this.ctx = ctx;
        window.heatmap3d = this;
        this.data = this.generateData();
        
        // Fixed camera angles (no interaction)
        // Slight azimuth, viewed from above so the cells and their vertical
        // columns rise away from the base plane instead of hanging below it.
        this.rotationX = 0.78;
        this.rotationY = 0.16;
        
        // Canvas setup
        this.setupCanvas();
        
        // Render
        this.render();
        
        // Handle resize
        window.addEventListener('resize', () => {
            this.setupCanvas();
            this.render();
        });
    }
    
    setupCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        
        this.width = rect.width;
        this.height = rect.height;
    }
    
    generateData() {
        const weeks = 52;
        const days = 7;
        const data = [];
        
        for (let week = 0; week < weeks; week++) {
            for (let day = 0; day < days; day++) {
                // Generate realistic-looking contribution pattern
                let value = 0;
                
                // Lower activity on weekends
                if (day === 0 || day === 6) {
                    value = Math.random() < 0.3 ? Math.floor(Math.random() * 5) : 0;
                } else {
                    // Weekdays have higher activity
                    const rand = Math.random();
                    if (rand < 0.1) {
                        value = 0; // No contribution
                    } else if (rand < 0.4) {
                        value = Math.floor(Math.random() * 5) + 1; // Low
                    } else if (rand < 0.7) {
                        value = Math.floor(Math.random() * 10) + 5; // Medium
                    } else {
                        value = Math.floor(Math.random() * 15) + 10; // High
                    }
                }
                
                data.push({ week, day, value });
            }
        }
        
        return data;
    }
    
    getColor(value) {
        if (value === 0) return { r: 30, g: 41, b: 59, a: 0.5 }; // Dark
        if (value < 5) return { r: 34, g: 211, b: 238, a: 0.3 }; // Light cyan
        if (value < 10) return { r: 34, g: 211, b: 238, a: 0.6 }; // Cyan
        if (value < 15) return { r: 79, g: 209, b: 197, a: 0.8 }; // Teal
        return { r: 249, g: 115, b: 22, a: 1 }; // Orange for high activity
    }
    
    project3D(x, y, z) {
        // Apply rotation
        const cosX = Math.cos(this.rotationX);
        const sinX = Math.sin(this.rotationX);
        const cosY = Math.cos(this.rotationY);
        const sinY = Math.sin(this.rotationY);
        
        // Rotate around Y axis
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;
        
        // Rotate around X axis
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;
        
        // Perspective projection
        const fov = 800;
        const scale = fov / (fov + z2);
        
        return {
            x: this.width / 2 + x1 * scale,
            y: this.height / 2 - y2 * scale,
            z: z2,
            scale: scale
        };
    }
    
    render() {
        const ctx = this.ctx;
        
        // Clear canvas
        ctx.clearRect(0, 0, this.width, this.height);
        
        // Calculate sizes
        const cellSize = Math.min(14, Math.max(8, this.width / 44));
        const gap = Math.max(2, Math.round(cellSize * 0.28));
        const totalWidth = 52 * (cellSize + gap);
        const totalDepth = 7 * (cellSize + gap);
        
        // Create array of bars for sorting by depth
        const bars = this.data.map(d => {
            const x = (d.week - 26) * (cellSize + gap);
            const z = (d.day - 3.5) * (cellSize + gap);
            const height = d.value * 2;
            
            return {
                ...d,
                x,
                z,
                height,
                color: this.getColor(d.value)
            };
        });
        
        // Sort by depth (painter's algorithm)
        bars.sort((a, b) => {
            const projA = this.project3D(a.x, 0, a.z);
            const projB = this.project3D(b.x, 0, b.z);
            return projB.z - projA.z;
        });
        
        // Draw bars
        bars.forEach(bar => {
            if (bar.value === 0) return; // Skip empty cells
            
            const bottomCorners = [
                { x: bar.x - cellSize / 2, y: 0, z: bar.z - cellSize / 2 },
                { x: bar.x + cellSize / 2, y: 0, z: bar.z - cellSize / 2 },
                { x: bar.x + cellSize / 2, y: 0, z: bar.z + cellSize / 2 },
                { x: bar.x - cellSize / 2, y: 0, z: bar.z + cellSize / 2 }
            ];
            
            // Bars rise in positive world-Y; project3D flips the Y axis for screen
            // coordinates, so positive height places the tops above the base grid.
            const topCorners = bottomCorners.map(c => ({
                x: c.x,
                y: bar.height,
                z: c.z
            }));
            
            // Project all corners
            const projBottom = bottomCorners.map(c => this.project3D(c.x, c.y, c.z));
            const projTop = topCorners.map(c => this.project3D(c.x, c.y, c.z));
            
            // Draw top face
            ctx.fillStyle = `rgba(${bar.color.r}, ${bar.color.g}, ${bar.color.b}, ${bar.color.a})`;
            ctx.beginPath();
            ctx.moveTo(projTop[0].x, projTop[0].y);
            projTop.forEach(p => ctx.lineTo(p.x, p.y));
            ctx.closePath();
            ctx.fill();
            
            // Draw front face (darker)
            ctx.fillStyle = `rgba(${bar.color.r * 0.7}, ${bar.color.g * 0.7}, ${bar.color.b * 0.7}, ${bar.color.a})`;
            ctx.beginPath();
            ctx.moveTo(projBottom[1].x, projBottom[1].y);
            ctx.lineTo(projTop[1].x, projTop[1].y);
            ctx.lineTo(projTop[2].x, projTop[2].y);
            ctx.lineTo(projBottom[2].x, projBottom[2].y);
            ctx.closePath();
            ctx.fill();
            
            // Draw right face (even darker)
            ctx.fillStyle = `rgba(${bar.color.r * 0.5}, ${bar.color.g * 0.5}, ${bar.color.b * 0.5}, ${bar.color.a})`;
            ctx.beginPath();
            ctx.moveTo(projBottom[2].x, projBottom[2].y);
            ctx.lineTo(projTop[2].x, projTop[2].y);
            ctx.lineTo(projTop[3].x, projTop[3].y);
            ctx.lineTo(projBottom[3].x, projBottom[3].y);
            ctx.closePath();
            ctx.fill();
            
            // Draw edges for definition
            ctx.strokeStyle = 'rgba(34, 211, 238, 0.3)';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            projTop.forEach((p, i) => {
                if (i === 0) ctx.moveTo(p.x, p.y);
                else ctx.lineTo(p.x, p.y);
            });
            ctx.closePath();
            ctx.stroke();
        });
        
        // Draw grid base
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
        ctx.lineWidth = 1;
        
        // Grid lines along weeks
        for (let day = 0; day <= 7; day++) {
            const z = (day - 3.5) * (cellSize + gap);
            const start = this.project3D(-totalWidth / 2, 0, z);
            const end = this.project3D(totalWidth / 2, 0, z);
            
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        }
        
        // Grid lines along days
        for (let week = 0; week <= 52; week += 4) {
            const x = (week - 26) * (cellSize + gap);
            const start = this.project3D(x, 0, -totalDepth / 2);
            const end = this.project3D(x, 0, totalDepth / 2);
            
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new GitHubHeatmap3D();
});
