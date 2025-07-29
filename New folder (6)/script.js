const symbols = ['\ud83c\udf4e', '\ud83c\udf4f', '\ud83c\udf51', '\ud83c\udf52', '\ud83c\udf4a', '\ud83c\udf4b', '\ud83c\udf4d', '\ud83c\udf50'];
const colors = ['#ff5733', '#33ff57', '#3357ff', '#ff33a1', '#a133ff', '#33fff3', '#f3ff33', '#ff8c33'];
const gameBoard = document.getElementById('game-board');
const turnsSpan = document.getElementById('turns');
const timeSpan = document.getElementById('time');

let cards = [...symbols, ...symbols];
let flippedCards = [];
let matchedPairs = 0;
let turns = 0;
let timeLeft = 45;
let timerInterval;

const symbolColorMap = {};
symbols.forEach((symbol, index) => {
    symbolColorMap[symbol] = colors[index];
});

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startGame() {
    shuffle(cards);
    for (const cardSymbol of cards) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.symbol = cardSymbol;

        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        cardBack.textContent = cardSymbol;
        cardBack.style.backgroundColor = symbolColorMap[cardSymbol];

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);

        card.addEventListener('click', () => flipCard(card));
        gameBoard.appendChild(card);
    }
    startTimer();
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timeSpan.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            if (matchedPairs !== symbols.length) {
                alert('Time\'s up! You lost.');
                disableAllCards();
            }
        }
    }, 1000);
}

function disableAllCards() {
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => {
        card.style.pointerEvents = 'none';
    });
}

function flipCard(card) {
    if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            turns++;
            turnsSpan.textContent = turns;
            checkForMatch();
        }
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.symbol === card2.dataset.symbol) {
        matchedPairs++;
        flippedCards = [];
        if (matchedPairs === symbols.length) {
            clearInterval(timerInterval);
            setTimeout(() => alert(`You won in ${turns} turns!`), 500);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

startGame();