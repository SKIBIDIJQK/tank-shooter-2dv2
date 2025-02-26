const canvas = document.getElementById("gameCanvas");
canvas.width = 800;
canvas.height = 600;
const ctx = canvas.getContext("2d");

const player = { x: 400, y: 500, angle: 0, hp: 100, kills: 0, level: 1 };
const bullets = [];
const enemies = [];
const keys = {};
let enemySpawnRate = 100;
let gameOver = false;

window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

function spawnEnemy() {
    if (Math.random() * enemySpawnRate < 1) {
        enemies.push({ x: Math.random() * canvas.width, y: 0, hp: 20 });
    }
}

function update() {
    if (gameOver) return;
    
    if (keys["ArrowLeft"]) player.angle -= 0.05;
    if (keys["ArrowRight"]) player.angle += 0.05;
    if (keys["ArrowUp"]) {
        player.x += Math.cos(player.angle) * 3;
        player.y += Math.sin(player.angle) * 3;
    }
    if (keys[" "]) {
        bullets.push({ x: player.x, y: player.y, angle: player.angle });
    }

    bullets.forEach((b, i) => {
        b.x += Math.cos(b.angle) * 5;
        b.y += Math.sin(b.angle) * 5;
        if (b.x < 0 || b.x > canvas.width || b.y < 0 || b.y > canvas.height) {
            bullets.splice(i, 1);
        }
    });

    enemies.forEach((e, i) => {
        e.y += 2;
        if (e.y > canvas.height) {
            player.hp -= 10;
            enemies.splice(i, 1);
        }
    });

    bullets.forEach((b, bi) => {
        enemies.forEach((e, ei) => {
            if (Math.hypot(e.x - b.x, e.y - b.y) < 15) {
                enemies.splice(ei, 1);
                bullets.splice(bi, 1);
                player.kills++;
                if (player.kills % 5 === 0) {
                    player.level++;
                    enemySpawnRate *= 0.9;
                }
            }
        });
    });

    if (player.hp <= 0) {
        gameOver = true;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.angle);
    ctx.fillStyle = "green";
    ctx.fillRect(-10, -10, 20, 20);
    ctx.restore();

    ctx.fillStyle = "red";
    bullets.forEach((b) => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 5, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.fillStyle = "blue";
    enemies.forEach((e) => {
        ctx.fillRect(e.x - 10, e.y - 10, 20, 20);
    });

    ctx.fillStyle = "white";
    ctx.fillText(`HP: ${player.hp}`, 10, 20);
    ctx.fillText(`Kills: ${player.kills}`, 10, 40);
    ctx.fillText(`Level: ${player.level}`, 10, 60);

    if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.fillText("GAME OVER", canvas.width / 2 - 70, canvas.height / 2);
    }
}

function loop() {
    update();
    draw();
    spawnEnemy();
    requestAnimationFrame(loop);
}
loop();
