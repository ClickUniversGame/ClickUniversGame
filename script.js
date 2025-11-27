let score = 0;
const scoreEl = document.getElementById('score');
const clickBtn = document.getElementById('clickBtn');
const usernameInput = document.getElementById('username');
const clickSound = document.getElementById('clickSound');

// --- Bouton désactivé si pseudo vide ---
clickBtn.disabled = true;
usernameInput.addEventListener('input', () => {
  clickBtn.disabled = usernameInput.value.trim() === "";
});

// --- Clic ---
clickBtn.addEventListener('click', (ev) => {
  if(usernameInput.value.trim() === "") return;

  // son
  clickSound.currentTime = 0;
  clickSound.play().catch(()=>{});

  // score
  score++;
  scoreEl.textContent = score;

  // meilleur score
  let bestScore = localStorage.getItem(usernameInput.value) || 0;
  if(score > bestScore) localStorage.setItem(usernameInput.value, score);

  // particules
  spawnParticles(ev.clientX, ev.clientY);
});

// --- Particules ---
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function spawnParticles(x, y){
  for(let i=0; i<7; i++){
    particles.push({
      x,
      y,
      vx: (Math.random()-0.5)*5,
      vy: (Math.random()-1.5)*5,
      size: Math.random()*6 + 3,
      life: 60 + Math.random()*30,
      color: `hsl(${Math.random()*360}, 100%, 70%)`
    });
  }
}

function animateParticles(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let i=particles.length-1;i>=0;i--){
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.size *= 0.95;
    p.life--;
    ctx.globalAlpha = p.life/90;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
    ctx.fill();
    if(p.life<=0 || p.size<0.5) particles.splice(i,1);
  }
  requestAnimationFrame(animateParticles);
}

function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
animateParticles();
