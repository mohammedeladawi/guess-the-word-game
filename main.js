// Setting Game Name
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector(
  "footer"
).innerHTML = `${gameName} Game Created By Elzero Web School`;

// Setting Game Options
let numberOfTries = 8;
let numberOfLetters = 6;
let currentTry = 1;
let numberOfHints = 2;

// Manage Words
const words = [
  "Create",
  "Update",
  "Delete",
  "Master",
  "Branch",
  "Mainly",
  "Elzero",
  "School",
];
let wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();

// Hint Button
let hintButton = document.querySelector(".hint");

// Add Number Of Hints To Hint Button Span
let hintButtonSpan = document.querySelector(".hint span");
hintButtonSpan.textContent = `${numberOfHints}`;

function generateInputs() {
  let inputsContainer = document.querySelector(".inputs");

  // Create Main tryDiv(s) To Add Inputs Inside Them
  for (let i = 1; i <= numberOfTries; i++) {
    let tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);

    // Add Class disabled To All tryDiv Elements Unless The First One
    if (i !== 1) tryDiv.classList.add("disabled-inputs");

    tryDiv.innerHTML = `<span>Try ${i}</span>`;

    // Create Input Elements To Enter The Letters
    for (let j = 1; j <= numberOfLetters; j++) {
      let input = document.createElement("input");
      input.type = "text";
      input.id = `guess-${i}-letter-${j}`;
      input.setAttribute("maxlength", "1");
      tryDiv.appendChild(input);
    }
    inputsContainer.appendChild(tryDiv);
  }

  // Focus On The First Input
  inputsContainer.children[0].children[1].focus();

  // Make disabledDivs' Inputs disabled
  let inputsInDisabledDivs = document.querySelectorAll(
    ".disabled-inputs>input"
  );
  inputsInDisabledDivs.forEach((input) => (input.disabled = true));

  // Focus On Next Input After Writing A Letter
  let inputs = document.querySelectorAll("input");
  inputs.forEach((input, index) => {
    let nextInput = inputs[index + 1];
    input.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
      if (nextInput && this.value) nextInput.focus();
    });

    // Focus On Previous Or Next One If I Clicked On Left Or Right Arrow
    input.addEventListener("keydown", (e) => {
      let prevInput = inputs[index - 1];
      if (e.key === "ArrowRight") {
        if (nextInput) nextInput.focus();
      } else if (e.key === "ArrowLeft") {
        if (index - 1 >= 0) prevInput.focus();
      }
    });
  });
}

// Handle Check Button
let checkButton = document.querySelector(".check");
checkButton.addEventListener("click", handleGuesses);

function handleGuesses() {
  // Check If All Answers Are Right
  let successGuess = true;

  // Compare Your Answers With The Right One
  for (let i = 1; i <= numberOfLetters; i++) {
    const inputField = document.querySelector(
      `#guess-${currentTry}-letter-${i}`
    );
    const letter = inputField.value.toLowerCase();
    const actualLetter = wordToGuess[i - 1];

    // Game Logic
    if (letter === actualLetter) {
      // Letter Is Correct And In Place
      inputField.classList.add("in-place");
    } else if (wordToGuess.includes(letter) && letter !== "") {
      // Letter Is Correct And Not In Place
      inputField.classList.add("not-in-place");
      successGuess = false;
    } else {
      // Letter Is Wrong
      inputField.classList.add("no");
      successGuess = false;
    }
  }

  document
    .querySelectorAll(".inputs>div:not(.disabled-inputs)")
    .forEach((tryDiv) => tryDiv.classList.add("disabled-inputs"));
  document
    .querySelectorAll(`.try-${currentTry} input`)
    .forEach((input) => (input.disabled = true));

  // Check If User Won Or Lost
  if (successGuess) {
    successProcesses();
  } else {
    lostProcesses();
  }
}

let messageDiv = document.querySelector(".message");

function successProcesses() {
  // Show Success Message
  messageDiv.innerHTML = `You Won The Word Is <span>${wordToGuess}</span>`;

  // Disable Try Div And Check Button
  checkButton.disabled = true;
  hintButton.disabled = true;
}

function lostProcesses() {
  // Make Next Try Div Not Disabled And Its Input If Exist
  currentTry++;
  if (currentTry <= numberOfTries) {
    document
      .querySelector(`.try-${currentTry}`)
      .classList.remove("disabled-inputs");
    document
      .querySelectorAll(`.try-${currentTry} > input`)
      .forEach((input, index) => {
        input.disabled = false;

        // Focus On The First Input
        !index && input.focus();
      });
  } else {
    messageDiv.innerHTML = `You Lost The Word Is <span>${wordToGuess}</span>`;
    checkButton.disabled = true;
    hintButton.disabled = true;
  }
}

// Hint Button Managment
function handleHint() {
  // Inputs Doesn't Contain Words
  let inputs = document.querySelectorAll(`.inputs > div input:not([disabled])`);
  let inputsNotFill = Array.from(inputs).filter((input) => input.value === "");

  // If User Still Have Hints
  if (numberOfHints > 0 && inputsNotFill.length > 0) {
    // Add Random Hint To Random Input And Dicrease Hint Number
    let randomIndex = Math.floor(Math.random() * inputsNotFill.length);
    let indexToFill = Array.from(inputs).indexOf(inputsNotFill[randomIndex]);
    inputsNotFill[randomIndex].value = wordToGuess[indexToFill].toUpperCase();
    hintButtonSpan.textContent--;

    // If User Finished Their Hints Disable Hint Button
    !--numberOfHints && (hintButton.disabled = true);
  }
}
hintButton.addEventListener("click", handleHint);

// Handle Backspace
function handleBackspace(e) {
  if (e.key === "Backspace") {
    let inputs = document.querySelectorAll(`input:not([disabled])`);
    currentIndex = Array.from(inputs).indexOf(document.activeElement);

    if (currentIndex > 0) {
      inputs[currentIndex].value = "";
      inputs[currentIndex - 1].focus();
    }
  }
}
document.addEventListener("keydown", handleBackspace);

generateInputs();
