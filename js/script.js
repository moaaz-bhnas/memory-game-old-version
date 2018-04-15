const grid = document.querySelector('.grid'),
      cards = document.querySelectorAll('.card'),
      cardsNumber = grid.children.length,
      movesRecords = document.querySelectorAll('.moves-record'),
      timeRecord = document.querySelector('.timer'),
      starsRecords = document.querySelectorAll('.stars'),
      resetButtons = document.querySelectorAll('.reset'),
      modal = document.querySelector('.modal'), 
      timeInWordsRecord = document.querySelector('.time-in-words'),
      expressionImage = document.querySelector('.expression-image'),
      flippingTime = 550,
      flashTime = 600;
  

let firstCard, secondCard, firstImage, secondImage, // Variables to store cards inside for testing
    moves = 0,
    seconds = 0,
    minutes = 0,
    time, timeInWords,
    timerStarter,
    finishedResetting = true,
    star, starsNumber,
    noTwoCardsFlippedForTesting,
    currentCard, 
    currentCardIsNotFlipped,
    secondCardIsFlipped,
    rightCards;

const zeroPadded = num => { // 5 => 05
    if ( num < 10 )
        num = '0' + num;
    return num;
}
const shuffleCards = () => { 
    const randomNumbers = [];
    for (let i = 0; i < cardsNumber; i++) {
        let randomNumber;
        do {    // A loop to generate disticnct random number
            randomNumber = Math.floor(Math.random() * cardsNumber);
        } while (randomNumbers.includes(randomNumber));
        grid.appendChild(grid.children[randomNumber]);
        randomNumbers.push(randomNumber);
    }
    finishedResetting = true;
}
const flip = (...nodes) => {
    for (const node of nodes) {
        node.classList.add('flip');
    }
}
const unflip = (...nodes) => {
    for (const node of nodes) {
        node.classList.remove('flip');
    }
}
const trueFlash = (...nodes) => {
    for (const node of nodes) {
        node.classList.add('true-flash');
    }
}
const falseFlash = (...nodes) => {
    for (const node of nodes) {
        node.classList.add('false-flash')
    }
}
const removeTrueFlash = (...nodes) => {
    for (const node of nodes) {
        node.classList.remove('true-flash')
    }
}
const removeFalseFlash = (...nodes) => {
    for (const node of nodes) {
        node.classList.remove('false-flash')
    }
}
const countMoves = () => {
    moves++;
    logMovesRecord( moves );
}
const logMovesRecord = moves => {
    for (const record of movesRecords) {
        record.textContent = moves + ((moves === 1) ? ' move' : ' moves');
    }  
}
const countTime = () => { // 00:05 => 00:06 => 00:07 ..
    seconds++;
    if (seconds === 60) {
        minutes++;
        seconds = 0;
    }
    logTimeRecord(minutes, seconds);
}
const logTimeRecord = (minutes, seconds) => {
    time = `${zeroPadded(minutes)}:${zeroPadded(seconds)}`;
    timeRecord.textContent = time;
}
const removeStar = starsRecords => {
    for (const record of starsRecords) {
        star = record.lastElementChild;
        star.remove();
    }
}
const resetStars = () => {
    for (const record of starsRecords) {
        record.innerHTML = '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>';
    }
}
const startTimer = () => {
    if (timeRecord.textContent === '00:00') {
        seconds++;
        logTimeRecord(minutes, seconds);
        timerStarter = setInterval(countTime, 1000);
    }
}
const prepareCardsForTesting = () => {
    if (firstCard === undefined) { // empty
        firstCard = currentCard;
        firstImage = currentCard.querySelector('img');
    } else { 
        secondCard = currentCard;
        secondImage = currentCard.querySelector('img');
    }
}
const determineStarsAndExpression = () => {
    starsNumber = starsRecords[0].children.length;
    if (moves > 12 && starsNumber === 3) {
        removeStar(starsRecords);
        expressionImage.setAttribute('src', 'img/great.png');
    } else if (moves > 16 && starsNumber === 2) {
        removeStar(starsRecords);
        expressionImage.setAttribute('src', 'img/not-bad.png');
    } else if (moves > 20 && starsNumber === 1) {
        removeStar(starsRecords);
        expressionImage.setAttribute('src', 'img/what.png');
    }
}
const test = () => {
    const sameCharacter = firstImage.getAttribute('src') === secondImage.getAttribute('src');
    if ( sameCharacter ) {
        trueFlash(firstImage, secondImage);
        lastPairTest();
    } else {
        falseFlash(firstImage, secondImage);
        setTimeout(removeFalseEffects, flashTime); // Wait until the flash effect ends,then flip.
    }
    emptyVariablesForSecondMove();
}
const lastPairTest = () => {
    rightCards = document.querySelectorAll('.flip');
    if (rightCards.length === 16) {
        clearInterval(timerStarter);
        popUp();
    }
}
const popUp = () => {
    determineTimeInWords();
    setTimeout(function() {
        modal.classList.add('pop-up')
    }, flashTime);
}
const determineTimeInWords = () => {
    if (minutes > 0 && seconds > 0) {
        timeInWords = `${minutes} ${(minutes === 1) ? 'minute' : 'minutes'} and ${seconds} ${(seconds === 1) ? 'second' : 'seconds'}`;
    } else if (minutes > 0 && seconds === 0) {
        timeInWords = `${minutes} ${(minutes === 1) ? 'minute' : 'minutes'}`;
    } else {
        timeInWords = `${seconds} ${(seconds === 1) ? 'second' : 'seconds'}`;
    }
    timeInWordsRecord.textContent = timeInWords;
}
const removeFalseEffects = () => {
    unflip(firstCard, secondCard);
    removeFalseFlash(firstImage, secondImage);
}
const removetrueEffects = () => {
    for (const card of cards) {
        unflip(card);
        removeTrueFlash(card);
    }
}
const emptyVariablesForSecondMove = () => {
    setTimeout(function() {
        firstCard = secondCard = undefined;
    }, flashTime); // Wait until the flash ends, so we still can function on them (unflip).
}
const reset = () => {
    removetrueEffects();
    modal.classList.remove('pop-up');
    moves = seconds = minutes = 0;
    logMovesRecord( moves );
    logTimeRecord(minutes, seconds);
    clearInterval(timerStarter);
    firstCard = undefined;  
    finishedResetting = false;   // Until the shuffling ends, so the card doesn't show in another place when the player clicks.
    resetStars();
    setTimeout(shuffleCards, flippingTime);
}

shuffleCards();

/* --- Events --- */
grid.addEventListener('click', function( event ) {
    noTwoCardsFlippedForTesting = secondCard === undefined; // The second variable is empty
    if ( noTwoCardsFlippedForTesting && finishedResetting ) { 
        if ( event.target.parentElement.nodeName === 'LI') {
            currentCard = event.target.parentElement;
            currentCardIsNotFlipped = !currentCard.classList.contains('flip');
            if ( currentCardIsNotFlipped ) { // Don't flip already flipped card
                flip(currentCard);
                startTimer();
                prepareCardsForTesting();
                secondCardIsFlipped = secondCard !== undefined;
                if ( secondCardIsFlipped ) {
                    countMoves();
                    determineStarsAndExpression();
                    setTimeout(test, flippingTime); // Wait until the second card flips, and then start testing and responding.
                }
            }
        }
    }
});

for (const button of resetButtons) {
    button.addEventListener('click', reset);
}










