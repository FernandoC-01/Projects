const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
});
}

async function computerGuesses() {
console.log("Let's play a game where you (human) make up a number and I (computer) try to guess it.");
// Allowing the usering set the bounderies for the game
let min = Math.round(await ask("Enter a number for the minimum value range: "))
let max = Math.round(await ask("Enter a number for the maximum value range: "))

while (min >= max || isNaN(min) || isNaN(max) || min < 0 || max > 10000) {
  // Ensuring the min is less than the max value
  if (min >= max) {
    console.log("The minimum value must be less than the maximum value.");
    min = Math.floor(await ask("Please enter the minimum value for the range: "));
    max = Math.ceil(await ask("Please enter the maximum value for the range: "));
  }
  // This makes sure the user enters in a number for min
  if (isNaN(min)) {
    console.log("The minimum value must be a valid number.");
    min = Math.floor(await ask("Please enter a valid value for the minimum range: "));
  }
  // This makes sure the user enters in a number for max
  if (isNaN(max)) {
    console.log("The maximum value must be a valid number.");
    max = Math.ceil(await ask("Please enter a valid value for the the maximum range: "));
  }
  // Making sure min isnt less than 0
  if (min < 0) {
    console.log("The min value can't be less than 0")
    min = Math.floor(await ask("Please enter a valid value for the the minimum range: "));
  }
  // Making sure max isnt greater than 10000
  if (max > 10000) {
    console.log("The max value can't be larger than 10000")
    max = Math.ceil(await ask("Please enter a valid value for the the maximum range: "));
  }
}

let secretNumber = await ask("What is your secret number?\nI won't peek, I promise...\n");
console.log('You entered: ' + secretNumber);

// Ensuring that the user doesnt enter a number that is greater than the max value or less than the min value
while(secretNumber > max || secretNumber < min) {
  if (secretNumber > max){
    console.log(`The secretNumber needs to be lower than or equal to ${max}`)
    secretNumber = await ask("What is your secret number?\nI won't peek, I promise...\n");
    console.log('You entered: ' + secretNumber);
  }
  if (secretNumber < min){
    console.log(`The secretNumber needs to be greater than or equal to ${min}`)
    secretNumber = await ask("What is your secret number?\nI won't peek, I promise...\n");
    console.log('You entered: ' + secretNumber);
}
}

const getMidpoint = (min, max) => Math.floor((min + max) / 2); // This finds the midpoint of any min and max

let guess = getMidpoint(min, max); // computer guesses will be to the midpoint of min and max
let computerGuess = false; 
let guessCounter = 0;

// this is the original
while (!computerGuess) {
    guessCounter ++ // addes the amount of guesses
    let userResponse = await ask(`Is your number ${guess}? Type 'y' for yes, 'n' for no\n`); // allows user to give an input
    
    // if input is y then code exits while loop
    if (userResponse.toLowerCase() === "y") {
    console.log(`The computer guessed your number ${secretNumber} in ${guessCounter} guesses!\n`);
    computerGuess = true; // exits the while statement because it is now true
    } else if (userResponse.toLowerCase() === "n") {
    
    let userResponse2 = await ask(`Is your number higher or lower than ${guess}? Type 'h' for higher or 'l' for lower\n`); // user gives another input
    
    if (userResponse2.toLowerCase() === "h") {
    // cheat check
      if (guess >= max){
        console.log(`You said it was lower than ${max + 1}, so it can't also be higher than ${guess}!`);
      } else {
        min = guess + 1;  // Ensures that computer guesses higher
      }
    }
    else if (userResponse2.toLowerCase() === "l") {
      // cheat check
      if (guess <= min){
        console.log(`You said it was higher than ${min - 1}, so it can't also be higher than ${guess}!`);
      } else {
        max = guess - 1;  // Ensures that computer guesses lower
      }
    }else {
      console.log("Please enter 'h' or 'l'."); // Catching any invalid inputs for 'h'igher or 'l'ower
    } 
    } else {
    console.log("Please enter 'y' or 'n'."); // Catching any invalid inputs for 'y' or 'n'
    }

    guess = getMidpoint(min, max); // allows computer to guess another number if it has not yet guessed correctly
  }
  playAgain() // lets user play again once while loop ends
}


async function reversedGame() {
  console.log("Lets play a game where I (computer) think of a number between 1 - 100, and you (human) try to guess it.\n")
  
  let randomNum = (min, max) => {
     return Math.floor(Math.random() * (max - min + 1)) + min  // This here is where the computer gets it random number
  }  

  let computerNum = randomNum(1, 100); // selects a number between 1 - 100
  console.log(`Mhmmm give me a few seconds as I think of my number ... \n`);
  
  let totalGuesses = 0; // keeping track of attemps
  let userGuess = await ask ("Finally... I think I got the perfect number, go ahead and take your guess: ");
  
  while(userGuess !== computerNum){
      totalGuesses ++ // keeping track of total guesses
  
      if (userGuess > computerNum) {
          console.log("Nice try, but no think lower\n")
      } else if (userGuess < computerNum){
          console.log("Not quite, think higher\n")
      } else console.log("Make sure you entering in a number")
  
      userGuess = parseInt(await ask("Here, try again:")); // Once the following code hits the conditional it will ask user to guess again if guess was incorrect
  }
  
  totalGuesses++; // keeping track of total guesses
  console.log(`Oh WOW! You guessed ${computerNum} in ${totalGuesses} tries. Good job!\n`); // Once the while loop is no longer true it will print this
  
  playAgain(); // lets user play again once while loop ends
  
  }

async function chooseGame() {
let game = await ask("which game do you want to play?\nComputer guesses your number (1) or you guess the computer's number (2): (1 or 2)")

if (game === "1") { 
  await computerGuesses() // starts the computering number guessing game
} else if (game === "2"){
  await reversedGame(); // starts the reversed guessing game
} else {
  console.log("Invalid input! Please enter 1 or 2");
  chooseGame(); // if invalid input runs function over again
}

}

async function playAgain(){
  let userPlayAgain = await ask("Would you like to play again? type 'y' for yes, 'n' for no\n")
  
  if (userPlayAgain.toLowerCase() === "y"){
    chooseGame() // allows the user to chose what game they would like to play
  } else if (userPlayAgain.toLowerCase() === "n") {
    console.log("Thanks for playing")
    process.exit(0) // exits the game
  } else {
    console.log("Make sure you are entering 'y' or 'n'")
    playAgain() // if invalid input runs function over again
  }
}

chooseGame()
