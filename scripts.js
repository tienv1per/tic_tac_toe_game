var origBoard;
const huPlayer = '0';
const AIPlayer = 'X';
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2],
];

const cells = document.querySelectorAll('.cell'); // NodeList


function startGame(){
    document.querySelector('.endgame').style.display = 'none';
    origBoard = Array.from(Array(9).keys()); // create array from 0->8

    for(var i = 0; i < cells.length; i++){
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square){
    if (typeof origBoard[square.target.id] === 'number'){
        turn(square.target.id, huPlayer); // nuoc di cua human
        if(!checkWin(origBoard, huPlayer)){ // kiem tra dieu kien neu chua thang
            if(!checktie()){
                turn(bestSpot(), AIPlayer); // nuoc di cua AI
            }
        }

    }
}

function turn(squareId, player){
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(origBoard, player);
    if(gameWon){
        gameOver(gameWon);
    }
}

function checkWin(board, player){
    let plays = board.reduce((accumulator, currentValue, currentIndex) => {
        if (currentValue === player){
            return accumulator.concat(currentIndex);
        }
        else{
            return accumulator;
        }
    }, []);

    let gameWon = null;
    for(let [index, win] of winCombos.entries()){
        if(win.every((element) => plays.indexOf(element) > -1)) {
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon){
    for(let index of winCombos[gameWon.index]){
        document.getElementById(index).style.backgroundColor = 
            gameWon.player === huPlayer ? "blue" : "red";
    }
    for (var i = 0; i < cells.length; i++){
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player === huPlayer ? "You Win" : "You Lose");
}

function emptySquares(){
    return origBoard.filter((s) => {
        return typeof s === 'number'
    })
}

function declareWinner(str){
    document.querySelector('.endgame').style.display = 'block';
    document.querySelector('.endgame .text').innerText = str;
}

function bestSpot(){
    return minimax(origBoard, AIPlayer).index;
}

// check xem co hoa khong
function checktie(){
    if(emptySquares().length === 0){
        if(!checkWin(origBoard, huPlayer) || !checkWin(origBoard, AIPlayer)){
            for(var i = 0; i < cells.length; i++){
                cells[i].style.backgroundColor = 'green';
                cells[i].removeEventListener('click', turnClick, false);
            }
            declareWinner("Tie Game");
            return true;
        }
    }
    return false;
}

function minimax(newBoard, player){
    var availSpots = emptySquares(newBoard);
    if(checkWin(newBoard, huPlayer)){
        return {score: -10};
    }
    else if (checkWin(newBoard, AIPlayer)){
        return {score: 10};
    }
    else if (availSpots.length === 0){
        return {score: 0};
    }

    var moves = [];
    for( var i = 0; i < availSpots.length; i++){
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if(player == AIPlayer){
            var result = minimax(newBoard, huPlayer);
            move.score = result.score;
        }
        else{
            var result = minimax(newBoard, AIPlayer);
            move.score = result.score;
        }
        newBoard[availSpots[i]] = move.index;
        moves.push(move);

        var bestMove;
        if(player === AIPlayer){
            var bestScore = -1000;
            for(var i = 0; i < moves.length; i++){
                if(moves[i].score > bestScore){
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        else{
            var bestScore = 1000;
            for(var i = 0; i < moves.length; i++){
                if(moves[i].score < bestScore){
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
    }
    return moves[bestMove];
}