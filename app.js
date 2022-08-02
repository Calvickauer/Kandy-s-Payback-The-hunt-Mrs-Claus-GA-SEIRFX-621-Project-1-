const canvas = document.getElementById('canvasMain');
const ctx = canvas.getContext('2d');
canvas.width = 900;
canvas.height = 650;
ctx.font = '25px Impact';

const staticCanvasWidth = 900;
const staticCanvasHeight = 650; 

console.log(ctx);

const collisionCanvas = document.getElementById('collisionCanvas');
const collisionCtx = collisionCanvas.getContext('2d');
collisionCanvas.width = canvas.width;
collisionCanvas.height = canvas.height;

console.log(collisionCtx);


let scoreBoard = 0;

const spritePlayer = new Image();
spritePlayer.src = "./playerSprites/idle.png";

const enemySprite = new Image();
enemySprite.src = "./craftpix-485144-2d-game-terrorists-character-free-sprites-sheets/png/2/Attack3/2_terrorist_2_Attack3_000.png";

const santaSprite = new Image();
santaSprite.src = './creepySanta.png';

const gifBackground = new Image();
gifBackground.src = './backgroundSheet.png';
gifBackground.id = 'background';

const numberOfTerrorists = 3;
const terroristArray = [];

let timeTillNextAttackRaven = 0;
let ravenInterval = 2000;
let lastTime = 0;


const keys = [];



const background = {
    height: 342,
    width: 640
}


const santa = {
    coordX: 800,
}

const player = {
    width: 265,
    height: 571,
    xCoord: 300,
    yCoord: 400,
    sizeX: 50,
    sizeY: 112,
    xFrame: 0,
    yFrame: 0,
    speed: 5,
    moving: false
}


const startScreen = {
    active: true
}
let backgroundFrameX = 1;

// CLASSES //
let ravens = [];
class AttackRaven {
    constructor(){
        this.spriteWidth = 225;
        this.spriteHeight = 320;
        this.sizeModifier = Math.random() * 0.4 + 0.2;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;

        this.xCoord = canvas.width;
        this.yCoord = Math.random() * 250 + 100;            
        this.xCoordDirection = Math.random() * 5 + 2;
        this.yCoordDirection = Math.random() * 5 - 2.5;

        this.markedToDelete = false;

        this.image = new Image();
        this.image.src = './baldEagle.png';
        this.frame = 0;
        this.maxFrame = 2;
        this.timeSinceFlap = 0;
        this.flapInterval = Math.random() * 60 + 100;

    //collision detection
        this.randomColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)]; // random number 1-255 no decimals
        this.color = 'rgb(' + this.randomColors[0] + ',' + this.randomColors[1] + ',' + this.randomColors[2] + ')';
    }

    update(deltatime){
        if (this.yCoord < 120 || this.yCoord > 300){
            this.yCoordDirection = this.yCoordDirection * -1
        };
        this.xCoord -= this.xCoordDirection;
        this.yCoord += this.yCoordDirection;
        if (this.xCoord < -500) this.markedToDelete = true;
        this.timeSinceFlap += deltatime;
        if (this.timeSinceFlap > this.flapInterval){
            if (this.frame > this.maxFrame) this.frame = 0;
            else this.frame++;
            this.timeSinceFlap = 0;
        }

    }

    draw(){
        collisionCtx.fillStyle = this.color;
        collisionCtx.fillRect(300, 300, 100, 100);
        collisionCtx.fillRect(this.xCoord, this.yCoord, this.width, this.height);
        // ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.xCoord, this.yCoord, this.width, this.height);
    }
}

const raven = new AttackRaven();


class Enemy {
    constructor(){
        this.image = new Image();
        this.image.src = './craftpix-485144-2d-game-terrorists-character-free-sprites-sheets/png/2/Attack3/2_terrorist_2_Attack3_000.png';
        this.width = 598;
        this.height = 1291;
        this.sizeX = this.width / 10;
        this.sizeY = this.height / 10;
        this.xCoord = Math.random() * 10 + 1;
        this.yCoord = Math.random() * canvas.height + 400;
        this.speed = Math.random() * 2 + 1;
        this.frameX = 0; 
    }
    update(){
         if (this.xCoord < player.xCoord && this.yCoord > player.yCoord){// upward  right angle
            this.xCoord++;
            this.yCoord--;
        } else if (this.xCoord > player.xCoord && this.yCoord < player.yCoord){// down left angle
            this.xCoord--;
            this.yCoord++;
        } else if (this.xCoord > player.xCoord && this.yCoord > player.yCoord){// up left angle
            this.xCoord--;
            this.yCoord--;
        } else if (this.xCoord < player.xCoord && this.yCoord < player.yCoord){// down right angle
            this.xCoord++;
            this.yCoord++;
        }

    }
    draw(){
        ctx.drawImage(this.image, 0, 0, this.width, this.height, this.xCoord, this.yCoord + 25, this.sizeX, this.sizeY); 
    
    }
}




for (let i = 0; i < numberOfTerrorists; i++){
    terroristArray.push(new Enemy());
}

          // END OF CLASSES // 

          

           // EVENT LISTENERS  //
window.addEventListener('keydown', function(event){
        keys[event.key] = true; 
        console.log(keys);
});

window.addEventListener('keyup', function(event){
    delete keys[event.key];

});

window.addEventListener('mousedown', function(event){
    const detectPixelColor = collisionCtx.getImageData(event.x, event.y, 1, 1);
    // console.log(event.x, event.y);
    // console.log(raven.color);
    console.log(detectPixelColor);
});

         // END EVENT LISTENERS //

         // FUNCTION //


