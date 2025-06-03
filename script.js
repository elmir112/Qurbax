
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let frog = { x: 100, y: 300, width: 40, height: 40, vy: 0, jumping: false };
let gravity = 1.2;
let jumpStrength = -15;

let platforms = [];
let breakable = [2, 6]; // 2 və 6-cı platformalar qırılan olacaq

for (let i = 0; i < 10; i++) {
  platforms.push({
    x: i * 80,
    y: 350,
    width: 70,
    height: 10,
    breakable: breakable.includes(i),
    breaking: false,
    timer: 0
  });
}

function drawFrog() {
  ctx.fillStyle = "green";
  ctx.fillRect(frog.x, frog.y, frog.width, frog.height);
}

function drawPlatforms() {
  platforms.forEach(p => {
    ctx.fillStyle = p.breakable ? (p.breaking ? "red" : "orange") : "brown";
    ctx.fillRect(p.x, p.y, p.width, p.height);
  });
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Jump physics
  frog.y += frog.vy;
  frog.vy += gravity;

  // Platform collision
  platforms.forEach(p => {
    if (
      frog.y + frog.height >= p.y &&
      frog.y + frog.height <= p.y + p.height &&
      frog.x + frog.width > p.x &&
      frog.x < p.x + p.width &&
      frog.vy >= 0
    ) {
      frog.y = p.y - frog.height;
      frog.vy = 0;
      frog.jumping = false;

      if (p.breakable) {
        if (!p.breaking) {
          p.breaking = true;
          p.timer = 60; // 1 saniyə sonra qırılacaq (60 FPS)
        }
      }
    }

    if (p.breaking) {
      p.timer--;
      if (p.timer <= 0) {
        p.y += 1000; // qırılıb düşür
      }
    }
  });

  drawFrog();
  drawPlatforms();
  requestAnimationFrame(update);
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !frog.jumping) {
    frog.vy = jumpStrength;
    frog.jumping = true;
  }
});

update();
