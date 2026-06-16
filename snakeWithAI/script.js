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
    { x: boxSize * 10 , y: boxSize * 10 }, // Index 0: The head
    { x: boxSize * 9, y: boxSize * 10 },   // Index 1: A piece of the body 
    { x: boxSize * 8, y: boxSize * 10 },   // Index 2: The tail 
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

// Paint the board 
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

// Control
addEventListener("keydown", function (event) {
 if (event.key === 'Enter' && isGameOver ||
        event.key === ' ' && isGameOver){
        event.preventDefault();
        resetVar();
        gameInterval = setInterval(gameLoop,speedMilliS);
    };
});

// Logic of the game 
function moveSnake(){

    let newHead;

    switch (direction) {
        case 'RIGHT':
            newHead = { x : snake[0].x + boxSize, y: snake[0].y };
            break;
        case 'LEFT':
            newHead = { x : snake[0].x - boxSize, y: snake[0].y };
            break;
        case 'UP':
            newHead = { x : snake[0].x, y: snake[0].y - boxSize };
            break;
        case 'DOWN':
            newHead = { x : snake[0].x , y: snake[0].y + boxSize };
            break;
        default:
            break;
    };  
           
    snake.unshift(newHead); // Add the new head to the front of the array to move forward

    if (newHead.x === food.x && newHead.y === food.y ) {
        
        console.log("I'm eating")
        score++; 
        scoreElement.textContent = score;
        foodRandomGenerator(); 

    } else{
        
        snake.pop(); // Remove the tail if it hasn't eaten, maintaining the current length

    }

};

function gameLoop() {

    setAIDirection(food); // The AI engine starts here, setting the food as the main target
    moveSnake(); 
    gameOver();
    drawBoard(); 

}

 /* Works like a metronome, repeating the function every 100 milliseconds.
As opposed to setTimeout() which only executes once*/ 
gameInterval = setInterval(gameLoop, speedMilliS);

function foodRandomGenerator() {
    const round = 20;
    
    let newFood;
    let busyCoordinate;

    do {

        let randomNumberX = Math.random();
        randomNumberX = randomNumberX * round;
        randomNumberX = Math.floor(randomNumberX);

        let randomNumberY = Math.random();
        randomNumberY = randomNumberY * round;
        randomNumberY = Math.floor(randomNumberY);
        
        newFood = { 
            x: randomNumberX * boxSize, 
            y: randomNumberY * boxSize 
        };

        // Ensure the new food doesn't spawn on top of the snake's body
        busyCoordinate = snake.some(body => 
            body.x === newFood.x && body.y === newFood.y
        );

    } while (busyCoordinate); 

    food.x = newFood.x;
    food.y = newFood.y;
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


//ARTIFICIAL INTELLIGENCE


function getValidNeighbors(currentBox){

    let head = currentBox;

    const possibleMoves = [
        { x: head.x, y: head.y - boxSize, dir: 'UP' },
        { x: head.x, y: head.y + boxSize, dir: 'DOWN' },
        { x: head.x - boxSize, y: head.y, dir: 'LEFT' },
        { x: head.x + boxSize, y: head.y, dir: 'RIGHT' }
    ];

    const validMoves = possibleMoves.filter(move => {

        const isWall = move.x < 0 || move.x >= canvas.width || 
                       move.y < 0 || move.y >= canvas.height;

        // slice(0, -1) ignores the tip of the tail because that box will be free next turn
        const isBody = snake.slice(0, -1).some(bodyPart => 
            bodyPart.x === move.x && bodyPart.y === move.y
        );

        return !isWall && !isBody;

    }); 

    return validMoves;
}

// Breadth-First Search (BFS): Floods the map level by level to mathematically find the shortest path
function calculatePath(target) {
  const start = snake[0];

  let boxesToExplore = [];
  boxesToExplore.push(start);

  let recordSteps = new Map();
  let startKey = `${start.x},${start.y}`;
    
  recordSteps.set(startKey, null);

  while (boxesToExplore.length > 0) {
    let currentBox = boxesToExplore.shift();

    if (currentBox.x === target.x && currentBox.y === target.y) {
      return rebuildRoute(recordSteps, target);
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

  return []; // If it returns empty, it means the target is blocked
}

// Backtracks the step map (from target to start) to build the final route array
function rebuildRoute(recordSteps, target) {
    
    let finalRoute = []; 
    let currentBox = target; 

    while (currentBox !== null) {
        
        finalRoute.push(currentBox)
        let currentKey = `${currentBox.x},${currentBox.y}`;
        currentBox = recordSteps.get(currentKey);

    }

    finalRoute.reverse();
    return finalRoute;
}

function setAIDirection(target) {
    
    let route = calculatePath(target); 

    // Plan A: We have a valid route to the target. Deduce which way to steer.
    if (route.length > 1) {
        

        console.log("PLAN A")

        let currentPosition = route[0]; 
        let nextStep = route[1]; 

        if (nextStep.x > currentPosition.x) {
            direction = "RIGHT"; 
        } else if (nextStep.x < currentPosition.x) {
            direction = "LEFT"; 
        } else if (nextStep.y > currentPosition.y) {
            direction = "DOWN";
        } else if (nextStep.y < currentPosition.y) {
            direction = "UP";
        }

    // Plan B: If the path to the food is blocked, chase the tail instead. (Recursive base case)
    } else if (target.x === food.x && target.y === food.y) {
        
        console.log("PLAN B")

        let snakeTail = snake[snake.length - 1];
        setAIDirection(snakeTail);

    // Plan C: If the tail is also blocked, make safe moves to gain time.   
    } else {

        console.log("PLAN C")
        
        let options = getValidNeighbors(snake[0]);
        let bestOption = checkDistance(options);
        
        if(bestOption) {
            direction = bestOption.dir;     
        }

    }
}

// Manhattan Distance: Finds the box that is FURTHEST from the food to take a detour and survive
function checkDistance(validMoves) {
    
    let largerDistance = -1;
    let bestMove; 

    validMoves.forEach( box => {

        let distancia = Math.abs(food.x - box.x) + Math.abs(food.y - box.y);

        if ( largerDistance < distancia  ) {

            bestMove = box; 
            largerDistance = distancia;

        }

    });

    return bestMove; // Returns the entire object to access its .dir property later
}