const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameState = "intro";

const player = {
  x: 100,
  y: 380,
  width: 40,
  height: 40,
  speed: 4
};

const keys = {};

document.addEventListener("keydown", e => {
  keys[e.key] = true;

  if (gameState === "intro" && e.key === "Enter") {
    gameState = "explore";
  }
});

document.addEventListener("keyup", e => {
  keys[e.key] = false;
});

function update() {
  if (gameState === "explore") {
    if (keys["ArrowLeft"]) player.x -= player.speed;
    if (keys["ArrowRight"]) player.x += player.speed;

    // Keep inside screen
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width)
      player.x = canvas.width - player.width;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameState === "intro") {
    ctx.fillStyle = "white";
    ctx.font = "30px monospace";
    ctx.fillText("The Trail of Wild Roses", 250, 200);
    ctx.fillText("Press Enter", 360, 250);
  }

  if (gameState === "explore") {
    // Background
    ctx.fillStyle = "#1c1c1c";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Player (Nick placeholder)
    ctx.fillStyle = "orange";
    ctx.fillRect(player.x, player.y, player.width, player.height);
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
