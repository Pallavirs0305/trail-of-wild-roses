window.onload = function () {

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  let gameState = "intro";

  const player = {
    x: 100,
    y: 350,
    width: 120,
    height: 120,
    speed: 4
  };

  const keys = {};

  // Load Images
  const foxImage = new Image();
  foxImage.src = "assets/sprites/fox.png";

  const rabbitImage = new Image();
  rabbitImage.src = "assets/sprites/rabbit.png";

  let lastTime = 0;

  // Multi Rose System
  let roses = [
    { x: 400, y: 390, collected: false },
    { x: 550, y: 390, collected: false },
    { x: 650, y: 390, collected: false }
  ];

  let heartMeter = 0;
  let roseGlow = 0;

  // Rabbit Interaction
  let nearRabbit = false;
  let heartScale = 0;
  let heartPulse = 0;

  // Controls
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

      // Movement
      if (keys["ArrowLeft"]) player.x -= player.speed;
      if (keys["ArrowRight"]) player.x += player.speed;

      if (player.x < 0) player.x = 0;
      if (player.x + player.width > canvas.width)
        player.x = canvas.width - player.width;

      // Rose glow animation
      roseGlow += deltaTime * 0.005;

      // Rose collision
      roses.forEach(rose => {

        let dx = player.x - rose.x;
        let dy = player.y - rose.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (!rose.collected && distance < 60) {
          rose.collected = true;
          heartMeter += 25;
        }

      });

      // Rabbit proximity
      let dxRabbit = player.x - 700;
      let dyRabbit = player.y - 350;
      let distRabbit = Math.sqrt(dxRabbit * dxRabbit + dyRabbit * dyRabbit);

      nearRabbit = distRabbit < 80;

      if (nearRabbit) {
        heartPulse += deltaTime * 0.005;
        heartScale = 1 + Math.sin(heartPulse) * 0.2;
      } else {
        heartScale = 0;
      }
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

      // Heart Meter
      ctx.fillStyle = "white";
      ctx.fillRect(20, 20, 200, 20);

      ctx.fillStyle = "pink";
      ctx.fillRect(20, 20, heartMeter * 2, 20);

      // Roses
      roses.forEach(rose => {

        if (!rose.collected) {

          let glowScale = 1 + Math.sin(roseGlow) * 0.1;

          ctx.save();
          ctx.translate(rose.x, rose.y);
          ctx.scale(glowScale, glowScale);

          ctx.fillStyle = "red";
          ctx.beginPath();
          ctx.arc(0, 0, 10, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }

      });

      // Fox (FULL IMAGE, NO SLICING)
      ctx.drawImage(
        foxImage,
        player.x,
        player.y,
        player.width,
        player.height
      );

      // Rabbit (FULL IMAGE, NO SLICING)
      ctx.drawImage(
        rabbitImage,
        700,
        350,
        120,
        120
      );

      // Heart above rabbit
      if (nearRabbit) {

        ctx.save();
        ctx.translate(760, 320);
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
  }

  function gameLoop(timestamp) {

    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    update(deltaTime);
    draw();

    requestAnimationFrame(gameLoop);
  }

  gameLoop(0);

};
