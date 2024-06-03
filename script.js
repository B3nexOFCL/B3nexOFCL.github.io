let playerBudget = 500;
let currentBet = 0;
let deck = [];

const initialDeck = [
    '2♦', '3♦', '4♦', '5♦', '6♦', '7♦', '8♦', '9♦', '10♦', 'J♦', 'Q♦', 'K♦', 'A♦',
    '2♣', '3♣', '4♣', '5♣', '6♣', '7♣', '8♣', '9♣', '10♣', 'J♣', 'Q♣', 'K♣', 'A♣',
    '2♥', '3♥', '4♥', '5♥', '6♥', '7♥', '8♥', '9♥', '10♥', 'J♥', 'Q♥', 'K♥', 'A♥',
    '2♠', '3♠', '4♠', '5♠', '6♠', '7♠', '8♠', '9♠', '10♠', 'J♠', 'Q♠', 'K♠', 'A♠'
];

let playerCards = [];
let dealerCards = [];

function shuffleDeck() {
    deck = [...initialDeck];
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function getCardValue(card) {
    const value = card.slice(0, -1);
    if (['J', 'Q', 'K'].includes(value)) return 10;
    if (value === 'A') return 11;
    return parseInt(value);
}

function calculateHandValue(cards) {
    let value = cards.reduce((sum, card) => sum + getCardValue(card), 0);
    const numAces = cards.filter(card => card[0] === 'A').length;
    let acesAdjusted = 0;
    while (value > 21 && acesAdjusted < numAces) {
        value -= 10;
        acesAdjusted++;
    }
    return value;
}

function updateDisplay(showDealerFullHand = false, message = '') {
    document.getElementById('budget').textContent = `Budget: €${playerBudget}`;
    document.getElementById('player-cards').innerHTML = playerCards.map(card => {
        const colorClass = (card.includes('♦') || card.includes('♥')) ? 'red' : '';
        return `<div class="card ${colorClass}">${card}</div>`;
    }).join('');
    if (showDealerFullHand) {
        document.getElementById('dealer-cards').innerHTML = dealerCards.map(card => {
            const colorClass = (card.includes('♦') || card.includes('♥')) ? 'red' : '';
            return `<div class="card ${colorClass}">${card}</div>`;
        }).join('');
    } else {
        const hiddenCards = dealerCards.slice(1).map(card => `<div class="card back"></div>`).join('');
        const colorClass = (dealerCards[0].includes('♦') || dealerCards[0].includes('♥')) ? 'red' : '';
        document.getElementById('dealer-cards').innerHTML = `<div class="card ${colorClass}">${dealerCards[0]}</div>${hiddenCards}`;
    }
    if (message) {
        alert(message);
    }
}

function dealInitialCards() {
    playerCards = [getRandomCard(), getRandomCard()];
    dealerCards = [getRandomCard()];
    updateDisplay();
}

function getRandomCard() {
    if (deck.length === 0) {
        shuffleDeck();
    }
    return deck.pop();
}

function startNewGame() {
    playerCards = [];
    dealerCards = [];
    currentBet = 0;
    document.getElementById('bet-amount').value = 50;
    document.getElementById('place-bet').disabled = false;
    document.getElementById('hit').disabled = true;
    document.getElementById('stand').disabled = true;
    shuffleDeck();
    updateDisplay();
}

function resetGame() {
    playerBudget = 500;
    startNewGame();
}

document.getElementById('place-bet').addEventListener('click', () => {
    const betAmount = parseInt(document.getElementById('bet-amount').value);
    if (betAmount > 0 && betAmount <= playerBudget) {
        currentBet = betAmount;
        playerBudget -= betAmount;
        dealInitialCards();
        document.getElementById('place-bet').disabled = true;
        document.getElementById('hit').disabled = false;
        document.getElementById('stand').disabled = false;
    } else {
        alert('Invalid bet amount');
    }
});

document.getElementById('hit').addEventListener('click', () => {
    playerCards.push(getRandomCard());
    updateDisplay();
    if (calculateHandValue(playerCards) > 21) {
        updateDisplay(true, 'Player busts! You lose.');
        startNewGame();
    }
});

document.getElementById('stand').addEventListener('click', () => {
    while (calculateHandValue(dealerCards) < 17) {
        dealerCards.push(getRandomCard());
    }
    const playerValue = calculateHandValue(playerCards);
    const dealerValue = calculateHandValue(dealerCards);
    if (dealerValue > 21 || playerValue > dealerValue) {
        playerBudget += currentBet * 2;
        updateDisplay(true, 'Player wins!');
    } else if (playerValue < dealerValue) {
        updateDisplay(true, 'Dealer wins!');
    } else {
        playerBudget += currentBet;
        updateDisplay(true, 'Push!');
    }
    startNewGame();
});

document.getElementById('new-game').addEventListener('click', startNewGame);
document.getElementById('reset-game').addEventListener('click', resetGame);

startNewGame();