function drawScore(){
    ctx.fillStyle = 'black';
    ctx.fillText('Current Score: ' + scoreBoard, 662, 27);
    ctx.fillStyle = 'white';
    ctx.fillText('Current Score: ' + scoreBoard, 665, 30);
};

function drawHowTo(){
    ctx.fillStyle = 'black';
    ctx.fillText('How to Play', 77, 27);
    ctx.fillStyle = 'white';
    ctx.fillText('How to Play', 80, 30);
};



           // ANIMATION LOOP //

function animation(timestamp){
    requestAnimationFrame(animation);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    collisionCtx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.drawImage(gifBackground, backgroundFrameX, 0, background.width, background.height, 0, 0, canvas.width, canvas.height);
    let deltatime = timestamp - lastTime;
    lastTime = timestamp;
    timeTillNextAttackRaven += deltatime;
    if (timeTillNextAttackRaven > ravenInterval){
        ravens.push(new AttackRaven());
        timeTillNextAttackRaven = 0;
        ravens.sort(function(a, b) {
            return a.width - b.width;
        });
    };
    [...ravens].forEach(object => object.update(deltatime));
    [...ravens].forEach(object => object.draw());
    
    ravens = ravens.filter(object => !object.markedToDelete);
    
         // STYLING FOR SCORE AND MENU //

    ctx.fillStyle = 'darkgreen';
    ctx.fillRect(0, 0, canvas.width, 100);
    ctx.fillStyle = 'red';
    ctx.fillRect(300, 0, 5, 100);
    ctx.fillRect(600, 0, 5, 100);
    ctx.fillStyle = 'black';
    ctx.fillRect(300, 0, 2, 100);
    ctx.fillRect(600, 0, 2, 100);
    ctx.fillRect(305, 0, 2, 100);
    ctx.fillRect(605, 0, 2, 100);
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 40, canvas.width, 5);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 40, canvas.width, 2);
    ctx.fillRect(0, 45, canvas.width, 2);
    ctx.fillRect(0, 100, canvas.width, 10);
    
        drawScore();
        drawHowTo();

           // END STYLING //
    
    const mainPlayer = ctx.drawImage(spritePlayer, 0, 0, player.width, player.height, player.xCoord, player.yCoord, player.sizeX, player.sizeY); 
    mainPlayer;

    terroristArray.forEach(enemy => {
        enemy.update();
        enemy.draw();
    })
    ctx.drawImage(santaSprite, 0, 0, santaSprite.width, santaSprite.height, santa.coordX, 425, 200, 200);
    santa.coordX--;


    spriteMovementKeys();
}

animation(0);


             // END  OF ANIMATION LOOP //


function spriteMovementKeys(){
    if (keys['ArrowLeft'] && player.xCoord > 0){
        player.xCoord -= player.speed;
        player.moving = true;
        console.log(`Arrow Key Left  X: ${player.xCoord} Y: ${player.yCoord}`);
    } else if (keys['ArrowRight'] && player.xCoord < canvas.width - 50){
        player.xCoord += player.speed;
        player.moving = true;
        console.log(`Arrow Key Right  X: ${player.xCoord}  Y: ${player.yCoord}`);
    } else if (keys['ArrowUp'] && player.yCoord > 350){
        player.yCoord -= player.speed;
        player.moving = true;
        console.log(`Arrow Key Up  X:  ${player.xCoord}  Y:  ${player.yCoord}`);
    } else if (keys["ArrowDown"] && player.yCoord < canvas.height - player.sizeY){
        player.yCoord += player.speed;
        player.moving = true;
        console.log(`Arrow Key Down  X:  ${player.xCoord}  Y:  ${player.yCoord}`);
    } else if (keys['a'] && player.xCoord > 0){
        player.xCoord -= player.speed;
        player.moving = true;
        console.log(`Key A -- X: ${player.xCoord} Y: ${player.yCoord}`);
    } else if (keys['d'] && player.xCoord < canvas.width - 50){
        player.xCoord += player.speed;
        player.moving = true;
        console.log(`Key D -- X: ${player.xCoord}  Y: ${player.yCoord}`);
    } else if (keys['w'] && player.yCoord > 350){
        player.yCoord -= player.speed;
        player.moving = true;
        console.log(`Key W -- X:  ${player.xCoord}  Y:  ${player.yCoord}`);
    } else if (keys["s"] && player.yCoord < canvas.height - player.sizeY){
        player.yCoord += player.speed;
        player.moving = true;
        console.log(`Key S -- X:  ${player.xCoord}  Y:  ${player.yCoord}`);
    }
}

// backgroundLoop(31); //COMMENTED OUT TEMPORARILY 
//     ctx.fillRect(0, 162.5, canvas.width, 10); //Y quardant 1
//     ctx.fillRect(0, 325, canvas.width, 10);//Y quardant 2
//     ctx.fillRect(0, 487.5, canvas.width, 10);//Y quardant 3
// // need to combine quadrants into X/Y sections 
//     ctx.fillRect(225, 0, 10, canvas.height);//X quadrant 1
//     ctx.fillRect(450, 0, 10, canvas.height);//X quadrant 2
//     ctx.fillRect(675, 0, 10, canvas.height);//X quadrant 3

// function backgroundLoop(speed){
    //     // requestAnimationFrame(backgroundLoop);
    //     let i = 2
    //     if(backgroundFrameX < 7 && speed % i == 0){
        //         console.log(true);
        //         let backgroundFrame = backgroundFrameX * background.width;
        //         ctx.drawImage(gifBackground, backgroundFrame, 0, background.width, background.height, 0, 0, canvas.width, canvas.height);
        //         backgroundFrameX++;
        //         i++;
        //     } else if (backgroundFrameX == 7){
            //      backgroundFrameX = 1;
            //     }
            
            // }