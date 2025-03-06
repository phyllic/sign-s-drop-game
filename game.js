document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Game objects
    const ship = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 15,
        angle: 0,
        rotation: 0,
        thrust: 0,
        velX: 0,
        velY: 0
    };

    let asteroids = [];
    let bullets = [];
    const ASTEROID_COUNT = 5;

    // Input handling
    const keys = {
        left: false,
        right: false,
        up: false,
        space: false
    };

    // Initialize asteroids
    function spawnAsteroids() {
        asteroids = [];
        for (let i = 0; i < ASTEROID_COUNT; i++) {
            asteroids.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: 30 + Math.random() * 20,
                velX: (Math.random() * 2 - 1) * 2,
                velY: (Math.random() * 2 - 1) * 2,
                angle: Math.random() * Math.PI * 2,
                rotation: Math.random() * 0.04 - 0.02
            });
        }
    }

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowLeft': keys.left = true; break;
            case 'ArrowRight': keys.right = true; break;
            case 'ArrowUp': keys.up = true; break;
            case ' ': keys.space = true; break;
        }
    });

    document.addEventListener('keyup', (e) => {
        switch(e.key) {
            case 'ArrowLeft': keys.left = false; break;
            case 'ArrowRight': keys.right = false; break;
            case 'ArrowUp': keys.up = false; break;
            case ' ': keys.space = false; break;
        }
    });

    // Ship movement
    function updateShip() {
        // Rotation
        ship.rotation = 0;
        if (keys.left) ship.rotation = -0.1;
        if (keys.right) ship.rotation = 0.1;
        ship.angle += ship.rotation;

        // Thrust
        ship.thrust = keys.up ? 0.2 : 0;
        ship.velX += Math.cos(ship.angle) * ship.thrust;
        ship.velY += Math.sin(ship.angle) * ship.thrust;

        // Friction
        ship.velX *= 0.98;
        ship.velY *= 0.98;

        // Position
        ship.x += ship.velX;
        ship.y += ship.velY;

        // Screen wrap
        ship.x = (ship.x + canvas.width) % canvas.width;
        ship.y = (ship.y + canvas.height) % canvas.height;

        // Shooting
        if (keys.space && bullets.length < 5) {
            bullets.push({
                x: ship.x + Math.cos(ship.angle) * ship.radius,
                y: ship.y + Math.sin(ship.angle) * ship.radius,
                velX: Math.cos(ship.angle) * 6,
                velY: Math.sin(ship.angle) * 6,
                life: 60
            });
            keys.space = false; // Prevent continuous firing
        }
    }

    // Update game state
    function update() {
        updateShip();

        // Update bullets
        bullets = bullets.filter(b => b.life > 0);
        bullets.forEach(b => {
            b.x += b.velX;
            b.y += b.velY;
            b.life--;
            b.x = (b.x + canvas.width) % canvas.width;
            b.y = (b.y + canvas.height) % canvas.height;
        });

        // Update asteroids
        asteroids.forEach(a => {
            a.x += a.velX;
            a.y += a.velY;
            a.angle += a.rotation;
            a.x = (a.x + canvas.width) % canvas.width;
            a.y = (a.y + canvas.height) % canvas.height;
        });
    }

    // Render game
    function draw() {
        // Clear canvas
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw ship
        ctx.save();
        ctx.translate(ship.x, ship.y);
        ctx.rotate(ship.angle);
        ctx.beginPath();
        ctx.moveTo(ship.radius, 0);
        ctx.lineTo(-ship.radius * 0.7, ship.radius * 0.7);
        ctx.lineTo(-ship.radius * 0.7, -ship.radius * 0.7);
        ctx.closePath();
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.restore();

        // Draw asteroids
        asteroids.forEach(a => {
            ctx.save();
            ctx.translate(a.x, a.y);
            ctx.rotate(a.angle);
            ctx.beginPath();
            for (let i = 0; i < 12; i++) {
                const angle = (i / 12) * Math.PI * 2;
                const radius = a.radius * (0.8 + Math.random() * 0.2);
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.strokeStyle = 'white';
            ctx.stroke();
            ctx.restore();
        });

        // Draw bullets
        bullets.forEach(b => {
            ctx.beginPath();
            ctx.arc(b.x, b.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();
        });
    }

    // Game loop
    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

    // Start game
    spawnAsteroids();
    gameLoop();
});