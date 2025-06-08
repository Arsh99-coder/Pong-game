const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game objects
const paddleWidth = 12;
const paddleHeight = 80;
const paddleMargin = 10;
const ballSize = 14;

// Paddles
let leftPaddle = {
    x: paddleMargin,
    y: canvas.height/2 - paddleHeight/2,
    width: paddleWidth,
    height: paddleHeight,
    speed: 7
};

let rightPaddle = {
    x: canvas.width - paddleMargin - paddleWidth,
    y: canvas.height/2 - paddleHeight/2,
    width: paddleWidth,
    height: paddleHeight,
    speed: 5
};

// Ball
let ball = {
    x: canvas.width/2 - ballSize/2,
    y: canvas.height/2 - ballSize/2,
    size: ballSize,
    speed: 5,
    dx: 5 * (Math.random() > 0.5 ? 1 : -1),
    dy: (Math.random()*4 - 2)
};

// Scores
let leftScore = 0;
let rightScore = 0;

// Draw functions
function drawRect(x, y, w, h, color="#fff") {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawBall() {
    ctx.fillStyle = "#0ff";
    ctx.fillRect(ball.x, ball.y, ball.size, ball.size);
}

function drawNet() {
    for (let i = 0; i < canvas.height; i += 24) {
        drawRect(canvas.width/2 - 1, i, 2, 16, "#444");
    }
}

function drawScore() {
    ctx.font = "32px Arial";
    ctx.fillText(leftScore, canvas.width/2 - 60, 40);
    ctx.fillText(rightScore, canvas.width/2 + 40, 40);
}

// Control left paddle with mouse
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    // Center paddle on mouse
    leftPaddle.y = mouseY - leftPaddle.height/2;
    // Clamp paddle in bounds
    if (leftPaddle.y < 0) leftPaddle.y = 0;
    if (leftPaddle.y + leftPaddle.height > canvas.height)
        leftPaddle.y = canvas.height - leftPaddle.height;
});

// Basic AI for right paddle
function moveAIPaddle() {
    let center = rightPaddle.y + rightPaddle.height/2;
    if (center < ball.y) {
        rightPaddle.y += rightPaddle.speed;
    } else if (center > ball.y + ball.size) {
        rightPaddle.y -= rightPaddle.speed;
    }
    // Clamp in bounds
    if (rightPaddle.y < 0) rightPaddle.y = 0;
    if (rightPaddle.y + rightPaddle.height > canvas.height)
        rightPaddle.y = canvas.height - rightPaddle.height;
}

// Ball movement and collision
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Top/bottom wall collision
    if (ball.y < 0) {
        ball.y = 0;
        ball.dy *= -1;
    }
    if (ball.y + ball.size > canvas.height) {
        ball.y = canvas.height - ball.size;
        ball.dy *= -1;
    }

    // Left paddle collision
    if (
        ball.x < leftPaddle.x + leftPaddle.width &&
        ball.x > leftPaddle.x &&
        ball.y + ball.size > leftPaddle.y &&
        ball.y < leftPaddle.y + leftPaddle.height
    ) {
        ball.x = leftPaddle.x + leftPaddle.width;
        ball.dx *= -1;
        // Add paddle influence
        let collidePoint = (ball.y + ball.size/2) - (leftPaddle.y + leftPaddle.height/2);
        collidePoint = collidePoint / (leftPaddle.height/2);
        let angle = collidePoint * Math.PI/4;
        let direction = 1;
        ball.dx = direction * ball.speed * Math.cos(angle);
        ball.dy = ball.speed * Math.sin(angle);
    }

    // Right paddle collision
    if (
        ball.x + ball.size > rightPaddle.x &&
        ball.x + ball.size < rightPaddle.x + rightPaddle.width &&
        ball.y + ball.size > rightPaddle.y &&
        ball.y < rightPaddle.y + rightPaddle.height
    ) {
        ball.x = rightPaddle.x - ball.size;
        ball.dx *= -1;
        // Add paddle influence
        let collidePoint = (ball.y + ball.size/2) - (rightPaddle.y + rightPaddle.height/2);
        collidePoint = collidePoint / (rightPaddle.height/2);
        let angle = collidePoint * Math.PI/4;
        let direction = -1;
        ball.dx = direction * ball.speed * Math.cos(angle);
        ball.dy = ball.speed * Math.sin(angle);
    }

    // Score check
    if (ball.x < 0) {
        rightScore++;
        resetBall(-1);
    }
    if (ball.x + ball.size > canvas.width) {
        leftScore++;
        resetBall(1);
    }
}

function resetBall(dir) {
    ball.x = canvas.width/2 - ball.size/2;
    ball.y = canvas.height/2 - ball.size/2;
    ball.dx = ball.speed * dir;
    ball.dy = (Math.random()*4 - 2);
}

// Main draw
function draw() {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawNet();
    drawScore();
    drawRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height, "#fff");
    drawRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height, "#fff");
    drawBall();
}

// Game loop
function gameLoop() {
    moveAIPaddle();
    moveBall();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();