/* =================================================
    Game Grid
==================================================== */

const grid = document.querySelector('.grid'),
      modal = document.querySelector('.modal'),
      resetButton = document.querySelector('.reset'),
      cardsNumber = grid.children.length,
      flippingTime = 550,
      flashTime = 600;

let firstCard, secondCard, firstImage, secondImage,
    moves = 0;

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
const successFlash = (...nodes) => {
    for (const node of nodes) {
        node.classList.add('success-flash');
    }
}
const failureFlash = (...nodes) => {
    for (const node of nodes) {
        node.classList.add('failure-flash')
    }
}
const removeSuccessFlash = (...nodes) => {
    for (const node of nodes) {
        node.classList.remove('success-flash')
    }
}
const removeFailureFlash = (...nodes) => {
    for (const node of nodes) {
        node.classList.remove('failure-flash')
    }
}
const logMovesRecord = ( moves ) => {
    const records = document.querySelectorAll('.moves-record');
    for (const record of records) {
        record.textContent = moves + ((moves === 1) ? ' move' : ' moves');
    }  
}

shuffleCards();

grid.addEventListener('click', function( event ) {
    const noTwoCardsFlippedForTesting = secondCard === undefined;
    if ( noTwoCardsFlippedForTesting ) { // Making sure that the user doesn't flip a third card while two are being tested.
        if ( event.target.parentElement.nodeName === 'LI') {
            const currentCard = event.target.parentElement;
            const currentCardIsFlipped = currentCard.classList.contains('flip');
            if ( currentCardIsFlipped === false ) { // Don't allow testing already flipped card
                flip(currentCard);
                
                const PackingVariablesForTesting = () => {
                    if (firstCard === undefined) { // empty
                        firstCard = currentCard;
                        firstImage = currentCard.querySelector('img');
                    } else { 
                        secondCard = currentCard;
                        secondImage = currentCard.querySelector('img');
                        moves++;
                        logMovesRecord( moves );
                    }
                    return secondCard;
                }
                const TwoCardsAreReady = PackingVariablesForTesting();
                if ( TwoCardsAreReady ) {
                    setTimeout(function() {
                        (function testAndRespond() {
                            const sameCharacter = firstImage.getAttribute('src') === secondImage.getAttribute('src');
                            if ( sameCharacter ) {
                                successFlash(firstImage, secondImage);
                                const rightCards = document.querySelectorAll('.flip');
                                if (rightCards.length === 16) {
                                    (function popUp() {
                                        (function chooseExpression() {
                                            const expression = document.querySelector('.expression');
                                            if (moves <= 12) {
                                                expression.setAttribute('src', 'img/dude.png');
                                            } else if (moves <= 16) {
                                                expression.setAttribute('src', 'img/great.png');
                                            } else if (moves <= 20) {
                                                expression.setAttribute('src', 'img/not-bad.png');
                                            } else {
                                                expression.setAttribute('src', 'img/what.png');
                                            }
                                        })();
                                        modal.classList.add('pop-up');
                                    })();
                                }
                            } else {
                                failureFlash(firstImage, secondImage);

                                setTimeout(function removeFailureEffetcs() {
                                    unflip(firstCard, secondCard);
                                    removeFailureFlash(firstImage, secondImage);
                                }, flashTime); // Wait until the flash effect ends.
                            }
                        })();
                        setTimeout(function emptyVariablesForSecondMove() {
                            firstCard = secondCard = undefined;
                        }, flashTime); // Wait until the flash ends, so we still can function on them (unflip).
                    }, flippingTime); // Wait until the second card flips, and then start testing and responding.
                }
            }
        }
    }
});

/* --- Restart --- */

resetButton.addEventListener('click', function reset() {
    const cards = document.querySelectorAll('.card');
    for (const card of cards) {
        unflip(card);
        removeSuccessFlash(card.querySelector('img'));
    }
    modal.classList.remove('pop-up');
    moves = 0;
    logMovesRecord( moves );
    setTimeout(shuffleCards, flippingTime);
})




