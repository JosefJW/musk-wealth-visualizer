const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let startTime = new Date();
let curTime = new Date();
let elapsedTime = 0;

const blocks = [];
const collisionBlocks = [];
let total = 0;
let unitSalary = 8500000; // Default average yearly salary
let totalWealth = 429200000000; // Default Elon Musk's wealth

const totalBlocks = totalWealth / unitSalary;
const totalArea = (canvas.width-100) * (canvas.height-100);
const blockArea = totalArea / totalBlocks;
const blockSize = Math.ceil(Math.sqrt(blockArea));

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
    this.color = '#32CD32';
  }

  draw() {
    ctx.fillStyle = this.color;
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
        for (let block of collisionBlocks) {
            if (block !== this && this.checkCollision(block)) {
                this.isSettled = true;
                this.y = block.y - blockSize;
                collisionBlocks.splice(collisionBlocks.indexOf(block), 1)
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
    curTime = new Date();
    elapsedTime = curTime - startTime;
    elapsedTimeSeconds = Math.floor(elapsedTime/1000);
    elapsedTimeSeconds = elapsedTimeSeconds % 60;
    elapsedTimeMinutes = Math.floor(elapsedTime/60000);
    document.getElementById('counter').innerText = `Total: $${total.toLocaleString()}`;
    document.getElementById('time').innerText = `${elapsedTimeMinutes.toString().padStart(2, '0')}:${elapsedTimeSeconds.toString().padStart(2, '0')}`;
  
    updateStoryText();
  }

  function updateBlockColors(amt) {
    for (let i = 0; i < amt; i++) {
      if (blocks[i]) {
        blocks[i].color = '#FF0000';
      }
    }
  }

  function revertBlockColors(amt) {
    for (let i = 0; i < amt; i++) {
      if (blocks[i]) {
        blocks[i].color = "#32CD32";
      }
      else {
        break;
      }
    }
  }

colored = false;
function updateStoryText() {
  mins = elapsedTime/60000;
  if (mins < 0.1) {
    document.getElementById('story').innerText = "";
  }
  else if (mins < 0.3) {
    document.getElementById('story').innerText = "Each one of these squares is worth $8.5 million.";
  }
  else if (mins < 0.5) {
    document.getElementById('story').innerText = "$8.5 million.";
  }
  else if (mins < 0.8) {
    document.getElementById('story').innerText = "Just one of these is enough for a lifetime of luxury and generational wealth.";
  }
  else if (mins < 1.2) {
    document.getElementById('story').innerText = "Based off the average annual salary and working years, the average American will only make about $3 million in their entire lifetime.";
  }
  else if (mins < 1.6) {
    document.getElementById('story').innerText = "It would take almost three people a lifetime of work to get just one of these squares.";
  }
  else if (mins < 2) {
    document.getElementById('story').innerText = "Musk has over 47,000 of them.";
  }
  else if (mins < 2.3) {
    document.getElementById('story').innerText = "Let's explore what you could do with just a few of these."
  }
  else if (mins < 2.6) {
    document.getElementById('story').innerText = "With just one of these squares, you could buy multiple luxury yachts.";
    updateBlockColors(1);
  }
  else if (mins < 2.9) {
    document.getElementById('story').innerText = "You could also buy a house in Beverly Hills.";
  }
  else if (mins < 3.2) {
    document.getElementById('story').innerText = "Every four of these squares could be a brand new school for our children to attend.";
    updateBlockColors(4);
  }
  else if (mins < 3.5) {
    document.getElementById('story').innerText = "Each one of these could build multiple homeless shelters.";
    revertBlockColors(4);
    updateBlockColors(1);
  }
  else if (mins < 3.8) {
    document.getElementById('story').innerText = "Here's how much the New York Jets are worth.";
    updateBlockColors(635);
  }
  else if (mins < 4.3) {
    document.getElementById('story').innerText = "Here's how much General Mills Inc. is worth.";
    updateBlockColors(4200);
  }
  else if (mins < 4.6) {
    document.getElementById('story').innerText = "And we aren't even close to Musk's wealth yet.";
    revertBlockColors(4200);
  }
  else if (mins < 5) {
    document.getElementById('story').innerText = "Here's how much Musk's charity gave away in 2023 according to Forbes. Yes, just that little bit of red in the corner. This much was not even enough for them to meet the minimum IRS standards.";
    updateBlockColors(28);
  }
  else if (mins < 5.4) {
    document.getElementById('story').innerText = "Musk was able to reap the tax benefits of donating while keeping much of the money he donated under his control.";
    revertBlockColors(28);
  }
  else if (mins < 5.8) {
    document.getElementById('story').innerText = "In fact, Musk spent more money backing Donald Trump in the 2024 election than his charity gave away in 2023.";
  }
  else if (mins < 6.1) {
    document.getElementById('story').innerText = "CBS News estimates Musk spent $277 million to back Trump and other republicans.";
    updateBlockColors(32);
  }
  else if (mins < 6.4) {
    document.getElementById('story').innerText = "With a tiny portion of his wealth, Musk was able to buy a democratically elected government.";
  }
  else if (mins < 6.7) {
    document.getElementById('story').innerText = "Now, some of you may be thinking, \"Well, he doesn't really have that much! It is all in assets!\"";
    revertBlockColors(32);
  }
  else if (mins < 7.1) {
    document.getElementById('story').innerText = "That is true, however, Musk is still able to borrow money against his assets.";
  }
  else if (mins < 7.4) {
    document.getElementById('story').innerText = "In 2022, Musk borrowed over $44 billion to buy Twitter.";
    updateBlockColors(5176);
  }
  else if (mins < 7.8) {
    document.getElementById('story').innerText = "Should one person be able to outright buy an incredibly popular social media service used by officials and the general population?";
  }
  else if (mins < 8.2) {
    document.getElementById('story').innerText = "Maybe you think this amount of money is disgusting for one person to have, but what can we even do about it?";
    revertBlockColors(5176);
  }
  else if (mins < 8.6) {
    document.getElementById('story').innerText = "1) You should stay informed and inform others. Knowledge is power, and if we let billionaires like Musk lie to us about their riches and power, then we have already lost.";
  }
  else if (mins < 9) {
    document.getElementById('story').innerText = "2) Vote. Vote in every election you can. Learn about the candidates, who they support, what their thoughts are on billionaires like Musk, and how they want to help you.";
  }
  else if (mins < 9.4) {
    document.getElementById('story').innerText = "3) Stick together. It is not the homeless guy on the corner of the street taking your money, it is billionaires like Musk who don't want to pay their taxes, raise their employees' wages, or even spend their money at all that are taking your money and hoarding it.";
  }
  else if (mins < 10) {
    document.getElementById('story').innerText = "Well, we still got a long ways to go to show Musk's wealth. I'll highlight important milestones we pass the rest of the way.";
  }

  if (total > 175000000000 && total < 176000000000) {
    document.getElementById('story').innerText = "The GDP for the state of Maine in 2024";
    updateBlockColors(11514)
  }
  if (total > 190000000000 && total < 191000000000) {
    document.getElementById('story').innerText = "Amount the USDA needed to spend on food assistance programs in 2023";
    updateBlockColors(19576);
  }
  if (total > 200000000000 && total < 201000000000) {
    revertBlockColors(19576);
    document.getElementById('story').innerText = "Global box office revenue in 2024";
    updateBlockColors(3588)
  }
  if (total > 215000000000 && total < 216000000000) {
    document.getElementById('story').innerText = "The wealth of Costa Rica";
    updateBlockColors(24824);
  }
  if (total > 237500000000 && total < 238000000000) {
    document.getElementById('story').innerText = "Jeff Bezos' net worth";
    updateBlockColors(27941);
  }
  if (total > 269000000000 && total < 270000000000) {
    document.getElementById('story').innerText = "Coca-Cola market cap";
    updateBlockColors(31647);
  }
  if (total > 306000000000 && total < 307000000000) {
    document.getElementById('story').innerText = "GDP of Finland 2024";
    updateBlockColors(36000);
  }
  if (total > 345000000000 && total < 346000000000) {
    document.getElementById('story').innerText = "Estimated annual U.S. infrastructure investment needs";
    updateBlockColors(40588);
  }
  if (total > 375000000000 && total < 376000000000) {
    document.getElementById('story').innerText = "Combined annual profit of Walmart, Target, Kroger, Home Depot, Best Buy, Lowe's, Burlington, and Alibaba in 2024.";
    updateBlockColors(42353);
  }
  if (total > 401000000000 && total < 402000000000) {
    document.getElementById('story').innerText = "GDP of Hong Kong in 2024";
    updateBlockColors(47176);
  }
  if (total >= 429200000000) {
    document.getElementById('story').innerText = "Elon Musk";
    updateBlockColors(51000);
  }
}

x = 0;
dir = 1.5

function spawnBlock() {
  if (total < totalWealth) {
    if (x > 100 && x < canvas.width - 100) {
      newBlock = new Block(x, 0)
      blocks.push(newBlock);
      collisionBlocks.push(newBlock)
      updateCounter();
    }
    x += blockSize*dir;
    if (x > canvas.width || x < 0) {
        dir = -dir;
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

setInterval(spawnBlock, 15); // Spawn a block every 10ms
animate();
