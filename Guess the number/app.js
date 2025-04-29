let randomNumber = parseInt(Math.random()*100 +1) ;

const submit = document.querySelector('#subt');
const userInput = document.querySelector('#guessField');
const guessSlot = document.querySelector('.guesses');
const remaining = document.querySelector('.lastResult');
const lowOrHi = document.querySelector('.lowOrHi');

const p = document.createElement('p');

let prevGuess = [];
let numGuess = 0;
 let playgame = true;//game khelana hai ki nhi

 if(playgame){
    submit.addEventListener('click' ,function(e){
        e.preventDefault();
        const guess = parseInt(userInput.value);
        validGuess(guess);
    });
 }

 function validGuess(guess){
    if(isNaN(guess) || guess > 100 || guess < 1){
        alert('please enter valid number ..!');
    }else{
        prevGuess.push(guess);
        if(numGuess===11){
            display(guess);
            displayMsg(`Game over.. Random number was ${randomNumber}`);
            endGame();
        }else{
            display(guess);
            checkGuess(guess);
        }
    }
 }
 function checkGuess(guess){
    if(guess === randomNumber){
        displayMsg(`You guess Right ${randomNumber}`);
    }else if (guess > randomNumber){
        displayMsg(`Your guess is to large`);
    }else{
        displayMsg(`Your guess is to small`);
    }

 }
function display(guess){
    userInput.value = '';
    guessSlot.innerHTML += `${guess}   `;
    numGuess++;
    remaining.innerHTML = `${11 - numGuess}`;

}
function displayMsg(message){
    lowOrHi.innerHTML = `<h2>${message}</h2>`;
}
function endGame(){
    userInput.value = '';
    userInput.setAttribute('disabled', '');//key value pair
    p.classList.add('button')
    p.innerText = `<h3 id='newGame'>Start new game</h3>`;
    startOver.appendChild(p);
    playGame = false;
    newGame();
}
function newGame(){
    const newGameButton = document.querySelector('#newGame');
    newGame
}