const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameState = "intro";

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameState === "intro") {
    ctx.fillStyle = "white";
    ctx.font = "30px monospace";
    ctx.fillText("The Trail of Wild Roses", 250, 200);
    ctx.fillText("Press Enter", 360, 250);
  }
}

document.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    gameState = "explore";
  }
});

function gameLoop() {
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
