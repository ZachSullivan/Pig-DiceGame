/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

var scores, roundScores, activePlayer, dice, maxDicePossibility, winCondition;
var tempDice = 1;

NewGame();

dice = 0;
maxDicePossibility = 6;
winCondition = 10; //Sets the objective score needed to win the game

var canRoll = true;//Bool logs if the diceroll function has yet to complete before the user presses the roll dice (stops rapid clicking to roll) 

//dice = Math.ceil(Math.random() * 6);//Math is a built in JS method providing various mathimatical functions

//Set the scores to 0, takes string, number;
SetScore('score-0', 0);
SetScore('score-1', 0);
SetScore('current-0', 0);
SetScore('current-1', 0);

document.querySelector('#current-' + activePlayer).textContent = dice;

//. Selector to select a class, # Selector to select and ID
//Set the dice area to be blank on first load
document.querySelector('.dice').style.display = 'none';

//SetEventListener to trigger a clickable action
//Note we do NOT provide a paramater () after the function as the eventlistener calls the function for us. This is a call back function
document.querySelector('.btn-roll').addEventListener('click', RollDice);

document.querySelector('.btn-hold').addEventListener('click', function(){
    // User can only hold once the current roll has finished    
    if(canRoll){
        //Show the hold button to the user
        // Add current score to global score
        scores[activePlayer] += roundScore;

        // Update the UI 
        document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];

        //Check if player won the game
        CheckWinCondition();
    }      
});

document.querySelector('.btn-new').addEventListener('click', NewGame);

function NewGame(){
    //Reset all scoring and player values
    activePlayer = 0;
    scores = [0,0];
    roundScore = 0;
    
    //Remove dice icon
    document.querySelector('.dice').style.display = 'none';
    
    //Reset UI elements
    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    

    document.getElementById('name-0').textContent = 'Player 1';
    document.getElementById('name-1').textContent = 'Player 2';
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.add('active');
    document.querySelector('.player-1-panel').classList.remove('active');

}

function CheckWinCondition(){
    if(scores[activePlayer] >= winCondition){
        document.querySelector('#name-' + activePlayer).textContent = 'WINNER';
        document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
        document.querySelector('.player-' + activePlayer + '-panel').classList.toggle('active');
        document.querySelector('.dice').style.display = 'none';
    } else {
        SetActivePlayer();
    }
    
}

function SetActivePlayer(){
    
    activePlayer == 0 ? activePlayer = 1 : activePlayer = 0;
    roundScore = 0;
    canRoll = true;
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    
    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');

    document.querySelector('.dice').style.display = 'none';
}

function SetScore(elementID, score){
    document.getElementById(elementID).textContent = score;

}

function RollDice(){
    //1 Get random number
    if(canRoll == true){
        dice = Math.ceil(Math.random() * maxDicePossibility);//Math is a built in JS method providing various mathimatical functions

        //2 Display the result
        var diceDOM = document.querySelector('.dice');
        diceDOM.style.display = 'block';

        console.log('Result: ' + dice);

        var isDice = false;//bool logs if the tempdice = dice, if yes then stop iterating images

        tempDice = 1;
        var itrLoops = 0; //records the current number of setInterval loops
        var itrMaxLoops = Math.ceil(Math.random() * maxDicePossibility); //Set the target number of loops for the SetInterval method

        var itrLoopRate = 70; //in milliSeconds

        /******DECAY ATTEMPT*****
        //var itrDecayRate = 10; //in milliSeconds
        //var itrDecayResult = 0;
        //var itrCanDecay = false; //bool allows tempDice to increase value without getting skipped by a continous decay
        ***********************/

        //TODO Allow the user to set the max number of possible itrloops
        //TODO Allow the user to set the speed of the itrloops
        //TODO Rewrite changeDiceImage expression to use SetTimeout (Needed for time decay)
        diceDOM.src = 'dice-1.png'; // set the starting dice roll position

            canRoll = false;//do not let the user reroll until current roll has finished
            var changeDiceImage =  setInterval(function(){
                // set to be one since that is the smallest dice value
                if((isDice == false) && (itrLoops < itrMaxLoops)){

                    //if(tempDice != dice ){ 
                    diceDOM.src = 'dice-' + tempDice + '.png';         
                    tempDice++;

                    if(tempDice > maxDicePossibility){
                        tempDice = 1; //reset the temp dice 
                        itrLoops++;
                        //itrCanDecay = true; //iteration has occured and can now decay 1 step
                    } 

                    //Attempt at exponential time decay as dice got closer to its result
                    /*if(tempDice < dice && itrLoops == itrMaxLoops && itrCanDecay){
                        //itrLoopSpeed--;
                        clearInterval(changeDiceImage);
                        itrDecayResult = Math.pow(itrDecayRate, (-(itrDecayRate*0.01)));
                        function ChangeInterval(){

                            itrLoopRate = itrLoopRate/itrDecayResult;
                            itrCanDecay = false;
                            console.log('INTERVAL: '+itrLoopRate);
                        }
                        //if(itrCanDecay){
                        changeDiceImage = setInterval(ChangeInterval,itrLoopRate);

                        //}
                        console.log('DECAY: '+itrDecayResult);

                    }*/

                    console.log('temp dice is: ' + tempDice);
                    //} else 
                    if (tempDice == dice && itrLoops == itrMaxLoops){
                        isDice = true;                  
                    }

                } else{
                    clearInterval(changeDiceImage); //Stop the iteration
                    diceDOM.src = 'dice-' + dice + '.png';
                    
                    //3 update the round score IF the result was NOT 1
                    //TODO move this section of code into the if statement that displays the final dice image after roll
                    if(dice != 1){
                        //Add score
                        roundScore += dice;
                        document.querySelector('#current-' + activePlayer).textContent = roundScore;
                    } else {
                        //Next player turn
                        SetActivePlayer();
                    }
                    
                    canRoll = true;
                }
            }, itrLoopRate);
    }
    
}


















