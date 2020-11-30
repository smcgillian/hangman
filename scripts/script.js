////////////////////////////////////////////////////////////////////////
// Game Constants
////////////////////////////////////
const maxStrikes = 6;

// Filenames
const STRIKE0_FNAME = "images/strike-0.png";
const STRIKE1_FNAME = "images/strike-1.png";
const STRIKE2_FNAME = "images/strike-2.png";
const STRIKE3_FNAME = "images/strike-3.png";
const STRIKE4_FNAME = "images/strike-4.png";
const STRIKE5_FNAME = "images/strike-5.png";
const STRIKE6_FNAME = "images/strike-6.png";

// String literals and identifiers
const CHAR_NOT_FOUND = -1;
const NO_CHAR_AT_POS = '_';
const INPUT_WORD_PROMPT_TEXT = "Welcome to Hangman! Player 1, please enter a word for Player 2 to guess.";
const GAME_LOST_TEXT = "Player 2 lost. The game is over!";
const GAME_WON_TEXT = "Player 2 won. The game is over!";
const STRIKE0_AT = "Strikes: 0";
const STRIKE1_AT = "Strikes: 1";
const STRIKE2_AT = "Strikes: 2";
const STRIKE3_AT = "Strikes: 3";
const STRIKE4_AT = "Strikes: 4";
const STRIKE5_AT = "Strikes: 5";
const STRIKE6_AT = "Strikes: 6";


