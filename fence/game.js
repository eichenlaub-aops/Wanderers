// Get DOM elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const angleSlider = document.getElementById('angleSlider');
const powerSlider = document.getElementById('powerSlider');
const angleValue = document.getElementById('angleValue');
const powerValue = document.getElementById('powerValue');
const goButton = document.getElementById('goButton');
const resetButton = document.getElementById('resetButton');
const message = document.getElementById('message');
const ballInfo = document.getElementById('ballInfo');
const ballPosXElement = document.getElementById('ballPosX');
const ballPosYElement = document.getElementById('ballPosY');
const ballVelXElement = document.getElementById('ballVelX');
const ballVelYElement = document.getElementById('ballVelY');

// Canvas dimensions
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Game parameters
let gridSize = 20; // Will be calculated based on canvas size
const gravity = -1; // Downward acceleration

// Game state
let gameStatus = 'ready'; // 'ready', 'playing', 'won', 'lost'
let angle = parseInt(angleSlider.value);
let power = parseFloat(powerSlider.value);
let animFrameId = null;

// Ball state
const ballPos = { x: 0, y: 0 };
const ballVel = { x: 0, y: 0 };
let gameTime = 0;
const ballTrail = []; // Array to store past positions for trail effect

// Game objects
const startPos = { x: 0, y: 0 };
const targetPos = { x: 30, y: 0 };
const fence = [
    { start: { x: 20, y: 0 }, end: { x: 20, y: 13 } },
    { start: { x: 20, y: 16 }, end: { x: 20, y: 20 } }
];

// Event listeners
angleSlider.addEventListener('input', function() {
    angle = parseInt(this.value);
    angleValue.textContent = angle;
    if (gameStatus === 'ready') {
        drawGame();
    }
});

powerSlider.addEventListener('input', function() {
    power = parseFloat(this.value);
    powerValue.textContent = power.toFixed(1);
    if (gameStatus === 'ready') {
        drawGame();
    }
});

goButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);

// Handle window resize
window.addEventListener('resize', function() {
    if (gameStatus === 'ready') {
        drawGame();
    }
});

// Start the game
function startGame() {
    if (gameStatus !== 'playing') {
        // Reset ball position and velocity
        ballPos.x = startPos.x;
        ballPos.y = startPos.y;
        
        // Clear the trail
        ballTrail.length = 0;
        
        // Calculate initial velocity based on angle and power
        const radians = angle * Math.PI / 180;
        ballVel.x = power * Math.cos(radians);
        ballVel.y = power * Math.sin(radians);
        
        gameTime = 0;
        gameStatus = 'playing';
        message.textContent = 'Ball launched!';
        
        // Show ball info
        ballInfo.classList.remove('hidden');
        
        // Disable go button during play
        goButton.disabled = true;
        
        // Start animation
        if (animFrameId) {
            cancelAnimationFrame(animFrameId);
        }
        animFrameId = requestAnimationFrame(updateGame);
    }
}

// Reset the game
function resetGame() {
    if (animFrameId) {
        cancelAnimationFrame(animFrameId);
    }
    
    // Reset ball position
    ballPos.x = 0;
    ballPos.y = 0;
    
    // Clear trail
    ballTrail.length = 0;
    
    gameStatus = 'ready';
    message.textContent = 'Adjust angle and power, then press Go!';
    goButton.disabled = false;
    ballInfo.classList.add('hidden');
    drawGame();
}

// Check if the ball hit the fence
function checkFenceCollision(pos) {
    // Only check when ball is near the fence (x coordinate around 20)
    if (pos.x >= 19.5 && pos.x <= 20.5) {
        for (const segment of fence) {
            if (pos.y >= segment.start.y && pos.y <= segment.end.y) {
                return true;
            }
        }
    }
    return false;
}

// Check if ball is out of bounds
function isOutOfBounds(pos) {
    return pos.x < 0 || pos.x > 30 || pos.y < 0 || pos.y > 20;
}

// Check if ball hit the target
function checkTargetHit(pos) {
    return Math.abs(pos.x - targetPos.x) < 0.5 && Math.abs(pos.y - targetPos.y) < 0.5;
}

// Check if ball hit the ground
function checkGroundHit(pos) {
    return pos.y <= 0.1;
}

