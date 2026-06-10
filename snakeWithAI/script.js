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

//Rule 1: 

//AI working with BFS's Alghoritm. 

//Valid the neighboors boxes 
function getValidNeighbors(currentBox){

    let head = currentBox;

    //look for all the posible moves de head can do 
    const possibleMoves = [
        { x: head.x, y: head.y - boxSize, dir: 'UP' },
        { x: head.x, y: head.y + boxSize, dir: 'DOWN' },
        { x: head.x - boxSize, y: head.y, dir: 'LEFT' },
        { x: head.x + boxSize, y: head.y, dir: 'RIGHT' }
    ];

    
    const validMoves = possibleMoves.filter(move => {

        const isWall = move.x < 0 || move.x >= canvas.width || 
                       move.y < 0 || move.y >= canvas.height;

        const isBody = snake.slice(0, -1).some(bodyPart => 
            bodyPart.x === move.x && bodyPart.y === move.y
);


    return !isWall && !isBody;

    }); 
    return validMoves;

}

//Calculate the shortest path to eat the apple 
function calculatePath() {
  const start = snake[0];

  //QUEUE
  let boxesToExplore = [];
  boxesToExplore.push(start);

  let recordSteps = new Map();
  let startKey = `${start.x},${start.y}`;
    
  //It's the first step, so doesn't have any previous step 
  recordSteps.set(startKey, null);

  while (boxesToExplore.length > 0) {
    let currentBox = boxesToExplore.shift();

    if (currentBox.x === food.x && currentBox.y === food.y) {
      return rebuildRoute(recordSteps, food);
    }

    let neighbors = getValidNeighbors(currentBox);

    for (let neighbor of neighbors) {
      let neighborKey = `${neighbor.x},${neighbor.y}`;

      
      if (!recordSteps.has(neighborKey)) {
        boxesToExplore.push(neighbor);
        recordSteps.set(neighborKey, currentBox);
      }
    }
  }

  //If the loop has finished that means doesn't exist route to eat the apple 
  return [];
}

//rebuild the safe path from the end to the start. 
function rebuildRoute(recordSteps, food) {
    
    let finalRoute = []; 
    let currentBox = food; 

    while (currentBox !== null) {
        
        finalRoute.push(currentBox)

        let currentKey = `${currentBox.x},${currentBox.y}`;

        currentBox = recordSteps.get(currentKey);

    }

    //reverse it. Finally we have the shortest route
    finalRoute.reverse();

    return finalRoute;

}