const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const blockSize = 3;
const blocks = [];
let total = 0;
let unitSalary; // Default average yearly salary
let totalWealth; // Default Elon Musk's wealth

// Fetch wealth data from the backend
fetch('/get_wealth_data')
  .then(response => response.json())
  .then(data => {
    totalWealth = data.total_wealth;
    unitSalary = data.unit_salary;
  });

class Block {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = Math.random() * 2 - 1; // Random initial horizontal velocity
    this.vy = 0; // Initial vertical velocity
    this.g = 0.2; // Gravity
    this.restitution = 0.1; // Bounce factor (less than 1 for energy loss)
    this.friction = 0.98; // Horizontal friction
    this.isSettled = false;
  }

  draw() {
    ctx.fillStyle = '#32CD32';
    ctx.fillRect(this.x, this.y, blockSize, blockSize);
  }

  update() {
    if (!this.isSettled) {
        // Apply gravity
        this.vy += this.g;
        this.y += this.vy;

        if (this.vy > blockSize-1) {
            this.vy = blockSize-1;
        }

        // Apply horizontal velocity with friction
        //this.x += this.vx;
        //this.vx *= this.friction;

        // Prevent blocks from going out of bounds
        if (this.x < 0) {
            this.x = 0;
            this.vx = -this.vx * this.restitution;
        }
        if (this.x + blockSize > canvas.width) {
            this.x = canvas.width - blockSize;
            this.vx = -this.vx * this.restitution;
        }

        // Check for collision with the ground
        if (this.y + blockSize >= canvas.height) {
            this.y = canvas.height - blockSize;
            this.vy = -this.vy * this.restitution;
            if (Math.abs(this.vy) < 0.1 && Math.abs(this.vx) < 0.1) {
                this.isSettled = true;
            }
        }

        // Check for collision with other blocks
        for (let block of blocks) {
            if (block !== this && this.checkCollision(block)) {
                this.resolveCollision(block);
            }
        }
    }
}


  checkCollision(other) {
    return (
      this.x < other.x + blockSize &&
      this.x + blockSize > other.x &&
      this.y + blockSize > other.y &&
      this.y < other.y + blockSize
    );
  }

  resolveCollision(other) {
        if (this.isSettled) return;

        // Calculate the overlap
        const overlapX = this.x + blockSize - other.x;
        const overlapY = this.y + blockSize - other.y;

        if (this.y > other.y) {
            return
        }

        // Resolve vertical collision if overlapY is significant
        if (overlapY > 0 && this.vy > 0) {
            this.y = other.y - blockSize; // Position above the collided block
            this.vy = -this.vy * this.restitution; // Bounce vertically
        }

        // Resolve horizontal collision to simulate sliding off
        if (Math.abs(overlapX) > 0) {
            this.x += this.vx * this.restitution; // Adjust horizontal position
            this.vx = -this.vx * 0.5; // Slightly reduce horizontal velocity
        }

        // Dampening effect to gradually settle blocks
        this.vx *= this.friction;
        this.vy *= this.friction;

        // Settle the block if motion is negligible
        if (Math.abs(this.vy) < 0.1 && Math.abs(this.vx) < 0.1) {
            this.isSettled = true;
        }
    }
}

function updateCounter() {
    total += unitSalary;
    document.getElementById('counter').innerText = `Total: $${total.toLocaleString()}`;
}

x = 0;
dir = 1.5

function spawnBlock() {
  if (total < totalWealth) {
    blocks.push(new Block(x, 0));
    updateCounter();
    x += blockSize*dir;
    if (x > canvas.width || x < 0) {
        dir = -dir;
        //x += blockSize*dir;
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  blocks.forEach(block => {
    block.update();
    block.draw();
  });
  requestAnimationFrame(animate);
}

setInterval(spawnBlock, 1); // Spawn a block every 100ms
animate();
