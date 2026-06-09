const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

const speedMilliS = 100;

const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');

let widthScreen =  window.innerWidth; 
let heightScreen = window.innerHeight;

let responsiveBoard = Math.min( widthScreen, heightScreen);

responsiveBoard = responsiveBoard * 0.8 

canvas.width = responsiveBoard; 
canvas.height= responsiveBoard;

const boxSize = Math.floor(responsiveBoard/20) ;

let snake = [
    { x: boxSize * 10 , y: boxSize * 10 }, // Index 0 : The head
    { x: boxSize * 9, y: boxSize * 10 }, // Index 1: A piece of the body 
    { x: boxSize * 8, y: boxSize * 10 },  // Index 2: The tail 
];
let food = { x: boxSize * 15, y: boxSize * 15 };
let direction = 'RIGHT';
let gameInterval; 
let isGameOver = false;
let score = 0;
let highScore = 0; 

function resetVar() {

    snake = [
        { x: boxSize * 10 , y: boxSize * 10 }, 
        { x: boxSize * 9, y: boxSize * 10 }, 
        { x: boxSize * 8, y: boxSize * 10 },  
    ];
    food = { x: boxSize * 15, y: boxSize * 15 };

    direction = 'RIGHT';
    isGameOver = false;
    score = 0;
    scoreElement.textContent = score;
}

//Paint the board 
function drawBoard(){

    ctx.fillStyle = '#9bbc0f';      
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, boxSize,boxSize); 
    
    ctx.fillStyle = 'black'; 
    snake.forEach(body => {
        ctx.fillRect(body.x,body.y,boxSize,boxSize);
    });

    if (isGameOver) {
        
        ctx.font = " bold 30px Arial"
        ctx.fillStyle = 'red'
        ctx.textAlign = "center"
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);

    }

};

//Control

addEventListener('keydown', function(event) {

    if (event.key === 'ArrowLeft' && direction !== 'RIGHT') {
        console.log('Left arrow pressed');
        direction = 'LEFT';

    } else if (event.key === 'ArrowRight' && direction != 'LEFT') {
        
        console.log('Right arrow pressed');
        direction = 'RIGHT';

    } else if (event.key === 'ArrowUp' && direction != 'DOWN') {
        
        event.preventDefault();
        console.log('Up arrow pressed');
        direction =  'UP';

    } else if (event.key === 'ArrowDown' && direction != 'UP') {

        event.preventDefault();
        console.log('Down arrow pressed');
        direction = 'DOWN';
    
    } else if (event.key === 'Enter' && isGameOver ||
        event.key === ' ' && isGameOver){
        event.preventDefault();
        resetVar();
        gameInterval = setInterval(gameLoop,speedMilliS);
    } 

});

//Logic of the game 
function moveSnake(){

    let newHead;

    switch (direction) {
        case 'RIGHT':
            newHead = {
                x : snake[0].x + boxSize,
                y: snake[0].y
            };
            break;
        case 'LEFT':
            newHead = {
                x : snake[0].x - boxSize,
                y: snake[0].y
            };
            break;
        case 'UP':
            newHead = {
                x : snake[0].x,
                y: snake[0].y - boxSize 
            };
            break;
        case 'DOWN':
            newHead = {
                x : snake[0].x ,
                y: snake[0].y + boxSize
            };
            break;
        default:
            break;
    };  

           
    snake.unshift(newHead);//save a new head to the front of the array  

    if (newHead.x === food.x && newHead.y === food.y ) {
        
        console.log("I'm eating")
        score++; 
        scoreElement.textContent = score;
        foodRandomGenerator(); 

    } else{

    snake.pop();

    }

};

function gameLoop() {
   
    moveSnake(); 
    gameOver();
    drawBoard(); 

}

/* Works like a metronome, repeating the function every 100 milliseconds. 
As opposed to setTimeout() which only executes once*/
gameInterval = setInterval(gameLoop, speedMilliS);

function foodRandomGenerator(){

    const round = 20;

    let randomNumberX = Math.random();

    randomNumberX =  randomNumberX * round;

    randomNumberX = Math.floor(randomNumberX);
    
    let randomNumberY = Math.random();
    randomNumberY =  randomNumberY * round;

    randomNumberY = Math.floor(randomNumberY);
    
    food.x = randomNumberX * boxSize;
    food.y = randomNumberY * boxSize;

}

function gameOver() {
    
    if (snake[0].x < 0 || snake[0].x >= canvas.width ||
        snake[0].y < 0|| snake[0].y >= canvas.height) {
        
        console.log("hit the wall")
        
       clearInterval(gameInterval);

       if (score > highScore) {

            console.log("I pass the filter")        
            highScore = score; 
            highScoreElement.textContent = highScore;

       }
        isGameOver = true;

    }

    snake.slice(1).forEach(body => {

        if(snake[0].x === body.x  && snake[0].y === body.y){

            console.log("I hit myself")

            clearInterval(gameInterval);

            if (score > highScore) {

            highScore = score; 
            highScoreElement.textContent = highScore;

            }

            isGameOver = true;

        } 
    });
}