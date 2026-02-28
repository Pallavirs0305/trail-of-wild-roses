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

  // Load Images
  const foxImage = new Image();
  foxImage.src = "assets/sprites/fox.png";

  const rabbitImage = new Image();
  rabbitImage.src = "assets/sprites/rabbit.png";

  // Animation
  let currentFrame = 0;
  let frameTimer = 0;
  let frameInterval = 150;
  let direction = "idle";

  let rabbitFrame = 0;
  let rabbitTimer = 0;

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

      let moving = false;

      if (keys["ArrowLeft"]) {
        player.x -= player.speed;
        direction = "left";
        moving = true;
      }

      if (keys["ArrowRight"]) {
        player.x += player.speed;
        direction = "right";
        moving = true;
      }

      if (!moving) direction = "idle";

      if (player.x < 0) player.x = 0;
      if (player.x + player.width > canvas.width)
        player.x = canvas.width - player.width;

      // Fox animation
      if (moving) {
        frameTimer += deltaTime;
        if (frameTimer > frameInterval) {
          currentFrame = (currentFrame + 1) % 3;
          frameTimer = 0;
        }
      } else {
        currentFrame = 0;
      }

      // Rabbit animation
      rabbitTimer += deltaTime;
      if (rabbitTimer > 300) {
        rabbitFrame = (rabbitFrame + 1) % 3;
        rabbitTimer = 0;
      }

      // Rose glow
      roseGlow += deltaTime * 0.005;

      // Rose collision
      roses.forEach(rose => {

        let dx = player.x - rose.x;
        let dy = player.y - rose.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (!rose.collected && distance < 40) {
          rose.collected = true;
          heartMeter += 25;
        }

      });

      // Rabbit proximity
      let dxRabbit = player.x - 700;
      let dyRabbit = player.y - 380;
      let distRabbit = Math.sqrt(dxRabbit * dxRabbit + dyRabbit * dyRabbit);

      nearRabbit = distRabbit < 50;

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

      // Fox
      let row = 0;
      if (direction === "right") row = 1;
      if (direction === "left") row = 2;

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

      // Rabbit
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

      // Heart above rabbit
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