// Update game state
function updateGame() {
    if (gameStatus !== 'playing') return;
    
    // Update time (slowed down to 1/4 speed)
    gameTime += 0.025; // Increment time by 0.025 seconds instead of 0.1
    
    // Update position and velocity
    const newPos = {
        x: ballPos.x + ballVel.x * 0.025,
        y: ballPos.y + ballVel.y * 0.025
    };
    
    // Apply gravity
    ballVel.y += gravity * 0.025;
    
    // Add current position to trail (every few frames to avoid too many points)
    if (gameTime % 0.1 < 0.025) {
        // Add a copy of the current position, not a reference
        ballTrail.push({x: ballPos.x, y: ballPos.y});
        
        // Limit trail length
        if (ballTrail.length > 50) {
            ballTrail.shift(); // Remove oldest position
        }
    }
    
    // Update ball info display
    ballPosXElement.textContent = newPos.x.toFixed(2);
    ballPosYElement.textContent = newPos.y.toFixed(2);
    ballVelXElement.textContent = ballVel.x.toFixed(2);
    ballVelYElement.textContent = ballVel.y.toFixed(2);
    
    // Check for collisions or out of bounds
    if (checkFenceCollision(newPos)) {
        gameStatus = 'lost';
        message.textContent = 'You hit the fence! Game over.';
        goButton.disabled = false;
        drawGame(newPos);
        return;
    }
    
    if (isOutOfBounds(newPos)) {
        gameStatus = 'lost';
        message.textContent = 'Ball went out of bounds! Game over.';
        goButton.disabled = false;
        drawGame(newPos);
        return;
    }
    
    if (checkGroundHit(newPos) && !checkTargetHit(newPos)) {
        gameStatus = 'lost';
        message.textContent = 'Ball hit the ground! Game over.';
        goButton.disabled = false;
        drawGame(newPos);
        return;
    }
    
    if (checkTargetHit(newPos)) {
        gameStatus = 'won';
        message.textContent = 'You hit the target! You win!';
        goButton.disabled = false;
        drawGame(newPos);
        return;
    }
    
    // Update ball position
    ballPos.x = newPos.x;
    ballPos.y = newPos.y;
    
    // Draw game
    drawGame();
    
    // Continue animation
    animFrameId = requestAnimationFrame(updateGame);
}

