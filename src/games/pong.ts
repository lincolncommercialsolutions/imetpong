import { inject } from '@vercel/analytics';

// Initialize Vercel Analytics
inject();

// Game state interfaces
interface GameState {
  ballX: number;
  ballY: number;
  ballSpeedX: number;
  ballSpeedY: number;
  playerY: number;
  jarvisY: number;
  playerScore: number;
  jarvisScore: number;
  playerLives: number;
  gameRunning: boolean;
  selectedLayout: 'desktop' | 'mobile' | null;
  startTime: number | null;
}

interface GameConfig {
  paddleWidth: number;
  paddleHeight: number;
  ballRadius: number;
  ballSpeedX: number;
  ballSpeedY: number;
  paddleOffset: number;
  winningScore: number;
}

// DOM elements
const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const playerScoreEl = document.getElementById('playerScore')!;
const jarvisScoreEl = document.getElementById('jarvisScore')!;
const winnerEl = document.getElementById('winner')!;
const startOverlay = document.getElementById('startOverlay')!;
const timerEl = document.getElementById('timer')!;
const layoutSelect = document.getElementById('layoutSelect')!;
const livesEl = document.getElementById('lives')!;
const desktopBtn = document.getElementById('desktopBtn')!;
const mobileBtn = document.getElementById('mobileBtn')!;
const startBtn = document.getElementById('startBtn')!;
const cheatInput = document.getElementById('cheatInput') as HTMLInputElement;
const submitCheatBtn = document.getElementById('submitCheat')!;

// Game state
const state: GameState = {
  ballX: canvas.width / 2,
  ballY: canvas.height / 2,
  ballSpeedX: 15,
  ballSpeedY: 9,
  playerY: canvas.height / 2 - 60,
  jarvisY: canvas.height / 2 - 60,
  playerScore: 0,
  jarvisScore: 0,
  playerLives: 3,
  gameRunning: false,
  selectedLayout: null,
  startTime: null
};

// Game configuration
let config: GameConfig = {
  paddleWidth: 16,
  paddleHeight: 120,
  ballRadius: 14,
  ballSpeedX: 15,
  ballSpeedY: 9,
  paddleOffset: 50,
  winningScore: 54
};

// Input state
const keys: Record<string, boolean> = {};
let isTouching = false;
let touchY = 0;
let timerInterval: number | null = null;

// Cheat codes
let cheatCodeBuffer = '';
const cheatCodes = ['ball54', '27', 'cat', 'time'];
let cheatCodeTimeout: number | null = null;

// Event Listeners
desktopBtn.addEventListener('click', () => selectLayout('desktop'));
mobileBtn.addEventListener('click', () => selectLayout('mobile'));
startBtn.addEventListener('click', startGame);

// Cheat code input handler
submitCheatBtn.addEventListener('click', handleCheatInput);
cheatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleCheatInput();
  }
});

function handleCheatInput(): void {
  if (!state.gameRunning) return;
  
  const inputValue = cheatInput.value.toLowerCase().trim();
  if (cheatCodes.includes(inputValue)) {
    activateCheatCode();
    cheatInput.value = '';
  } else if (inputValue) {
    // Show feedback for invalid code
    cheatInput.style.borderColor = '#ff0066';
    setTimeout(() => {
      cheatInput.style.borderColor = 'rgba(0, 221, 255, 0.5)';
    }, 500);
  }
}

window.addEventListener('keydown', (e) => {
  keys[e.key.toLowerCase()] = true;
  if (e.key === ' ' && !state.gameRunning && startOverlay.classList.contains('hidden')) {
    e.preventDefault();
  }
  
  // Cheat code detection
  if (state.gameRunning && e.key.length === 1) {
    cheatCodeBuffer += e.key.toLowerCase();
    
    if (cheatCodeTimeout) clearTimeout(cheatCodeTimeout);
    cheatCodeTimeout = window.setTimeout(() => {
      cheatCodeBuffer = '';
    }, 3000);
    
    for (const code of cheatCodes) {
      if (cheatCodeBuffer.includes(code)) {
        activateCheatCode();
        cheatCodeBuffer = '';
        break;
      }
    }
    
    if (cheatCodeBuffer.length > 10) {
      cheatCodeBuffer = cheatCodeBuffer.slice(-10);
    }
  }
});

window.addEventListener('keyup', (e) => {
  keys[e.key.toLowerCase()] = false;
});

canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
canvas.addEventListener('touchend', () => { isTouching = false; });

canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', () => { isTouching = false; });

window.addEventListener('resize', resizeCanvas);

// Functions
function selectLayout(layout: 'desktop' | 'mobile'): void {
  state.selectedLayout = layout;
  layoutSelect.classList.add('hidden');
  
  if (layout === 'mobile') {
    document.body.classList.add('mobile-layout');
    canvas.width = 500;
    canvas.height = 500;
    
    config = {
      paddleWidth: 12,
      paddleHeight: 80,
      ballRadius: 10,
      ballSpeedX: 10,
      ballSpeedY: 6,
      paddleOffset: 35,
      winningScore: 54
    };
  } else {
    document.body.classList.remove('mobile-layout');
    canvas.width = 900;
    canvas.height = 600;
    
    config = {
      paddleWidth: 16,
      paddleHeight: 120,
      ballRadius: 14,
      ballSpeedX: 15,
      ballSpeedY: 9,
      paddleOffset: 50,
      winningScore: 54
    };
  }
  
  resetPositions();
}

