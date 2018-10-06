
// Villains List

var villainsList =           
    [
        "SAURON",
        "KYLO",
        "CTHULHU",
        "JOKER",
        "MAGNETO",
        "VOLDEMORT",
        "TERMINATOR",
        "DRACULA",
        "BANE",
        "MALEFICENT",
        "IAGO",
        "SARUMAN",
        "URSULA",
        "HADES",
        // "SCAR",
        // "CHERNABOG",
        // "CTHULHU",
        // "RIDDLER",
        // "HANNIBAL",
        // "VADER",
        // "PREDATOR",
        // "GOLDFINGER",
        // "MYSTIQUE",
        // "MORIARTY",
        // "HAL",
        // "SMAUG",
        // "PINHEAD",
        // "FRANKENSTEIN",
        // "SALIERI",
        // "LEATHERFACE",
    ];

// Game basics
// Maximum number of guesses
const maxTries = 10; 
// Show the guessed letters
var guessedLetters = []; 
// Current guess index
var currentWordIndex;   
// User's Guess
var guessingWord = [];
// Remaining Guesses
var remainingGuesses = 0; 
// Press any key to restart
var hasFinished = false;  
// Total Number of Wins
var wins = 0;   
// // Total Number of Losses
// var losses = 0;


// Sound Library
// Intro sound
var keySound = new Audio('/sounds/heartbeat.wav');
// Win Sound
var winSound = new Audio('/sounds/laugh.wav');
// Lose Sound
var loseSound = new Audio('/sounds/scream.wav');

// Reset our game-level variables
function resetGame() {
    remainingGuesses = maxTries;

    // Use Math.floor to round the random number down to the nearest whole.
    currentWordIndex = Math.floor(Math.random() * (villainsList.length));

    // Clear out arrays
    guessedLetters = [];
    guessingWord = [];

    // Make sure the hangman image is cleared
    document.getElementById("hangmanImage").src = "";

    // Build the guessing word and clear it out
    for (var i = 0; i < villainsList[currentWordIndex].length; i++) {
        guessingWord.push("_");
    }   

    // Hide game over and win images/text
    document.getElementById("pressKeyTryAgain").style.cssText= "display: none";
    document.getElementById("gameover-image").style.cssText = "display: none";
    document.getElementById("youwin-image").style.cssText = "display: none";

    // Show display
    updateDisplay();
};

//  Updates the display on the HTML Page
function updateDisplay() {

    document.getElementById("totalWins").innerText = wins;

    // Display how much of the word we've already guessed on screen.
    // Printing the array would add commas (,) - so we concatenate a string from each value in the array.
    var guessingWordText = "";
    for (var i = 0; i < guessingWord.length; i++) {
        guessingWordText += guessingWord[i];
    }

    //
    document.getElementById("currentWord").innerText = guessingWordText;
    document.getElementById("remainingGuesses").innerText = remainingGuesses;
    document.getElementById("guessedLetters").innerText = guessedLetters;
};


// Updates the image depending on how many guesses
function updateHangmanImage() {
    document.getElementById("hangmanImage").src = "./images/" + (maxTries - remainingGuesses) + ".jpg";
};

// This function takes a letter and finds all instances of 
// appearance in the string and replaces them in the guess word.
function evaluateGuess(letter) {
    // Array to store positions of letters in string
    var positions = [];

    // Loop through word finding all instances of guessed letter, store the indicies in an array.
    for (var i = 0; i < villainsList[currentWordIndex].length; i++) {
        if(villainsList[currentWordIndex][i] === letter) {
            positions.push(i);
        }
    }

    // if there are no indicies, remove a guess and update the hangman image
    if (positions.length <= 0) {
        remainingGuesses--;
        updateHangmanImage();
    } else {
        // Loop through all the indicies and replace the '_' with a letter.
        for(var i = 0; i < positions.length; i++) {
            guessingWord[positions[i]] = letter;
        }
    }
};
// Checks for a win by seeing if there are any remaining underscores in the guessingword we are building.
function checkWin() {
    if(guessingWord.indexOf("_") === -1) {
        document.getElementById("youwin-image").style.cssText = "display: block";
        document.getElementById("pressKeyTryAgain").style.cssText= "display: block";
        wins++;
        winSound.play();
        hasFinished = true;
    }
};


// Checks for a loss
function checkLoss()
{
    if(remainingGuesses <= 0) {
        loseSound.play();
        document.getElementById("gameover-image").style.cssText = "display: block";
        document.getElementById("pressKeyTryAgain").style.cssText = "display:block";
        hasFinished = true;
    }
}

// Makes a guess
function makeGuess(letter) {
    if (remainingGuesses > 0) {
        // Make sure we didn't use this letter yet
        if (guessedLetters.indexOf(letter) === -1) {
            guessedLetters.push(letter);
            evaluateGuess(letter);
        }
    }
    
};


// Event listener
document.onkeydown = function(event) {
    // If we finished a game, dump one keystroke and reset.
    if(hasFinished) {
        resetGame();
        hasFinished = false;
    } else {
        // Check to make sure a-z was pressed.
        if(event.keyCode >= 65 && event.keyCode <= 90) {
            keySound.play();
            makeGuess(event.key.toUpperCase());
            updateDisplay();
            checkWin();
            checkLoss();
        }
    }
};