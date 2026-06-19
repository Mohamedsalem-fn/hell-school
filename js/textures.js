// js/textures.js

const Textures = {
    // 1. Lava floor texture (cracked obsidian with lava veins)
    createLavaFloor() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        // Dark grey/black stone base
        ctx.fillStyle = '#140c0a';
        ctx.fillRect(0, 0, 512, 512);

        // Draw cracks/lava veins
        ctx.strokeStyle = '#ff3c00';
        ctx.shadowColor = '#ff6600';
        ctx.shadowBlur = 10;
        ctx.lineWidth = 4;

        // Draw procedural stone cracks
        const drawCrack = (x1, y1, x2, y2, depth = 0) => {
            if (depth > 4) return;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            
            // Midpoint displacement for jagged cracks
            const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * 30;
            const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * 30;

            ctx.lineTo(midX, midY);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            // Branch out
            if (Math.random() > 0.6) {
                const branchX = x2 + (Math.random() - 0.5) * 60;
                const branchY = y2 + (Math.random() - 0.5) * 60;
                drawCrack(midX, midY, branchX, branchY, depth + 1);
            }
        };

        // Seed several core lava cracks
        for (let i = 0; i < 12; i++) {
            const x1 = Math.random() * 512;
            const y1 = Math.random() * 512;
            const x2 = x1 + (Math.random() - 0.5) * 200;
            const y2 = y1 + (Math.random() - 0.5) * 200;
            ctx.strokeStyle = i % 2 === 0 ? '#ff3c00' : '#ffaa00';
            ctx.shadowColor = i % 2 === 0 ? '#ff0000' : '#ff6600';
            ctx.lineWidth = 1 + Math.random() * 3;
            drawCrack(x1, y1, x2, y2);
        }

        // Disable shadow blur for performance/details
        ctx.shadowBlur = 0;

        // Draw cobblestone/tile borders
        ctx.strokeStyle = '#050302';
        ctx.lineWidth = 3;
        for (let i = 0; i < 512; i += 64) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, 512);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(512, i);
            ctx.stroke();
        }

        // Add fine dark volcanic ash noise
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        for (let i = 0; i < 8000; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            ctx.fillRect(x, y, 1.5, 1.5);
        }

        return canvas;
    },

    // 2. Volcanic Gothic wall texture
    createVolcanicWall() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        // Dark volcanic stone base
        ctx.fillStyle = '#0f0806';
        ctx.fillRect(0, 0, 512, 512);

        // Brick mortar joints with glowing magma cracks
        ctx.strokeStyle = '#ff3300';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#ff2200';

        // Draw bricks
        const brickH = 32;
        const brickW = 64;
        
        for (let y = 0; y < 512; y += brickH) {
            const offset = (y / brickH) % 2 === 0 ? 0 : brickW / 2;
            
            // Horizontal lines
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(512, y);
            ctx.strokeStyle = Math.random() > 0.3 ? '#ff3300' : '#140c0a';
            ctx.shadowBlur = ctx.strokeStyle === '#ff3300' ? 8 : 0;
            ctx.stroke();

            // Vertical joints
            for (let x = offset; x < 512 + brickW; x += brickW) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x, y + brickH);
                ctx.strokeStyle = Math.random() > 0.4 ? '#ff3300' : '#140c0a';
                ctx.shadowBlur = ctx.strokeStyle === '#ff3300' ? 8 : 0;
                ctx.stroke();
            }
        }

        ctx.shadowBlur = 0;

        // Add rough rocky noise and highlights
        for (let i = 0; i < 4000; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            const size = 1 + Math.random() * 2;
            ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0,0,0,0.5)' : 'rgba(255,85,0,0.1)';
            ctx.fillRect(x, y, size, size);
        }

        return canvas;
    },

    // 3. Bone Gate Texture
    createBoneTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        // Ivory/bone base color
        ctx.fillStyle = '#dacab0';
        ctx.fillRect(0, 0, 256, 256);

        // Draw ribcage-like / skeleton patterns
        ctx.strokeStyle = '#5a4d3b';
        ctx.lineWidth = 3;
        
        // Draw vertical spine and horizontal ribs
        ctx.beginPath();
        ctx.moveTo(128, 0);
        ctx.lineTo(128, 256);
        ctx.stroke();

        for (let y = 16; y < 256; y += 24) {
            // Left ribs
            ctx.beginPath();
            ctx.arc(128 - 60, y, 60, 0, Math.PI * 0.4, false);
            ctx.stroke();
            
            // Right ribs
            ctx.beginPath();
            ctx.arc(128 + 60, y, 60, Math.PI, Math.PI * 0.6, true);
            ctx.stroke();
        }

        // Add aging noise (bone marrow / decayed dust)
        ctx.fillStyle = 'rgba(74, 57, 36, 0.4)';
        for (let i = 0; i < 2000; i++) {
            const x = Math.random() * 256;
            const y = Math.random() * 256;
            ctx.fillRect(x, y, 1.5, 1.5);
        }

        return canvas;
    },

    // 4. Soul Vortex Gate Texture (swirling ethereal matrix)
    createSoulTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        // Deep spectral cyan base
        ctx.fillStyle = '#01121a';
        ctx.fillRect(0, 0, 256, 256);

        // Swirling green/cyan particles
        for (let i = 0; i < 50; i++) {
            const x = 128 + Math.sin(i) * (i * 2);
            const y = 128 + Math.cos(i) * (i * 2);
            const rad = 4 + Math.random() * 15;

            const grad = ctx.createRadialGradient(x, y, 0, x, y, rad);
            grad.addColorStop(0, 'rgba(0, 255, 180, 0.8)');
            grad.addColorStop(0.5, 'rgba(0, 150, 255, 0.3)');
            grad.addColorStop(1, 'rgba(0,0,0,0)');

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(x, y, rad, 0, Math.PI * 2);
            ctx.fill();
        }

        return canvas;
    },

    // 5. Demonic Eye Gate Texture
    createDemonicEyeTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        // Fleshy red background
        ctx.fillStyle = '#470905';
        ctx.fillRect(0, 0, 256, 256);

        // draw blood veins
        ctx.strokeStyle = '#1a0000';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 20; i++) {
            ctx.beginPath();
            ctx.moveTo(128 + (Math.random() - 0.5) * 80, 128 + (Math.random() - 0.5) * 80);
            ctx.bezierCurveTo(
                Math.random() * 256, Math.random() * 256,
                Math.random() * 256, Math.random() * 256,
                Math.random() * 256, Math.random() * 256
            );
            ctx.stroke();
        }

        // Draw outer iris
        const gradIris = ctx.createRadialGradient(128, 128, 10, 128, 128, 60);
        gradIris.addColorStop(0, '#ffcc00'); // Yellow core
        gradIris.addColorStop(0.6, '#ff4400'); // Fiery orange middle
        gradIris.addColorStop(1, '#240000'); // Crimson borders
        ctx.fillStyle = gradIris;
        ctx.beginPath();
        ctx.arc(128, 128, 60, 0, Math.PI * 2);
        ctx.fill();

        // Draw vertical reptilian slit pupil
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.moveTo(128, 80);
        ctx.quadraticCurveTo(105, 128, 128, 176);
        ctx.quadraticCurveTo(151, 128, 128, 80);
        ctx.fill();

        return canvas;
    },

    // 6. Runic Door Texture
    createRunicTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        // Dark grey obsidian
        ctx.fillStyle = '#1c1c1c';
        ctx.fillRect(0, 0, 256, 256);

        // Draw runic symbols glowing red
        ctx.shadowColor = '#ff2200';
        ctx.shadowBlur = 6;
        ctx.strokeStyle = '#ff6600';
        ctx.lineWidth = 3;
        ctx.font = 'bold 24px serif';
        ctx.textAlign = 'center';

        const runes = ['᚛', 'ᚃ', 'ᚌ', 'ᚙ', 'ᛃ', 'ᛏ', 'ᛒ', 'ᛗ', 'ᛥ', '☠', '☣', '⛧'];
        let rIndex = 0;
        for (let y = 30; y < 256; y += 45) {
            for (let x = 30; x < 256; x += 50) {
                ctx.strokeText(runes[rIndex % runes.length], x, y);
                rIndex++;
            }
        }

        ctx.shadowBlur = 0;
        return canvas;
    }
};