function resetPositions(): void {
  state.ballX = canvas.width / 2;
  state.ballY = canvas.height / 2;
  state.playerY = canvas.height / 2 - config.paddleHeight / 2;
  state.jarvisY = canvas.height / 2 - config.paddleHeight / 2;
  state.ballSpeedX = config.ballSpeedX;
  state.ballSpeedY = config.ballSpeedY;
}

function updateTimer(): void {
  if (!state.startTime) return;
  const elapsed = Date.now() - state.startTime;
  const minutes = Math.floor(elapsed / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);
  timerEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateLivesDisplay(): void {
  const angels = '🪽'.repeat(state.playerLives);
  livesEl.innerHTML = `Lives: <span class="heart">${angels}</span>`;
}

function resizeCanvas(): void {
  const maxWidth = Math.min(900, window.innerWidth * 0.95);
  const maxHeight = Math.min(600, window.innerHeight * 0.95);
  const aspectRatio = 900 / 600;
  
  if (maxWidth / maxHeight > aspectRatio) {
    canvas.height = maxHeight;
    canvas.width = maxHeight * aspectRatio;
  } else {
    canvas.width = maxWidth;
    canvas.height = maxWidth / aspectRatio;
  }
}

function startGame(): void {
  if (!state.selectedLayout) {
    layoutSelect.classList.remove('hidden');
    return;
  }
  startOverlay.classList.add('hidden');
  state.gameRunning = true;
  state.startTime = Date.now();
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = window.setInterval(updateTimer, 100);
  timerEl.textContent = "00:00";
  updateLivesDisplay();
  resetBall();
}

function resetBall(): void {
  state.ballX = canvas.width / 2;
  state.ballY = canvas.height / 2;
  state.ballSpeedX = (Math.random() > 0.5 ? config.ballSpeedX : -config.ballSpeedX) * (Math.random() > 0.5 ? 1 : -1);
  state.ballSpeedY = (Math.random() * config.ballSpeedY * 2 - config.ballSpeedY);
}

function activateCheatCode(): void {
  state.playerScore = 54;
  state.jarvisScore = 27;
  playerScoreEl.textContent = String(state.playerScore);
  jarvisScoreEl.textContent = String(state.jarvisScore);
  checkWin();
}

function handleTouchStart(e: TouchEvent): void {
  e.preventDefault();
  if (!state.gameRunning && startOverlay.classList.contains('hidden')) {
    startGame();
    return;
  }
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  const x = ((touch.clientX - rect.left) / rect.width) * canvas.width;
  
  if (x < canvas.width / 2) {
    isTouching = true;
    touchY = ((touch.clientY - rect.top) / rect.height) * canvas.height;
  }
}

function handleTouchMove(e: TouchEvent): void {
  e.preventDefault();
  if (!isTouching) return;
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  touchY = ((touch.clientY - rect.top) / rect.height) * canvas.height;
}

function handleMouseDown(e: MouseEvent): void {
  const rect = canvas.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
  
  if (x < canvas.width / 2) {
    isTouching = true;
    touchY = ((e.clientY - rect.top) / rect.height) * canvas.height;
  }
}

function handleMouseMove(e: MouseEvent): void {
  if (!isTouching) return;
  const rect = canvas.getBoundingClientRect();
  touchY = ((e.clientY - rect.top) / rect.height) * canvas.height;
}

function update(): void {
  if (!state.gameRunning) return;

  const topBoundary = 70;
  const bottomBoundary = 40;
  const maxPlayerY = canvas.height - bottomBoundary - config.paddleHeight;

  // Player controls
  if (keys['a'] && state.playerY > topBoundary) state.playerY -= 9;
  if (keys['d'] && state.playerY < maxPlayerY) state.playerY += 9;
  
  if (isTouching) {
    const targetY = touchY - config.paddleHeight / 2;
    state.playerY = Math.max(topBoundary, Math.min(maxPlayerY, targetY));
  }

  // J4RV1S AI
  const targetY = state.ballY - config.paddleHeight / 2;
  const diff = targetY - state.jarvisY;
  const jarvisSpeed = 9;
  
  if (Math.abs(diff) > 3) {
    const moveAmount = Math.min(Math.abs(diff), jarvisSpeed);
    state.jarvisY += diff > 0 ? moveAmount : -moveAmount;
  }
  
  state.jarvisY = Math.max(topBoundary, Math.min(maxPlayerY, state.jarvisY));

  // Ball movement
  state.ballX += state.ballSpeedX;
  state.ballY += state.ballSpeedY;

  // Top/bottom bounce
  if (state.ballY - config.ballRadius <= topBoundary || state.ballY + config.ballRadius >= canvas.height - bottomBoundary) {
    state.ballSpeedY = -state.ballSpeedY;
    
    if (state.ballY - config.ballRadius < topBoundary) {
      state.ballY = topBoundary + config.ballRadius;
    }
    if (state.ballY + config.ballRadius > canvas.height - bottomBoundary) {
      state.ballY = canvas.height - bottomBoundary - config.ballRadius;
    }
  }

  // Paddle collision - Player
  if (state.ballSpeedX < 0 &&
      state.ballX - config.ballRadius < config.paddleOffset + config.paddleWidth &&
      state.ballX + config.ballRadius > config.paddleOffset &&
      state.ballY > state.playerY && state.ballY < state.playerY + config.paddleHeight) {
    state.ballSpeedX = -state.ballSpeedX * 1.06;
    const deltaY = (state.ballY - (state.playerY + config.paddleHeight / 2)) / (config.paddleHeight / 2);
    state.ballSpeedY = deltaY * 8;
  }

  // Paddle collision - J4RV1S
  if (state.ballSpeedX > 0 &&
      state.ballX + config.ballRadius > canvas.width - config.paddleOffset - config.paddleWidth &&
      state.ballX - config.ballRadius < canvas.width - config.paddleOffset &&
      state.ballY > state.jarvisY && state.ballY < state.jarvisY + config.paddleHeight) {
    state.ballSpeedX = -state.ballSpeedX * 1.06;
    const deltaY = (state.ballY - (state.jarvisY + config.paddleHeight / 2)) / (config.paddleHeight / 2);
    state.ballSpeedY = deltaY * 8;
  }

  // Scoring
  if (state.ballX < 0) {
    state.jarvisScore++;
    jarvisScoreEl.textContent = String(state.jarvisScore);
    checkWin();
    resetBall();
  }
  if (state.ballX > canvas.width) {
    state.playerScore++;
    playerScoreEl.textContent = String(state.playerScore);
    checkWin();
    resetBall();
  }
}

function checkWin(): void {
  if (state.playerScore >= config.winningScore || state.jarvisScore >= config.winningScore) {
    if (state.jarvisScore >= config.winningScore) {
      state.playerLives--;
      updateLivesDisplay();
      
      if (state.playerLives <= 0) {
        state.gameRunning = false;
        if (timerInterval) {
          clearInterval(timerInterval);
          timerInterval = null;
        }
        winnerEl.textContent = `J4RV1S WINS!`;
        winnerEl.style.opacity = '1';
        winnerEl.style.textShadow = "0 0 40px #ff0066, 0 0 80px #ff0066";

        setTimeout(() => {
          resetGame();
        }, 4000);
      } else {
        state.jarvisScore = 0;
        jarvisScoreEl.textContent = "0";
        resetBall();
      }
    } else {
      state.gameRunning = false;
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      winnerEl.textContent = `PLAYER WINS!`;
      winnerEl.style.opacity = '1';
      winnerEl.style.textShadow = "0 0 40px #00ddff, 0 0 80px #00ddff";

      setTimeout(() => {
        resetGame();
      }, 4000);
    }
  }
}

function resetGame(): void {
  state.playerScore = 0;
  state.jarvisScore = 0;
  state.playerLives = 3;
  playerScoreEl.textContent = "0";
  jarvisScoreEl.textContent = "0";
  winnerEl.style.opacity = '0';
  startOverlay.classList.remove('hidden');
  isTouching = false;
  state.startTime = null;
  timerEl.textContent = "00:00";
  updateLivesDisplay();
}

function draw(): void {
  // Background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Center line
  ctx.setLineDash([15, 15]);
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  // Paddles
  ctx.shadowBlur = 20;
  ctx.shadowColor = '#000';

  // Player paddle
  ctx.fillStyle = 'black';
  ctx.shadowColor = '#00ddff';
  ctx.fillRect(config.paddleOffset, state.playerY, config.paddleWidth, config.paddleHeight);

  // J4RV1S paddle
  ctx.shadowColor = '#ff0066';
  ctx.fillRect(canvas.width - config.paddleOffset - config.paddleWidth, state.jarvisY, config.paddleWidth, config.paddleHeight);

  ctx.shadowBlur = 0;

  // Ball
  const gradient = ctx.createRadialGradient(state.ballX - 4, state.ballY - 4, 0, state.ballX, state.ballY, config.ballRadius);
  gradient.addColorStop(0, '#66bbff');
  gradient.addColorStop(0.7, '#0088ff');
  gradient.addColorStop(1, '#0044aa');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(state.ballX, state.ballY, config.ballRadius, 0, Math.PI * 2);
  ctx.fill();

  // Ball glow
  ctx.shadowBlur = 30;
  ctx.shadowColor = '#0088ff';
  ctx.beginPath();
  ctx.arc(state.ballX, state.ballY, config.ballRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

function gameLoop(): void {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Initialize
resizeCanvas();
gameLoop();
