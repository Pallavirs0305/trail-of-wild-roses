window.onload = function () {

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const foxImage = new Image();
  foxImage.src = "assets/sprites/fox.png";

  const player = {
    x: 200,
    y: 300,
    width: 48,
    height: 48,
    speed: 4
  };

  const keys = {};

  let currentFrame = 0;
  let frameTimer = 0;
  let frameSpeed = 150;

  let direction = "idle"; // idle, right, left, hug

  document.addEventListener("keydown", e => {
    keys[e.key] = true;

    if (e.key === "h") {
      direction = "hug";
    }
  });

  document.addEventListener("keyup", e => {
    keys[e.key] = false;

    if (e.key === "h") {
      direction = "idle";
    }
  });

  function update(deltaTime) {

    if (keys["ArrowRight"]) {
      player.x += player.speed;
      direction = "right";
    }
    else if (keys["ArrowLeft"]) {
      player.x -= player.speed;
      direction = "left";
    }
    else if (!keys["h"]) {
      direction = "idle";
    }

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width)
      player.x = canvas.width - player.width;

    // Animation timing
    frameTimer += deltaTime;
    if (frameTimer > frameSpeed) {
      currentFrame++;
      frameTimer = 0;

      if (currentFrame > 2) {
        currentFrame = 0;
      }
    }
  }

  function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let row = 0;

    if (direction === "idle") row = 0;
    if (direction === "right") row = 1;
    if (direction === "left") row = 2;
    if (direction === "hug") row = 3;

    ctx.drawImage(
      foxImage,
      currentFrame * 48,
      row * 48,
      48,
      48,
      player.x,
      player.y,
      96,
      96
    );
  }

  let lastTime = 0;

  function gameLoop(timestamp) {

    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    update(deltaTime);
    draw();

    requestAnimationFrame(gameLoop);
  }

  gameLoop(0);

};