// Draw the game
function drawGame(finalPos = null) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Calculate grid size for 30x20 grid
    const gridSize = Math.min(canvasWidth / 30, canvasHeight / 20);
    
    // Draw grid
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let x = 0; x <= 30; x += 2) {
        ctx.beginPath();
        ctx.moveTo(x * gridSize, 0);
        ctx.lineTo(x * gridSize, 20 * gridSize);
        ctx.stroke();
        
        // Add x-axis labels
        if (x % 4 === 0) {
            ctx.fillStyle = '#666';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(x.toString(), x * gridSize, 20 * gridSize + 12);
        }
    }
    
    // Horizontal grid lines
    for (let y = 0; y <= 20; y += 2) {
        ctx.beginPath();
        ctx.moveTo(0, 20 * gridSize - y * gridSize);
        ctx.lineTo(30 * gridSize, 20 * gridSize - y * gridSize);
        ctx.stroke();
        
        // Add y-axis labels
        if (y % 4 === 0) {
            ctx.fillStyle = '#666';
            ctx.font = '10px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(y.toString(), 15, 20 * gridSize - y * gridSize + 4);
        }
    }
    
    // Draw coordinate axes
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 20 * gridSize);
    ctx.lineTo(30 * gridSize, 20 * gridSize);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, 20 * gridSize);
    ctx.lineTo(0, 0);
    ctx.stroke();
    
    // Draw fence
    ctx.strokeStyle = '#663300';
    ctx.lineWidth = 4;
    for (const segment of fence) {
        ctx.beginPath();
        ctx.moveTo(segment.start.x * gridSize, 20 * gridSize - segment.start.y * gridSize);
        ctx.lineTo(segment.end.x * gridSize, 20 * gridSize - segment.end.y * gridSize);
        ctx.stroke();
    }
    
    // Draw target
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(
        targetPos.x * gridSize,
        20 * gridSize - targetPos.y * gridSize,
        10,
        0,
        Math.PI * 2
    );
    ctx.fill();
    
    // Draw trajectory if game is over
    if ((gameStatus === 'won' || gameStatus === 'lost') && finalPos === null) {
        ctx.strokeStyle = 'rgba(0, 128, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        // Simulate trajectory
        const steps = 100;
        const simulatedPos = { ...startPos };
        const simulatedVel = {
            x: power * Math.cos(angle * Math.PI / 180),
            y: power * Math.sin(angle * Math.PI / 180)
        };
        
        ctx.moveTo(simulatedPos.x * gridSize, canvasHeight - simulatedPos.y * gridSize);
        
        for (let i = 0; i < steps; i++) {
            simulatedPos.x += simulatedVel.x * (gameTime / steps);
            simulatedPos.y += simulatedVel.y * (gameTime / steps);
            simulatedVel.y += gravity * (gameTime / steps);
            
            // Stop drawing if we go out of bounds
            if (
                simulatedPos.x < 0 ||
                simulatedPos.x > 30 ||
                simulatedPos.y < 0 ||
                simulatedPos.y > 20
            ) {
                break;
            }
            
            ctx.lineTo(simulatedPos.x * gridSize, canvasHeight - simulatedPos.y * gridSize);
        }
        
        ctx.stroke();
    }
    
    // Draw trail behind the ball if playing or game over
    if (gameStatus === 'playing' || gameStatus === 'won' || gameStatus === 'lost') {
        ctx.strokeStyle = 'rgba(0, 100, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        if (ballTrail.length > 0) {
            ctx.moveTo(ballTrail[0].x * gridSize, 20 * gridSize - ballTrail[0].y * gridSize);
            
            for (let i = 1; i < ballTrail.length; i++) {
                ctx.lineTo(ballTrail[i].x * gridSize, 20 * gridSize - ballTrail[i].y * gridSize);
            }
            
            // Connect to current position
            if (finalPos) {
                ctx.lineTo(finalPos.x * gridSize, 20 * gridSize - finalPos.y * gridSize);
            } else {
                ctx.lineTo(ballPos.x * gridSize, 20 * gridSize - ballPos.y * gridSize);
            }
            
            ctx.stroke();
        }
    }
    
    // Draw ball
    const pos = finalPos || ballPos;
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(
        pos.x * gridSize,
        20 * gridSize - pos.y * gridSize,
        15,
        0,
        Math.PI * 2
    );
    ctx.fill();
    
    // Draw initial velocity vector if game is ready
    if (gameStatus === 'ready') {
        const radians = angle * Math.PI / 180;
        const vectorLength = power * 0.75; // Half the previous size
        
        ctx.strokeStyle = 'green';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(startPos.x * gridSize, 20 * gridSize - startPos.y * gridSize);
        ctx.lineTo(
            (startPos.x + vectorLength * Math.cos(radians)) * gridSize,
            20 * gridSize - (startPos.y + vectorLength * Math.sin(radians)) * gridSize
        );
        ctx.stroke();
        
        // Arrow head (smaller)
        const headLength = 2.5; // Half the previous size
        const headAngle = 0.3;
        ctx.beginPath();
        ctx.moveTo(
            (startPos.x + vectorLength * Math.cos(radians)) * gridSize,
            20 * gridSize - (startPos.y + vectorLength * Math.sin(radians)) * gridSize
        );
        ctx.lineTo(
            (startPos.x + vectorLength * Math.cos(radians) - headLength * Math.cos(radians - headAngle)) * gridSize,
            20 * gridSize - (startPos.y + vectorLength * Math.sin(radians) - headLength * Math.sin(radians - headAngle)) * gridSize
        );
        ctx.moveTo(
            (startPos.x + vectorLength * Math.cos(radians)) * gridSize,
            20 * gridSize - (startPos.y + vectorLength * Math.sin(radians)) * gridSize
        );
        ctx.lineTo(
            (startPos.x + vectorLength * Math.cos(radians) - headLength * Math.cos(radians + headAngle)) * gridSize,
            20 * gridSize - (startPos.y + vectorLength * Math.sin(radians) - headLength * Math.sin(radians + headAngle)) * gridSize
        );
        ctx.stroke();
    }
}

// Initialize the game
function init() {
    drawGame();
}

// Start the game when the page loads
window.addEventListener('load', init);