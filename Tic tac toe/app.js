let boxes = document.querySelectorAll('.box');
let resetBtn = document.querySelector('#reset-btn');
let msgContainer =  document.querySelector('.msg-container');
let newBtn = document.querySelector('#new-btn');
let msg = document.querySelector('#win');

let turn0 = true //turn of O player and if false then turn of X player

const winPatterns = [
    [0,1,2] , [0,3,6] , [0,4,8],
    [1,4,7] , [2,5,8]  ,[2,4,6],
    [3,4,5] , [6,7,8],
];

const reset = () =>{
 turn0 = true;
 enabledBox();
 msgContainer.classList.add('hide');
}

boxes.forEach((box) =>{
    box.addEventListener('click' ,()=>{
        console.log("palyer clicked");
        if(turn0){//that mean turn0 is true player 0 turns
            box.innerHTML = 'O';
            turn0 = false; //next turn
        }else{
            box.innerHTML = 'X';
            turn0 = true;
        }
        box.disabled = true;
        checkWinner();
        
    });
})

const disabledBox = ()=>{
    for(let box of boxes){
        box.disabled =true;
   
    }
}
const enabledBox = ()=>{
    for(let box of boxes){
        box.disabled =false;
        box.innerHTML = '';
    }
}


const checkWinner = ()=>{
    for(let pattern of winPatterns){
        let posVal1 = boxes[pattern[0]].innerText;
        let posVal2 = boxes[pattern[1]].innerText;
        let posVal3 = boxes[pattern[2]].innerText;

        if(posVal1 !='' && posVal2!= '' && posVal3 != ''){
            if(posVal1 === posVal2 && posVal2 === posVal3){
                showWinner(posVal1);
            }
        }

    }
}
 
const showWinner = (winner) =>{
    msg.innerHTML = `Congrats you win ${winner}`;
    msgContainer.classList.remove('hide');
    disabledBox();
}

newBtn.addEventListener('click', reset);
resetBtn.addEventListener('click', reset);