window.onload = function () {

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  let gameState = "intro";

  const player = {
    x: 100,
    y: 380,
    width: 48,
    height: 48,
    speed: 4
  };

  const keys = {};

  const foxImage = new Image();
  foxImage.src = "assets/sprites/fox.png";

  const rabbitImage = new Image();
  rabbitImage.src = "assets/sprites/rabbit.png";

  document.addEventListener("keydown", e => {
    keys[e.key] = true;

    if (gameState === "intro" && e.key === "Enter") {
      gameState = "explore";
    }
  });

  document.addEventListener("keyup", e => {
    keys[e.key] = false;
  });

function update(deltaTime) {
    if (gameState === "explore") {
      if (keys["ArrowLeft"]) player.x -= player.speed;
      if (keys["ArrowRight"]) player.x += player.speed;

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

  // --- FOX ---
  let row = 0;

  if (direction === "right") row = 1;
  if (direction === "left") row = 2;
  if (direction === "idle") row = 0;

  ctx.drawImage(
    foxImage,
    currentFrame * 48,
    row * 48,
    48,
    48,
    player.x,
    player.y,
    48,
    48
  );

  // --- RABBIT ---
  ctx.drawImage(
    rabbitImage,
    rabbitFrame * 48,
    0,
    48,
    48,
    700,
    380,
    48,
    48
  );

  // --- HEART ---
  if (nearRabbit) {

    ctx.save();

    ctx.translate(724, 350);
    ctx.scale(heartScale, heartScale);

    ctx.fillStyle = "pink";

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-10, -10, -20, 10, 0, 20);
    ctx.bezierCurveTo(20, 10, 10, -10, 0, 0);
    ctx.fill();

    ctx.restore();
  }
}
    
function gameLoop(timestamp) {

  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  update(deltaTime);
  draw();

  requestAnimationFrame(gameLoop);
}

gameLoop(0);
