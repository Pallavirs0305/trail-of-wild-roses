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

  function update() {
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

      ctx.fillStyle = "#1c1c1c";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw fox (player)
      ctx.drawImage(
        foxImage,
        0, 0, 48, 48,
        player.x,
        player.y,
        48,
        48
      );

      // Draw rabbit
      ctx.drawImage(
        rabbitImage,
        0, 0, 48, 48,
        700,
        380,
        48,
        48
      );
    }
  }

  function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }

  gameLoop();

};