// Enumerate Game States
const gameStates = {
    STRIKE0: 0,
    STRIKE1: 1,
    STRIKE2: 2,
    STRIKE3: 3,
    STRIKE4: 4,
    STRIKE5: 5,
    STRIKE6: 6,
    STRIKES_EXCEEDED: 7,
    PLAYER2LOST: 8,
    PLAYER2WON: 9,
    UNINTIALIZED: 10,
    INITIALIZED: 11
}
////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////
// Objects
////////////////////////////////////
// TODO: Create extra object to separate GUI control logic from game logic - beyond scope of this project.
// HangMan
let HangMan = {
    // Properties
    state : gameStates.UNINTIALIZED,
    targetWord : null,
    strikeLetters : null,
    revealedLetters : null,
    strikes : 0,
    guessInputElement : null,
    guessInputDiv : null,
    revealElement : null,
    strikeGuessesElement : null,
    submitButton : null,
    gallowsFileName : null,
    gallowsAltText : null,
    gallowsImageElement : null,
    playAgainButton : null,
    playAgainView : null,
    incorrectGuessesView : null,

    // Methods
    changeState : function(state){
        this.state = state;
        this.onStateChange();
    },

    onStateChange : function(){
        switch(this.state) {
            case gameStates.UNINTIALIZED: 
            case gameStates.INITIALIZED:    break;
            case gameStates.STRIKE0:        this.gallowsFileName = STRIKE0_FNAME;
                                            this.gallowsAltText = STRIKE0_AT;
                                            break;
            case gameStates.STRIKE1:        this.gallowsFileName = STRIKE1_FNAME;
                                            this.gallowsAltText = STRIKE1_AT;
                                            break;
            case gameStates.STRIKE2:        this.gallowsFileName = STRIKE2_FNAME;
                                            this.gallowsAltText = STRIKE2_AT;
                                            break;
            case gameStates.STRIKE3:        this.gallowsFileName = STRIKE3_FNAME;
                                            this.gallowsAltText = STRIKE3_AT;
                                            break;
            case gameStates.STRIKE4:        this.gallowsFileName = STRIKE4_FNAME;
                                            this.gallowsAltText = STRIKE4_AT;
                                            break;
            case gameStates.STRIKE5:        this.gallowsFileName = STRIKE5_FNAME;
                                            this.gallowsAltText = STRIKE6_AT;
                                            break;
            case gameStates.STRIKE6:        this.gallowsFileName = STRIKE6_FNAME;
                                            this.gallowsAltText = STRIKE6_AT;
                                            break;
            case gameStates.PLAYER2LOST:    this.OnGameLost();
                                            break;
            case gameStates.PLAYER2WON:     this.OnGameWon();
                                            break;
        }

        this.UpdateView();
    },

    OnGameLost : function(){
        alert(GAME_LOST_TEXT);
        this.onGameOver();
    },

    OnGameWon : function(){
        alert(GAME_WON_TEXT);
        this.onGameOver();
    },

    onGameOver : function () {
        this.guessInputDiv.style.display = "none";
        this.playAgainView.style.display = "block";
        incorrectGuessesView.style.display = "none";
    },

    getStringFromArray : function(array){
        let str = "";
        for(let i = 0; i < array.length; i++){
            str += array[i];
        }
        return str;
    },

    drawWordProgress : function(){
        if (this.state == gameStates.UNINTIALIZED) return;
    
        this.revealElement.innerHTML = this.getStringFromArray(this.revealedLetters);
    },
    
    drawGallows : function(){
        if (this.state == gameStates.UNINTIALIZED) return;

        this.gallowsImageElement.src = this.gallowsFileName;
        this.gallowsImageElement.alt = this.gallowsAltText;
    },

    drawStrikeLetters : function(){
        if (this.state == gameStates.UNINTIALIZED) return;

        this.strikeGuessesElement.innerHTML = this.getStringFromArray(this.strikeLetters);
    },


    UpdateView : function(){
        if (this.state == gameStates.UNINTIALIZED) return;

        this.drawWordProgress();
        this.drawGallows();
        this.drawStrikeLetters();
    },

    processGuess : function(guess){
        guess = guess.toUpperCase();

        if (this.strikes < maxStrikes) {
            if (this.isGuessCorrect(guess)) {
                this.onCorrectGuess();
            } else {
                this.onIncorrectGuess(guess);
            }
        } else {
            // some error here, we should never get to this place, it's 1 guess too many
            console.log("ERROR: this.strikes greater than maxStrikes");
        }
    },

    isGuessCorrect : function(guess){
        if (this.state == gameStates.UNINTIALIZED) return;
        
        let found = false;

        for (let i = 0; i < this.targetWord.length; i++){
            if (this.targetWord[i] == guess){
                // Set the reveal word chars while here for efficiency, only have to loop once
                this.revealedLetters[i] = this.targetWord[i];
                found = true;
            };
        }
        return found;
    },

    onCorrectGuess : function(){
        this.UpdateView();

        let won = true;
        for (let i = 0; i < this.revealedLetters.length; i++){
            if (this.revealedLetters[i] == NO_CHAR_AT_POS){
                won = false;;
                break;
            }
        }        
        if (won){
            this.changeState(gameStates.PLAYER2WON);
        }
    },

    onIncorrectGuess : function(guess){
        this.strikeLetters.push(guess);
        this.onStrike();
        if (this.strikes == maxStrikes) {
            this.changeState(gameStates.PLAYER2LOST); 
        }
    },

    onStrike : function(){
        this.state++;
        this.strikes++;
        this.onStateChange();
    },

    getWordToGuess : function(){
        if (this.state == gameStates.UNINTIALIZED) return;

        this.targetWord = prompt(INPUT_WORD_PROMPT_TEXT).toUpperCase();
        this.revealedLetters = new Array(this.targetWord.length);
        this.revealedLetters.fill(NO_CHAR_AT_POS);
    },

    onGuessInputChange : function(){
        // Get a ref to the global game object
        let thisGame = getGlobalGameObject();

        if (thisGame.state == gameStates.UNINTIALIZED) return;

        // TODO: Add code to disable button and form "enter" key
        // if we have 0 or more than 1 char in the guess input.
/*                
        let guess = thisGame.guessInputElement.value;
        if ( (guess.length > 1) || (guess.length == 0) ){
            thisGame.submitButton.disabled = "true";
        } else {
            thisGame.submitButton.disabled = "false";
        }
*/      
    },

    run : function(){
        // Initialize all the 
        if (this.state == gameStates.UNINTIALIZED){
            this.initialize();
        } else return;

        // Get the target word to guess
        this.getWordToGuess();

        // Setup the initial game state
        this.changeState(gameStates.STRIKE0);
    },

    initialize : function(){
        this.strikes = 0;
        this.strikeLetters = new Array();
        document.getElementById("guessForm").addEventListener("submit", this.onGuessEvent);
        this.submitButton = document.getElementById("submitGuess");
        this.guessInputElement = document.getElementById("guessInput");
        this.guessInputElement.addEventListener("change", this.onGuessInputChange);

        this.strikeGuessesElement = document.getElementById("strikeGuesses");      
        this.revealElement = document.getElementById("revealWordLable");
        this.gallowsImageElement = document.getElementById("gallowsImageElement");
        this.guessInputDiv = document.getElementById("inputView");
        this.guessInputDiv.style.display = "block";
        this.playAgainButton = document.getElementById("playAgainButton");
        this.playAgainButton.addEventListener("click", this.onNewGameButtonClicked);

        this.incorrectGuessesView = document.getElementById("incorrectGuessesView");

        this.playAgainView = document.getElementById("playAgainView");

        this.playAgainView.style.display = "none";
        this.state = gameStates.INITIALIZED;
    },

    onPlayAgain : function(){
        // Reset the views
        this.guessInputDiv.style.display = "block";
        this.playAgainView.style.display = "none";
        incorrectGuessesView.style.display = "block";
        
        // Reset variables
        this.strikes = 0;
        this.strikeLetters.length = 0;
        this.getWordToGuess.length = 0;
        this.revealedLetters.length = 0;

        // Set initial state
        this.state = gameStates.INITIALIZED;

        // Get the target word to guess
        this.getWordToGuess();

        // Setup the initial game state
        this.changeState(gameStates.STRIKE0);
    },

    // Event Handlers
    onGuessEvent : function(event){
        // Get a ref to the global game object
        let thisGame = getGlobalGameObject();

        if (thisGame.state == gameStates.UNINTIALIZED) return;
        
        event.preventDefault();
        let guess = thisGame.guessInputElement.value;
        if (guess.length == 1){
            thisGame.guessInputElement.value = "";
            thisGame.processGuess(guess);
        }
    },

    onNewGameButtonClicked : function(){
        // Get a ref to the global game object
        let thisGame = getGlobalGameObject();
        thisGame.onPlayAgain();
    }

} // end object constructor 
////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////
// Global functions
////////////////////////////////////
getGlobalGameObject = function(){
    return HangMan;
}
////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////
// Execution of game logic
////////////////////////////////////
// Get a ref to the global game object
let thisGame = getGlobalGameObject();
thisGame.run();
////////////////////////////////////